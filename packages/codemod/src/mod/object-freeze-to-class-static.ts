import {builders, namedTypes} from "ast-types";
import ClassBody = namedTypes.ClassBody;
import type {Scope} from "ast-types/lib/scope";
import type {Transform, NodePath, Toolkit} from "../type";
import type {ASTNode} from "ast-types";

export const description = `
Change exported Object.freeze to export class with static property and method 
`;

type Referred = NodePath<namedTypes.VariableDeclarator> | NodePath<namedTypes.FunctionDeclaration>;

const transform: Transform = (source, toolkit) => {
    const ast = toolkit.parse(source);
    const b = toolkit.builders;

    let exportedName: string | undefined, exportObjectFreezeDeclaration: NodePath<namedTypes.ExportNamedDeclaration> | undefined, objectExpression: namedTypes.ObjectExpression | undefined;

    toolkit.visit(ast, {
        visitProgram(path) {
            this.traverse(path);
        },
        visitExportNamedDeclaration(path): any {
            if (
                path.node.declaration &&
                path.node.declaration.type === "VariableDeclaration" &&
                path.node.declaration.declarations[0].type === "VariableDeclarator" &&
                path.node.declaration.declarations[0].id.type === "Identifier" &&
                path.node.declaration.declarations[0].init?.type === "CallExpression" &&
                path.node.declaration.declarations[0].init.callee.type === "MemberExpression" &&
                path.node.declaration.declarations[0].init.callee.object.type === "Identifier" &&
                path.node.declaration.declarations[0].init.callee.property.type === "Identifier" &&
                path.node.declaration.declarations[0].init.callee.object.name === "Object" &&
                path.node.declaration.declarations[0].init.callee.property.name === "freeze" &&
                path.node.declaration.declarations[0].init.arguments[0].type === "ObjectExpression"
            ) {
                exportedName = path.node.declaration.declarations[0].id.name;
                exportObjectFreezeDeclaration = path;
                objectExpression = path.node.declaration.declarations[0].init.arguments[0];
            }
            this.traverse(path);
        },
    });

    if (!exportObjectFreezeDeclaration || !exportedName || !objectExpression) return;

    const {classDeclaration, referredList} = createClass(exportedName, exportObjectFreezeDeclaration, objectExpression, toolkit);

    // updated all reference
    referredList.forEach(path => {
        updateReferences(path, ast, toolkit, exportedName);
    });

    // remove all node are referenced in objectExpression value of Object.freeze
    referredList.forEach(remove);

    exportObjectFreezeDeclaration.replace(
        b.exportNamedDeclaration.from({
            declaration: classDeclaration,
        })
    );

    const privateMethodOrProperty: ClassBody["body"] = [];
    toolkit.visit(ast, {
        visitVariableDeclarator(path) {
            if (path.parent.parent.node.type === "Program" && path.parent.node.type === "VariableDeclaration" && !path.parent.node.declare && path.node.id.type === "Identifier") {
                privateMethodOrProperty.push(createClassPropertyFromVariableDeclarator(path, path.node.id.name, true));
                updateReferences(path, ast, toolkit, exportedName);
                remove(path);
            }
            this.traverse(path);
        },
        visitFunctionDeclaration(path) {
            if (path.parent.node.type === "Program" && path.node.id?.type === "Identifier") {
                privateMethodOrProperty.push(createClassMethodFromFunctionDeclaration(path.node, true));
                updateReferences(path, ast, toolkit, exportedName);
                remove(path);
            }

            this.traverse(path);
        },
    });

    classDeclaration.body.body.unshift(...privateMethodOrProperty);

    return toolkit.generate(ast).code;
};

function findReferences(referred: NodePath<namedTypes.FunctionDeclaration> | NodePath<namedTypes.VariableDeclarator>, name: string, ast: ASTNode, toolkit: Toolkit) {
    const identifiers: NodePath<namedTypes.Identifier>[] = [];
    toolkit.visit(ast, {
        visitIdentifier(path: NodePath<namedTypes.Identifier>): any {
            if (path.node.name === name) {
                const bindings = lookupBindings(path.scope, name);
                if (bindings?.findIndex(_ => _.node === referred.node.id) !== -1) {
                    identifiers.push(path);
                }
            }

            this.traverse(path);
        },
    });
    return identifiers;
}

function createClassBodyFromObjectFreeze(
    exportObjectFreezeDeclaration: NodePath<namedTypes.ExportNamedDeclaration>,
    expression: namedTypes.ObjectExpression
): {body: namedTypes.ClassBody["body"]; referredList: Array<Referred>} {
    const b = builders;
    const body: Array<namedTypes.ClassMethod | namedTypes.ClassProperty> = [];
    const referredList: Array<Referred> = [];
    for (const property of expression.properties) {
        switch (property.type) {
            case "ObjectProperty":
                if (property.key.type !== "Identifier") throw new Error(`Unable to analysis usage of identifier of object property key type: ${property.key.type}`);
                if (property.value.type === "Identifier") {
                    const lhsName = property.key.name;
                    const rhsName = property.value.name;
                    const scope: Scope = exportObjectFreezeDeclaration.scope;
                    const bindings = lookupBindings(scope, property.value.name);
                    if (!Array.isArray(bindings) || bindings.length === 0)
                        throw new Error(`Unable to find binding of given identifier:  ${property.value.name} in ${property.value.loc?.start.line}:${property.value.loc?.start.column}`);
                    const latestBinding = bindings[bindings.length - 1];
                    switch (latestBinding.parent.node.type) {
                        case "VariableDeclarator":
                            {
                                const declarator: NodePath<namedTypes.VariableDeclarator> = latestBinding.parent;
                                if (declarator.parent.node.kind === "const" && declarator.node.id.type === "Identifier") {
                                    body.push(createClassPropertyFromVariableDeclarator(declarator, lhsName));
                                    referredList.push(declarator);
                                } else {
                                    throw new Error("Unable to process static analysis when variableDeclarator is not a const type");
                                }
                            }
                            break;
                        case "FunctionDeclaration":
                            {
                                const functionDeclaration: NodePath<namedTypes.FunctionDeclaration> = latestBinding.parent;
                                body.push(createClassMethodFromFunctionDeclaration(functionDeclaration.node));
                                referredList.push(functionDeclaration);
                            }
                            break;
                        case "ImportSpecifier":
                        case "ImportNamespaceSpecifier":
                        case "ImportDefaultSpecifier":
                            body.push(
                                b.classProperty.from({
                                    static: true,
                                    key: b.identifier(lhsName),
                                    value: b.identifier(rhsName),
                                    comments: property.comments ?? null,
                                })
                            );
                            break;
                        default:
                            throw new Error(`Unable to analysis the references of identifier ${property.value.type} of Object.freeze, binding type: ${latestBinding.parent.node.type} `);
                    }
                } else {
                    body.push(createClassPropertyFromObjectProperty(property));
                    break;
                }
                break;
            case "ObjectMethod":
                body.push(createClassMethodFromObjectMethod(property));
                break;
            case "SpreadElement":
            case "SpreadProperty":
            case "Property":
                throw new Error(`Do not support transform Object Key type: ${property.type}, please modify manually.`);
        }
    }
    return {body, referredList};
}

function createClass(
    name: string,
    exportObjectFreezeDeclaration: NodePath<namedTypes.ExportNamedDeclaration>,
    expression: namedTypes.ObjectExpression,
    toolkit: Toolkit
): {classDeclaration: namedTypes.ClassDeclaration; referredList: Array<Referred>} {
    const b = toolkit.builders;
    const {body, referredList} = createClassBodyFromObjectFreeze(exportObjectFreezeDeclaration, expression);
    return {
        classDeclaration: b.classDeclaration.from({
            body: b.classBody.from({
                body,
            }),
            id: b.identifier(name),
            comments: exportObjectFreezeDeclaration.node.comments ?? null,
        }),
        referredList,
    };
}

function lookupBindings(currentScope: Scope, name: string) {
    try {
        return currentScope.lookup(name).getBindings()[name] as Array<NodePath> | undefined;
    } catch (e) {
        return undefined;
    }
}

function updateReferences(path: NodePath<namedTypes.VariableDeclarator> | NodePath<namedTypes.FunctionDeclaration>, ast: ASTNode, toolkit: Toolkit, exportedName: string | undefined) {
    const b = toolkit.builders;
    if (path.node.id?.type === "Identifier") {
        const name = path.node.id.name;
        const references = findReferences(path, name, ast, toolkit);
        references.forEach(_ =>
            _.replace(
                b.memberExpression.from({
                    object: b.identifier(exportedName!),
                    property: b.identifier(_.node.name),
                })
            )
        );
    }
}

function createClassMethodFromFunctionDeclaration(declaration: namedTypes.FunctionDeclaration, isPrivate: boolean = false): namedTypes.ClassMethod {
    const b = builders;
    if (declaration.id?.type !== "Identifier") throw new Error("Unable to transform Referenced Variable Declarator to Class property ");
    return b.classMethod.from({
        static: true,
        key: b.identifier(declaration.id.name),
        params: declaration.params,
        body: declaration.body,
        returnType: declaration.returnType ?? null,
        comments: declaration.comments ?? null,
        async: declaration.async ?? false,
        generator: declaration.generator ?? false,
        rest: declaration.rest ?? null,
        predicate: declaration.predicate ?? null,
        typeParameters: declaration.typeParameters ?? null,
        expression: declaration.expression ?? false,
        defaults: declaration.defaults ?? [],
        id: declaration.id ?? null,
        ...(isPrivate ? {access: "private"} : {}),
    });
}

function createClassPropertyFromVariableDeclarator(path: NodePath<namedTypes.VariableDeclarator>, lhsName: string, isPrivate: boolean = false): namedTypes.ClassProperty {
    const b = builders;
    if (path.node.id?.type !== "Identifier") throw new Error("Unable to transform Referenced Variable Declarator to Class property ");
    if (path.parent.node.type !== "VariableDeclaration") throw new Error(`Unable to analysis VariableDeclarator of child of the ${path.parent.node.type} `);
    return b.classProperty.from({
        key: b.identifier(lhsName),
        static: true,
        value: path.node.init ?? null,
        comments: path.parent.node.comments ?? null,
        typeAnnotation: path.node.id.typeAnnotation ?? null,
        ...(isPrivate ? {access: "private"} : {}),
    });
}

function createClassPropertyFromObjectProperty(property: namedTypes.ObjectProperty): namedTypes.ClassProperty {
    const b = builders;
    if (property.key?.type !== "Identifier") throw new Error("Unable to transform object property to class property ");
    if (
        property.value.type === "RestElement" ||
        property.value.type === "SpreadElementPattern" ||
        property.value.type === "PropertyPattern" ||
        property.value.type === "ObjectPattern" ||
        property.value.type === "AssignmentPattern" ||
        property.value.type === "ArrayPattern" ||
        property.value.type === "SpreadPropertyPattern" ||
        property.value.type === "TSParameterProperty"
    ) {
        throw new Error(`Unable to transform Object Property with value type ${property.value.type}`);
    }
    return b.classProperty.from({
        static: true,
        key: b.identifier(property.key.name),
        value: property.value,
        comments: property.comments ?? null,
    });
}

function createClassMethodFromObjectMethod(property: namedTypes.ObjectMethod): namedTypes.ClassMethod {
    const b = builders;
    if (property.key?.type !== "Identifier") throw new Error("Unable to transform object method to class method");
    return b.classMethod.from({
        static: true,
        key: b.identifier(property.key.name),
        body: property.body,
        params: property.params,
        kind: "method",
        comments: property.comments ?? null,
        async: property.async ?? false,
        generator: property.generator ?? false,
        rest: property.rest ?? null,
        predicate: property.predicate ?? null,
        typeParameters: property.typeParameters ?? null,
        decorators: property.decorators ?? null,
        returnType: property.returnType ?? null,
        expression: property.expression ?? false,
        defaults: property.defaults ?? [],
        computed: property.computed ?? false,
        id: property.id ?? null,
    });
}

function remove(path: NodePath) {
    if (path.parent.node.type === "VariableDeclaration" && path.parent.node.declarations.length === 1) {
        path.parent.replace();
    } else {
        path.replace();
    }
}

export default transform;

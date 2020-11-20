import {APIGeneratorBase} from "./APIGeneratorBase";
import {WebAPIGenerator} from "./WebAPIGenerator";
/**
 * APIGenerator is to generate API sources according to backend definition (_sys/api).
 *
 * Generated files include:
 * - One [api.ts], to define all API types
 * - Multiple [SomeService.ts], to provide static Promise-based API functions in class-style.
 *
 */
export class APIGenerator extends APIGeneratorBase {
    /**
     * Do not add static APIGenerator.App.
     * Because app networking usage can vary from project to project.
     */
    static Web = WebAPIGenerator;
}

export type {APIDefinition, APIGeneratorOptions, Operation, PlatformConfig, PlatformSpecificAPIGeneratorOptions, ServiceDefinition, TypeDefinition} from "./types";

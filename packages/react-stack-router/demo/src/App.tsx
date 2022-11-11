import {StackRoute, StackRouter, Link} from "@pinnacle0/react-stack-router/src";

export default function App() {
    return (
        <StackRouter base={Home}>
            <StackRoute path="about" component={About} />
            <StackRoute path="game" component={About}>
                <StackRoute path=":id" component={About} />
                <StackRoute path="monday" component={About} />
                <StackRoute path="tuesday" component={About} />
            </StackRoute>
        </StackRouter>
    );
}

export const Home = () => {
    return (
        <div>
            <p>This is Home page</p>
            <p>
                <Link to="/about">Go To about</Link>
            </p>
        </div>
    );
};

export const About = () => {
    return (
        <div>
            <p>This is about page</p>
            <Link to="/">Go To Home</Link>
        </div>
    );
};

import {Link, Route, Router} from "@pinnacle0/react-stack-router/src";
import {Home} from "./Home";

export default function App() {
    return (
        <Router>
            <Route path="/" component={Home} />
            <Route path="about" component={About} />
            <Route path="game" component={About}>
                <Route path=":id" component={About} />
                <Route path="monday" component={About} />
                <Route path="tuesday" component={About} />
            </Route>
        </Router>
    );
}

export const About = () => {
    return (
        <div>
            <h3>About Page</h3>
            <Link to="/">Back to Home</Link>
        </div>
    );
};

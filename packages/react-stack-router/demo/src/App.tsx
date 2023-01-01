import {About} from "./page/About";
import {Home} from "./page/Home";
import {router} from "./router";

const Root = router.Root;
const Route = router.Route;

export default function App() {
    return (
        <Root>
            <Route path="/" component={Home} />
            <Route path="about" component={About} />
            <Route path="game" component={About}>
                <Route path=":id" component={About} />
                <Route path="monday" component={About} />
                <Route path="tuesday" component={About} />
            </Route>
        </Root>
    );
}

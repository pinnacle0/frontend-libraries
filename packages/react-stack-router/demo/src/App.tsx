import {About} from "./page/About";
import {Game} from "./page/Game";
import {Home} from "./page/Home";
import {NotFound} from "./page/NotFound";
import {router} from "./router";

const Root = router.Root;
const Route = router.Route;

export default function App() {
    return (
        <Root>
            <Route path="/" component={Home} />
            <Route path="about" component={About} />
            <Route path="game" component={Game}>
                <Route path=":id" component={Game} />
                <Route path="monday" component={Game} />
                <Route path="tuesday" component={Game} />
            </Route>
            <Route path="*" component={NotFound} />
        </Root>
    );
}

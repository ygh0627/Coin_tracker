import { BrowserRouter, Switch, Route } from "react-router-dom";
import Coin from "./Routes/coin";
import Coins from "./Routes/coins";

function Router() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL + "/"}>
      <Switch>
        <Route path="/coins/:coinId/details">
          <Coin />
        </Route>
        <Route path="/">
          <Coins />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
export default Router;

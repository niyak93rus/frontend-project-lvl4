import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import NoMatch from "./pages/NoMatch";
import Login from "./pages/Login";
import './App.css';

function App() {
  return (
    <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/">
            <Redirect to="/login" component={Login} />
          </Route>
          <Route component={NoMatch} />
        </Switch>
    </Router>
  );
}

export default App;

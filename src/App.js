import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./Auth/authContext";
import PrivateRoute from "./Auth/PrivateRoute";
import TaskForm from "./Components/Form/TaskForm/TaskForm";
import HomeProvider from "./Components/HomeContext";
import Home from "./Components/Homepage/Home";
import Login from "./Components/Login/Login";
import Signup from "./Components/Login/Signup";

function App() {
  return (
    <div className="app default-mode">
      <Router>
        <HomeProvider>
          <AuthProvider>
            <Switch>
              <Route path={"/signup"} component={Signup} />
              <Route path={"/login"} component={Login} />
              <PrivateRoute path={'/task/:mode/:param?'} component={TaskForm} />
              <PrivateRoute path="/" component={Home} />
              <Redirect to={"/"} />
            </Switch>
          </AuthProvider>
        </HomeProvider>
      </Router>
    </div>
  );
}

export default App;

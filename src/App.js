import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./Auth/authContext";
import PrivateRoute from "./Auth/PrivateRoute";
import Loading from "./Components/CommonComponents/Loading/Loading";
import HomeProvider from "./Components/HomeContext";
import Home from "./Components/Homepage/Home";
import Login from "./Components/Login/Login";
import Signup from "./Components/Login/Signup";

function App() {
  return (
    <div className="default-mode">
      <Router>
        <AuthProvider>
          <HomeProvider>
           <Loading />
            <Switch>
              <Route path={"/signup"} component={Signup} />
              <Route path={"/login"} component={Login} />
              <PrivateRoute path="/" component={Home} />
              <Redirect to={"/"} />
            </Switch>
          </HomeProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;

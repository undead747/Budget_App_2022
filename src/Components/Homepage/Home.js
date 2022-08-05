import React, { useState } from "react";
import {
  matchPath,
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../../Auth/authContext";
import { CustomButton } from "../CommonComponents/Button/Button";
import DailyTasks from "./DailyTasks/DailyTasks";
import MonthlyTasks from "./MonthlyTasks/MonthlyTasks";
import Navigator from "./Navigator/Navigator";
import Sidebar from "./Sidebar/Sidebar";
import TasksByCalendar from "./TasksByCalendar/TasksByCalendar";
import TasksByYears from "./TasksByYears/TasksByYears";
import WeeklyTasks from "./WeeklyTasks/WeeklyTasks";
import "./home.css";
import EclipseButton from "../CommonComponents/Button/EclipseButton";

export default function Home() {
  const [errors, setErrors] = useState();
  const { logout } = useAuth();
  const history = useHistory();
  const { pathname } = useLocation();

  const handleAddTask = () => {
    let dateParam = matchPath(pathname, { path: "/:mode/:date?" });
    if (dateParam.params.date)
      history.push(`/task/add/${dateParam.params.date}`);
    else history.push("/task/add");
  };

  async function handleLogout() {
    setErrors("");
    try {
      await logout();
      history.push("/login");
    } catch (error) {
      setErrors(error.message);
    }
  }

  return (
    <>
      <div className="header">
        <Navigator />
        <Sidebar />
      </div>

      <Switch>
        <Route
          path={"/daily/:date?"}
          render={(routes) => (
            <DailyTasks key={routes.match.params.date} {...routes} />
          )}
        />
        <Route path={"/monthly/:year?/:month?"} component={MonthlyTasks} />
        <Route path={"/years/:date?"} component={TasksByYears} />
        <Route path={"/calendar/:date?"} component={TasksByCalendar} />

        <Redirect to={"/daily"} />
      </Switch>
      <CustomButton callback={handleLogout}>Sign out</CustomButton>
      <EclipseButton customClass="btn--task-add" callback={handleAddTask}>
        <i className="fas fa-plus"></i>
      </EclipseButton>
    </>
  );
}

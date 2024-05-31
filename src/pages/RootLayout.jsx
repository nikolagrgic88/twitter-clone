import { Outlet } from "react-router-dom";
import MainHeader from "./MainHeader";
import classes from "./RootLayout.module.css";
import EventsPage from './HomePageEvents'

function RootLayout() {
  return (
    <div className={classes.mainDisplay}>
      <MainHeader />
      <Outlet />
      <EventsPage/>
    </div>
  );
}

export default RootLayout;

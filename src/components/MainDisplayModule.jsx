import classes from "./MainDisplay.module.css";

function MainDispalyModule({ children }) {
  return <div className={classes.main}>{children}</div>;
}
export default MainDispalyModule;

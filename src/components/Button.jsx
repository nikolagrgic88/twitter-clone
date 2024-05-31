import { NavLink } from "react-router-dom";
import classes from './HomeAccountHeader.module.css'

function Button({ children }) {
  return <NavLink className={classes}>{children}</NavLink>;
}
export default Button;

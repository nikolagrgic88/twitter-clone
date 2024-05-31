import classes from './Loading.module.css';
import Lottie from 'react-lottie-player';
import animation from '../animations/spinner_blue.json';
import animation1 from '../animations/spinner.json';

// function Loading(props) {
// 	return (
// 		<div className={classes.loaderContainer} style={props.styleContainer}>
// 			<div className={classes.loader} style={props.styleSpinner}></div>
// 		</div>
// 	);
// }

function Loading(props) {
	return (
		<div className={classes.loaderContainer} style={props.styleContainer}>
			<Lottie loop animationData={animation} play style={props.styleSpinner} />
		</div>
	);
}

export default Loading;

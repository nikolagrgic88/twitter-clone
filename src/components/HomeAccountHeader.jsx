import classes from './HomeAccountHeader.module.css';

import Tweetbox from './Tweetbox';
import TweetBoxHeader from './TweetBoxHeader';

const HomeAccountHeader = () => {
	return (
		<div className={classes.tweetBoxTop}>
			<TweetBoxHeader />
			<Tweetbox />
		</div>
	);
};
export default HomeAccountHeader;

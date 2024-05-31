import { usersPost } from './usersPost';
import classes from '../components/HomeRender.module.css';

export const renderPost = (post, tweetsArray, onProfilePage) => {
	if (post.retweeted.length !== 0) {
		const retweetedPost = tweetsArray.find(
			(tweet) => tweet.id === post.retweeted.id
		);
		if (onProfilePage) {
			let repostedRepost;
			if (post.isReposted) {
				repostedRepost = tweetsArray.find(
					(tweet) => tweet.id === retweetedPost.retweeted.id
				);
			}

			return (
				<div >
					{post.retweeted.length !== 0 && (
						<div className={classes.reposted}>
							<ion-icon name='repeat-outline'></ion-icon>
							<div>You Reposted</div>
						</div>
					)}
					{repostedRepost
						? usersPost(retweetedPost, true, repostedRepost)
						: usersPost(retweetedPost, false)}
				</div>
			);
		} else {
			return usersPost(post, true, retweetedPost);
		}
	} else {
		return usersPost(post, false);
	}
};

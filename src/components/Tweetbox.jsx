import classes from './Tweetbox.module.css';

import Avatar from '../shared/components/UiElements/Avatar';
import useProfilePhoto from '../hooks/useProfilePhoto';

import Loading from './Loading';
import { useSelector } from 'react-redux';

import InputTweetBox from '../shared/components/TweetPost/InputTweetBox';

function Tweetbox() {
	const authUsersData = useSelector((state) => state.user.authUser);

	const { profilePhotoURL, isProfileImgLoading } =
		useProfilePhoto(authUsersData);

	return (
		<div className={classes['tweet-home-container']}>
			{authUsersData && (
				<div className={classes['tweet-home-box']}>
					<div className={classes['tweet-home-img']}>
						{isProfileImgLoading ? (
							<Loading styleSpinner={{ minWidth: '40px', height: '40px' }} />
						) : (
							<Avatar
								image={profilePhotoURL}
								alt='profilePhot'
								width='75px'
								heght='70px'
								style={{ display: 'block', paddingTop: '12px' }}
							/>
						)}
					</div>
					<InputTweetBox placeholder="What's happening" type='Post' />
				</div>
			)}
		</div>
	);
}

export default Tweetbox;

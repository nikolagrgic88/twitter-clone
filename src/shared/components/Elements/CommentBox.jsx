import { useSelector } from 'react-redux';
import { usersPost } from '../../../Utils/usersPost';
import classes from './CommentBox.module.css';
import Avatar from '../UiElements/Avatar';
import useProfilePhoto from '../../../hooks/useProfilePhoto';
import InputTweetBox from '../TweetPost/InputTweetBox';

const CommentBox = (props) => {
	const authUser = useSelector((state) => state.user.authUser);
	const { profilePhotoURL, isProfileImgLoading } = useProfilePhoto(authUser);
	
	return (
		<div className={classes.commentPlaceholder}>
			<div className={classes.usersPost}>
				{usersPost(props.tweet, false, null, true)}
			</div>
			<div className={classes.commentBox}>
				<Avatar
					image={profilePhotoURL}
					width='50px'
					style={{ maxWidth: '85px' }}
				/>
				<div className={classes.inputBox}>
					<InputTweetBox
						placeholder='Comment...'
						type='Reply'
						tweet={props.tweet}
					/>
				</div>
			</div>
		</div>
	);
};

export default CommentBox;

import { NavLink, useParams, Link } from 'react-router-dom';
import PostProfilePhoto from '../shared/components/UiElements/PostProfilePhoto';
import UsersPost from '../shared/components/UiElements/UsersPost';
import classes from './PostBox.module.css';
import useProfilePhoto from '../hooks/useProfilePhoto';
import { useSelector } from 'react-redux';
import Loading from './Loading';
import Avatar from '../shared/components/UiElements/Avatar';
import PostStats from '../shared/components/TweetPost/PostStats';

const PostBox = (props) => {
	// const retweet = props.post.retweeted;

	const params = useParams();

	const usersData = useSelector((state) => state.user.usersData);

	const userData = usersData.filter(
		(user) => user.userId === props.post.userId
	)[0];
	

	const { profilePhotoURL, isProfileImgLoading } = useProfilePhoto(userData);

	const date = new Date(props.post.timeStamp);
	const day = date.getDate();
	const year = date.getFullYear();
	const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
		date
	);

	return (
		<div className={classes.postBoxContainer}>
			{isProfileImgLoading ? (
				<div className={classes.profilePhoto}>
					<Loading styleSpinner={{ height: '70px', minWidth: '110px' }} />
				</div>
			) : params.uid ? (
				<div className={classes.profilePhoto}>
					<Avatar
						image={profilePhotoURL}
						alt='profilePhot'
						width='40px'
						height='40px'
					/>
				</div>
			) : (
				<Link
					className={classes.profilePhoto}
					to={`profile/${userData.userId}`}
				>
					<Avatar
						image={profilePhotoURL}
						alt='profilePhot'
						width='50px'
						height='60px'
					/>
				</Link>
			)}
			<div className={classes.content}>
				<div className={classes.box}>
					<div className={classes.name}>
						<div className={classes['name-header']}>
							<div
								style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}
							>
								<strong>{props.post.displayName}</strong>{' '}
								<div
									style={{ fontSize: '14px' }}
								>{`${day} ${month} ${year}`}</div>
							</div>
						</div>
						<div className={classes['post-menu']}>
							<NavLink>...</NavLink>
						</div>
					</div>
					<div className={classes.text}>{props.post?.text}</div>

					{props.post?.imageDownloadURL && (
						<div className={classes.imageBox}>
							<img src={props.post?.imageDownloadURL} alt={props.post?.image} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
export default PostBox;

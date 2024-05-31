import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import classes from './PostProfilePhoto.module.css';
import Loading from '../../../components/Loading';
import useProfilePhoto from '../../../hooks/useProfilePhoto';
import { useSelector } from 'react-redux';

const PostProfilePhoto = (props) => {
	const params = useParams();
	const usersData = useSelector((state) => state.user.usersData);
	const userData = usersData.filter((user) => user.userId === props.uid)[0];
	const { profilePhotoURL, isProfileImgLoading } = useProfilePhoto(userData);

	return isProfileImgLoading ? (
		<div className={classes.profilePhotoPlaceholder}>
			<div className={classes.profilePhoto}>
				<Loading styleSpinner={{ height: '70px', minWidth: '110px' }} />
			</div>
		</div>
	) : params.uid ? (
		<div
			className={`${classes.profilePhotoPlaceholder} ${
				props.isComment ? classes.withLine : ''
			}`}
		>
			<div
				className={`${classes.profilePhoto} ${
					props.isComment ? classes.withLine : ''
				}`}
			>
				<Avatar
					image={profilePhotoURL}
					alt='profilePhot'
					width='50px'
					height='50px'
				/>
			</div>
		</div>
	) : (
		<div
			className={`${classes.profilePhotoPlaceholder} ${
				props.isComment ? classes.withLine : ''
			}`}
		>
			<Link
				className={`${classes.profilePhoto} ${
					props.isComment ? classes.withLine : ''
				}`}
				to={`profile/${userData.userId}`}
			>
				<Avatar
					image={profilePhotoURL}
					alt='profilePhot'
					width='50px'
					height='50px'
				/>
			</Link>
		</div>
	);
};

export default PostProfilePhoto;

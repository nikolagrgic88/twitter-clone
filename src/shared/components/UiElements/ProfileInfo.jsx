import { useEffect, useState } from 'react';
import Avatar from './Avatar';
import classes from './ProfileInfo.module.css';
import { getAuth } from 'firebase/auth';
import { app, cloudDb } from '../../../Firebase';
import { update } from 'firebase/database';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { dispatch } from '../../../store/store';
import { setAuthData, setUserData } from '../../../store/userSlice';
import CommentBox from '../Elements/CommentBox';
import { AnimatePresence } from 'framer-motion';
import FriendsList from '../../../components/FriendsList';
import Modal from '../../../components/Modal';

const ProfileInfo = (props) => {
	const [authUser, setAuthUser] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);
	const [isFollowingList, setIsFollowingList] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalUpdateDetailsOpen,setIsModalUpdateDetailsOpen] = useState(false)
	//updateto following

	const followers = props?.userData?.followers;
	const following = props?.userData?.following;
	const authUserData = useSelector((state) => state.user.authUser);

	const followersHandler = () => {
		setIsFollowingList(false);
		setIsModalOpen(true);
	};

	const followingHandler = () => {
		setIsFollowingList(true);
		setIsModalOpen(true);
	};
	const closeModalHandler = () => {
		setIsModalOpen(false);
	};

	useEffect(() => {
		if (followers) {
			setIsFollowing(followers.find((id) => id === authUserData.userId));
		}
	}, [followers, authUserData.userId]);

	// if(followers){
	// 	followers.map(user=>user.)
	// }

	// const bio = props.userData.bio;
	// const location = props.userData.location;
	// const dob = props.userData.dob

	const date = new Date(props.userData.joiningDate);
	const year = date.getFullYear();
	const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
		date
	);

	const userFollowHandler = async () => {
		try {
			if (!isFollowing) {
				await updateDoc(doc(cloudDb, 'users', props?.userData?.userId), {
					followers: [...followers, authUserData.userId],
				});
				await updateDoc(doc(cloudDb, 'users', authUserData.userId), {
					following: [...authUserData.following, props?.userData?.userId],
				});
				dispatch(
					setAuthData({
						...authUserData,
						following: [...authUserData.following, props?.userData?.userId],
					})
				);
				dispatch(
					setUserData({
						...props?.userData,
						followers: [...followers, authUserData.userId],
					})
				);
			}
		} catch (e) {
			console.error('Following request Error : ', e);
		}
	};

	useEffect(() => {
		if (props?.userData?.userId === authUserData.userId) {
			setAuthUser(true);
		}
	}, [authUserData.userId, props?.userData?.userId, setAuthUser]);

	const updateUserDetails = () => {};

	return (
		<>
			<AnimatePresence>
				{isModalOpen && (
					<Modal handleClose={closeModalHandler} optional={true}>
						<FriendsList
							friendsList={isFollowingList ? following : followers}
						/>
					</Modal>
				)}
				{isModalUpdateDetailsOpen && (
					<Modal handleClose={closeModalHandler} optional={true}>
					
					</Modal>
				)}
			</AnimatePresence>
			<div className={classes.profileInfoContainer}>
				<div className={classes.buttonContainer}>
					{!authUser ? (
						<button onClick={userFollowHandler}>
							{isFollowing ? 'Unfollow' : 'Follow'}
						</button>
					) : (
						<button onClick={updateUserDetails}>Update details</button>
					)}
				</div>

				<div className={classes.userInfoContainer}>
					<h1>{props.userData.displayName}</h1>
					<div className={classes.textContainer}>
						<span>User Bio text if any</span>
					</div>
					<div className={classes.userLocationContainer}>
						<div className={classes.locationInfo}>
							<ion-icon src='/img/map.svg'></ion-icon>
							<span>Location</span>
						</div>
						<div className={classes.locationInfo}>
							<ion-icon src='/img/calendar.svg'></ion-icon>
							<span>
								Joined {month} {year}
							</span>
						</div>
					</div>
					<div className={classes.userLocationContainer}>
						<div className={classes.locationInfo}>
							<strong>{following.length}</strong>
							<Link onClick={followingHandler}>Following </Link>
						</div>
						<div className={classes.locationInfo}>
							<strong>{followers.length}</strong>
							<Link onClick={followersHandler}>Followers </Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProfileInfo;

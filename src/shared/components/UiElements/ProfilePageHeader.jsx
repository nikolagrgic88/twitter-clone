import Avatar from './Avatar';
import ProfileInfo from './ProfileInfo';

import BackgroundImage from './BackgroundImage';
import classes from './ProfilePageHeader.module.css';
import { useLoaderData } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cloudDb, storage } from '../../../Firebase';
import {
	collection,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { ref } from 'firebase/storage';

import Loading from '../../../components/Loading';
import {
	setAuthData,
	setIsLoading,
	setUserData,
	updateProfilePhoto,
} from '../../../store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import useProfilePhoto from '../../../hooks/useProfilePhoto';
import { dispatch } from '../../../store/store';
import Modal from '../../../components/Modal';

const ProfilePageHeader = (props) => {
	const [avatarImagePreview, setAvatarImagePreview] = useState(null);
	const [avatarImageUpload, setAvatarImageUpload] = useState(null);
	const [imageUpload, setImageUpload] = useState(false);

	const authUserData = useSelector((state) => state.user.authUser);
	const [avatarImage, setAvatarImage] = useState(authUserData.profilePhoto);

	const isLoading = useSelector((state) => state.user.isLoading);
	const isUserAuth = props.uid === authUserData.userId;
	const userData = useSelector((state) => state.user.userData);

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		setImageUpload(true);

		if (selectedFile) {
			setAvatarImage(selectedFile);
			setAvatarImagePreview(URL.createObjectURL(selectedFile));
			setAvatarImageUpload(selectedFile);
		}
	};

	useEffect(() => {
		const updateProfilePhoto = async () => {
			try {
				console.log('profilePhoto', userData.profilePhoto);

				const profilePhotoRef = ref(
					storage,
					`profilePhotos/${userData.profilePhoto}`
				);

				const downloadedUrl = await getDownloadURL(profilePhotoRef);

				setAvatarImage(downloadedUrl);
			} catch (error) {
				console.error('Error fetching profile photo:', error);
			}
		};

		updateProfilePhoto();
	}, [userData]);

	const imageHandler = async () => {
		const userId = userData.userId;
		const uploadedImage = avatarImage.name ? avatarImage : avatarImageUpload;

		try {
			dispatch(setIsLoading(true));
			const storageRef = ref(storage, `profilePhotos/${uploadedImage.name}`);
			await uploadBytesResumable(storageRef, uploadedImage);

			// await uploadTask;

			const userQuery = query(
				collection(cloudDb, 'users'),
				where('userId', '==', userId)
			);

			const userDocSnapshot = await getDocs(userQuery);
			const userDocRef = userDocSnapshot.docs[0].ref;

			await updateDoc(userDocRef, { profilePhoto: uploadedImage.name });
			console.log('Profile photo updated successfully!');

			// Download the uploaded image URL after successful upload
			const downloadedUrl = await getDownloadURL(
				ref(storage, `profilePhotos/${uploadedImage.name}`)
			);

			// Dispatch action to update profile photo URL in Redux
			// dispatch(setUserData({ ...userData, profilePhoto: downloadedUrl }));
			dispatch(
				setAuthData({ ...authUserData, profilePhoto: uploadedImage.name })
			);
			dispatch(setUserData({ ...userData, profilePhoto: uploadedImage.name }));
			dispatch(updateProfilePhoto(downloadedUrl));
			setAvatarImage(null);
			dispatch(setIsLoading(false));
		} catch (error) {
			console.error('Error uploading image and updating profile photo:', error);
		}

		setAvatarImageUpload(null);
		setImageUpload(false);
	};

	const cancelImageHandler = () => {
		document.getElementById('fileInput').value = null;
		setAvatarImageUpload(null);
		setAvatarImagePreview(null);
		setAvatarImage(avatarImage);
		setImageUpload(false);
	};

	return (
		<>
			<div className={classes.profileHeader}>
				<BackgroundImage userData={userData} />
				<div className={classes.avatarContainer}>
					{isLoading ? (
						<Loading
							styleSpinner={{ height: '160px', width: '160px' }}
							styleContainer={{ backgroundColor: 'pink' }}
						/>
					) : (
						<>
							<input
								type='file'
								accept='image/*'
								onChange={handleFileChange}
								style={{ display: 'none' }}
								id='fileInput'
							/>
							<label htmlFor='fileInput'>
								<div>
									<Avatar
										image={avatarImagePreview || avatarImage}
										width='160px'
										height='160px'
										border='5px white solid'
										disabled={isUserAuth}
									/>
								</div>
							</label>
							{imageUpload && !isLoading && (
								<div className={classes.modalContainer}>
									<button onClick={imageHandler}>Upload Photo</button>
									<button onClick={cancelImageHandler}>Cancel</button>
								</div>
							)}
						</>
					)}
				</div>

				<ProfileInfo userData={userData} />

				{/* <ProfilePosts/> */}
			</div>
		</>
	);
};

export default ProfilePageHeader;

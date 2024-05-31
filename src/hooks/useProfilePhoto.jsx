import { useEffect, useState } from 'react';
import { ref } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import { storage } from '../Firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, updateProfilePhoto } from '../store/userSlice';

const useProfilePhoto = (userData) => {
	const [profilePhotoURL, setProfilePhotoURL] = useState(null);
	const [isProfileImgLoading, setIsProfileImgLoading] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchProfilePhoto = async () => {
			try {
				const profilePhotoRef = ref(
					storage,
					`profilePhotos/${userData?.profilePhoto}`
				);
				const downloadedUrl = await getDownloadURL(profilePhotoRef);

				setProfilePhotoURL(downloadedUrl);

				dispatch(updateProfilePhoto(downloadedUrl));
			} catch (error) {
				console.error('Error fetching profile photo:', error);
			} finally {
				setIsProfileImgLoading(false);
			}
		};

		if (userData?.profilePhoto) {
			fetchProfilePhoto();
		}
	}, [userData?.profilePhoto]);

	return { profilePhotoURL, isProfileImgLoading };
};

export default useProfilePhoto;

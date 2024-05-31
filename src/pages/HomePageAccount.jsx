import React from 'react';

import HomeRender from '../components/HomeRender';
import MainDispalyModule from '../components/MainDisplayModule';
import { useParams } from 'react-router-dom';

import ProfilePageHeader from '../shared/components/UiElements/ProfilePageHeader';
import { useSelector } from 'react-redux';
import { dispatch } from '../store/store';
import { setUserData } from '../store/userSlice';
import BackButton from '../shared/components/UiElements/BackButton';

function HomePageAccount() {
	const params = useParams();
	const usersData = useSelector((state) => state.user.usersData);

	const userData = usersData.filter((user) => user.userId === params.uid)[0];
	dispatch(setUserData(userData));
	

	return (
		<MainDispalyModule>
			<BackButton />
			<ProfilePageHeader uid={params.uid} />
			<HomeRender uid={params.uid} />
		</MainDispalyModule>
	);
}
export default HomePageAccount;

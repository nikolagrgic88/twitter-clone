import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { app, cloudDb } from '../Firebase';
import { dispatch } from '../store/store';
import { setAuthData, setTweets, setUsersData } from '../store/userSlice';
import { getAuth } from 'firebase/auth';
import { redirect } from 'react-router-dom';
import { getToken } from '../Utils/tokenStorage';

export async function loader() {
	try {
		const auth = getAuth(app);
		const token = getToken();
		if (!token || auth.currentUser === null) {
			return redirect('/login');
		}

		const queryDb = query(collection(cloudDb, 'tweets'), orderBy('timeStamp'));
		const querySnapshot = await getDocs(queryDb);
		let tweetsData = [];

		querySnapshot.forEach((doc) => {
			tweetsData.push({
				id: doc.id,
				...doc.data(),
				timeStamp: doc.data().timeStamp,
			});
		});

		const usersQuery = query(collection(cloudDb, 'users'));
		const usersSnapshot = await getDocs(usersQuery);
		const usersData = usersSnapshot.docs.map((doc) => doc.data());

		const authUserId = auth.currentUser.uid;
		const authenticatedUser = usersData.find(
			(user) => user.userId === authUserId
		);

		dispatch(setUsersData(usersData));
		dispatch(setAuthData(authenticatedUser));
		dispatch(setTweets(tweetsData));

		//making sure that data doesnt double up
		return {
			data: tweetsData.length > 0 ? [] : tweetsData,
			userData: usersData,
		};
	} catch (error) {
		console.error('Error loading tweets: ', error);
		return { data: [], userData: [] };
	}
}

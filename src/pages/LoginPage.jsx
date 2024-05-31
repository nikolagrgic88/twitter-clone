import { redirect, useActionData, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	getAuth,
	updateProfile,
} from 'firebase/auth';

import { useEffect, useState } from 'react';
import { app, cloudDb } from '../Firebase';
import { onAuthStateChanged } from 'firebase/auth';

import auth from '../Firebase';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

import { getToken, setToken, removeToken } from '../Utils/tokenStorage';
import { jwtDecode } from 'jwt-decode';
import Home from '../Home';

function Login() {
	const [isLoading, setIsLoading] = useState(true);
	const [isTokenValid, setIsTokenValid] = useState(false);
	//checking if user is logged in
	const navigate = useNavigate();

	useEffect(() => {
		const auth = getAuth(app);

		const token = getToken();

		if (token) {
			const decodedToken = jwtDecode(token);

			if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
				// Token is valid, navigate to home page

				setIsTokenValid(true);
				// navigate('/');
				setIsLoading(false);
			} else {
				// Token is expired or invalid, remove it from storage
				setIsTokenValid(false);
				removeToken();
				setIsLoading(false);
			}
		}

		const login = async () => {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					user
						.getIdToken()
						.then((token) => {
							setToken(token);
							navigate('/');
							setIsTokenValid(true);
						})
						.catch((error) => {
							console.error('Error getting ID token:', error);
							setIsLoading(false);
						});
				} else {
					setIsLoading(false);
				}
			});
		};

		login();
	}, [navigate]);

	return (
		<Modal optional={false}>
			{isLoading || isTokenValid ? (
				<Loading styleSpinner={{ height: '200px', minWidth: '110px' }} />
			) : (
				<LoginForm />
			)}
		</Modal>
	);
}

export default Login;

export async function action({ request }) {
	try {
		const data = await request.formData();
		const intent = data.get('intent');

		let createdUserId;
		if (intent === 'signup') {
			const authData = {
				email: data.get('email').trim(),
				password: data.get('password').trim(),
				displayName: data.get('username').trim(),
				dateOfBirth: data.get('dob').trim(),
			};
			//creating new user in Firebase authentication

			await createUserWithEmailAndPassword(
				auth,
				authData.email,
				authData.password
			).then((user) => {
				createdUserId = user;
				updateProfile(createdUserId.user, {
					displayName: authData.displayName,
				});
			});

			//creating new user in Firestore Cloud DB
			await setDoc(doc(cloudDb, 'users', createdUserId.user.uid), {
				displayName: authData.displayName,
				dateOfBirth: authData.dateOfBirth,
				joiningDate: new Date().toISOString(),
				location: null,
				userId: createdUserId.user.uid,
				following: [],
				followers: [],
				backgroundImage: null,
				profilePhoto: 'avatar.svg',
				bio: '',
			});
			console.log('writen');
		}
		if (intent === 'login') {
			const authData = {
				email: data.get('email').trim(),
				password: data.get('password').trim(),
			};

			await signInWithEmailAndPassword(auth, authData.email, authData.password);
		}
	} catch (error) {
		if (error.code === 'auth/user-not-found') {
			return { message: 'User not found!' };
		} else if (error.code === 'auth/wrong-password') {
			return { message: 'You entered wrong credentials!' };
		} else {
			return { message: error.message };
		}
	}

	return redirect('/');
}

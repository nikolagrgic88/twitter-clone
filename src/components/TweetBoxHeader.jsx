import { getAuth, signOut } from 'firebase/auth';

import classes from './HomeAccountHeader.module.css';
import { NavLink, redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import auth from '../Firebase';
import { removeToken } from '../Utils/tokenStorage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TweetBoxHeader() {
	const navigate = useNavigate();

	const logoutHandler = () => {
		signOut(auth)
			.then(() => {
				removeToken();
				console.log('signout');
				toast.success('You are signed out now');
				const redirectUrl = '/login?mode=login';
				navigate(redirectUrl);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div className={classes.homebar}>
			<div className={classes['home']}>
				<button onClick={logoutHandler}>Logout</button>
			</div>
			<nav className={classes['home-nav']}>
				<div className={classes['home-nav-link']}>
					<NavLink
						className={({ isActive }) =>
							isActive ? classes.active : classes['home-nav-link']
						}
						to='/'
						end
					>
						For you
					</NavLink>
				</div>
				<div className={classes['home-nav-link']}>
					<NavLink
						className={({ isActive }) =>
							isActive ? classes.active : undefined
						}
						to='/profile'
						end
					>
						Following
					</NavLink>
				</div>
			</nav>
		</div>
	);
}
export default TweetBoxHeader;

import { NavLink } from 'react-router-dom';
import classes from './MainHeader.module.css';
import { getAuth } from 'firebase/auth';
import { app } from '../Firebase';
import { useSelector } from 'react-redux';
import { dispatch } from '../store/store';
import { setSearchModalMode } from '../store/userSlice';

function MainHeader() {
	// const authUser = useSelector((state) => state.user.authenticatedUser);
	const authUser = getAuth(app).currentUser.uid;
	const openModal = () => {
		dispatch(setSearchModalMode(true));
	};

	// const auth = getAuth(app);
	// const user = auth.currentUser;
	return (
		<header className={classes.header}>
			<div className={classes.headerBox}>
				<ul className={classes['main-nav-list']}>
					<li>
						<NavLink className={classes['main-nav-link--a']} to='/'>
							<ion-icon src='../..\img\logo-twitter (1).svg' />
						</NavLink>
					</li>
					<li>
						<div className={classes.buttonEl}>
							<NavLink className={classes['main-nav-link']} to='/'>
								<ion-icon src='../..\img\home-outline.svg' />
								<p>Home</p>
							</NavLink>
						</div>
					</li>
					<li>
						<div className={classes.buttonEl}>
							<NavLink className={classes['main-nav-link']} onClick={openModal}>
								<ion-icon src='../../img\search-circle-outline.svg' />
								<p>Explore</p>
							</NavLink>
						</div>
					</li>
					<li>
						<div className={classes.buttonEl}>
							<NavLink className={classes['main-nav-link']} to='profile'>
								<ion-icon src='../..\img\notifications-outline.svg' />
								<p>Notification</p>
							</NavLink>
						</div>
					</li>
					<li>
						<div className={classes.buttonEl}>
							<NavLink className={classes['main-nav-link']} to='profile'>
								<ion-icon src='../..\img\mail-unread-outline.svg' />
								<p>Messages</p>
							</NavLink>
						</div>
					</li>

					<li>
						<div className={classes.buttonEl}>
							<NavLink
								className={classes['main-nav-link']}
								to={`profile/${authUser}`}
							>
								<ion-icon src='../..\img\person-circle-outline.svg' />
								<p>Profile</p>
							</NavLink>
						</div>
					</li>
				</ul>
			</div>
		</header>
	);
}

export default MainHeader;

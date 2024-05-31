import { useSelector } from 'react-redux';
import FriendsList from './FriendsList';
import { AnimatePresence } from 'framer-motion';
import Modal from './Modal';
import { useState } from 'react';
import classes from './FriendsList.module.css';
import PostProfilePhoto from '../shared/components/UiElements/PostProfilePhoto';
import { Link } from 'react-router-dom';
import { dispatch } from '../store/store';
import { setSearchModalMode } from '../store/userSlice';

const Search = () => {
	const { searchModalIsOpen, usersData } = useSelector((state) => state.user);
	//add redux search modal

	const [searchTerm, setSearchTerm] = useState('');

	const filteredUsers = usersData.filter((user) =>
		user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const closeModalHandler = () => {
		dispatch(setSearchModalMode(false));
	};

	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
	};

	return (
		<>
			<AnimatePresence>
				<Modal handleClose={closeModalHandler} optional={true}>
					<div className={classes.searchBox}>
						<div className={classes.inputBox}>
							<input
								type='text'
								placeholder='Search users...'
								value={searchTerm}
								onChange={handleInputChange}
							/>
						</div>
						<ul className={classes.listContainer}>
							{filteredUsers.map((user) => (
								<li key={user.userId} className={classes.listItem}>
									<Link
										className={classes.listItemBox}
										to={`profile/${user.userId}`}
										onClick={closeModalHandler}
									>
										<PostProfilePhoto uid={user.userId} />
										<div>{user.displayName}</div>
									</Link>
								</li>
							))}
						</ul>
						{filteredUsers.length === 0 && <span>No user found...</span>}
					</div>
				</Modal>
			</AnimatePresence>
		</>
	);
};

export default Search;

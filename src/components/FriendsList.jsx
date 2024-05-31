import { useSelector } from 'react-redux';
import PostProfilePhoto from '../shared/components/UiElements/PostProfilePhoto';
import classes from './FriendsList.module.css';

const FriendsList = (props) => {
	console.log('props', props);

	const usersData = useSelector((state) => state.user.usersData);

	return (
		<ul className={classes.listContainer}>
			{props.friendsList.map((friend) => {
				const friendData = usersData.find((f) => f.userId === friend);

				return (
					<li key={friend} className={classes.listItem}>
						<PostProfilePhoto uid={friend} />
						<div>{friendData.displayName}</div>
					</li>
				);
			})}
		</ul>
	);
};

export default FriendsList;

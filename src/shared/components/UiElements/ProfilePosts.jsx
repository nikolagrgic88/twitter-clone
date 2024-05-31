import classes from './ProfilePosts.module.css';
import UsersPost from './UsersPost';
const ProfilePosts = (props) => {

	//change to ProfilePostOptions
	return (
		<ul>
			{props.length > 0 &&
				props.map((item, index) => (
					<li key={index}>
						<div className={classes.post}>
							<UsersPost displayName={item.displayName} item={item} />
						</div>
					</li>
				))}
		</ul>
	);
};

export default ProfilePosts;

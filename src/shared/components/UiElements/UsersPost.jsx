import { Link, NavLink, useNavigate } from 'react-router-dom';
import classes from './UsersPost.module.css';
import PostStats from '../TweetPost/PostStats';
import PostBox from '../../../components/PostBox';


const UsersPost = (props) => {
	const date = new Date(props.post.timeStamp);
	const day = date.getDate();
	const year = date.getFullYear();
	const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
		date
	);
	const navigate = useNavigate

	return (
		<div className={classes.content}>
			<div className={classes.box}>
				<div className={classes.name}>
					<div className={classes['name-header']}>
						<div
							style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}
						>
							<strong>{props.post.displayName}</strong>{' '}
							<div
								style={{ fontSize: '14px' }}
							>{`${day} ${month} ${year}`}</div>
						</div>
					</div>
					<div className={classes['post-menu']}>
						<NavLink>...</NavLink>
					</div>
				</div>
				<Link to={`/post/${props.post.id}`}>
					<div className={classes.text}>{props.post?.text}</div>

					{props.post?.imageDownloadURL && (
						<div className={classes.imageBox}>
							<img src={props.post?.imageDownloadURL} alt={props.post?.image} />
						</div>
					)}
				</Link>

				{props.display && (
					<div className={classes.imageBox}>
						<PostBox post={props.rePostData} />
					</div>
				)}
				{!props.isComment && <PostStats stats={props.post} />}
			</div>
		</div>
	);
};

export default UsersPost;

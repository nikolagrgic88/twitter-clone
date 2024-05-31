import PostProfilePhoto from '../shared/components/UiElements/PostProfilePhoto';
import UsersPost from '../shared/components/UiElements/UsersPost';
import classes from '../components/HomeRender.module.css';

export const usersPost = (data, display, rePostData, isComment, style) => {
	
	
	return (
		<div
			className={classes.post}
			style={{ borderBottom: isComment && 'none', style }}
		>
			<PostProfilePhoto uid={data.userId} isComment={isComment} />
			<UsersPost
				post={data}
				display={display}
				rePostData={rePostData}
				isComment={isComment}
			>
				{data.imageDownloadURL ? (
					<img src={data.imageDownloadURL} alt='Post Image' />
				) : (
					<div className={classes.imagePlaceholder} />
				)}
			</UsersPost>
		</div>
	);
};

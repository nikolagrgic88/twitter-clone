import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { renderPost } from '../Utils/renderPost';
import { usersPost } from '../Utils/usersPost';
import MainDispalyModule from '../components/MainDisplayModule';

import { useSelector } from 'react-redux';
import PostBox from '../components/PostBox';
import { useEffect, useState } from 'react';
import CommentBox from '../shared/components/Elements/CommentBox';
import Loading from '../components/Loading';
import PostProfilePhoto from '../shared/components/UiElements/PostProfilePhoto';
import BackButton from '../shared/components/UiElements/BackButton';

const CommentPage = () => {
	const { postId } = useParams();
	const storedTweets = useSelector((state) => state.user.tweets);
	const [selectedTweet, setSelectedTweet] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const tweet = storedTweets.find((t) => t.id === postId);
		setSelectedTweet(tweet);
		setLoading(false);
	}, [storedTweets, postId, selectedTweet]);
	console.log('selected tweet', selectedTweet);

	return (
		<MainDispalyModule>
			{loading ? (
				<Loading />
			) : (
				<div>
					<BackButton />
					<CommentBox tweet={selectedTweet}></CommentBox>
					<div>
						<ul>
							{selectedTweet?.comments?.length > 0 &&
								selectedTweet.comments.map((comment, index) => (
									<li key={index}>{renderPost(comment)}</li>
								))}
						</ul>
						{/* <ul>
							{selectedTweet.comments?.length > 0 &&
								selectedTweet.comments.map((comment, index) => {
									let repliedPost = storedTweets.find(
										(reply) => reply.id === comment
									);
									return <li key={index}>{renderPost(repliedPost)}</li>;
								})}
						</ul> */}
					</div>
				</div>
			)}
		</MainDispalyModule>
	);
};
export default CommentPage;

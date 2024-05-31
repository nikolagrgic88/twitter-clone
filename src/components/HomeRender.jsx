import classes from './HomeRender.module.css';
import useTweets from '../hooks/useTweets';
import { useEffect, useState } from 'react';

import { renderPost } from '../Utils/renderPost';
import { AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import Modal from './Modal';
import { dispatch } from '../store/store';
import { setModalMode } from '../store/userSlice';
import CommentBox from '../shared/components/Elements/CommentBox';

const HomeRender = (props) => {
	const { tweetsArray, isLoading } = useTweets();
	const [onProfilePage, setOnProfilePage] = useState(false);
	const isModalOpen = useSelector((state) => state.user.modalIsOpen);
	const selectedPostId = useSelector((state) => state.user.commentedTweet);

	const closeModalHandler = () => {
		dispatch(setModalMode(false));
	};

	useEffect(() => {
		if (props.uid) {
			setOnProfilePage(true);
		} else {
			setOnProfilePage(false);
		}
	}, [props.uid]);

	const filteredTweets = props.uid
		? tweetsArray
				.filter((item) => item.userId === props.uid)
				.sort((a, b) => b.timeStamp - a.timeStamp)
		: tweetsArray
				.filter((item) => item.isReposted === false)
				.sort((a, b) => b.timeStamp - a.timeStamp);

	return (
		<div>
			<ul>
				{filteredTweets?.length > 0 &&
					filteredTweets.map((post, index) => (
						<li key={index} className={classes.linkList}>
							{renderPost(post, tweetsArray, onProfilePage)}
						</li>
					))}
			</ul>
			<AnimatePresence>
				{isModalOpen && (
					<Modal handleClose={closeModalHandler} optional={true}>
						<CommentBox
							tweet={tweetsArray.find((t) => t.id === selectedPostId) || null}
						/>
					</Modal>
				)}
			</AnimatePresence>
		</div>
	);
};

export default HomeRender;

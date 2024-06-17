import classes from './PostStats.module.css';
import { useState, useEffect } from 'react';
import { cloudDb } from '../../../Firebase.jsx';
import { getAuth } from 'firebase/auth';
import {
	Timestamp,
	addDoc,
	collection,
	deleteDoc,
	doc,
	documentId,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import {
	addLike,
	addTweet,
	removeLike,
	removeTweet,
	setCommentedTweet,
	setModalMode,
} from '../../../store/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';

const PostStats = (props) => {
	const dispatch = useDispatch();
	const tweets = useSelector((state) => state.user.tweets);
	const selectedTweet = tweets.find((tweet) => tweet.id === props.id);
	const auth = getAuth();
	const [isLiked, setIsLiked] = useState(false);
	const [isReposted, setIsReposted] = useState(false);
	// const [tweetStats, setTweetStats] = useState({
	// 	likes: 0,
	// 	reposts: 0,
	// 	comments: 0,
	// });

	// console.log('tweet', selectedTweet);

	// const userLikes = selectedTweet?.likes || [];
	// const userReposts = selectedTweet?.reposts || [];
	// const userComments = selectedTweet?.comments || [];

	useEffect(() => {
		// setTweetStats({
		// 	likes: userLikes.length,
		// 	reposts: userReposts.length,
		// 	comments: userComments.length,
		// });

		setIsLiked(selectedTweet.likes.includes(auth.currentUser.uid));
		setIsReposted(selectedTweet.reposts.includes(auth.currentUser.uid));
	}, [auth.currentUser.uid]);

	const likesHandler = async () => {
		try {
			if (!isLiked) {
				await updateDoc(doc(cloudDb, 'tweets', selectedTweet.id), {
					likes: [...selectedTweet.likes, auth.currentUser.uid],
				});
				dispatch(
					addLike({ tweetId: selectedTweet.id, userId: auth.currentUser.uid })
				);
				setIsLiked(true);

				// setTweetStats((prevState) => ({
				// 	...prevState,
				// 	likes: prevState.likes + 1,
				// }));
			} else {
				const newLikes = selectedTweet.likes.filter(
					(userId) => userId !== auth.currentUser.uid
				);
				await updateDoc(doc(cloudDb, 'tweets', selectedTweet.id), {
					likes: newLikes,
				});
				setIsLiked(false);
				dispatch(
					removeLike({
						tweetId: selectedTweet.id,
						userId: auth.currentUser.uid,
					})
				);
				// setTweetStats((prevState) => ({
				// 	...prevState,
				// 	likes: prevState.likes - 1,
				// }));
			}
		} catch (error) {
			console.error('Error updating likes:', error);
		}
	};
	const repostsHandler = async () => {
		try {
			if (!isReposted) {
				await updateDoc(doc(cloudDb, 'tweets', selectedTweet.id), {
					reposts: [...selectedTweet.reposts, auth.currentUser.uid],
				});
				setIsReposted(true);
				// setTweetStats((prevState) => ({
				// 	...prevState,
				// 	reposts: prevState.reposts + 1,
				// }));

				const tweetsQuery = query(
					collection(cloudDb, 'tweets'),
					where(documentId(), '==', selectedTweet.id)
				);
				const querySnapshot = await getDocs(tweetsQuery);

				const tweetData = querySnapshot.docs[0].data();
				const oldTweetId = querySnapshot.docs[0].id;

				const userId = auth.currentUser.uid;
				const displayName = auth.currentUser.displayName;
				const timeStamp = Timestamp.now().toMillis();

				const newTweet = {
					text: null,
					userId,
					timeStamp,
					displayName,
					likes: [],
					reposts: [],
					comments: [],
					imageDownloadURL: null,
					isCommentFor: null,
					retweeted: { id: oldTweetId },
					isReposted:
						!tweetData.isReposted && tweetData.retweeted.length === 0
							? false
							: true,
				};

				const docRef = await addDoc(collection(cloudDb, 'tweets'), newTweet);
				const tweetId = docRef.id;
				await updateDoc(doc(cloudDb, 'tweets', tweetId), { id: tweetId });

				dispatch(addTweet({ ...newTweet, id: tweetId }));
			} else {
				const tweetsQuery = query(
					collection(cloudDb, 'tweets'),
					where('retweeted.id', '==', selectedTweet.id),
					where('userId', '==', auth.currentUser.uid)
				);
				const originalTweetQuery = query(
					collection(cloudDb, 'tweets'),
					where(documentId(), '==', selectedTweet.id)
				);
				const originalTweetSnapshot = await getDocs(originalTweetQuery);

				if (!originalTweetSnapshot.empty) {
					const originalTweetDoc = originalTweetSnapshot.docs[0];
					const originalTweetData = originalTweetDoc.data();
					const originalTweetId = originalTweetDoc.id;

					// Modify the reposts array to remove the current user's ID
					const updatedReposts = originalTweetData.reposts.filter(
						(uid) => uid !== auth.currentUser.uid
					);

					// Update the document in Firestore with the modified reposts array
					await updateDoc(doc(cloudDb, 'tweets', originalTweetId), {
						reposts: updatedReposts,
					});

					// Optionally update local state or dispatch an action to reflect the change
					// For example:
					// dispatch(updateRepostsInState({ tweetId: originalTweetId, reposts: updatedReposts }));
				} else {
					console.error('Original tweet not found.');
				}

				const querySnapshot = await getDocs(tweetsQuery);

				// const oldTweetId = querySnapshot.docs[0].id;
				const oldTweetId = querySnapshot.docs.map((data) => data.data());
				const data = querySnapshot.docs[0].id;
				await deleteDoc(doc(cloudDb, 'tweets', data));
				setIsReposted(false);
				// setTweetStats((prevState) => ({
				// 	...prevState,
				// 	reposts: prevState.reposts - 1,
				// }));

				dispatch(removeTweet(selectedTweet.id));
			}
		} catch (error) {
			console.error('Error updating repost:', error);
		}
	};

	const commentsHandler = () => {
		try {
			dispatch(setCommentedTweet(selectedTweet.id));
			dispatch(setModalMode(true));
		} catch (e) {
			console.log('Error adding comment: ', e);
		}
	};

	return (
		<>
			<ul className={classes.statsContainer}>
				<li>
					<div
						style={{
							color: isLiked ? 'red' : 'black',
						}}
					>
						{selectedTweet?.likes.length || 0}
					</div>
					<ion-button onClick={likesHandler}>
						<ion-icon
							name={isLiked ? 'heart' : 'heart-outline'}
							style={{
								color: isLiked ? 'red' : 'black',
							}}
						></ion-icon>
					</ion-button>
				</li>

				<li>
					<div style={{ color: isReposted ? 'green' : 'black' }}>
						{selectedTweet?.reposts.length || 0}
					</div>
					<ion-button onClick={repostsHandler}>
						<ion-icon
							name={isReposted ? 'repeat' : 'repeat-outline'}
							style={{
								color: isReposted ? 'green' : 'black',
							}}
						></ion-icon>
					</ion-button>
				</li>

				<li>
					<div>{selectedTweet?.comments.length || 0}</div>
					<ion-button onClick={commentsHandler}>
						<ion-icon
							src='/img/chat-cloud.svg'
							// style={{ backgroundColor: 'red' }}
						></ion-icon>
					</ion-button>
				</li>
			</ul>
		</>
	);
};

export default PostStats;

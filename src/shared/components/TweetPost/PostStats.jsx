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
	addTweet,
	removeTweet,
	setCommentedTweet,
	setModalMode,
} from '../../../store/userSlice.js';
import { useDispatch } from 'react-redux';

const PostStats = (props) => {
	const dispatch = useDispatch();
	const [isLiked, setIsLiked] = useState(false);
	const [isReposted, setIsReposted] = useState(false);
	const [tweetStats, setTweetStats] = useState({
		likes: 0,
		reposts: 0,
		comments: 0,
	});

	const auth = getAuth();

	useEffect(() => {
		const userLikes = props.stats?.likes || [];
		const userReposts = props.stats?.reposts || [];
		setTweetStats({
			likes: userLikes.length,
			reposts: userReposts.length,
			comments: props.stats.comments?.length,
		});

		setIsLiked(userLikes.includes(auth.currentUser.uid));
		setIsReposted(userReposts.includes(auth.currentUser.uid));
	}, [props.stats, auth.currentUser.uid]);

	const likesHandler = async () => {
		try {
			if (!isLiked) {
				await updateDoc(doc(cloudDb, 'tweets', props.stats.id), {
					likes: [...props.stats.likes, auth.currentUser.uid],
				});
				setIsLiked(true);
				setTweetStats((prevState) => ({
					...prevState,
					likes: (prevState.likes || 0) + 1,
				}));
				console.log('Like added');
			} else {
				const newLikes = props.stats.likes.filter(
					(userId) => userId !== auth.currentUser.uid
				);
				await updateDoc(doc(cloudDb, 'tweets', props.stats.id), {
					likes: newLikes,
				});
				setIsLiked(false);
				setTweetStats((prevState) => ({
					...prevState,
					likes: (prevState.likes || 0) - 1,
				}));
				console.log('Like removed');
			}
		} catch (error) {
			console.error('Error updating likes:', error);
		}
	};
	const repostsHandler = async () => {
		try {
			if (!isReposted) {
				await updateDoc(doc(cloudDb, 'tweets', props.stats.id), {
					reposts: [...props.stats.reposts, auth.currentUser.uid],
				});
				setIsReposted(true);
				setTweetStats((prevState) => ({
					...prevState,
					reposts: (prevState.reposts || 0) + 1,
				}));

				const tweetsQuery = query(
					collection(cloudDb, 'tweets'),
					where(documentId(), '==', props.stats.id)
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
					where('retweeted.id', '==', props.stats.id),
					where('userId', '==', auth.currentUser.uid)
				);
				const originalTweetQuery = query(
					collection(cloudDb, 'tweets'),
					where(documentId(), '==', props.stats.id)
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
				setTweetStats((prevState) => ({
					...prevState,
					reposts: prevState.reposts - 1,
				}));
				dispatch(removeTweet(props.stats.id));
			}
		} catch (error) {
			console.error('Error updating repost:', error);
		}
	};

	const commentsHandler = () => {
		try {
			dispatch(setCommentedTweet(props.stats.id));
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
						{tweetStats.likes}
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
						{tweetStats.reposts}
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
					<div>{tweetStats.comments}</div>
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

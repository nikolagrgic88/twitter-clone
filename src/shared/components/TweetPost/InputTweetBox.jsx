import { useState, useRef, useEffect } from 'react';
import ImageCompressor from 'image-compressor.js';
import { v4 as uuidv4 } from 'uuid';

import { useSelector, useDispatch } from 'react-redux';

import classes from '../../../components/Tweetbox.module.css';
import {
	Timestamp,
	addDoc,
	doc,
	updateDoc,
	collection,
} from 'firebase/firestore';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import {
	addComment,
	addTweet,
	setModalMode,
	setNewPostIsLoading,
} from '../../../store/userSlice';
import { cloudDb, storage } from '../../../Firebase';
import { ref } from 'firebase/storage';

function InputTweetBox(props) {
	const tweetRef = useRef();
	const dispatch = useDispatch();
	const [image, setImage] = useState(null);
	const [postIsValid, setPostIsValid] = useState(false);
	const authUsersData = useSelector((state) => state.user.authUser);
	const postIsLoading = useSelector((state) => state.user.newPostIsLoading);

	useEffect(() => {
		if (tweetRef.current?.length !== 0 || image !== null) {
			setPostIsValid(true);
		}
	}, [tweetRef, image]);

	let tweetValue;
	const onTweetHandler = async (event) => {
		event.preventDefault();
		try {
			dispatch(setNewPostIsLoading(true));

			if (tweetRef.current.value === '' && image === null) return;
			const timeStamp = Timestamp.now().toMillis();
			const newTweet = {
				text: tweetRef.current.value,
				userId: authUsersData.userId,
				timeStamp: timeStamp,
				image: image ? image.name : null,
				displayName: authUsersData.displayName,
				likes: [],
				reposts: [],
				comments: [],
				imageDownloadURL: null,
				retweeted: [],
				isReposted: false,
				isCommentFor: null,
			};

			if (image !== null) {
				const storageRef = ref(storage, `images/${image.name}`);
				const metadata = { contentType: 'image/jpeg' };
				const uploadTask = uploadBytesResumable(storageRef, image, metadata);
				await uploadTask;
				const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
				newTweet.imageDownloadURL = downloadURL;
			}

			// if (props.type === 'Reply') {
			// 	// const tweetId = uuidv4();
			// 	// await updateDoc(doc(cloudDb, 'tweets', props.tweet.id), {
			// 	// 	comments: [...props.tweet.comments, { ...newTweet, id: tweetId }],
			// 	// });

			// 	// dispatch(
			// 	// 	addComment({
			// 	// 		tweetId: props.tweet.id,
			// 	// 		comment: { ...newTweet, id: tweetId },
			// 	// 	})
			// 	// );
			// 	//////////////////////////////////////////////////////////////////////////
			// 	const docRef = await addDoc(collection(cloudDb, 'tweets'), newTweet);
			// 	const tweetId = docRef.id;
			// 	await updateDoc(doc(collection(cloudDb, 'tweets'), tweetId), {
			// 		id: tweetId,
			// 		isCommentFor: props.tweet.id,
			// 	});
			// 	await updateDoc(doc(cloudDb, 'tweets', props.tweet.id), {
			// 		comments: [...props.tweet.comments, tweetId],
			// 	});
			// 	dispatch(addTweet({ ...newTweet, id: tweetId }));
			// } else if (props.type === 'Post') {
			// 	const docRef = await addDoc(collection(cloudDb, 'tweets'), newTweet);
			// 	const tweetId = docRef.id;
			// 	await updateDoc(doc(collection(cloudDb, 'tweets'), tweetId), {
			// 		id: tweetId,
			// 	});
			// 	dispatch(addTweet({ ...newTweet, id: tweetId }));
			// }
			const docRef = await addDoc(collection(cloudDb, 'tweets'), newTweet);
			const tweetId = docRef.id;

			await updateDoc(doc(collection(cloudDb, 'tweets'), tweetId), {
				id: tweetId,
				...(props.type === 'Reply' && { isCommentFor: props.tweet.id }), // Conditionally adding 'isCommentFor' property
			});

			if (props.type === 'Reply') {
				await updateDoc(doc(cloudDb, 'tweets', props.tweet.id), {
					comments: [...props.tweet.comments, tweetId],
				});

				addComment({
					tweetId: props.tweet.id,
					comment: tweetId,
				});
			}

			dispatch(addTweet({ ...newTweet, id: tweetId }));

			dispatch(setModalMode(false));
		} catch (error) {
			console.error('Error uploading image:', error);
		} finally {
			dispatch(setNewPostIsLoading(false));
		}

		tweetRef.current.value = '';
		setImage(null);
	};

	const handleImageInputChange = async (event) => {
		const selectedImage = event.target.files[0];
		const compressor = new ImageCompressor();
		const compressedImage = await compressor.compress(selectedImage, {
			maxWidth: 800,
			maxHeight: 600,
			quality: 0.8,
		});
		setImage(compressedImage);
	};

	const handleChange = (event) => {
		event.target.style.height = 'auto';
		event.target.style.height = event.target.scrollHeight + 'px';
	};

	const handleLoadedImage = () => {
		setImage(null);
	};

	return (
		<div className={classes['tweet-home-tweetbox']}>
			<div className={classes['tweet-home-input']}>
				<textarea
					ref={tweetRef}
					value={tweetValue}
					className='twitter-input'
					placeholder={props.placeholder}
					rows={2}
					onChange={handleChange}
				/>
				<div className={classes['tweet-image-box']}>
					{image && (
						<div className={classes['tweet-image']}>
							<img src={URL.createObjectURL(image)} alt='Selected image' />
							<button onClick={handleLoadedImage}>X</button>
						</div>
					)}
				</div>
			</div>
			<div className={classes['tweet-home-buttons']}>
				<ul className={classes['tweet-home-buttons-options']}>
					<li>
						<label htmlFor='image-upload'>
							<ion-icon src='../..\img\image-outline.svg'></ion-icon>
							<input
								id='image-upload'
								type='file'
								accept='image/*'
								onChange={handleImageInputChange}
							/>
						</label>
					</li>
				</ul>
				<div>
					<button
						disabled={!postIsValid}
						onClick={onTweetHandler}
						className={classes['tweet-home-button-tweet-inner']}
					>
						{postIsLoading ? `${props.type}ing...` : props.type}
					</button>
				</div>
			</div>
		</div>
	);
}

export default InputTweetBox;

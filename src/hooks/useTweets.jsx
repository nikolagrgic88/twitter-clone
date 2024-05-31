import { useState, useEffect } from 'react';
import { cloudDb, storage } from '../Firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';


const useTweets = () => {
	const [tweetsArray, setTweetsArray] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onSnapshot(
			collection(cloudDb, 'tweets'),
			async (snapshot) => {
				try {
					setIsLoading(true);

					const newTweets = snapshot.docs.map((doc) => {
						return {
							id: doc.id,
							...doc.data(),
							timeStamp: doc.data()?.timeStamp,
						};
					});

					const updatedTweetsArray = await Promise.all(
						newTweets
							.map(async (tweet) => {
								if (tweet.image) {
									const imageDownloadURL = await getDownloadURL(
										ref(storage, `images/${tweet.image}`)
									);
									tweet = { ...tweet, imageDownloadURL };
								}
								return tweet;
							})
							.sort((a, b) => b.timeStamp - a.timeStamp)
					);

					setTweetsArray(updatedTweetsArray);
					setIsLoading(false);
				} catch (error) {
					console.error('Error fetching tweets:', error);
					setIsLoading(false);
				}
			}
		);

		return () => unsubscribe();
	}, []);

	return { tweetsArray, isLoading };
};

export default useTweets;

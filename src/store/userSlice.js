import { createSlice } from '@reduxjs/toolkit';

const userDataDefaults = {
	displayName: '',
	dateOfBirth: null,
	joiningDate: null,
	location: null,
	userId: '',
	following: [],
	followers: [],
	backgroundImage: null,
	profilePhoto: null,
	bio: '',
};
const initialState = {
	authUser: { ...userDataDefaults },
	userData: { ...userDataDefaults },
	usersData: [],
	isLoading: false,
	tweets: [],
	newPostIsLoading: false,
	modalIsOpen: false,
	searchModalIsOpen: false,
	commentedTweet: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserData: (state, action) => {
			state.userData = action.payload;
		},
		setUsersData: (state, action) => {
			state.usersData = action.payload;
		},
		setIsLoading: (state, action) => {
			state.isLoading = action.payload;
		},
		updateProfilePhoto: (state, action) => {
			state.userData.profilePhoto = action.payload;
		},
		setAuthData: (state, action) => {
			state.authUser = action.payload;
		},
		setTweets: (state, action) => {
			state.tweets = action.payload;
		},
		addTweet: (state, action) => {
			state.tweets.push(action.payload);
		},
		removeTweet: (state, action) => {
			state.tweets = state.tweets.filter(
				(tweet) => tweet.id !== action.payload
			);
		},
		setNewPostIsLoading: (state, action) => {
			state.newPostIsLoading = action.payload;
		},
		addComment: (state, action) => {
			const { tweetId, comment } = action.payload;
			const tweetIndex = state.tweets.findIndex(
				(tweet) => tweet.id === tweetId
			);
			if (tweetIndex !== -1) {
				state.tweets[tweetIndex].comments.push(comment);
			}
		},
		addLike: (state, action) => {
			const { tweetId, userId } = action.payload;
			const tweetIndex = state.tweets.findIndex(
				(tweet) => tweet.id === tweetId
			);
			if (tweetIndex !== -1) {
				state.tweets[tweetIndex].likes.push(userId);
			}
		},
		removeLike: (state, action) => {
			const { tweetId, userId } = action.payload;
			const tweetIndex = state.tweets.findIndex(
				(tweet) => tweet.id === tweetId
			);
			if (tweetIndex !== -1) {
				state.tweets[tweetIndex].likes = state.tweets[tweetIndex].likes.filter(
					(item) => item !== userId
				);
			}
		},
		addRepost: (state, action) => {
			const { tweetId, userId } = action.payload;
			const tweetIndex = state.tweets.findIndex(
				(tweet) => tweet.id === tweetId
			);
			if (tweetIndex !== -1) {
				state.tweets[tweetIndex].reposts.push(userId);
			}
		},
		removeRepost: (state, action) => {
			const { tweetId, userId } = action.payload;
			const tweetIndex = state.tweets.findIndex(
				(tweet) => tweet.id === tweetId
			);
			if (tweetIndex !== -1) {
				state.tweets[tweetIndex].reposts = state.tweets[
					tweetIndex
				].reposts.filter((item) => item !== userId);
			}
		},
		setModalMode: (state, action) => {
			state.modalIsOpen = action.payload;
		},
		setSearchModalMode: (state, action) => {
			state.searchModalIsOpen = action.payload;
		},
		setCommentedTweet: (state, action) => {
			state.commentedTweet = action.payload;
		},
	},
});

export const {
	setUserData,
	setUsersData,
	setIsLoading,
	updateProfilePhoto,
	setAuthData,
	setTweets,
	addTweet,
	setNewPostIsLoading,
	removeTweet,
	addComment,
	setModalMode,
	setCommentedTweet,
	searchModalIsOpen,
	setSearchModalMode,
	addLike,
	removeLike,
	addRepost,
	removeRepost,
} = userSlice.actions;

export default userSlice.reducer;

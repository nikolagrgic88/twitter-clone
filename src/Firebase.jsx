import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBIVwiJ_Xzi9O2f4m2TeOuCSygs2Jd09hs",
  authDomain: "twitter-d08b4.firebaseapp.com",
  databaseURL:
    "https://twitter-d08b4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "twitter-d08b4",
  storageBucket: "twitter-d08b4.appspot.com",
  messagingSenderId: "882804128469",
  appId: "1:882804128469:web:d28263bc51538f05edc05c",
  measurementId: "G-BYNW1KVKKM",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
const auth = getAuth(app);
export const cloudDb = getFirestore(app);
export const storage = getStorage(app);
export default auth;

// export async function loader() {
//   //getting data from firebase db
//   const dbRef = ref(database, "users/tweets/");
// return onValue(query(dbRef, orderByChild("timeStamp")),(snapshot)=>{
//    const tweetObject = {};
//     snapshot.forEach((childSnapshot) => {
//       tweetObject[childSnapshot.key] = childSnapshot.val();
//     });
//     return({ data: tweetObject });

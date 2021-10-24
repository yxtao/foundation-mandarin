import firebase from "firebase/app";
import "firebase/firestore";
import 'firebase/storage';
import 'firebase/auth';

import firebaseConfigInfo from "./configinfo";

const firebaseConfig = firebaseConfigInfo;

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth;
export default firebase;
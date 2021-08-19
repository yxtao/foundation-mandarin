import firebase from "firebase/app";
import "firebase/firestore";
import 'firebase/storage';
import firebaseConfigInfo from "./config";


const firebaseConfig = firebaseConfigInfo;
firebase.initializeApp(firebaseConfig);

export default firebase;
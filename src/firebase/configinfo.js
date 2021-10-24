import dotenv from 'dotenv';
dotenv.config();

var firebaseConfigInfo = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket:process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
  };

  export default firebaseConfigInfo;
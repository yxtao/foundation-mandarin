import env from "react-dotenv";

var firebaseConfigInfo = {
    apiKey: env.REACT_APP_KEY,
    authDomain: env.REACT_APP_DOMAIN,
    projectId: env.REACT_APP_PROJECTID,
    storageBucket:env.REACT_APP_BUCKET,
    messagingSenderId: env.REACT_APP_SENDER,
    appId:env.REACT_APP_APPID
  };

  export default firebaseConfigInfo;
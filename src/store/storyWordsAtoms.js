import { atom } from "recoil";
import firebase from "../firebase/firebase";

export const storyliststate = atom({
    key: "storyliststate",
    default: [],
  });  
export const wordliststate = atom({
    key: "wordliststate",
    default: [],
  });
  export const codeliststate = atom({
    key: "codeliststate",
    default: [],
  });
  export const firestoreState = atom({
    key: "firestore", // unique ID (with respect to other atoms/selectors)
    default: firebase.app().firestore(), // default value (aka initial value)
  });
  
  export const firestoreStorageState = atom({
    key: "firestorestorage",
    default: firebase.storage(),
  });

  export const wordsetstate = atom({
    key: "wordsetstate",
    default: [],
  });

  export const userlevelstate = atom({
    key: "userlevelstate",
    default: 0,
  });

  export const teachernamestate = atom({
    key:"teachernamestate",
    default:""
  })
  export const accesscodestate = atom({
    key:"accesscodestate",
    default:""
  })
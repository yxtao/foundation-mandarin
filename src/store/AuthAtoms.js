import { atom } from "recoil";
import firebase from "../firebase/firebase";

export const firebaseState = atom({
    key: "firebaseState",
    default: firebase,
  });


  export const checkedAuthState = atom({
    key: "checkedAuthState",
    default: false,
  });  


export const usernameState = atom({
    key: "usernameState",
    default: "",
  });
  
  export const userIdState = atom({
    key: "userIdState",
    default: "",
  });

  export const isAdminState = atom({
    key: "isAdminState",
    default: false,
  });

  export const isTeacherState = atom({
    key: "isAdminState",
    default: false,
  });
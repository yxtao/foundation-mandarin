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
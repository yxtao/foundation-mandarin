import axios from 'axios';
import {auth} from '../firebase/firebase';
const URL = "https://foundationchinese.herokuapp.com"
export const createUserAccount = async (userData) =>{
     await axios.post(`${URL}/auth/signup`, userData);       
}

export const loginUser = async (email, password) =>{
   const res = await auth().signInWithEmailAndPassword(email, password);
   return res;
}




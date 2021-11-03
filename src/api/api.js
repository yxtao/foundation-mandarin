import axios from 'axios';
import {auth} from '../firebase/firebase';
//const URL = "https://foundationchinese.herokuapp.com"
const URL = "http://localhost:5000"
export const createUserAccount = async (userData) =>{
   const res = await axios.post(`${URL}/auth/signup`, userData); 
   return res;  
}

export const loginUser = async (email, password) =>{
   const res = await auth().signInWithEmailAndPassword(email, password);
   return res;
}

export const resetEmail = (userData)=>{
   axios.post(`${URL}/auth/resetemail`, userData);
}




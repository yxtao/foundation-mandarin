import axios from 'axios';
import {auth} from '../firebase/firebase';
const URL = "https://foundationchinese.herokuapp.com"

export const createUserAccount = async (userData) =>{
   await axios.post(`${URL}/auth/signup`, userData); 
}

export const loginUser = async (email, password) =>{
   await auth().signInWithEmailAndPassword(email, password);
}

export const resetEmail = (userData)=>{
   axios.post(`${URL}/auth/resetemail`, userData);
}




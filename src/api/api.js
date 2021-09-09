import axios from 'axios';
import {auth} from '../firebase/firebase';

export const createUserAccount = async (userData) =>{
    try{
       const res = await axios.post('http://localhost:5000/auth/signup', userData);
       return {data:res.data};
    }catch(err){
       return {error: err.response.data.message};
    }
              
}

export const loginUser = async (email, password) =>{
   const res = await auth().signInWithEmailAndPassword(email, password);
   return res;
}

export const getArticles = async () =>{
    const token = await auth.currentUser.getIdToken();

    const {data} = axios.get("http://localhost:5000/articles", { 
        headers: { authorization: `Bearer ${token}`} })
    return data;
}


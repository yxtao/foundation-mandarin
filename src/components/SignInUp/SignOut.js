import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { checkedAuthState, usernameState, isAdminState, firebaseState } from "../../store/AuthAtoms" 

import './SignInUp.css';

const SignOut = ()=>{
  const history = useHistory();
  const firebase = useRecoilValue(firebaseState);
  const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);
  const [user, setUser] = useRecoilState(usernameState);
  useEffect(()=>{
    firebase.auth().signOut();
    setIsAuthenticated(false);
    setUser("");
  }, [])

    return (
     <div className="container wrapperDiv">
       You have signed out 
    </div>
    )
}
export default SignOut;
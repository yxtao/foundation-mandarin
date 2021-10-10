import React, {useEffect, useState} from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import './SignInUp.css';
const SignInUp = ()=>{
  const [isSignUp, setIsSignUp] = useState(false);
  const handleCallback = () =>{
    setIsSignUp(true);
  }
  const handleSignUpCallback = ()=>{
    setIsSignUp(false);
  }
    return (
     <div className="container wrapperDiv">
       {isSignUp? <SignUp parentCallback = {handleSignUpCallback}/> : <SignIn parentCallback = {handleCallback} /> }
    </div>
    )
}
export default SignInUp;
import React,{useState, useEffect} from 'react';
import { useRecoilValue , useRecoilState} from "recoil";
import { checkedAuthState, usernameState, isAdminState, firebaseState } from "../../store/AuthAtoms" ;

import "./Assessment.css"

const Assessment= (props)=>{
    const user = useRecoilValue(usernameState);
    return (
        <div className="container-wrapper">
            This is Assessment component for {user}
        </div>
    )
}

export default Assessment;
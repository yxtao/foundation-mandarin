import React,{useState, useEffect} from 'react';
import { useRecoilValue , useRecoilState} from "recoil";
import { checkedAuthState, usernameState, isAdminState, firebaseState } from "../../store/AuthAtoms" ;

import "./CardDetail.css"

const CardDetail = (props)=>{
    
    return (
        <div className="container-wrapper">
            This is CARD DETAIL component for 
        </div>
    )
}

export default CardDetail;
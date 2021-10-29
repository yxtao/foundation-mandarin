import React, { useState, useEffect} from 'react';
import { Link} from 'react-router-dom';
import { useRecoilValue , useRecoilState} from "recoil";
import { checkedAuthState, usernameState, isAdminState, firebaseState } from "../../store/AuthAtoms" 
import{
    AppBar,
    Toolbar,
    Button,
    Box,
    IconButton
}from '@material-ui/core';

import Mobile from "./Mobile";

import './NavBar.css';

const displayDesktop =(navItems, user)=>{
    return(
            <Toolbar  >
                <Box  display='flex' flexGrow={1} style={{color: "black"}}>
                    Logo
                </Box>
                <div className="userName">
                {user }
                </div>
                <div>
                    {navItems.map((item, index)=>
                        <Button component ={Link} to={item.link} style={{border:"",margin:"2px"}} key={index}>{item.label}</Button>
                    )}
                </div>    
            </Toolbar>     
    )
}

const NavBar = ()=>{
    const user = useRecoilValue(usernameState);
    const isAdmin = useRecoilValue(isAdminState);
    const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);
    const [mobileView, setMobileView] = useState(false)
    
    const [navItems, setNavItems] = useState([
        {label:"Teacher Sign in", link:"/SignInUp"},
        {label:"Home 主页", link:"/"},
        {label:"Word Wall 汉字墙", link:"/wordwall"}, 
        {label:"Reading 阅读", link:"/reading"}]);

    useEffect(() => {
        const setResponsiveness = () => {
            return window.innerWidth < 900
            ? setMobileView(true)
            : setMobileView(false);
        };
    
        setResponsiveness();
    
        window.addEventListener("resize", () => setResponsiveness());
     },[]);
             
    useEffect(()=>{
      if(isAuthticated){
          setNavItems( [
              {label:"Home 主页", link:"/"},
            //   {label:"Assessment 测试", link:"/assessment"},
            //   {label:"Notes 笔记", link:"/recommendation"},
              {label:"Word Wall 汉字墙", link:"/wordwall"}, 
              {label:"Reading 阅读", link:"/reading"},
              {label:"Sign out", link:"/signout"}]);
      } 
      if(isAuthticated&& isAdmin ){
        setNavItems((pre)=>[{label:"Teacher", link:"/teacher"},...pre]) 
      }
      if(!isAuthticated){
        setNavItems([
            {label:"Teacher Sign in", link:"/SignInUp"},
            {label:"Home 主页", link:"/"},
            {label:"Word Wall 汉字墙", link:"/wordwall"}, 
            {label:"Reading 阅读", link:"/reading"}]);  
      }
    }, [isAuthticated, isAdmin])
    
    return (
        <AppBar position={mobileView?"fixed":"sticky" }   style={{ background:mobileView? 'transparent':"#97f2f8",boxShadow: 'none', height:"auto", opacity:0.7}} >
            {mobileView? <Mobile /> : displayDesktop(navItems, user)}
        </AppBar>
    )
}

export default NavBar;
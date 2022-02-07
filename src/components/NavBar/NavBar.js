import React, { useState, useEffect} from 'react';
import { Link} from 'react-router-dom';
import { useRecoilValue , useRecoilState} from "recoil";
import { checkedAuthState, usernameState, isAdminState, firebaseState, isTeacherState } from "../../store/AuthAtoms" 
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
                    Mandarin Builder 中文分享
                </Box>
                <div className="userName">
                {user } &nbsp; &nbsp; &nbsp; &nbsp;
                </div>
                <div>
                    {navItems.map((item, index)=>
                        <Button component ={Link} to={item.link} style={{border:"1px solid green",margin:"2px"}} key={index}>{item.label}</Button>
                    )}
                </div>    
            </Toolbar>     
    )
}

const NavBar = ()=>{
    const user = useRecoilValue(usernameState);
    const isAdmin = useRecoilValue(isAdminState);
    const isTeacher = useRecoilValue(isTeacherState);
    const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);
    const [mobileView, setMobileView] = useState(false)
    
    const [navItems, setNavItems] = useState([
        {label:"Teacher Sign in", link:"/SignInUp"},
        {label:"Home 主页🏠", link:"/"},
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
              {label:"Home主页🏠", link:"/"},
            //   {label:"Assessment 测试", link:"/assessment"},
            //   {label:"Notes 笔记", link:"/recommendation"},
              {label:"Words汉字📝", link:"/wordwall"}, 
              {label:"Reading读📖", link:"/reading"},
              {label:"Sign out退出", link:"/signout"}]);
      } 
      if(isAuthticated&& (isAdmin || isTeacher || true) ){
        setNavItems((pre)=>[{label:"Teacher老师界面", link:"/teacherDashboard"},...pre]) 
      }
      if(!isAuthticated){
        setNavItems([
            {label:"Teacher Sign in 老师登录", link:"/SignInUp"},
            {label:"Home主页🏠", link:"/"},
            {label:"Words汉字📝", link:"/wordwall"}, 
            {label:"Reading读📖", link:"/reading"}]);  
      }
    }, [isAuthticated, isAdmin, isTeacher])
    
    return (
        <AppBar position={mobileView?"fixed":"sticky" }  
             style={{ 
             background:"white",
             boxShadow: 'none',
             height:"auto", 
             opacity:mobileView ? 1:0.7}} >
            {mobileView? <Mobile /> : displayDesktop(navItems, user)}
        </AppBar>
    )
}

export default NavBar;
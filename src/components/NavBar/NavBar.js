import React, { useState, useEffect} from 'react';
import { Link} from 'react-router-dom'
import { useRecoilValue , useRecoilState} from "recoil";
import { checkedAuthState, usernameState, isAdminState, firebaseState } from "../../store/AuthAtoms" 
import{
    AppBar,
    Toolbar,
    Button,
    Box,
    IconButton
}from '@material-ui/core';

import './NavBar.css';

const displayDesktop =(navItems, user)=>{
    return(
            <Toolbar>
                <Box  display='flex' flexGrow={1} style={{color: "black"}}>
                    Logo
                </Box>
                <div className="userName">
                {user }
                </div>
                <div>
                    {navItems.map((item, index)=>
                        <Button component ={Link} to={item.link} style={{border:"solid 1px black ",margin:"2px"}} key={index}>{item.label}</Button>
                    )}
                </div>    
            </Toolbar>     
    )
}

const NavBar = ()=>{
    const user = useRecoilValue(usernameState);
    const firebase = useRecoilValue(firebaseState);
    const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);

    const [navItems, setNavItems] = useState([
        {label:"Sign in", link:"/SignInUp"},
        {label:"Home 主页", link:"/"},
        {label:"Word Wall 汉字墙", link:"/wordwall"}, 
        {label:"Reading 阅读", link:"/reading"}]);
    
    useEffect(()=>{
      if(isAuthticated){
          setNavItems( [
              {label:"Home 主页", link:"/"},
              {label:"Assessment 测试", link:"/assessment"},
              {label:"Recommendation 推荐", link:"/recommendation"},
              {label:"Word Wall 汉字墙", link:"/wordwall"}, 
              {label:"Reading 阅读", link:"/reading"},
              {label:"Sign out", link:"/signout"}]);
      } 
      if(isAuthticated&& user==="natasha" ){
        setNavItems((pre)=>[...pre,{label:"Teacher", link:"/teacher"}]) 
      }
      if(!isAuthticated){
        setNavItems([
            {label:"Sign in", link:"/SignInUp"},
            {label:"Home 主页", link:"/"},
            {label:"Word Wall 汉字墙", link:"/wordwall"}, 
            {label:"Reading 阅读", link:"/reading"}]);  
      }
    }, [isAuthticated])
    
    return (
        <AppBar position="fixed"  style={{ background: '#CBF3F3', opacity:"0.9",boxShadow: 'none', height:"auto"}}  >
            {displayDesktop(navItems, user)}
        </AppBar>
    )
}

export default NavBar;
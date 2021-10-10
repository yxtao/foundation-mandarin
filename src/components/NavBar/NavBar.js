import React, { useState, useEffect} from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom'
import{
    AppBar,
    Toolbar,
    Button,
    Box,
    IconButton
}from '@material-ui/core';


import './NavBar.css';

const navItems = [ {label:"Sign in", link:"/SignInUp"},  {label:"Teacher", link:"/teacher"},{label:"Home 主页", link:"/"},{label:"Word Wall 汉字墙", link:"/wordwall"}, {label:"Reading 阅读", link:"/reading"}]

const displayDesktop =()=>{
    return(
            <Toolbar>
                <Box  display='flex' flexGrow={1} style={{color: "black"}}>
                    Logo
                </Box>
                <div>
                    {navItems.map((item, index)=>
                        <Button component ={Link} to={item.link} style={{border:"solid 1px black ",margin:"2px"}} key={index}>{item.label}</Button>
                    )}
                </div>    
            </Toolbar>     
    )
}

const NavBar = ()=>{
    return (
        <AppBar position="fixed"  style={{ background: '#CBF3F3', opacity:"0.9",boxShadow: 'none', height:"auto"}}  >
            {displayDesktop()}
        </AppBar>
    )
}

export default NavBar;
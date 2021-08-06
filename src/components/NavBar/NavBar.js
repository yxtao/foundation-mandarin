import React, { useState, useEffect} from 'react';
import './NavBar.css'
import{
    AppBar,
    Toolbar,
    Button,
    Box,
    IconButton
}from '@material-ui/core';

const navItems = ["Home 主页", "Word Wall 汉字墙", "Reading 阅读"]

const displayDesktop =()=>{
    return(
            <Toolbar>
                <Box  display='flex' flexGrow={1} style={{color: "black"}}>
                    Logo
                </Box>
                <div>
                    {navItems.map((label, index)=>
                        <Button style={{border:"solid 1px black ",margin:"2px"}} key={index}>{label}</Button>
                    )}
                </div>    
            </Toolbar>     
    )
}

const NavBar = ()=>{
    return (
        <AppBar position="static"  style={{ background: 'transparent', boxShadow: 'none', height:"auto"}}  >
            {displayDesktop()}
        </AppBar>
    )
}

export default NavBar;
import React, { useState, useEffect } from "react";
import { Link} from 'react-router-dom';
import { useRecoilValue , useRecoilState} from "recoil";
import { checkedAuthState, usernameState, isAdminState } from "../../store/AuthAtoms" 

import{ 
  Toolbar,
  Button,
  IconButton,
  Drawer,
  MenuItem,  
} from "@material-ui/core";


import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from '@material-ui/core/styles';

const Mobile = (props) => {
    const user = useRecoilValue(usernameState);
    const isAdmin = useRecoilValue(isAdminState);
    const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [navItems, setNavItems] = useState([
        {label:"Sign in", link:"/SignInUp"},
        {label:"Home 主页", link:"/"},
        {label:"Word Wall 汉字墙", link:"/wordwall"}, 
        {label:"Reading 阅读", link:"/reading"}]);

    const useStyles = makeStyles({
        paper: {
            paddingTop:"10vh",
            width:"50vw",
            background: "lightblue"
        },  
        });
        
    const styles = useStyles();

    const handleDrawerOpen = () => setDrawerOpen(true) ; 
    const handleDrawerClose = () => setDrawerOpen(false) ;
    const getDrawerChoices = () => {
        return navItems.map((item, index) => { 
          return ( 
           <div key= {`item${index}`}>  
              <MenuItem >
                <Button 
                className="DrawerButton"
                onClick = {() => setDrawerOpen(false)}
                component ={Link}
                to={item.link} 
                style={{color:"black"}} > 
                {item.label} 
                </Button>
              </MenuItem>
            </div>
          );
        });
      };   

  useEffect(()=>{
    if(isAuthticated){
        setNavItems( [
            {label:"Home 主页", link:"/"},
            {label:"Assessment 测试", link:"/assessment"},
            {label:"Notes 笔记", link:"/recommendation"},
            {label:"Word Wall 汉字墙", link:"/wordwall"}, 
            {label:"Reading 阅读", link:"/reading"},
            {label:"Sign out", link:"/signout"}]);
    } 
    if(isAuthticated&& isAdmin){
      setNavItems((pre)=>[{label:"Admin", link:"/teacher"},...pre]) 
    }
    if(!isAuthticated){
      setNavItems([
          {label:"Sign in", link:"/SignInUp"},
          {label:"Home 主页", link:"/"},
          {label:"Word Wall 汉字墙", link:"/wordwall"}, 
          {label:"Reading 阅读", link:"/reading"}]);  
    }
  }, [isAuthticated, isAdmin])

  return (
     
    <Toolbar>
        {user}
        <IconButton
            {...{
            edge: "start",
            "aria-label": "menu",
            "aria-haspopup": "true",
            onClick: handleDrawerOpen,
            }}
            style={{color:"black"}}
        >
            <MenuIcon />
        </IconButton>

        <Drawer
            classes={{  paper: styles.paper  }}
            {...{
            anchor: "left",
            open: drawerOpen,
            onClose: handleDrawerClose,
            }}
        >
        {getDrawerChoices()}
        </Drawer>
    </Toolbar>
    
  )
};

export default Mobile;
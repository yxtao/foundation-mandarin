import React, { useState, useEffect } from "react";
import { Link} from 'react-router-dom';
import { useRecoilValue , useRecoilState} from "recoil";
import { checkedAuthState, usernameState, isTeacherState } from "../../store/AuthAtoms" 

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
    const isTeacher = useRecoilValue(isTeacherState);
    const [isAuthticated, setIsAuthenticated] = useRecoilState(checkedAuthState);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [navItems, setNavItems] = useState([
        {label:"Teacher Sign in", link:"/SignInUp"},
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
            // {label:"Assessment 测试", link:"/assessment"},
            // {label:"Notes 笔记", link:"/recommendation"},
            {label:"Word Wall 汉字墙", link:"/wordwall"}, 
            {label:"Reading 阅读", link:"/reading"},
            {label:"Sign out", link:"/signout"}]);
    } 
    if(isAuthticated&& isTeacher){
      setNavItems((pre)=>[{label:"Teacher", link:"/teacherDashboard"},...pre]) 
    }
    if(!isAuthticated){
      setNavItems([
          {label:"Teacher Sign in", link:"/SignInUp"},
          {label:"Home 主页", link:"/"},
          {label:"Word Wall 汉字墙", link:"/wordwall"}, 
          {label:"Reading 阅读", link:"/reading"}]);  
    }
  }, [isAuthticated, isTeacher])

  return (    
    <Toolbar style={{ background: 'transparent',boxShadow: 'none'}} >
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
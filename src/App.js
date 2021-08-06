import React from "react";
import {
    BrowserRouter,
    Switch,
    Route,
    Link
  } from "react-router-dom";


import NavBar from "./components/NavBar/NavBar";
import WordWall from "./components/WordWall/WordWall"
import Home from "./components/Home/home"
import './app.css';

const App = ()=>{
    return(
        <BrowserRouter>
            <NavBar />
            <Switch>
                <Route path="/" exact component ={Home} />
                <Route path="/about"  component={ WordWall } />
            </Switch>
        </BrowserRouter>
    )          
}

export default App;
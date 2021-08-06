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
import Reading from "./components/Reading/Reading"
import './app.css';

const App = ()=>{
    return(
        <BrowserRouter>
            <NavBar />
            <Switch>
                <Route path="/" exact component ={ Home } />
                <Route path="/wordwall"  component={ WordWall } />
                <Route path="/reading" component={ Reading } />
            </Switch>
        </BrowserRouter>
    )          
}

export default App;
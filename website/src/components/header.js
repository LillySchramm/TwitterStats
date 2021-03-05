import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

class Header extends React.Component {
    constructor(probs){
      super(probs);     
    }   

    render(){              
        return (
            <div>
                <h1>Twitterstats</h1> 
                <hr /> 
                <h2> <Link to="/">START</Link> | <Link to="/howitworks">HOW IT WORKS</Link>  | <a href="https://github.com/EliasSchramm/TwitterStats" target="_blank">GITHUB</a> |  <Link to="/about">ABOUT</Link> </h2>
                <hr/>
            </div>
        );      
    }
  
  }

  export default Header
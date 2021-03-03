import React from 'react';
import ReactDOM from 'react-dom';

class Header extends React.Component {
    constructor(probs){
      super(probs);     
    }   

    render(){              
        return (
            <div>
                <h1>Twitterstats</h1> 
                <hr /> 
                <h2> <a href="/">START</a> | <a href="/howitworks">HOW IT WORKS</a>  | <a href="https://github.com/EliasSchramm/TwitterStats" target="_blank">GITHUB</a> |  <a href="/about">ABOUT</a> </h2>
                <hr/>
            </div>
        );      
    }
  
  }

  export default Header
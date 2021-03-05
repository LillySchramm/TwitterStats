import React from 'react';
import ReactDOM from 'react-dom';

import {BrowserRouter as Router, Route} from 'react-router-dom';
import './css/bootstrap.min.css';
import './css/App.css'; 
import Header from './components/header';
import Searchbar from './components/searchbar';
import TopList from './components/toplist';
import Stats from './components/stats';
import Graph from './components/graph';

class Site_GRAPH extends React.Component{
  constructor(probs){
    super(probs)
  }

  render(){

    let d = window.location.href;
    d = d.split("/");

    let type = d[d.length - 2]
    let search = d[d.length - 1];

    let prefix = type == "tag" ? "@" : "#"

    return(
      <span>
        <br />
        <br />
        <br />
        <h2>The recorded history of '{prefix + search}'.</h2>
        <Graph />

      </span>
      
    );
  }

}

class Site_INDEX extends React.Component{
  constructor(probs){
    super(probs)
  }

  render(){
    return(
      <span>
        <p class="def">Welcome to my little corona project. Here you can search my database for Twitter tags and hashtags. Just use the searchbar above or click on one of the names in the Top 30 lists below.</p>
        <div class="flex-container">
            <TopList type="tag" n={30}/>
            <TopList type="hashtag" n={30}/>
        </div>
      </span>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Header/>
      <Searchbar/>
      <Router>
          <Route path='/' exact component={Site_INDEX} />   
          <Route path='/history/:type/:search' exact component={Site_GRAPH} />         
      </Router> 
      <br />
      <Stats/>
    </div>
  );
}

export default App;

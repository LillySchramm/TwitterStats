import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route } from 'react-router-dom';
import './css/bootstrap.min.css';
import './css/App.css'; 
import Header from './components/header';
import Searchbar from './components/searchbar';
import TopList from './components/toplist';
import Stats from './components/stats';
import Graph from './components/graph';

class Site_HowItWorks extends React.Component{
  constructor(probs){
    super(probs)
  }

  render(){
    return(
      <span>
        <br />
        <br />
        <br />
        <div class="about">  
          <h2>How it works</h2>
          <p>
              The twitter-api has an feature called "Sampled Stream". That means that you get a small live portion of, if you can trust the <a href="https://developer.twitter.com/en/docs/twitter-api/tweets/sampled-stream/api-reference/get-tweets-sample-stream"><u>documentation</u></a>,
              ca. 1% of all tweets pushed to twitter. <br />
              This is the reason why you can multiply all numbers on this page by 100 to get somewhat near to the real usages. A script, that runs on a Raspberry Pi 4, processes all information it gets and looks for hashtags and tags.
              These informations get passed to a database. On average 90k datasets are getting generated this way per hour.
          </p>
        </div>
      </span>
    );
  }
}

class Site_About extends React.Component{
  constructor(probs){
    super(probs)
  }

  render(){
    return(
      <span>
        <br />
        <br />
        <br />
        <div class="about">
          <h2><b>About</b></h2>
          <p>
              <b>Disclaimer:</b> Everything on this website is a pure statistical evaluation of an limited amount of data. 
              I explicitly distance myself from any tags/hashtags found or/and shown. I also strongly advise to not assume that any numbers/statistics shown on this website are resembling the past or current situation/s on Twitter in an accurate manner.         
          </p>
          <h2>Contact</h2>

          <p> Elias Paul Schramm <br/>
              privat@eps-dev.de <br/>
              adress and tel. on request 
          </p>
        </div>
      </span>
    );
  }
}

class Site_GRAPH extends React.Component{
  constructor(probs){
    super(probs)
  }

  render(){

    let d = window.location.href;
    d = d.split("/");

    let type = d[d.length - 2]
    let search = d[d.length - 1];
    search = decodeURI(search)

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
          <Route path='/' exact component={Site_INDEX} />   
          <Route path='/howitworks' exact component={Site_HowItWorks} />  
          <Route path='/about' exact component={Site_About} />  
          <Route path='/history/:type/:search' exact component={Site_GRAPH} />         
      <br />
      <Stats/>
    </div>
  );
}

export default App;

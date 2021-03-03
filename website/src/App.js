import {BrowserRouter as Router, Route} from 'react-router-dom';
import './css/bootstrap.min.css';
import './css/App.css'; 
import Header from './components/header';
import Searchbar from './components/searchbar';
import TopList from './components/toplist';
import Stats from './components/stats';

function App() {
  return (
    <div className="App">
      <Header/>
      <Searchbar/>
      <p class="def">Welcome to my little corona project. Here you can search my database for Twitter tags and hashtags. Just use the searchbar above or click on one of the names in the Top 30 lists below.</p>
      <div class="flex-container">
          <TopList type="tag" n={30}/>
          <TopList type="hashtag" n={30}/>
      </div>
      <br />
      <Stats/>
    </div>
  );
}

export default App;

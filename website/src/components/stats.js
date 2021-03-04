import React from 'react';
import ReactDOM from 'react-dom';

import { getStats } from '../api/api';

class Stats extends React.Component {
    constructor(probs){
      super(probs);     

      this.state = {
        count_tweets: 0,
        count_retweets: 0,
        count_tags: 0,
        count_hashtags: 0
      };

      this.getStats();
    }   

    componentDidMount(){
        this.ticker = setInterval(() => {this.getStats()}, 4000);        
    }    

    async getStats(){
        await getStats().then(ret => {
            this.setState({
                count_tweets:   ret.count_tweets,
                count_retweets: ret.count_retweets,
                count_tags:     ret.count_tags,
                count_hashtags: ret.count_hashtags                
            });
        })

        this.forceUpdate();
    }

    render(){              
        return (
            <div>
                <hr />            
                <p class="defc">        
                    In the time this script is running it processed {this.state.count_tweets} Tweets.<br /> 
                    {this.state.count_retweets} of the Tweets where Retweets.<br />
                    It found {this.state.count_tags} Tags and {this.state.count_hashtags} Hashtags.      
                </p>

            </div>
        );      
    }
  
  }

  export default Stats
import React from 'react';
import ReactDOM from 'react-dom';

class Searchbar extends React.Component {
    constructor(probs){
      super(probs);     
    }   

    render(){              
        return (
            <div class="form">
                <form action="details.php" method="post" class="p-3">
                    <div class="input-group">
                        <input type="text" name="search" id="search" class="form-control form-control-lg rounded-0 eps" placeholder="Search for an tag or hashtag..." autocomplete="off" required />
                        <div class="input-group-append">
                            <input type="submit" name="submit" value="Search" class="btn btn-lg rounded-0 eps" />
                        </div>
                    </div>
                </form>
            </div>
        );      
    }
  
  }

  export default Searchbar
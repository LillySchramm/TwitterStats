import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import '../api/api';
import { getToplist } from '../api/api';

const TABLE_NAMES = {
    "tag":"Tags",
    "hashtag":"Hashtags"
}

const ROW_NAMES = {
    "tag":"TAG",
    "hashtag":"HASHTAG"
}

class TopListRow extends React.Component {
    constructor(probs){
        super(probs);  
    }   

    render(){
        
        let prefix = this.props.name.startsWith("@") ? "tag" : "hashtag"
        let link = "/history/" + prefix + "/" + this.props.name.substring(1)

        return(
            <tr>
                <td>
                    {this.props.id}
                </td>
                <td>
                    <Link to={link}>{this.props.name}</Link> 
                </td>
                <td>
                    {this.props.count}
                </td>
            </tr>
        );
    }
}

class TopList extends React.Component {
    constructor(probs){
        super(probs);    
        this.state = {
            content:<span></span>
        }
        this.genToplist();
    }   
    
    async genToplist(){
        getToplist(this.props.type, this.props.n).then((ret) => {
            let table = []
            let i = 1;

            ret.forEach(element => {
                table.push(<TopListRow id={i} name={element.NAME} count={element.COUNT}/>)
                i++;
            });

            this.setState({
                content:table
            })
        })

        this.forceUpdate()
        
    }

    render(){
        return (
            <div class="flex-items">
                <br />
                <h2>Current Top {this.props.n} {TABLE_NAMES[this.props.type]}</h2>
                <br />
                <table>
                <tr class="head">
                <th>#</th>        
                <th>{ROW_NAMES[this.props.type]}</th>
                <th>COUNT</th>
                </tr>        
                {this.state.content}                
            </table> 
           </div>         
        );      
    }  
  }

  export default TopList
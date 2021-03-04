import React from 'react';
import ReactDOM from 'react-dom';

import Chart from "react-google-charts"

import { getHistory } from '../api/api';

class Graph extends React.Component {
    constructor(probs){
      super(probs);     

      this.state = {
        gra:<span></span>
      };

      this.getData();
    }  

    async getData(){
        let d = window.location.href;
        d = d.split("/");

        let type = d[d.length - 2]
        let search = d[d.length - 1];
        let data = []
        await getHistory(type, search).then(ret => {            
            for (const [key, value] of Object.entries(ret.timestamps)) {
                data.push([key, value])
            }
        }) 
        
        data.push(["Date", "Count"])
        data = data.reverse()

        let g = 
        <Chart
            width={'600px'}
            height={'400px'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={data}
            options={{
            hAxis: {
                title: 'Time',
            },
            vAxis: {
                title: 'Popularity',
            },
            }}
            rootProps={{ 'data-testid': '1' }}
        />
        
        this.setState({
            gra: g
        })

        this.forceUpdate();
    }

    render(){              
        return (
            this.state.gra
        );      
    }
  
  }

  export default Graph
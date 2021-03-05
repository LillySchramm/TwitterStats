import React from 'react';
import ReactDOM from 'react-dom';

import Chart from "react-google-charts"

import { getHistory } from '../api/api';

class Graph extends React.Component {
    constructor(probs){
      super(probs);     

      this.state = {
        gra:<span></span>,
        last_url:window.location.href
      };

      this.getData();
    }  

    formatDate(date){
        date = date.split(':')
        return date[1] + "." + date[2] + " " + date[4] + "h"
    }

    componentDidMount(){
        this.ticker = setInterval(() => {
            if(this.state.last_url != window.location.href){
                this.setState({
                    gra:<span></span>,
                    last_url:window.location.href
                })
                this.getData(); 
            }
        }, 100);        
    }    

    async getData(){
        let d = window.location.href;
        d = d.split("/");

        let type = d[d.length - 2]
        let search = d[d.length - 1];
        let data = []
        let all_time_avg = 0;
        
        await getHistory(type, search).then(ret => {            
            for (const [key, value] of Object.entries(ret.timestamps)) {
                data.push([key, value])
                all_time_avg += value;
            }
        }) 

        all_time_avg /= data.length; 
        
        //Gen 24H avg

        data = data.reverse()
        let _data = [["Date", "Count", "24h avg"]];
        let avg_arr = []
        let avg = 0

        data.forEach(e => {
            let v = e[1];
            avg_arr.push(v)
            avg += v;
            if(avg_arr.length > 24){
                avg -= avg_arr.shift();
            }
            let temp = Math.ceil(avg / 24);
            _data.push([this.formatDate(e[0]),e[1],temp])
        });     

        let g = 
        <Chart
            chartType="LineChart"
            className={"graph"}
            data={_data}
            options={
                {  
                    //curveType: 'function',                   
                    legend: { position: 'bottom' },
                    series: {
                    0: { color: '#fff' },
                    1: { color: '#51ff00', lineWidth: 4 },
                    },
                    backgroundColor: {
                        fill: '#000',
                    } ,          
                    hAxis: {
                        textStyle:{color: '#FFF'},
                        baselineColor: '#fff'
                    },
                    vAxis: {
                        textStyle:{color: '#FFF'},
                        baselineColor: '#fff',
                        gridlines: {
                            color: '#fff',
                            minSpacing: 100
                        },
                        viewWindow: {
                            min: 0
                        }
                    },
                    legend: {            
                        textStyle:{color: '#FFF'},
                        position: 'bottom'
                    }
                }
            }            
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
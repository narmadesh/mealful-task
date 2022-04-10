import React, {useState, useEffect} from 'react';
import { UseD3 } from './UseD3';
import * as d3 from 'd3';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryPie, VictoryBar, VictoryAxis, VictoryTooltip } from 'victory';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
// import './App.css';


function App() {

  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [array,setArray] = useState([]);
  const [timeArray,setTimeArray] = useState([]);
  const [show,setShow] = useState(false);
  useEffect(() => {
    axios.get('./P2VO.json').then((res) =>{
      setData(res.data)
      // console.log(res.data)
      const schedule = {};
      res.data.map((d) => {
        if (d.item_date == startDate.toISOString().slice(0, 10)) {
          const dt = new Date(d.schedule_time);
          let set_date = dt.getFullYear()+'-'+dt.getMonth()+'-'+dt.getDate();
          schedule[set_date] = (schedule[set_date] || 0) + 1
        }
      })
      console.log(schedule)
      const relevance_values = Object.values(schedule)
      const relevance_keys = Object.keys(schedule)
      const relevanceArray = []
      for (var i = 0; i <= relevance_keys.length - 1; i++) {
        relevanceArray.push({ 'x': relevance_keys[i], 'y': relevance_values[i], 'label': `${relevance_keys[i]} : ${relevance_values[i]}` })
      }
      setArray(relevanceArray);
      }).catch(err => console.log(err))
  }, [startDate]);

  function expand(further){
    const schedule = {};
    data.map((d) => {
      const dt = new Date(d.schedule_time);
      let set_date = dt.getFullYear() + '-' + dt.getMonth() + '-' + dt.getDate();
      if (set_date == further[0] ) {
        const tm = new Date(d.schedule_time);
        let set_date = tm.getHours() + ':' + tm.getMinutes() + ':' + tm.getSeconds();
        schedule[set_date] = (schedule[set_date] || 0) + 1
      }
    })
    console.log(schedule,further[0])
    const relevance_values = Object.values(schedule)
    const relevance_keys = Object.keys(schedule)
    const relevanceArray = []
    for (var i = 0; i <= relevance_keys.length - 1; i++) {
      var expand = relevance_keys[i].split(':');
      var exp = parseInt(expand[0])
      if (exp >= 0 && exp < 3) {
        relevanceArray.push({ 'x': relevance_keys[i], 'y': relevance_values[i], 'label': `12am to 3am : ${relevance_values[i]} scheduled` })
      }
      else if (exp >= 3 && exp < 6){
        relevanceArray.push({ 'x': relevance_keys[i], 'y': relevance_values[i], 'label': `3am to 6am : ${relevance_values[i]} scheduled` })
      }
      else if (exp >= 6 && exp < 9) {
        relevanceArray.push({ 'x': relevance_keys[i], 'y': relevance_values[i], 'label': `6am to 9am : ${relevance_values[i]} scheduled` })
      }
      else if (exp >= 9 && exp < 12) {
        relevanceArray.push({ 'x': relevance_keys[i], 'y': relevance_values[i], 'label': `9am to 12pm : ${relevance_values[i]} scheduled` })
      }
      else if (exp >= 12 && exp < 15) {
        relevanceArray.push({ 'x': relevance_keys[i], 'y': relevance_values[i], 'label': `12pm to 3pm : ${relevance_values[i]} scheduled` })
      }
      else if (exp >= 15 && exp < 18) {
        relevanceArray.push({ 'x': relevance_keys[i], 'y': relevance_values[i], 'label': `3pm to 6pm : ${relevance_values[i]} scheduled` })
      }
      else if (exp >= 18 && exp < 21) {
        relevanceArray.push({ 'x': relevance_keys[i], 'y': relevance_values[i], 'label': `6pm to 9pm : ${relevance_values[i]} scheduled` })
      }
      else if (exp >= 21 && exp < 24) {
        relevanceArray.push({ 'x': relevance_keys[i], 'y': relevance_values[i], 'label': `9pm to 12pm : ${relevance_values[i]} scheduled` })
      }
      else{
        relevanceArray.push({ 'x': relevance_keys[i], 'y': relevance_values[i], 'label': `${exp} to ${exp+3} : ${relevance_values[i]} scheduled` })
      }
    }
    setTimeArray(relevanceArray);
    setShow(true)
  }
  
  return (
    <React.Fragment>
      
      <div className='container'>
        <label>Select date</label>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
        <div className='row'>
          <div className='col-sm-6'>
            <div className='card'>
              <div className='card-body shadow'>
                <VictoryPie
                  labelComponent={<VictoryTooltip />}
                  width={500} height={500}
                  colorScale="qualitative"
                  style={{ labels: { fill: "#000", fontSize: 15 } }}
                  data={array}
                  innerRadius={10}
                  events={[{
                    target: "data",
                    eventHandlers: {
                      onClick: () => {
                        return [
                          {
                            target: "data",
                            mutation: ({ style }) => {
                              
                              return style.fill === "#c43a31" ? null : { style: { fill: "#c43a31" } };
                            }
                          }, {
                            target: "labels",
                            mutation: ({ text }) => {
                              var further = text.split(' : ')
                              expand(further)
                              return text === "clicked" ? null : { text: "clicked" };
                            }
                          }
                        ];
                      }
                    }
                  }]}
                />
              </div>
            </div>
          </div>
          <div className='col-sm-6'>
            <div className={`card ${show?'':'d-none'}`}>
              <div className='card-body shadow'>
                <VictoryPie
                  labelComponent={<VictoryTooltip />}
                  width={500} height={500}
                  colorScale="qualitative"
                  style={{ labels: { fill: "#000", fontSize: 15 } }}
                  data={timeArray}
                  innerRadius={10}
                  events={[{
                    target: "data",
                    eventHandlers: {
                      onClick: () => {
                        return [
                          {
                            target: "data",
                            mutation: ({ style }) => {
                              
                              return style.fill === "#c43a31" ? null : { style: { fill: "#c43a31" } };
                            }
                          }, {
                            target: "labels",
                            mutation: ({ text }) => {
                              var further = text.split(' : ')
                              expand(further)
                              return text === "clicked" ? null : { text: "clicked" };
                            }
                          }
                        ];
                      }
                    }
                  }]}
                />
              </div>
            </div>
          </div>
        </div>
        
      </div>      
      <div>
        
      </div>
    </React.Fragment>
  );
}

export default App;
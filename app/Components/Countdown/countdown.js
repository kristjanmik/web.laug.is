import React from 'react';
import moment from 'moment';

function getTimeRemaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}



export default class Countdown extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    let self = this;
    this.interval = setInterval(function() {
      self.forceUpdate();
    }, 1000);
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }


  render() {
      let timeRem = moment(this.props.time,'HH:mm');
      let timeRemObject = getTimeRemaining(new Date(timeRem._d));
      return(
        <span><i>{timeRemObject.hours} klst, {timeRemObject.minutes} min, {timeRemObject.seconds} sek</i></span>
      );
  }
}
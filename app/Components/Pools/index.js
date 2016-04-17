//http://www.color-hex.com/color-palette/700

import React from 'react';
import styles from './Pools.css';
import moment from 'moment';

export default class Pools extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pools: []
    }
  }
  componentWillMount() {

    //Use relay in the future
    let url = 'http://graphql.laug.is/?query=%7Bpools%20%7B%0A%20%20id%2C%0A%20%20name%2C%0A%20%20today%20%7B%0A%20%20%20%20opens%0A%20%20%20%20closes%0A%20%20%7D%0A%7D%7D';

    fetch(url).then( r => r.json() ).then( (json) => {
      return json.data.pools;
    }).then( (pools) => {
      let now = moment().unix();

      pools = pools.map( (pool) => {
        //Add .isOpen property
        pool.isOpen = false;

        if(!pool.today){
          console.log('Pool without today',pool);
          return pool
        };

        let opens = moment(pool.today.opens,'HH:mm').unix();
        let closes = moment(pool.today.closes,'HH:mm').unix();

        pool.isOpen = opens < now && closes > now;

        if(pool.isOpen && (closes - now) <= 1800){
          pool.closesIn = closes - now;
          console.log('what is closes - now',closes - now);
        }else if(!pool.isOpen && Math.abs(now - opens) <= 3600){
          pool.opensIn = Math.abs(now - opens);
          console.log('what is now - opens',Math.abs(now - opens));
        }
        console.log(pool)
        return pool;
      });

      this.setState({
        pools
      })
    }).catch( (error) => {
      console.error('Error fetching data',error);
    })
  }
  render() {

    let list = this.state.pools.map( (pool) => {

      let openIndicator = (<div />);


      if(pool.isOpen){
        if(pool.closesIn >= 60){
          openIndicator = (
            <div className={styles.poolStatusWillClose}>Lokar eftir &nbsp; {Math.floor(pool.closesIn / 60)} &nbsp; mínútur</div>
          );
        }else{
          openIndicator = (
            <div className={styles.poolStatusOpen}>Opið</div>
          );
        }
      }else{
        if(pool.opensIn >= 60){
          openIndicator = (
            <div className={styles.poolStatusWillOpen}>Opnar eftir &nbsp; {Math.floor(pool.opensIn / 60)} &nbsp; mínútur</div>
          );
        }else{
          openIndicator = (
            <div className={styles.poolStatusClosed}>Lokað</div>
          );
        }
      }

      return (
        <div key={pool.id} className={styles.poolContainer}>
          <div className={styles.pool} >
            <img src={require(`../../img/${pool.id.toLowerCase()}.png`)} className={styles.poolImage}/>
            {/*<img src={require('../../img/arb.png')} className={styles.poolImage}/>*/}
            <div className={styles.poolName}>{pool.name}</div>
            <div className={styles.poolStatusContainer}>
              {openIndicator}
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className={styles.container}>
        {list}
      </div>
    );
  }
}

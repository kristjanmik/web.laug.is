import React from 'react';
import styles from './App.css';
import Pools from './Components/Pools';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={styles.container}>
        <Pools />
      </div>
    );
  }
}

import React from 'react'
import { local } from 'redux-react-local'
import { Link } from 'react-router'

import haversine from 'haversine'
import Countdown from '../components/Countdown'
import Pool from '../components/Pool'

import { poolsByDistance } from '../lib/DataUtils'

@local({
  ident: btoa('Frontpage'),
  initial: {
    pools: [],
    isFetching: false
  }
})
export default class Frontpage extends React.Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    this.fetchData()
  }
  fetchData(){
    const { isFetching } = this.props.state

    //If we are already fetching data, do nothing
    if(isFetching) return

    //@TODO Use relay in the future
    let url = 'https://graphql.laug.is/?query=%7Bpools%20%7B%0A%20%20id%2C%0A%20%20name%2C%0A%20%20latitude%2C%0A%20%20longitude%2C%0A%20%20today%20%7B%0A%20%20%20%20opens%0A%20%20%20%20closes%0A%20%20%7D%0A%7D%7D'

    fetch(url).then( r => r.json() ).then( (json) => {
      return json.data.pools
    }).then( (pools) => {
      const { state, setState } = this.props

      pools = this.coords ? poolsByDistance(pools,this.state.coords) : pools

      setState({
        ...state,
        pools
      })


    }).catch( (error) => {
      console.error('Error fetching data',error)
    })
  }
  render() {
    const { pools } = this.props.state

    let list = pools.map( (pool,index) => {
      return (
        <Pool
          key={index}
          data={pool}/>
      )
    })

    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          maxWidth: '960px'
        }}>
        {list}
      </div>
    )
  }
}

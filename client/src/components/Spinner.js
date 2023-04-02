import React from 'react'
import loading from './Ajax-loader.gif'
const Spinner = () => {
  return (
    <div className='my-5 text-center'>
    <img src={loading} alt="loading"></img>
    </div>
  )
}

export default Spinner

// import React from 'react'
import Quotes from '../components/Quotes'
import Login from '../components/Login'

const Signup = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2'>
      <div>
        <Login type="signup"></Login>
      </div>
      <div className='invisible lg:visible'>
        <Quotes></Quotes>
        
      </div>
    </div>
  )
}

export default Signup

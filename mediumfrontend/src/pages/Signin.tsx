// import React from 'react'
import Login from '../components/Login'
import Quotes from '../components/Quotes'
const Signin = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2'>
      <div>
        <Login type="signin"></Login>
      </div>
      <div className='invisible lg:visible'>
        <Quotes></Quotes>
        
      </div>
    </div>
  )
}

export default Signin

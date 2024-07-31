import React from 'react'
import Gif from '../images/5a6266beafc4be0001e0e5c8_giphy.gif'
import { useNavigate } from 'react-router-dom'
const Error404 = () => {
    const navigate = useNavigate()
    function handleback(){
        // window.history.back()
        navigate('/blogs')

    }
  return (
    <div style={{
        backgroundImage:`url(${Gif})`,
        backgroundSize:"cover",
        width: "100vw",
    height: "100vh",
    maxHeight: "100%",
    maxWidth: "100%",
    
    backgroundPosition: "50%",
    
    justifyContent: "start",
    alignItems: "start",
    display: "start",
        }} className='w-full h-full'>
      <button onClick={handleback} className='p-5 bg-yellow-400 font-semibold rounded-lg '>Take TO HOME 😭😭😭</button>
    </div>
  )
}

export default Error404

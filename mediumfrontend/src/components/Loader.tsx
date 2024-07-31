import React from 'react'
import { FallingLines } from 'react-loader-spinner'
const Loader = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <FallingLines
          color="#000"
          width="100"
          visible={true}  
      />
    </div>  
  )
}

export default Loader

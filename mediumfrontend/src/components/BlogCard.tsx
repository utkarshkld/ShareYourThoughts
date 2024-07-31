// import React from 'react'
import {  useNavigate } from 'react-router-dom'
import moment from 'moment'
interface BlogCardProps {
    id:any,
  authorName: string,
  img:any,
  plainText:string,
  title:string,
  content:string,
  publishedDate:string
}
const BlogCard = ({
    id,
    plainText,
  authorName,
  img,
  title,
  content,
  publishedDate,
  
}:BlogCardProps) => {
    const navigate = useNavigate()
    function handleClick(){
        console.log(id)
        navigate('/blog/'+id)
    }
  return (
    
    <div onClick={handleClick} className='w-full sm:w-6/12  flex flex-col gap-2 p-4 pt-2 border-b-2 border-slate-200 cursor-pointer'>
      <div className='flex gap-2 justify-start items-center '>
        
      <div className="relative inline-flex items-center border-2 border-black justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600"
        style={
          img ? {
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}}
        >
        {!img && <span className="font-medium text-gray-600 dark:text-gray-300">
          {authorName.slice(0, 1)}
        </span> }
        
      </div>

        <div>{authorName} <span className='font-thin text-slate-400'> &#9679; {moment(publishedDate).fromNow()}</span></div>
        
        
      </div>
      <div className='text-2xl font-semibold'>
        {title}
      </div>
      <div >
        {plainText?.length <= 100 ? plainText : plainText?.substring(0, 100)+"..."}
      </div>
      <div className='flex flex-start items-center mt-2'>
        <div className='p-2 text-xs bg-slate-200 rounded-full  text-slate-600'>{Math.floor(content.split(' ').length/100) + 1} min(s) read</div>
      </div>      
    </div>
    
  )
}

export default BlogCard

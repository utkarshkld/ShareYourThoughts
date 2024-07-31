import {useState,useRef, useEffect} from 'react'
import moment from 'moment'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import './custom.css'

interface propsdetails {
    id:any,
  authorName: string,
  title:string,
  content:string,
  publishedDate:string,

  
}
// convert image to blob
const FullBlog = ({id,authorName,content,title,publishedDate}:propsdetails) => {
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const quilref = useRef<any>()
  const quilref2 = useRef<any>()
  useEffect(()=>{
    setValue2(content)
  },[]);
  return (
    <div className='w-full p-2 md:p-10 flex flex-col gap-2  pt-2 border-b-2 border-slate-200'>
      <div className='mt-10 text-5xl font-serif font-bold '>{title}</div>
      <div className='font-thin text-slate-400 text-lg'>Posted {moment(publishedDate).fromNow()}</div> 
      
      <ReactQuill
          ref={quilref2}
          id="text-editor2"
          modules={{
            syntax:true,            
          }}          
          className=" md:border md:text-xl sm:text-md hover:shadow-lg hide-toolbar"
          theme="snow"
          value={value2}
          readOnly={true}                              
        />
        
     
    </div>
  )
}

export default FullBlog

import  {  useState} from 'react'
// import { getBlogsById } from '../hooks'

import { getLikedBlogs } from '../hooks';
// import { DeleteOutline } from '@mui/icons-material'
import { Link } from 'react-router-dom';
import { Card } from "antd";

import './custom.css'
// import axios from 'axios'
const LikedBlog = ({setpage}:{setpage:any}) => {
  setpage(3)
  const [currPostid,setcurrpostid] = useState<any>()
  const {loading,blogs,setBlogs} = getLikedBlogs()
  if(loading){
    console.log("loading")
    return (
      <div className='w-full h-full flex items-center p-5 justify-center overflow-hidden'>
        <div className='flex flex-col gap-3 h-full w-full md:w-8/12overflow-auto hide-scrollbar'>
        <Card loading={true}></Card>
        <Card loading={true}></Card>
        <Card loading={true}></Card>
        <Card loading={true}></Card>        
        </div>
      </div>  
    )    
  }
  
  console.log(blogs)
  return (    
      <div className='w-full h-full flex items-center p-5 justify-center overflow-hidden'>
        <div className='flex flex-col  gap-3 h-full w-full md:w-8/12 overflow-auto hide-scrollbar'>        
        {blogs?.map((blog:any) =>{
          return <div className='grid rounded-lg  bg-white grid-cols-12 w-full'><Link className='col-span-10' to={`/blog/`+blog.id}><Card   className="custom-card w-full h-full text-lg"  hoverable={true} bordered={true} title={blog.title}  ><div className='flex justify-between items-center'>
            {blog.plainText == null ? "Nothing to Show here" : (blog.plainText.length <=50 ? blog.plainText:blog.plainText.slice(0,50) + " ...")}
            {/* <img className="max-h-32 max-w-32 rounded-lg border" src={blog.thumbnail}/> */}
          </div>
          </Card></Link>
          <div className='col-span-2 text-slate-500 flex items-center justify-center'>{blog.thumbnail ? <img className=" w-full rounded-lg" src={blog.thumbnail} /> : "N/A"}
          </div>
          </div>          
        })}
        {(!blogs || blogs?.length == 0) &&  <div className='w-full h-full text-lg font-semibold flex items-center justify-center'>
          No Liked Post Found 💔 
        </div>}
        </div>
        
      </div>    
  )
}

export default LikedBlog

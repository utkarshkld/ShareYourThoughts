import React, { useEffect , useState} from 'react'
import { getBlogsById } from '../hooks'
import { OpenInBrowser,Edit } from '@mui/icons-material';

import { DeleteOutline ,Create} from '@mui/icons-material'
import { Card,Modal } from "antd";

import './custom.css'
import axios from 'axios'
import { Link } from 'react-router-dom';
const MyBlogs = ({setpage}:{setpage:any}) => {
  setpage(2)
  const [deletebtn,setdeletebtn] = useState(false)
  const [currPostid,setcurrpostid] = useState<any>()
  const {loading,blogs,setBlogs} = getBlogsById({id:localStorage.getItem('selfId')})
  if(loading){
    console.log("loading")
    return (
      <div className='w-full h-full flex items-center p-5 justify-center overflow-hidden'>
        <div className='flex flex-col gap-3 h-full w-full md:w-8/12 overflow-auto hide-scrollbar'>
        <Card loading={true}></Card>
        <Card loading={true}></Card>
        <Card loading={true}></Card>
        <Card loading={true}></Card>        
        </div>
      </div>  
    )    
  }
  async function deleteBlog(id:any){
    const response = await axios({
      method: 'put',
      url: "https://mediumbackend.utkarshkld.workers.dev/api/v1/blog/delete/"+id,
      headers: {
        Authorization: "Bearer " + localStorage.getItem('token')
      }
    })
    console.log(response)
    setBlogs((blogs:any) => blogs.filter((blog:any) => blog.id !== id));

  }
  async function handleDeleteClick(id:any){
    setcurrpostid(id)
    setdeletebtn(true)
  }
  async function onOkbtn(){
    console.log(currPostid)
    setdeletebtn(false)
    await deleteBlog(currPostid)

    // add delete logic in this function
  }
  return (    
      <div className='w-full h-full flex items-center p-5 justify-center overflow-hidden'>
        <div className='flex flex-col gap-3 h-full w-full md:w-8/12 overflow-auto hide-scrollbar'>
        
        <Modal
          title="Do you want to delete this blog ? "
          
          visible={deletebtn}
          onOk={onOkbtn}
          onCancel={()=>{setdeletebtn(false)}}
          closable = {true}
        >
          
        </Modal>
        {blogs?.map((blog:any,index:any) =>{
          return <Card className="custom-card text-lg"  hoverable={true} bordered={true} title={(index+1)+". "+blog.title} extra={
            <div className='flex items-start justify-center gap-4'>
              <Link className="text-sky-400 underline hover:text-green-700" to={`/editPost/${blog.id}`}><Edit/></Link>
              <Link className="text-red-400 underline hover:text-green-700" to={`/blog/${blog.id}`}><OpenInBrowser/></Link>              
              <button onClick={()=>{handleDeleteClick(blog.id)}} className="hover:text-red-500"><DeleteOutline/></button>
            </div>
          
        }>{blog.plainText == null ? "Nothing to Show here" : (blog.plainText <= 100 ? blog.plainText : blog.plainText.slice(0,50) + " ...")}</Card>
        })}
        {(!blogs || blogs?.length == 0) &&  <div className='w-full h-full text-lg font-semibold flex items-center justify-center'>
          <div className='flex flex-col gap-2'>
            <div>🙁 You Have not Posted yet 🙁</div>
            <div className='w-full text-center'>Create One here <Link to="/publish" className=' hover:text-green-500 text-sky-500'><Create/></Link></div>
          </div>
        
        </div>}
        </div>
      </div>    
  )
}

export default MyBlogs

import { useState } from 'react'
import {Route,Routes, useNavigate} from 'react-router-dom'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Blog from './pages/Blog'
import Blogs from './pages/Blogs'
import Publish from './pages/Publish'
import EditPost from './pages/EditPost'
import './App.css'
import Profile from './pages/Profile'
// import PersonalDetails from './components/PersonalDetails'
import { useEffect } from 'react'
import { userdetailState } from './atomsStorage'
import axios from 'axios'
import { useRecoilState } from "recoil";
import Loader from './components/Loader'
import Error404 from './pages/Error404'

function App() {
  const [userdetailState2,setUserDetail] = useRecoilState(userdetailState)
  const navigate = useNavigate()
  const [loading,setLoading] = useState(true)
  async function getUserDetails(){
    if(localStorage.getItem('token') == undefined || localStorage.getItem('token') == null){  
      navigate('/signup')    
      setLoading(false)
      return
    }
    const response = await axios({
      method:'get',
      url:'https://mediumbackend.utkarshkld.workers.dev/api/v1/user/getMyDetails',
      headers:{
        Authorization:"Bearer " + localStorage.getItem('token')
      }
    })
    console.log(response)    
    setUserDetail(response.data.response) 
    navigate('/blogs')   
    setLoading(false)
    
  }
  useEffect(()=>{
    getUserDetails()
  },[])
  if(loading){
    return <Loader/>
  }
  console.log("hello")
  return (
    <>
      <div className='w-screen h-screen overflow-hidden bg-slate-100 px-2 md:px-0'>
        <Routes>          
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blogs" element={<Blogs/>}/>
          <Route path="/publish" element={<Publish />}/>
          <Route path="/profile/*" element={<Profile/>} />
          <Route path="/editPost/:id" element={<EditPost />}/>
          <Route path="*" element={<Error404/>} />
          
          
        </Routes>
        </div>
      
    </>
  )
}

export default App

import axios from "axios"
import { useRecoilState, useRecoilValue } from "recoil";
import { userdetailState , commentsState} from "../atomsStorage";


import { useEffect, useRef, useState } from "react";
interface Blog{
    "content":string,
    "title":string,
    "id":number | string,
    "author":{
        "name":any,
        "id":any,
        "img":any,
        "tagline":any,
        "username":any,
    },
    "createdAt":string,
    "totalLikes":number | string
    "thumbnail":any
}
export const useBlog = ({id} :{id:string}) =>{
    const [loading,setLoading] = useState(true);
    const [comments,setComments] = useState<any>()
    const [blog,setBlog] = useState<Blog>();
    const [likes,setLikes] = useState<any>();
    const [userLiked,setUserLiked] = useState(false)
    const [doFollow,setDoFollow] = useState<any>(false)
    const [commentsatom,setcommentsatom] = useRecoilState(commentsState)
    async function getBlog(){
        console.log(localStorage.getItem('token'))
        try{

            const response = await axios({
                method:"GET",
                url:"https://mediumbackend.utkarshkld.workers.dev/api/v1/blog/"+id,
                headers:{
                    Authorization:"Bearer " + localStorage.getItem('token')
                }
        });
            // console.log(response);
            setDoFollow(response.data.doFollow)
            setBlog(response.data.postData);
            setLikes(response.data.totalLikes);
            setComments(response.data.comments);
            setUserLiked(response.data.isLikedByCurrentUser); 
            // setComments(response.data.postData.comments.reverse());
            setcommentsatom(response.data.fetchingFollowing.reverse())   
            // setComments(response.data.fetchingFollowing.reverse())  
                       
            setLoading(false);
            console.log(response)
        }catch(e){
            console.log(e)
        }
        
        
    }
    async function inUseeffect(){
        await getBlog()
    }
    useEffect(()=>{
        inUseeffect()
    },[])
    return {
        loading,blog,likes,userLiked,setLikes,setUserLiked,comments,setComments,doFollow,setDoFollow
    }
}
export const useBlogs = ()=>{
    const [loading,setLoading] = useState(true);
    const [blogs,setBlogs] = useState<Blog>();
    
    async function getBlogs(){
        console.log(localStorage.getItem('token'));
        const response = await axios({
            method:"get",
            url:"https://mediumbackend.utkarshkld.workers.dev/api/v1/blog/bulk",
            headers:{
                Authorization:"Bearer " + localStorage.getItem('token')
            }
    });
        setBlogs(response.data.postsList);        
        console.log(response.data.postsList);
        setLoading(false);
    }
    useEffect(()=>{
        getBlogs()
    },[])
    return {
        loading,blogs
    }
}
export const getMyDetails = ()=>{
    const [loading,setLoading] = useState(true);
    // const [myDetail,setMyDetail] = useState<any>();
    const [userdetailState2,setuserData] = useRecoilState(userdetailState)
    // const [myDetail,setMyDetail] = useRecoilState(userdetailState)
//     const nameref = useRef<any>()
//   const passwordref = useRef<any>()
//   const taglineref = useRef<any>()
  const imageref = useRef<any>()
    async function getDetails(){        
            const response = await axios({
                method:"get",
                url:"https://mediumbackend.utkarshkld.workers.dev/api/v1/user/getMyDetails",
                headers:{
                    Authorization:"Bearer " + localStorage.getItem('token')
                }
            })
            setLoading(false)
            // console.log(response)
            // setUserDetail(response.data.response)
            setuserData(response.data.response)    
            // console.log(myDetail)    
    }
    useEffect(()=>{
        if(userdetailState2==null){
            
            getDetails()
        }else{
            console.log(userdetailState2)
            setLoading(false)
        }
        
    },[])
    return {
        loading,userdetailState2,setuserData
    }
}
export const getBlogsById = ({id}:{id:any})=>{
    const [loading,setLoading] = useState(true);
    const [blogs,setBlogs] = useState<any>();
    
    
    async function getBlogs(){
        
        const response = await axios({
            method:"get",
            url:"https://mediumbackend.utkarshkld.workers.dev/api/v1/user/getUserPosts/"+id,
            headers:{
                Authorization:"Bearer " + localStorage.getItem('token')
            }
    });
        setBlogs(response.data.response?.[0].posts);        
        // console.log(response.data);
        // console.log(response.data.response?.[0].posts)
        setLoading(false);
    }
    useEffect(()=>{
        getBlogs()
    },[])
    return {
        loading,blogs,setBlogs
    }
}
export const getLikedBlogs = ()=>{
    const [loading,setLoading] = useState(true);
    const [blogs,setBlogs] = useState<any>();  
    
    async function getBlogs(){
        
        const response = await axios({
            method:"get",
            url:"https://mediumbackend.utkarshkld.workers.dev/api/v1/user/getMyLikedPosts",
            headers:{
                Authorization:"Bearer " + localStorage.getItem('token')
            }
    });
        setBlogs(response.data.response);        
        console.log(response.data);
        // console.log(response.data.response?.[0].posts)
        setLoading(false);
    }
    useEffect(()=>{
        getBlogs()
    },[])
    return {
        loading,blogs,setBlogs
    }
}
export const getFollowersAndFollowing = ({id})=>{
    const [loading,setLoading] = useState(true);
    const [follower,setFollower] = useState<any>();  
    const [following,setFollowing] = useState<any>();
    
    async function getFollowersAndFollowing(){
        
        let response = await axios({
            method:"get",
            url:"https://mediumbackend.utkarshkld.workers.dev/api/v1/user/getFollowers/"+id,
            headers:{
                Authorization:"Bearer " + localStorage.getItem('token')
            }
    });
              
        console.log(response.data);    
        setFollower(response.data) 
         response = await axios({
            method:"get",
            url:"https://mediumbackend.utkarshkld.workers.dev/api/v1/user/getFollowing/"+id,
            headers:{
                Authorization:"Bearer " + localStorage.getItem('token')
            }
    });   
    setFollowing(response.data)
    console.log(response.data)
    setLoading(false);
    }
    useEffect(()=>{
        getFollowersAndFollowing()
    },[])
    return {
        loading,follower,setFollower,following,setFollowing
    }
}
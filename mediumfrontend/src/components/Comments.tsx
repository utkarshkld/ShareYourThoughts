import  {  useState } from "react";
import moment from "moment";

import { useRecoilValue ,useRecoilState} from "recoil";
import { userdetailState,commentsState } from "../atomsStorage";
import axios from "axios";

interface comment {
  authorName: string;
  authorId: string;
  CommentsContent: string;
  createdAt:any;
  img:any,
  isFollowed:boolean,
  setcomment:any
  
}
const Comments = ({ setcomment,authorName, authorId, CommentsContent,createdAt,img,isFollowed }: comment) => {
  
  // no bring in the avatar
  const [commentsatom,setcommentsatom] = useRecoilState(commentsState)
  const temp = useRecoilValue(userdetailState)
  const [followedstatus,setfollowedstatus] = useState(isFollowed)
  const [process,setprocess] = useState(false)
  async function followedClickHandle(){
    setprocess(true)
    const response = await axios({
      method:"post",
      url:"https://mediumbackend.utkarshkld.workers.dev/api/v1/user/followUnfollow/"+authorId,
      headers:{
        Authorization:"Bearer " + localStorage.getItem('token') 
      }
    })
    // console.log(response)
    setprocess(false)
    const t =   commentsatom.map((comment: any) => {
      if (comment.userId === authorId) {
        // t.push( { ...comment, isFollowed: !followedstatus });
        return { ...comment, isFollowed: !followedstatus }
      }
      // t.push( { ...comment});
      return {...comment}
    });
    const s = await setcommentsatom(t);
    setfollowedstatus(followedstatus=>!followedstatus)    
    setcomment(3)
    
    // setcomment(false)
    setTimeout(() => {
      setcomment(2)
    },2000)
    
    // setcomment(true)
  }
  
  return (
    <div className="w-full flex flex-col gap-3 mt-3 pb-4 border-b z-5">
      <div className="flex justify-between w-full items-center">
        <div className="flex justify-between w-full items-center"> 
        <div className="flex gap-2 items-center">
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600"
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
        <div className="text-md">{authorName}</div>
        <div className="text-slate-400">{moment(createdAt).fromNow()}</div>
        </div>
        {temp?.id === authorId ? <span className="text-slate-400">( You )</span> : (followedstatus   ? <button onClick={()=>{followedClickHandle()}} type="button" className="text-white h-10 w-20 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-2 py-2.5 me-2 mb-2 ">Following</button> :<button onClick={()=>{followedClickHandle()}} type="button" className="flex h-10 w-20 item-center justify-center text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">Follow</button>)}
        {/* <button type="button" className="flex item-center justify-center text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">Follow</button> */}
        </div>
        
      </div>
      <div className="w-full text-lg">
        {CommentsContent}
      </div>
      
    </div>
  );
};

export default Comments;

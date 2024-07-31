import axios from "axios";
import { useState } from "react";

// import React from "react";

const AuthorCard = ({doFollow,setDoFollow, authorName,img,userId,tagline }: { doFollow:any,setDoFollow:any,authorName: string,img:any,userId:any,tagline:string }) => {
  const t = localStorage.getItem('selfId') === userId;
  const [isFollowed,setIsFollowed] = useState<any>(doFollow)
  console.log(isFollowed)
  async function handleFollowClick(){

    const response = await axios({
      method:"post",
      url:"https://mediumbackend.utkarshkld.workers.dev/api/v1/user/followUnfollow/"+userId,
      headers:{
        Authorization:"Bearer " + localStorage.getItem('token') 
      }
    })
    console.log(response)
    setIsFollowed(isFollowed=>!isFollowed)
  }
  return (
    <div className="w-full" >
      
    <div className="flex items-center gap-2">
    <div className="relative inline-flex items-center border-2 border-black justify-center w-12 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600"
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
      <div className="w-full  m-2">
        <div className="flex justify-between items-center w-72">
          <div className="text-xl font-semibold text-black">{authorName}</div>
          {t ? <span className="text-slate-400">(You)</span> :<button type="button" onClick={handleFollowClick} className={`text-white ${!isFollowed ? "bg-gray-800 hover:bg-gray-900" : "bg-green-700 hover:bg-green-800 "} focus:outline-none focus:ring-4  font-medium rounded-full text-sm px-2.5 py-1 text-center  me-2 mb-2 `}>{isFollowed ? "Unfollow" : "Follow"}</button>}
          </div>
      
      <div className=" text-slate-500 w-10/12">{tagline && tagline.length > 0 ? tagline : ''}</div>
      
      </div>
    </div>
    </div>
  );
};

export default AuthorCard;

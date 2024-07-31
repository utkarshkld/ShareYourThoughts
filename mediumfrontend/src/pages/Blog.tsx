import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useBlog } from "../hooks";
import AppBar from "../components/AppBar";
import FullBlog from "../components/FullBlog";
import AuthorCard from "../components/AuthorCard";
import Comments from "../components/Comments";
import Loader from "../components/Loader";
import { Oval } from "react-loader-spinner";


import {
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
  MessageFilled,
} from "@ant-design/icons";
import axios from "axios";
import "./Publish.css";
import { useRecoilState } from "recoil";
import { commentsState } from "../atomsStorage";
const t = []
const Blog = () => {
  const { id } = useParams();
  console.log(id)
  const commentref = useRef();
  const [commentClick, setCommentClick] = useState<any>(1);
  const [commentsatom,setcommentsatom] = useRecoilState(commentsState)
  const {
    loading,
    blog,
    likes,
    userLiked,
    setLikes,
    setUserLiked,
    doFollow,
    setDoFollow
    
    
  } = useBlog({
    id: id || "",
  });
  
  const [commentOnClicked, setCommentOnClicked] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);
  useEffect(()=>{
    console.log(commentsatom)
    
  },[commentsatom])
  if (loading) {
    return <Loader></Loader>;
  }

  // console.log(currLikes)

  async function handleClickLike() {
    try {
      setLikes((likes : any) => {
        if (userLiked) {
          return likes - 1;
        }
        return likes + 1;
      });
      setUserLiked((userLiked) => !userLiked);
      setLikeClicked(true);
      const respone = await axios({
        method: "post",
        url:
          "https://mediumbackend.utkarshkld.workers.dev/api/v1/blog/likedislike/" +
          id,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setLikeClicked(false);
      console.log(respone)
      // setUserLiked(respone.data.liked)
      // setLikes(respone.data.totalLikes)
    } catch (e) {
      console.log(e);
    }
  }
  async function handleaddComment() {
    if(commentref.current.value.length < 1){
      alert("Please add comment text ... :)")
      return;
    }
    try {
      setCommentOnClicked(true);
      const response = await axios({
        method: "post",
        url:
          "https://mediumbackend.utkarshkld.workers.dev/api/v1/blog/addComment/" +
          id,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: {
          content: commentref.current.value,
        },
      });
      setCommentOnClicked(false);
      setcommentsatom((commentsatom:any)=>[response?.data.commentData,...commentsatom]);
      commentref.current.value = "";
    } catch (e) {
      console.log(e);
    }
  }
  
  return (
    <div className="slide-in h-full w-full overflow-scroll-y">
      <div className='grid w-full h-full grid-rows-12'>
        
        <AppBar isPublish={false}></AppBar>
      
      <div className="w-full  row-span-11 overflow-auto"> 
      <div className="md:text-sm md:grid md:grid-cols-12 ">
        <div className="w-full md:col-span-8">
        <div className=" md:fixed md:top-20 md:right-20 md:w-1/4  md:h-[calc(100%-80px)]">
          <AuthorCard doFollow={doFollow} setDoFollow={setDoFollow} authorName={blog?.author.name || ""} userId={blog?.author.id} img={blog?.author.img} tagline={blog?.author.tagline}></AuthorCard>
          <div className="w-full p-5">
            <div className="flex gap-2 mb-5">
              <div className="flex gap-1"></div>
              <button
                disabled={likeClicked}
                className="text-xl"
                onClick={handleClickLike}
              >
                {!likeClicked && (userLiked ? (
                  <LikeFilled color="black" />
                ) : (
                  <LikeOutlined />
                ))}
                {likeClicked && (
                  <Oval
                    visible={true}
                    height="20"
                    width="20"
                    color="#1e90ff"
                    secondaryColor="#fff"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    strokeWidth={3}
                  />
                )}
              </button>
              <div className="text-slate-500 text-xl">{likes}</div>

              <button
                className="ml-3 text-xl"
                onClick={() => {
                  setCommentClick((commentClick:any) => {
                    if(commentClick == 1){
                      return 2;
                    }else{
                      return 1
                    }
                  });
                }}
              >
                {commentClick == 2 ? (
                  <MessageFilled color="black" />
                ) : (
                  <MessageOutlined />
                )}
              </button>
              <div className="text-slate-500 text-xl">{commentsatom.length}</div>
            </div>

            {commentClick == 2 && (
              <div className="w-full  slide-in">
                
                <div className="w-full flex">
                  <input
                    ref={commentref}
                    type="text"
                    id="comment"
                    className="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-md rounded-tl-lg focus:ring-blue-500 block w-full p-2.5 "
                    placeholder="Add Your Comment..."
                    required
                  />
                  <button
                    disabled={commentOnClicked}
                    onClick={handleaddComment}
                    className="bg-black hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-tr-lg focus:outline-none focus:shadow-outline"
                  >
                    {commentOnClicked ? (
                      <Oval
                        visible={true}
                        height="30"
                        width="30"
                        color="#fff"
                        ariaLabel="oval-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        strokeWidth={4}
                        secondaryColor="#fff"
                      />
                    ) : (
                      "Comment"
                    )}
                  </button>
                </div>
                <div className=" h-72 border w-full border-gray-300 p-3 overflow-y-auto break-words rounded-b-lg">
                  {commentsatom?.map((comment: any) => {
                    console.log("checking checking")
                    console.log(comment)
                    return (
                      <Comments
                        setcomment={setCommentClick}                     
                        authorName={comment.user.name}
                        authorId={comment.userId}
                        CommentsContent={comment.content}
                        key={comment.id}
                        createdAt={comment.createdAt}
                        img={comment.user.img}
                        isFollowed={comment.isFollowed}
                      ></Comments>
                    );
                  })}
                </div>
              </div>
            )}
            {commentClick == 3 && (
              <div className="flex w-full h-96 items-center justify-center">
                <Oval
                        visible={true}
                        height="60"
                        width="60"
                        color="#000"
                        ariaLabel="oval-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        strokeWidth={4}
                        secondaryColor=""
                      />
              </div>
            )}
          </div>
        </div>
          <FullBlog
            id={blog?.id}
            title={blog?.title || ""}
            content={blog?.content || ""}
            authorName={blog?.author.name || ""}
            publishedDate={blog?.createdAt || ""}
          ></FullBlog>
        </div>
        
        </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;

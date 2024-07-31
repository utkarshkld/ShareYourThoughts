// import React from 'react'
import { Card, Modal, Anchor, List, Avatar } from "antd";
import { Delete } from "@mui/icons-material";
import Meta from "antd/es/card/Meta";
import { useEffect, useRef, useState } from "react";
import { getFollowersAndFollowing } from "../hooks";
import Loader from "./Loader";
import { set } from "mongoose";
import { Oval } from "react-loader-spinner";
import axios from "axios";
const FollowFollowing = ({ setpage }: { setpage: any }) => {
  setpage(4);

  const [isOpen, setIsOpen] = useState<any>(false);
  const [deletebtn, setdeletebtn] = useState(false);
  
  const [confirmLoading, setConfirmLoading] = useState<any>(false);
  const id = localStorage.getItem("selfId");
  const { follower, setFollower, following, setFollowing, loading } =
    getFollowersAndFollowing({ id });
  useEffect(() => {
    console.log(follower);
    console.log(following);
  }, [follower, following]);
  if (loading) {
    return <Loader></Loader>;
  }
  async function handleOnSHow(){
    console.log('hello')
    
    console.log(follower)
    console.log(following)
  }
  async function removeFollower(id:any){
    setdeletebtn(true)
    const response = await axios({
      method:"put",
      url:"https://mediumbackend.utkarshkld.workers.dev/api/v1/user/removeFollwer/"+id,
      headers:{
        Authorization:"Bearer " + localStorage.getItem('token')
      }
    })
    console.log(response)
    setdeletebtn(false)
    
    setFollower(follower=>follower?.response?.filter(item=>item.follower.id!==id))
  }
  async function removeFollowing(id:any){
    setdeletebtn(true)
    const response = await axios({
      method:"put",
      url:"https://mediumbackend.utkarshkld.workers.dev/api/v1/user/removeFollowing/"+id,
      headers:{
        Authorization:"Bearer " + localStorage.getItem('token')
      }
    })
    setdeletebtn(false)    
    setFollowing(following=>following?.response?.filter(item=>item.following.id!==id))
  }
  return (
    <div className="w-full h-full grid grid-rows-6">
      <div className="row-span-1"></div>
      <div className="flex w-full justify-center gap-5 items-center">
        <Modal
          open={isOpen}
          confirmLoading={confirmLoading}
          footer={""}
          onCancel={() => setIsOpen(false)}
        >
          <Anchor
            direction="horizontal"
            affix={true}

            
            
            items={[
              {
                key: "part-1",
                href: "#part-1",
                title: "Followers",
              },
              {
                key: "part-2",
                href: "#part-2",
                title: "Following",
              },
            ]}
            
          />
          <div className=" h-52 overflow-y-hidden overflow-x-hidden">
            <div
              id="part-1"
              style={{
                overflow: "auto",
                width: "100%",
                height: "100%",
                textAlign: "center",
                
              }}
            >
              <List
                size="large"
                itemLayout="horizontal"
                bordered
                dataSource={follower?.response}
                renderItem={(item: any) => {
                  return (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={
                              item.follower.img ||
                              `https://api.dicebear.com/7.x/miniavs/svg?seed=1`
                            }
                          />
                        }
                        title={
                          <div className="flex justify-between">                          
                            <div className="font-semibold  ">
                              {item.follower.name} <span className="font-thin text-slate-400">({item.follower.username})</span>
                            </div>                            
                          
                          {!deletebtn ? <button onClick={()=>{removeFollower(item.follower.id)}} className="hover:text-red-500"><Delete/></button> :  <Oval
                    visible={true}
                    height="20"
                    width="20"
                    color="#1e90ff"
                    secondaryColor="#fff"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    strokeWidth={3}
                  /> }
                          </div>
                        }
                        description={<div className="flex w-full justify-start">{item.follower.tagline}</div>}
                      />
                    </List.Item>
                  );
                }}
              />
            </div>
            <div
              id="part-2"
              style={{
                width: "100%",
                height: "100%",
                textAlign: "center",                
              }}
            >
              <List
                size="large"
                bordered
                dataSource={following?.response}
                renderItem={(item: any) => {
                  return (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={
                              item.following.img ||
                              `https://api.dicebear.com/7.x/miniavs/svg?seed=1`
                            }
                          />
                        }
                        title={
                          <div className="flex justify-between">                          
                            <div className="font-semibold  ">
                              {item.following.name} <span className="font-thin text-slate-400">({item.following.username})</span>
                            </div>                            
                          
                            {!deletebtn ? <button onClick={()=>{removeFollowing(item.following.id)}} className="hover:text-red-500"><Delete/></button> :  <Oval
                    visible={true}
                    height="20"
                    width="20"
                    color="#1e90ff"
                    secondaryColor="#fff"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    strokeWidth={3}
                  /> }
                          </div>
                        }
                        // description={<div className="text-black">{item.following.tagline}</div>}
                      />
                    </List.Item>
                  );
                }}
              />
            </div>
          </div>
        </Modal>
        <Card hoverable>
          <Meta
            title={
              <div className="w-full flex items-center justify-center ">
                Followers
              </div>
            }
            description={
              <div className="w-full flex items-center justify-center text-5xl text-black font-semibold">
                {follower.count}
              </div>
            }
          />
        </Card>
        <Card hoverable>
          <Meta
            title={
              <div className="w-full flex items-center justify-center ">
                Following
              </div>
            }
            description={
              <div className="w-full flex items-center justify-center text-5xl text-black font-semibold">
                {following.count}
              </div>
            }
          />
        </Card>

      </div>
      <div onClick={()=>setIsOpen(true)} className="flex items-center justify-center cursor-pointer w-full hover:underline text-sky-500">View {">>"}</div>
    </div>
  );
};

export default FollowFollowing;

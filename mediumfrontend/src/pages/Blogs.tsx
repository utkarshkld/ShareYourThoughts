import React from "react";
import BlogCard from "../components/BlogCard";
import AppBar from "../components/AppBar";
import { useBlogs } from "../hooks";
import Loader from "../components/Loader";
import { Card } from "antd";
import { Link } from "react-router-dom";
import Avatar from "antd/es/avatar/avatar";
import "./Publish.css";
import moment from "moment";
const { Meta } = Card;

const Blogs = () => {
  const { loading, blogs } = useBlogs();
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="slide-in h-full w-full overflow-hidden">
      <div className="grid w-full h-full grid-rows-12">
        <AppBar isPublish={false}></AppBar>

        <div className="w-full flex justify-center overflow-y-auto overflow-x-auto row-span-11">
          <div className="flex flex-col items-center gap-5 w-full  md:w-8/12 lg:w-6/12 h-full py-5">
            {blogs &&
              blogs?.map((blog: any) => {
                return (
                  <div className="grid rounded-lg bg-white grid-cols-12 w-full">
                    <Link className="col-span-10" to={`/blog/` + blog.id}>
                      <Card
                        size="small"
                        className="custom-card h-full "
                        hoverable={true}
                        bordered={true}
                        actions={[
                          <span className="p-2 bg-slate-200 rounded-full">
                            {Math.floor(blog.plainText?.split(" ").length / 100) + 1} min(s) read
                          </span>,
                        ]}
                      >
                        <Meta
                          avatar={
                            <Avatar
                              size={"large"}
                              src={
                                blog.author.img
                                  ? blog.author.img
                                  : "https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                              }
                            />
                          }
                          style={{ fontSize: "large" }}
                          title={
                            <div>
                              <div className="text-xl">{blog.title}</div>
                              <div className="text-sm font-thin text-slate-400">
                                {blog.author.name} &#128900; {moment(blog.createdAt).fromNow()}
                              </div>
                            </div>
                          }
                          description={
                            blog.plainText == null
                              ? "Nothing to Show here"
                              : blog.plainText.length <= 50
                              ? blog.plainText
                              : blog.plainText.slice(0, 50) + " ..."
                          }
                        />
                      </Card>
                    </Link>
                    <div className="col-span-2 text-slate-500 object-contains flex items-center justify-center">
                      {blog.thumbnail ? (
                        <img
                          className="max-h-32 w-fullrounded-lg"
                          src={blog.thumbnail}
                        />
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;

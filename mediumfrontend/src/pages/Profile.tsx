import {useState}from "react";
import AppBar from "../components/AppBar";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import MyBlogs from "../components/MyBlogs";
import LikedBlog from "../components/LikedBlog";
import {  Route, Routes } from "react-router-dom";
import PersonalDetails from "../components/PersonalDetails";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import {FavoriteBorder , BookOutlined,PersonOutline,GroupOutlined,LogoutOutlined} from '@mui/icons-material';
// import { useRecoilState } from "recoil";
// import { userdetailState } from "../atomsStorage";

import FollowFollowing from "../components/FollowFollowing";
import "./Publish.css";
const Profile = () => {
  const navigate = useNavigate();
  const [selectedPage,setselectedpage] = useState<any>(1)
  // const [setuserData] = useRecoilState(userdetailState)
  // async function handleLogout(){
  //   localStorage.removeItem('token')
  //   localStorage.removeItem('selfId')
  //   setuserData(null)
  //   navigate('/signup')
  const [logout,setlogout] = useState<any>(false)
  // }
  async function handleOk() {
    localStorage.removeItem('token')
    localStorage.removeItem('selfId')
    navigate('/signup')    
    window.location.reload()
  }
  async function handleCancel() {
    setlogout(false)
  }
  return (
    <div className="w-screen grid grid-rows-12 h-screen slide-in">
      <Modal
        title="Exit Alert ⚠️"
        open={logout}
        onOk={handleOk}        
        onCancel={handleCancel}
      >
        <p className="text-lg">Are you sure you want to logout?</p>
      </Modal>
      <AppBar isPublish={false}></AppBar>
      <div className="flex items-center justify-center w-full row-span-11">
        <div className="grid grid-cols-12 h-full w-full">
          {/* <Link className="text-white p-2" to="/profile/editpage">Personal Details</Link>
                <Link className="text-white p-2" to="/profile/editpage">Personal Details</Link>
                <Link className="text-white p-2"  to="/profile/editpage">Personal Details</Link>
                <Link className="text-white p-2" to="/profile/editpage">Personal Details</Link> */}
                <div className="h-full w-full col-span-2 ">
                <Sidebar width="100%" className="h-full">
  <Menu
    
  >
    <MenuItem rootStyles={{}} className={selectedPage == 1 ? "bg-sky-500 text-white hover:font-bold hover:text-sky-600 " : "hover:font-bold  hover:text-sky-600"}
     onClick={() => {navigate('/profile'); setselectedpage(1)}}>
      <PersonOutline /> Personal Details
    </MenuItem>
    <MenuItem className={selectedPage == 2 ? "bg-sky-500 text-white hover:font-bold hover:text-sky-600" : "hover:font-bold hover:text-sky-600"} onClick={() => {navigate('/profile/myBlogs'); setselectedpage(2)}}>
      <BookOutlined /> My Blogs
    </MenuItem>
    <MenuItem className={selectedPage == 3 ? "bg-sky-500 text-white hover:font-bold hover:text-sky-600" : "hover:font-bold hover:text-sky-600"}  onClick={() => {navigate('/profile/likedBlog'); setselectedpage(3)}}>
      <FavoriteBorder /> Liked Blogs
    </MenuItem>
    <MenuItem className={selectedPage == 4 ? "bg-sky-500 text-white hover:font-bold hover:text-sky-600" : "hover:font-bold hover:text-sky-600"} onClick={() => {navigate('/profile/FollowFollowing'); setselectedpage(4)}}>
      <GroupOutlined /> Follow/Following
    </MenuItem>
    <MenuItem className={"hover:font-bold hover:text-sky-600"} onClick={() => {
      setlogout(true);
    }}>
      <LogoutOutlined/> Logout
    </MenuItem>
  </Menu>
</Sidebar>
          </div>
          <div className=" col-span-10 overflow-hidden">
            <Routes>
              <Route path="" element={<PersonalDetails setpage={setselectedpage}/>}></Route>
              <Route path="myBlogs" element ={<MyBlogs setpage={setselectedpage}/>}></Route>
              <Route path="likedBlog" element = {<LikedBlog setpage={setselectedpage}/>}></Route>
              <Route path="FollowFollowing" element = {<FollowFollowing setpage={setselectedpage}/>}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


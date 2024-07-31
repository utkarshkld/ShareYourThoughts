import React,{useState} from "react";
import icon from "../images/Medium.png";
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userdetailState } from "../atomsStorage";
import { Modal } from "antd";
interface props {
  
  isPublish: boolean | false;
  
}
const AppBar = ({ isPublish}: props) => {
  const [userdetailState2,setuserData] = useRecoilState(userdetailState)
  const [open,setOpen] = useState<any>(false)
  // console.log(userdetailState2)
  function handleLogout(){
    localStorage.removeItem('token')
    localStorage.removeItem('selfId')
    setuserData(null)
    window.location.reload()
  }
  async function handleOk(){
    localStorage.removeItem('token')
    localStorage.removeItem('selfId')
    setuserData(null)
    window.location.reload()
  }
  async function handleCancel(){
    setOpen(false)
  }
  return (
    <div className="flex row-span-1 p-3 items-center justify-between border-b-2 bg-white border-slate-200  py-2  w-full">
      <Modal
        title="Exit Alert ⚠️"
        open={open}
        onOk={handleOk}        
        onCancel={handleCancel}
      >
        <p className="text-lg">Are you sure you want to logout?</p>
      </Modal>
      <div className="flex items-center gap-2">
        <Link className="flex items-center" to="/blogs">
          <div className="w-10 h-10 ms-10">
            <img src={icon} alt="logo"></img>
          </div>
          
        </Link>
      </div>
        <div className="flex gap-3 ">
        <Link to="/profile">
        <div className="relative inline-flex items-center border-2 border-black justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600"
        style={
          userdetailState2?.img ? {
                backgroundImage: `url(${userdetailState2?.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {
              backgroundImage: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
        {!userdetailState2 && <span className="font-medium text-gray-600 dark:text-gray-300">
          {userdetailState2?.name.slice(0, 1)}
        </span> }
        
      </div>
      </Link>
      <div className="flex items-center justify-center gap-2 h-full">
        {!isPublish && <button type="button" className="text-white p-3 bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-300 rounded-xl md:rounded-2xl text-xs md:text-sm   dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"><Link to="/publish">New</Link></button>}
        
      <button onClick={()=>{setOpen(true)}} type="button" className="text-white  p-3 bg-red-700 rounded-xl hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-300  md:rounded-2xl text-xs md:text-sm dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Logout</button>
      </div>
        </div>
        
      
    </div>
  );
};

export default AppBar;

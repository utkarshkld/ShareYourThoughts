import { SignInInput, SignupInput } from '@utkarshkld/common-app2.0.1'
import React, { ChangeEvent, useState } from 'react'
import { useNavigate , Link} from 'react-router-dom'
import { useRecoilState } from 'recoil';
import axios from 'axios';
import { userdetailState } from '../atomsStorage';
import Loader from './Loader';
import { Oval } from 'react-loader-spinner';
import {z} from 'zod';
import { ToastContainer,toast } from 'react-toastify';


const Login = ({type} : {type : "signin" | "signup"}) => {
    const navigate = useNavigate();
    const [userdetails, setUserDetail] = useRecoilState(userdetailState);
    const [detailsobj, setdetailsobj] = useState<SignupInput>({
        name: "",
        password: "",
        email: ""    
    });
    const [loading, setLoading] = useState(false);
    
    async function getUserDetails(){
        if(localStorage.getItem('token') == undefined || localStorage.getItem('token') == null){
            navigate('/signup');
            setLoading(false);
            return;
        }
        const response = await axios({
            method: 'get',
            url: 'https://mediumbackend.utkarshkld.workers.dev/api/v1/user/getMyDetails',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('token')
            }
        });
        console.log(response);
        setUserDetail(response.data.response);
        setLoading(false);
        navigate('/blogs');
    }
    
    async function sendAuthReq(){
        try{
            
            if(type === 'signup'){
                const checkemail = z.string().email();
                const checkpassword = z.string().min(8).max(20);
            try{
                let t = checkemail.parse(detailsobj.email)
            }catch(e){                
                toast.error("Please Enter Valid email id 📧 !");
                return;
            }
            try {
                checkpassword.parse(detailsobj.password)
            } catch (error) {
                toast.error("Password should be between 8 to 20 characters 🔑! ")
                return
            }                    
            
            }
            setLoading(true);
            
            const response = await axios({
                url: `https://mediumbackend.utkarshkld.workers.dev/api/v1/user/${type}`,
                method: "POST",
                data: {
                    email: detailsobj.email,
                    password: detailsobj.password,
                    name: detailsobj.name
                }
            });            
            if(response.data.success){
                console.log(response.data.data.id);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('selfId', response.data.data.id);
                await getUserDetails();
                setUserDetail(response.data.data);
            }else{
                setLoading(false)
                toast.error("Username or Password Incorrect!!");

            }

            
        } catch(err) {
            console.log(err);
        }
    }
    
    return (
        <div className='h-screen flex items-center justify-center'>
            <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
            <div className='flex flex-col p-2 sm:p-5 items-center justify-center w-full sm:w-10/12 md:w-8/12 lg:w-6/12 rounded-lg shadow-lg'>
                <div className='text-lg sm:text-2xl md:text-3xl text-center w-full font-bold mb-2'>Create An Account</div>
                <div className='text-sm sm:text-lg w-full text-center text-gray-500 mb-2 md:mb-3'>
                    {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                    <Link to={type === "signin" ? "../signup" : "../signin"} className='underline cursor-pointer hover:text-black'>
                        {type === "signin" ? "Sign Up" : "Login"}
                    </Link>
                </div>
                {type === "signup" ? 
                    <CustomInput label="Name" placeholder="Enter Your Name" onChange={(e) => setdetailsobj({ ...detailsobj, name: e.target.value })}></CustomInput> 
                : <></>}
                <CustomInput label="Email" placeholder="Enter Your Email" onChange={(e) => setdetailsobj({ ...detailsobj, email: e.target.value })}></CustomInput>
                <CustomInput label="Password" placeholder="Enter Your Password" onChange={(e) => setdetailsobj({ ...detailsobj, password: e.target.value })}></CustomInput>
                <button onClick={sendAuthReq} className='w-full flex justify-center items-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>
                    {loading ? <Oval visible={true} height="20" width="20" color="white" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass="" strokeWidth={3} /> 
                    : (type === "signin" ? "Sign In" : "Sign Up")}
                </button>
            </div>
        </div>
    )
}

interface Labelledinput {
    label: string,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function CustomInput({ label, placeholder, onChange }: Labelledinput) {
    return (
        <>
            <div className='mb-2 font-semibold w-full '>{label}</div>
            <input onChange={onChange} type={label === "Password" ? "password" : "text"} className='w-full mb-5 text-lg p-2 rounded-lg outline-none border-2 border-slate-300' placeholder={placeholder} />
        </>
    )
}

export default Login

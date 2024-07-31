// import { Outlet } from 'react-router-dom'
import { Edit,Delete,FileUpload,Visibility,VisibilityOff } from "@mui/icons-material";
import { useRef, useState } from "react";
import { getMyDetails } from "../hooks";
import { useEffect } from "react";
import Loader from "./Loader";
import { Oval } from "react-loader-spinner";
import { storage } from "../Firebase/firebase";
import { ref,getDownloadURL,uploadBytesResumable } from "firebase/storage";
import axios from "axios";
const PersonalDetails = ({setpage}:{setpage:any}) => {
  setpage(1)
  const [editDetails, setEditDetails] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const { loading, userdetailState2, setuserData } =    getMyDetails();
  const [imageref, setImageref] = useState<any>("");
  const [visibility, setVisibility] = useState(false)
  const nameref = useRef<any>()
  const passwordref = useRef<any>()
  const taglineref = useRef<any>()
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 850);

    const checkScreenSize = () => {
        setIsSmallScreen(window.innerWidth <= 850);
    };

    useEffect(() => {
        window.addEventListener('resize', checkScreenSize);
        window.addEventListener('orientationchange', checkScreenSize);

        // Initial check
        checkScreenSize();

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener('resize', checkScreenSize);
            window.removeEventListener('orientationchange', checkScreenSize);
        };
    }, []);

  useEffect(() => {
    // nameref?.current.value = myDetail?.name;
    if (userdetailState2 != undefined && userdetailState2 && !loading) {
      nameref.current.value = userdetailState2?.name;
      taglineref.current.value = userdetailState2?.tagline;
      passwordref.current.value = userdetailState2?.password;
      setImageref(userdetailState2?.img);
    }
  }, [userdetailState2, editDetails,loading]);
  if (loading) {
    return <Loader></Loader>;
  }
  // async function handleOnClickSubmit() {
  //   if (submitClicked) return;
  //   try {
  //     setSubmitClicked(true);
  //     console.log(imageref);
  //     const response = await axios({
  //       method: "put",
  //       url: "https://mediumbackend.utkarshkld.workers.dev/api/v1/user/editDetails",
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("token"),
  //       },
  //       data: {
  //         name: nameref.current.value,
  //         tagline: taglineref.current.value,
  //         password: passwordref.current.value,
  //         img: imageref,
  //       },
  //     });
  //     // console.log(response);
  //     setSubmitClicked(false);
  //     setuserData(response.data.response);
  //   } catch (e) {}
  // }
  // async function convertImgUrlToBase64(imgUrl: any) {
  //   const response = await fetch(imgUrl);
  //   const blob = await response.blob();
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       resolve(reader.result);
  //     };
  //     reader.onerror = reject;
  //     reader.readAsDataURL(blob);
  //   });
  // }
  // async function handleChangeImage(e: any) {
  //   // console.log(e.target.files);
  //   // console.log(e.target.files);
  //   const file = e.target.files[0];
  //   if (file) {
  //     console.log(file);
  //     const t = URL.createObjectURL(e.target.files[0]);
  //     const base64Image = await convertImgUrlToBase64(t);
  //     setImageref(base64Image);
  //     //   console.log(base64Image);
  //   }
  // }
  async function handleOnClickSubmit() {
    if (submitClicked) return;
    try {
      setSubmitClicked(true);

      let imageUrl = imageref;
      
        console.log(imageUrl)
        imageUrl = await uploadImageToFirebase(imageref);
        console.log(imageUrl)
      

      const response = await axios({
        method: "put",
        url: "https://mediumbackend.utkarshkld.workers.dev/api/v1/user/editDetails",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: {
          name: nameref.current.value,
          tagline: taglineref.current.value,
          password: passwordref.current.value,
          img: imageUrl,
        },
      });

      setSubmitClicked(false);
      setuserData(response.data.response);
    } catch (e) {
      console.error(e);
      setSubmitClicked(false);
    }
  }

  async function uploadImageToFirebase(imageUrl) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    console.log(blob);
    const storageRef = ref(storage, `images/${Date.now()}-temp`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  }

  async function handleChangeImage(e) {
    const file = e.target.files[0];
    if (file) {
      const t = URL.createObjectURL(file);
      setImageref(t);
    }
  }
  return (
    <div className="h-full w-full">
      <div className="w-full h-full mt-5 px-10 sm:ml-32">
        <div className=" sm:w-8/12  flex-col  items-center">
          <div className="flex w-full justify-end">            
          </div>
          <div className="my-5  grid grid-cols-12  w-full">   
            <div className="col-span-1"></div>         
            <div className="flex h-full justify-center items-center col-span-2"> {editDetails && <button
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-md px-2 py-1 md:px-5 md:py-2.5 text-center me-2 mb-2"
              onClick={() => {
                document.getElementById("add-image-input")?.click();
              }}
            >
              <input
                onChange={handleChangeImage}
                id="add-image-input"
                placeholder="Add image"
                type="file"
                hidden
              ></input>
              <div className="flex justify-center  gap-1 items-center">{!isSmallScreen && <div className="text-md">Upload</div>}<FileUpload/></div>
              
            </button>}</div>
            <div className="col-span-6 flex items-center justify-center">
            <div
              className="flex  justify-center items-center w-24 h-24 md:h-40 md:w-40  border-4 border-slate-400 rounded-full "
              style={
                imageref
                  ? {
                      backgroundImage: `url(${imageref})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : {}
              }
            >
              {imageref == null || imageref.length == 0 ? "No Image" : ""}
            </div>
            </div>
            <div className="flex justify-center items-center col-span-2">{editDetails && <button onClick={()=>{setImageref('')}} type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-2 py-1 md:px-5 md:py-2.5 text-center me-2 mb-2"><div className="flex justify-center  items-center">{!isSmallScreen && <div className="text-md">Remove</div>}<Delete /></div></button>} </div>
            <div className="col-span-1"></div>
            <div className="col-span-1 ">           
            </div>
          </div>
            {/* {editDetails && <div className="w-full flex gap-5 justify-center items-center">
            <button
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2"
              onClick={() => {
                document.getElementById("add-image-input")?.click();
              }}
            >
              <input
                onChange={handleChangeImage}
                id="add-image-input"
                placeholder="Add image"
                type="file"
                hidden
              ></input>
              <div className="flex justify-center gap-1 items-center"><div className="text-md">Upload</div><FileUpload/></div>
              
            </button>
            <button onClick={()=>{setImageref('')}} type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-3 py-2.5 text-center me-2 mb-2"><div className="flex justify-center  items-center"><div className="text-md">Remove</div><Delete /></div></button>
          </div>} */}
          

          <div className="w-full  grid grid-cols-8">
            <div className="col-span-1"></div>
            <div className="text-2xl col-span-6 w-full my-5 flex justify-center font-semibold">
              Your Details
            </div>
            <div className="col-span-1 flex justify-center items-center">
              {/* <button className='bg-black rounded-lg p-2'><Edit sx={{color:"white"}}/></button> */}
            </div>
          </div>
          
          <div className="md:grid gap-3 md:grid-cols-2">
            <div className="col-span-1">
            <div className="font-semibold">Name:</div>
              <input
              disabled={!editDetails}
              ref={nameref}
              type="text"
              className="p-3 w-full text-lg rounded-md outline-none border-2 border-slate-300 focus:border-sky-500"
              placeholder="Name"
            /></div>
            
              <div className="col-span-1">
              <div className="text-lg font-semibold">Password:</div>            
              <div className=" grid grid-cols-7 gap-3">  
            <input
              disabled={!editDetails}
              ref={passwordref}
              type={visibility ? 'text' : 'password'}
              className="p-3 text-lg w-full col-span-6 rounded-md outline-none border-2 border-slate-300 focus:border-sky-500"
              placeholder="Password"
            />
            <div className="col-span-1 flex items-center justify-center h-full">
            <button onClick={()=>{setVisibility(visibility=>!visibility)}} className="p-3 w-10 h-full flex items-center justify-center  rounded-lg bg-black">{visibility ? <VisibilityOff sx={{color:"white"}}/> :<Visibility sx={{color:"white"}}/>}</button>
            </div>
            </div>
              </div>
            
            
          </div>
          <div className="w-full text-lg font-semibold mt-3">Tagline:</div>
          <div className="w-full mt-3">
            <input
              disabled={!editDetails}
              ref={taglineref}
              type="text"
              className="p-3 text-lg w-full rounded-md outline-none border-2 border-slate-300 focus:border-sky-500"
              placeholder="Enter Your Tag Line ..."
            />
          </div>
          
          {(
            <div className="w-full mt-5 gap-5 flex justify-center items-center">
              <button
              onClick={() => {setEditDetails((editDetails) => !editDetails)}}
              type="button"
              className={`${
                editDetails
                  ? "bg-gray-800 text-white"
                  : "bg-slate-400 text-gray-800"
              } focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-2.5 md:px-5 py-2.5 me-2 mb-2`}
            >
              <Edit />
            </button>
              {editDetails && <button
                onClick={handleOnClickSubmit}
                type="button"
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
              >
                {submitClicked ? (
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
                  "Submit"
                )}
              </button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;

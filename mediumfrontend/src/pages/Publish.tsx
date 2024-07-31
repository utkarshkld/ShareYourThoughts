import  { useRef } from "react";
import AppBar from "../components/AppBar";
import { useState, useEffect } from "react";
// import { DeleteFilled, FileImageOutlined } from "@ant-design/icons";
import "./Publish.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Oval } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import 'highlight.js/styles/darcula.css';

const Publish = () => {
  const navigate = useNavigate();
  // const [showAlert, setshowAlert] = useState(false);
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const quilref = useRef<any>();
  const quilref2 = useRef<any>();
  const [isloading, setIsLoading] = useState(false);
  const imageRef = useRef<any>();
  const [image, setImage] = useState<any>("");
  useEffect(() => {
    quilref.current.getEditor().root.dataset.placeholder =
      "Content goes here ...";
    quilref2.current.getEditor().root.dataset.placeholder =
      "Title goes here...";
      
  }, []);
  // useEffect(() => {
  //   console.log(value);
  //   console.log(quilref?.current.getEditor().getText());
  //   console.log(quilref2?.current.getEditor().getText());
    
  //   // console.log(value2);
  // }, [value, value2]);

  async function PublishBlog() {
    const title = quilref2?.current.getEditor().getText();
    const content = value;
    const plainText = quilref?.current.getEditor().getText();
    console.log(title.length);
    if (!title || !plainText || title.length === 1 || plainText.length === 1) {
      toast.error("Can Leave Title and Content Blank !");

      return;
    }
    try {
      // const { title, content, plainText }

      // console.log(plainText)
      setIsLoading(true);
      const response = await axios({
        method: "POST",
        url: "https://mediumbackend.utkarshkld.workers.dev/api/v1/blog",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        data: {
          title,
          content,
          plainText,
          thumbnail: image,
        },
      });
      console.log(response);
      setIsLoading(false);
      navigate("/blog/" + response.data.postId);
    } catch (e) {
      console.log(e);
    }
  }
  const modules = {
    syntax: true,
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      ["link", "image","video"],
      [{ header: 1 }, { header: 2 }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ color: [] }, { background: [] }], // text color and background color
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ align: [] }],
      // remove formatting button
    ],
    
  };
  const titlemodule = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["link"],
      [{ header: 1 }, { header: 2 }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // custom button values
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ color: [] }, { background: [] }], // text color and background color
    ],
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "video",
    "image",
    "code-block",
    "color", // add text color
    "background", // add text background color
    "align",
    "font",
    "size",
    "script",
  ];
  // async function getBase64(file) {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = function () {
  //     const base64String = reader.result;
  //     console.log(base64String);
  //     setImage(base64String); // Prints the Base64 string
  //   };
  //   reader.onerror = function (error) {
  //     console.log("Error: ", error);
  //   };
  //   return "";
  // }
  function onChangehandler() {
    // console.log(e.target.files[0]);
    // const base64 = getBase64(e.target.files[0]);
    // setImage(base64)
    // console.log(base64)
    // document.getElementById('show-image').s
  }
  function inputImage() {
    document.getElementById("input-image")?.click();
  }
  
  
  
  // Add an event listener for the Enter key press
  
  
  // Optional: You can also add a listener to ensure it stays at the bottom when new content is added
  
  return (
    <div className="flex h-full w-full flex-col  items-center overflow-x-hidden">
      <AppBar isPublish={true}></AppBar>
      <div className="mt-5 w-full flex h-full border-none flex-col gap-10 sm:w-6/12 ">
        <div className="flex gap-3 flex-col">
          
          <div className="w-full h-22 rounded-lg grid grid-cols-12 gap-3 ">
            {/* Same as */}

            <ReactQuill
              ref={quilref2}
              id="text-editor2"
              className=" col-span-10  ql-error2 hover:shadow-lg"
              theme="snow"
              value={value2}
              onChange={setValue2}
              modules={titlemodule}
              formats={formats}
              scrollingContainer={"html"}
              // onKeyDown={handlescroll}
            />
            <div className="col-span-2 h-full flex items-center justify-center"> 
            <div
              onClick={inputImage}
              className="h-full max-h-32 w-full flex items-center justify-center  bg-white border-4 border-slate-400 text-md cursor-pointer  text-slate-600 rounded-e-lg hover:shadow-lg input-image"
            >
              {(!image || image.length === 0) && "Image..."}
              {image && image.length > 0 && (
                <img
                  src={image}
                  className="  object-fill"
                  id="show-image"
                />
              )}
              <input
                ref={imageRef}
                id="input-image"
                type="file"
                onChange={onChangehandler}
                hidden
              />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-col">
          
          <ReactQuill
            ref={quilref}
            id="text-editor"
            className="w-full  ql-error hover:shadow-lg "
            theme="snow"
            value={value}
            onChange={setValue}
            modules={modules}
            formats={formats}
            // scrollingContainer={"html"}
            bounds={".ql-container"}
          />
        </div>

        <div className="w-full mt-5 mb-10 flex justify-center gap-5 items-center">
          <button
            onClick={PublishBlog}
            className=" flex w-20 h-full justify-center items-center bg-slate-400 text-white p-2 hover:bg-green-500 rounded-lg "
          >
            {isloading ? (
              <Oval
                visible={true}
                height="30"
                width="30"
                color="#fff"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
                strokeWidth={4}
                secondaryColor=""
              />
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </div>
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
    </div>
  );
};

export default Publish;

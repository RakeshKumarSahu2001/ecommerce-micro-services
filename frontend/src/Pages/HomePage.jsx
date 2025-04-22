import { Outlet } from "react-router-dom"
import Footer from "../Components/Footer"
import Navbar from "../Components/Navbar"

// import { getDatabase,ref,set } from "firebase/database";
// import { app } from "../firebase.js";
// import { useEffect } from "react";


// const database = getDatabase(app);
function HomePage() {
  // useEffect(()=>{
  //   set(ref(database,"/test"),{
  //     id:1,
  //     name:"Spectra",
  //     age:23
  //   })
  // },[])

  return (
    <div className="!w-[100%] flex flex-col">
        <Navbar />
        <Outlet />
        <Footer />
    </div>
  )
}

export default HomePage
import React,{ useEffect, useState } from 'react'
import { Outlet,useNavigate } from 'react-router-dom'
import Login from 'src/views/pages/login/Login';



function AuthLayout() {
  const navigate = useNavigate();


  // useEffect(()=>{
  // if(!localStorage.getItem("token")){
  //   navigate("/Login");
  // }else{
  //   console.log('present')
  // }
  // },[]);

  return (
    <div>

    <Outlet/>
    </div>
  )
}

export default AuthLayout

import React from 'react'
import axios from 'axios'

const getToken = localStorage.getItem('token')

export const LoginApi = async (values) => {
  try {
     const resLogin = await axios.post('https://ptkapi.experiencecommerce.com/api/adminPanel/adminLogin',values)
    console.log('resLogin data  =>', resLogin.data);
    return resLogin.data
  } catch (error) {
    console.log('error =>',error );
  }
}

export const changePassWordApi = async (values) => {
  try {
    const resLogin = await axios.post('https://ptkapi.experiencecommerce.com/api/adminPanel/adminChangePassword', values,
      { headers: { token : `${getToken}` } })
    console.log('resLogin data  =>', resLogin.data);
    return resLogin.data
  } catch (error) {
    console.log('error =>',error );
  }
 }

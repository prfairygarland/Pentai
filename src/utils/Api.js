import React from 'react'
import axios from 'axios'
import { API_ENDPOINT } from 'src/utils/config'

const getToken = localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('sessionToken')


// export const PostApi = async (url,value) => {
//  try {
//      const resLogin = await axios.post(url,value)
//     console.log('resLogin data  =>', resLogin.data);
//     return resLogin.data
//   } catch (error) {
//     console.log('error =>',error );
//   }
// }

export const LoginApi = async (values) => {
  try {
    const resLogin = await axios.post('https://ptkapi.experiencecommerce.com/api/adminPanel/adminLogin', values)
    console.log('resLogin data  =>', resLogin.data);
    return resLogin.data
  } catch (error) {
    console.log('error =>', error);
  }
}

export const changePassWordApi = async (values) => {
  try {

    const reschangePassWord = await axios.post('https://ptkapi.experiencecommerce.com/api/adminPanel/adminChangePassword', values,
      { headers: { token: `${getToken}` } })
    console.log('reschangePassWord data  =>', reschangePassWord.data);
    return reschangePassWord.data
  } catch (error) {
    console.log('error =>', error);
  }
}

export const getUserList = async (url) => {
  try {

    const resUserList = await axios.get(url,
      { headers: { token: `${getToken}` } })
    console.log('resUserList data  =>', resUserList.data);
    return resUserList.data
  } catch (error) {
    console.log('error =>', error);
  }
}

export const getCompaniesMasterData = async (url) => {
  try {

    const resCompaniesMasterData = await axios.get(url,
      { headers: { token: `${getToken}` } })
    console.log('resCompaniesMasterData data  =>', resCompaniesMasterData.data);
    return resCompaniesMasterData.data
  } catch (error) {
    console.log('error =>', error);
  }
}

export const getDivisionMasterData = async (url) => {
  try {

    const resDivisionMasterData = await axios.get(url,
      { headers: { token: `${getToken}` } })
    console.log('resDivisionMasterData data  =>', resDivisionMasterData.data);
    return resDivisionMasterData.data
  } catch (error) {
    console.log('error =>', error);
  }
}

export const getGroupMasterData = async (url) => {
  try {

    const resGroupMasterData = await axios.get(url,
      { headers: { token: `${getToken}` } })
    console.log('resGroupMasterData data  =>', resGroupMasterData.data);
    return resGroupMasterData.data
  } catch (error) {
    console.log('error =>', error);
  }
}

export const getTeamMasterData = async (url) => {
  try {

    const resTeamMasterData = await axios.get(url,
      { headers: { token: `${getToken}` } })
    console.log('resTeamMasterData data  =>', resTeamMasterData.data);
    return resTeamMasterData.data
  } catch (error) {
    console.log('error =>', error);
  }
}

export const getUserListExportData = async (url) => {
  try {

    const resTeamMasterData = await axios.get(url,
      { headers: { token: `${getToken}` } })
    console.log('getUserListExportData data  =>', resTeamMasterData.data);
    return resTeamMasterData.data
  } catch (error) {
    console.log('error =>', error);
  }
}


export const getUserDetail = async (url) => {
  try {

    const resUserDetail = await axios.get(url,
      { headers: { token: `${getToken}` } })
    console.log('resUserDetail data  =>', resUserDetail.data);
    return resUserDetail.data
  } catch (error) {
    console.log('error =>', error);
  }
}

export const userImportApi = async (values) => {
  try {

    const userImportApi = await axios.post('https://ptkapi.experiencecommerce.com/api/adminPanel/orgBulkUpload', values,
      { headers: { token: `${getToken}` } })
    console.log('orgImportApiData data  =>', userImportApi.data);
    return userImportApi.data
  } catch (error) {
    console.log('error =>', error);
  }
}

export const orgImportApi = async (values) => {
  try {

    const orgImportApiData = await axios.post('https://ptkapi.experiencecommerce.com/api/adminPanel/orgBulkUpload', values,
      { headers: { token: `${getToken}` } })
    console.log('orgImportApiData data  =>', orgImportApiData.data);
    return orgImportApiData.data
  } catch (error) {
    console.log('error =>', error);
  }
}

export const getImportHistory = async (url) => {
  try {

    const resGetImportHistory = await axios.get(url,
      { headers: { token: `${getToken}` } })
    console.log('resUserList data  =>', resGetImportHistory.data);
    return resGetImportHistory.data
  } catch (error) {
    console.log('error =>', error);
  }
}

export const getSupplyRental = async (url) => {
  try {

    const resGetSupplyRental = await axios.get(url,
      { headers: { token: `${getToken}` } })
    console.log('resGetSupplyRental data  =>', resGetSupplyRental.data);
    return resGetSupplyRental.data
  } catch (error) {
    console.log('error =>', error);
  }
}

export const getBookRental = async (url) => {
  try {

    const resGetBookRental = await axios.get(url,
      { headers: { token: `${getToken}` } })
    console.log('resGetBookRental data  =>', resGetBookRental.data);
    return resGetBookRental.data
  } catch (error) {
    console.log('error =>', error);
  }
}

// import axios from 'axios';
// const CustomHeader = {
//   accept: 'text/plain',
//   accessToken: '12321321',
// };

// export const getApi = async (url, header) => {
//   {
//     let data = null;
//     try {
//       let res = await axios.get(url, {
//         headers: {
//           accept: 'text/plain',
//           ...CustomHeader,
//           ...header,
//         },
//       });

//       data = res.data;
//     } catch (err) {
//       console.log(err);
//     }

//     return data;
//   }
// };

// export const postApi = async (url, data, header) => {
//   {
//     let response = null;
//     try {
//       response = await axios.post(url, data, {
//         headers: {
//           accept: 'text/plain',
//           ...CustomHeader,
//           ...header,
//         },
//       });
//     } catch (err) {
//       console.log(err);
//     }

//     return response;
//   }
// };
// export const putApi = async (url, postIdToUpdate, data, header) => {
//   {
//     let response = null;
//     try {
//       response = await axios.put(url + postIdToUpdate, data, {
//         headers: {
//           accept: 'text/plain',
//           ...CustomHeader,
//           ...header,
//         },
//       });
//     } catch (err) {
//       console.log(err);
//     }

//     return response;
//   }
// };
// export const deleteApi = async (url, postIdToDelete, data, header) => {
//   {
//     let response = null;
//     try {
//       response = await axios.delete(url + postIdToDelete, data, {
//         headers: {
//           accept: 'text/plain',
//           ...CustomHeader,
//           ...header,
//         },
//       });
//     } catch (err) {
//       console.log(err);
//     }

//     return response;
//   }
// };

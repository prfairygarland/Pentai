import { cilMenu } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CCol, CFormCheck, CFormInput, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { enqueueSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Loader from 'src/components/common/Loader';
import ReactTable from 'src/components/common/ReactTable';
import { getApi, putApi } from 'src/utils/Api';
import { API_ENDPOINT } from 'src/utils/config';

const HomeContentManagement = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [usageStatus, setUsageStatus] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage, setItemPerPage] = useState(5)
    const [isWeek, setIsWeek] = useState()
    const [TwoWeek, setTwoWeek] = useState()
    const [month, setMonth] = useState()
    const [visible, setVisible] = useState(false) 

    const handleGetbannerList = async () => {
        setIsLoading(true)
        try {
            const response = await getApi(API_ENDPOINT.get_homeUsageStatus)
            console.log('res::', response)
            if (response?.status === 200) {
                setUsageStatus(response?.data)
                const val = response?.data?.filter(item => item?.type === 'community').map(item => item?.config)
                setIsWeek(val[0]?.isWeek)
                setTwoWeek(val[0]?.isTwoWeek)
                setMonth(val[0]?.isMonth)
                setIsLoading(false)
            }            
        } catch (error) {
            console.log(error)
        }
        finally{
            setIsLoading(false)
        }
    }
    
    useEffect(() => {
        handleGetbannerList()
    }, [])

    const handleGrant = async (id, type) => {
        const val = usageStatus?.findIndex((item) => item?.id === id)
        const res  = [...usageStatus?.slice(0, val),{...usageStatus[val], isEnabled: type==='Grant'  ? 1 : 0},...usageStatus?.slice(val + 1)]

           setUsageStatus(res)
    }


    const postData = async () =>{

        
        const reservation = usageStatus.filter((item) => item.type === "reservationAndRentals")
        const community = usageStatus.filter((item) => item.type === "community")
        const points = usageStatus.filter((item) => item.type === "points")

       const body = {
        reservationAndRentals:{
            id:reservation[0]?.id,
              isEnabled: reservation[0].isEnabled,
              config:{}
        },
        community:{
            id:community[0]?.id,
            isEnabled: community[0]?.isEnabled,
            config:{
                isWeek: Boolean(isWeek),
                isTwoWeek:  Boolean(TwoWeek),
                isMonth:Boolean(month)
            }
        },
        points:{
            id:points[0]?.id,
            isEnabled: points[0]?.isEnabled,
            config:{}
        }
    }
      let url = API_ENDPOINT.update_homeUsageStatus
       try {  
           const res = await putApi(url, body)
             console.log("response", res)
             if(res?.status === 200){
                if(res?.data?.status === 200){
                  enqueueSnackbar('It has been saved',{variant:'success'})
                  setVisible(false)
                  handleGetbannerList()
                }
             }
       } catch (error) {
        
       }
       finally{
        setVisible(false)
       }

    }



    const columns = useMemo(() => [
        {
            Header: 'Order',
            accessor: '',
            Cell: ({ row }) => <p className='text-center '><CIcon icon={cilMenu} size='sm' /></p>
        },
        {
            Header: 'No',
            accessor: '',
            Cell: ({ row }) => {
                return currentPage * itemsPerPage + (row?.index + 1)
            }
        },
        {
            Header: 'Content',
            accessor: '',
            Cell: ({ row }) => <p style={row?.original?.isEnabled === 0 ? {pointerEvents:'none', opacity:'0.4'} : null} className='text-start'>{row?.original?.type}</p>


        },
        {
            Header: 'Show on app',
            accessor: '',
            Cell: ({ row }) => <div className='d-flex gap-4 justify-content-center'>
                <CFormCheck
                    className='d-flex gap-2'
                    label="Grant"
                    type='radio'
                    // name='HomeManagement'
                    name={row?.original?.type}
                    id={row?.original?.id}
                    checked={row?.original?.isEnabled === 1}
                     onClick={() => handleGrant(row?.original?.id, 'Grant')}
                    value={row?.original?.isEnabled}
                />
                <CFormCheck
                    className='d-flex gap-2'
                    label="Deny"
                    type='radio'
                    id={row?.original?.id}
                    name={row?.original?.type}
                    checked={row?.original?.isEnabled === 0}
                    onClick={() => handleGrant(row?.original?.id, 'Deny')}
                    value={row?.original?.isEnabled}
                />
            </div>
        },
    ], [usageStatus])

    return (
        <div>
            <div className='pageTitle mb-3 pb-2'>
                <h2>Home Content Management</h2>
            </div>
            <div className=''>
                <h2>Usage</h2>
            </div>
            {isLoading && <Loader />}
            {usageStatus.length > 0 && <div className='my-3'>
                <ReactTable columns={columns} data={usageStatus} showCheckbox={false} onSelectionChange={() => {}} />
            </div>}
            <div className='card-body'>
                <div className='formWraper'>
                    <div className="form-outline form-white  d-flex ">
                        <div className="formWrpLabel">
                            <label className="fw-bolder ">Counting Period of
                                [Community Best] </label>
                        </div>
                        <div className="d-flex align-items-center  w-100">
                            <div className="push-notification-container gap-3 p-2">
                                <CFormCheck
                                    type="radio"
                                    name="imageType"
                                    defaultChecked={isWeek === true}
                                    onClick={() => {
                                        setIsWeek(true)
                                        setTwoWeek(false)
                                        setMonth(false)
                                    }}
                                    value={true}
                                    label="1 Week"
                                />
                            </div>
                            <div className="push-notification-container gap-3 p-2 align-items-center">
                                <CFormCheck
                                    type="radio"
                                    name="imageType"
                                     defaultChecked={TwoWeek === true}
                                    // onClick={() => {
                                    //     setImageType('linkTo')
                                    //     setPopupImage('')
                                    // }}\
                                    onClick={() => {
                                        setTwoWeek(true)
                                        setIsWeek(false)
                                        setMonth(false)
                                    }}
                                    value={true}
                                    label="2 Weeks"
                                />
                            </div>
                            <div className="d-flex  gap-3 p-2">
                                <CFormCheck
                                    type="radio"
                                    name="imageType"
                                    defaultChecked={month === true}
                                    // onClick={() => {
                                    //     setImageType('popUpImage')
                                    //     setLinkToUrl('')
                                    // }}
                                    onClick={() => {
                                        setMonth(true)
                                        setIsWeek(false)
                                        setTwoWeek(false)
                                    }}
                                    value={true}
                                    label="1 month"
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center mt-5">
                <CCol xs="auto">
                    <CButton onClick={() => setVisible(true)} type="submit" className="mb-3 btn-primary">
                        Save
                    </CButton>
                </CCol>
            </div>
            <CModal
                visible={visible}
                onClose={() => setVisible(false)}
            >
                <CModalHeader>
                    <CModalTitle>Save confirmation</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>Are you sure to save?</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => {setVisible(false);handleGetbannerList()}}>Close</CButton>
                    <CButton color="primary" onClick={postData}>Ok</CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default HomeContentManagement
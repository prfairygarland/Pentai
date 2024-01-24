import { CButton, CFormCheck, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const Library = ({ library, CategoryId, libraryDetails }) => {

    const [data, setData] = useState({
        title: '',
        code: '',
        AssociiatedItems: '',
        isVisible: false,
        rentableDurationWeek:'',
        extendDurationWeek:'',
        pickUpAndReturn:''

    })

    useEffect(() =>{
       setData({
        title:libraryDetails?.name,
        // code: libraryDetails?,
        AssociiatedItems: libraryDetails?.associatedItem,
        isVisible: libraryDetails?.visibility,
        rentableDurationWeek:libraryDetails?.rentableDurationWeek,
        extendDurationWeek:libraryDetails?.extendDurationWeek,
        pickUpAndReturn:libraryDetails?.pickUpAndReturn
       })
    }, [libraryDetails])

    console.log('ids', CategoryId)
    console.log('data', data)

    const updateGenre = async () =>{
       let url = `${API_ENDPOINT.update_Genre}?id=${CategoryId}`
       const body = {
        id:CategoryId,
        name:data.title ?  data.title : '',
        associatedItem:data.AssociiatedItems ? data.AssociiatedItems : '',
        visibility: data.isVisible === true ? 'visible' : 'hide',
        rentableDurationWeek:data.rentableDurationWeek ?  data.rentableDurationWeek : '',
        extendDurationWeek: data.extendDurationWeek ?  data.extendDurationWeek : '',
        pickUpAndReturn: data.pickUpAndReturn ? data.pickUpAndReturn : ''
       }

       console.log('body', body)
       const res = await putApi(url, CategoryId, body)
       if(res.status === 200){
        console.log('res', res.data)
       }
       else{
        console.log('Api fail')
       }
    }

    const updateLibrary = async () =>{
        const body = {
         id:libraryDetails.id,
         name:data.title ?  data.title : '',
         associatedItem:data.AssociiatedItems ? data.AssociiatedItems : '',
         visibility: data.isVisible === true ? 'visible' : 'hide',
         rentableDurationWeek:data.rentableDurationWeek ?  data.rentableDurationWeek : '',
         extendDurationWeek: data.extendDurationWeek ?  data.extendDurationWeek : '',
         pickUpAndReturn: data.pickUpAndReturn ? data.pickUpAndReturn : ''
        }
 
        console.log('body', body)
        const res = await putApi(API_ENDPOINT.update_libraries, libraryDetails.id, body)
        if(res.data.status === 200){
            enqueueSnackbar("Library updates successfully", { variant: "success" })
         console.log('res', res.data)
        }
        else{
         console.log('Api fail')
         enqueueSnackbar("Failed to update library", { variant: "error" })
        }
     }

    const handleRentalDuration = (e) =>{
        setData((prev) =>{
           return{
            ...prev,
            rentableDurationWeek: e.target.value
           } 

        })
    }

    const handleExtendDuration = (e) =>{
        setData((prev) =>{
           return{
            ...prev,
            extendDurationWeek: e.target.value
           } 

        })
    }



    const handleChangeTitle = (e) => {
        setData((prev) => {
            return {
                ...prev,
                title: e.target.value
            }
        })
    }

    const handleAssociatedItem = (e) =>{
        setData((prev) => {
            return {
                ...prev,
                AssociiatedItems: e.target.value
            }
        })
    }

    const handleChangePickUpPoint = (e) => {
        setData((prev) => {
            return {
                ...prev,
                pickUpAndReturn: e.target.value
            }
        })
    }

    // console.log('data', data)

    return (
        <div style={{ width: '100%', borderRadius: '0' }}>
            <div className="card p-2">
                <div className="dropdown-container">
                    <label className="me-3">Library</label>
                </div>
                <div className="card-body">
                    <div className="formWraper">
                        <div className="form-outline form-white   d-flex ">
                            <div className="formWrpLabel">
                                <label className="fw-bolder ">
                                    Library Name
                                </label>
                            </div>
                            <div className="formWrpInpt">
                                <div className="d-flex formradiogroup mb-2 gap-3">
                                    <CFormInput
                                        type="text"
                                        placeholder="Library"
                                        name="title"
                                        value={data.title}
                                        onChange={handleChangeTitle}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-outline form-white  d-flex ">
                            <div className="formWrpLabel">
                                <label className="fw-bolder ">
                                    Associated Items
                                </label>
                            </div>
                            <div className="formWrpInpt">
                                <div className="d-flex formradiogroup mb-2 gap-3">
                                    <input type='number' value={data.AssociiatedItems} onChange={handleAssociatedItem} />
                                </div>
                            </div>
                        </div>
                        <div className="form-outline formWrpLabel form-white d-flex justify-content-end bg-light">
                            <p style={{ padding: '2%' }}>Default settings</p>
                        </div>
                        <div className="form-outline form-white  d-flex ">
                            <div className="formWrpLabel">
                                <label className="fw-bolder ">
                                    Rental Duration
                                </label>
                            </div>
                            <div className="formWrpInpt">
                                <div className="d-flex formradiogroup mb-2 align-items-center  justify-content-center gap-5">
                                    <p>
                                        Rentable weeks
                                    </p>
                                    <p>
                                        <CFormInput value={data.rentableDurationWeek} onChange={handleRentalDuration} placeholder='0' type='number'
                                            style={{ width: '30%' }} />
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="form-outline form-white  d-flex ">
                            <div className="formWrpLabel">
                                <label className="fw-bolder ">
                                    Extend Duration
                                </label>
                            </div>
                            <div className="formWrpInpt">
                                <div className="d-flex formradiogroup mb-2 align-items-center  justify-content-center gap-5">
                                    <p>
                                        Rentable weeks
                                    </p>
                                    <p>
                                        <CFormInput value={data.extendDurationWeek} onChange={handleExtendDuration} placeholder='0' type='number'
                                            style={{ width: '30%' }} />
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='formWrpLabel' />
                        <div className="d-flex col-md-12">
                            <div className="form-outline form-white d-flex col-md-6">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">Visibility</label>
                                </div>
                                <div className="push-notification-container gap-3">
                                    <CFormCheck
                                        type="radio"
                                        name="isVisible"
                                        // defaultChecked={data.isVisible}
                                        onChange={() => setData((prev) => ({ ...prev, isVisible: true }))}
                                        label="Yes"
                                        value={true}
                                        checked={data.isVisible === true}
                                    //   disabled={location?.state?.postId ? true : false}
                                    />
                                    <CFormCheck
                                        type="radio"
                                        name="isVisible"
                                        // defaultChecked={!data.isVisible}
                                        onClick={() => setData((prev) => ({ ...prev, isVisible: false }))}
                                        label="No"
                                        value={false}
                                    // checked={data.isVisible === false}
                                    //   disabled={location?.state?.postId ? true : false}
                                    />
                                </div>
                            </div>
                            <div className="form-outline form-white d-flex col-md-6">
                            </div>
                        </div>
                        <div className="form-outline form-white  d-flex ">
                            <div className="formWrpLabel">
                                <label className="fw-bolder ">
                                    Point of pick and return
                                </label>
                            </div>
                            <div className="formWrpInpt">
                                <div className="d-flex formradiogroup mb-2 gap-3">
                                    <CFormInput
                                        type="text"
                                        placeholder=""
                                        name="title"
                                        value={data.pickUpAndReturn}
                                        onChange={handleChangePickUpPoint}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5%', gap: 10 }}>
                <CButton style={{ marginRight: '2%', background: '#ccc', border: 'none' }}>Cancel</CButton>
                <CButton onClick={updateLibrary}>Save</CButton>
            </div>
        </div>
    )
}

export default Library
import { CButton, CFormCheck, CFormInput, CFormSelect, CFormSwitch } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-date-picker'
import { deleteApi, postApi, putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const SeriesCategory = ({ subCategoryID, setStateUpdate, subCategoryDetail, categoryID }) => {

    const [title, setTitle] = useState('')

    // console.log('title', title)

    console.log('ca', categoryID)

    useEffect(() => {
        if (subCategoryID) {
            setTitle(subCategoryDetail?.name)
        }
        else {
            setTitle('')
        }
    }, [subCategoryDetail, subCategoryID])




    const CreateSubCategories = async () => {
        let url = API_ENDPOINT.create_subCategories

        const body = {
            categoryId: categoryID,
            name: title
        }


        const res = await postApi(url, body)
        if (res?.data?.status === 200) {
            setStateUpdate((prev) => prev + 1)
            console.log('created sucessfull')
        }
        else {
            console.log('failed to create')
        }
    }

    const deleteSubCategory = async () => {
        let url = `$${API_ENDPOINT.delete_subCategories}?id=`

        const res = await deleteApi(url, 22)
        if (res?.data?.status === 200) {
            setStateUpdate((prev) => prev + 1)
            console.log('delete sucessfull')
        }
        else {
            console.log('failed to delete')
        }

    }

    const updateSubCategory = async () =>{
        let url = `${API_ENDPOINT.update_Subcategory}`

        const body = {
            id:'',
            categoryId:'',
            name:''
        }

        const res = await putApi(url)
        if(res.data.status===200){
            alert('updated')
        }
        else{
            alert('fail to update')
        }
    }

    return (
        <div style={{ width: '100%' }}>
            <h1>SeriesCategory</h1>
            <div className='d-flex justify-content-end mb-4'>
                <CButton onClick={deleteSubCategory}>Delete</CButton>
            </div>
            <div className="card-body">
                <div className="formWraper">
                    <div className="form-outline form-white d-flex ">
                        <div className="formWrpLabel" >
                            <label className="fw-bolder">
                                Title
                            </label>
                        </div>
                        <div className="formWrpInpt d-flex">
                            <div className="d-flex formradiogroup col-md-12 mb-2 gap-3">
                                <CFormInput
                                    type='text'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5%', gap: 10 }}>
                <CButton style={{ marginRight: '2%', background: '#ccc', border: 'none' }}>Cancel</CButton>
                <CButton onClick={subCategoryID ?  updateSubCategory :  CreateSubCategories}>Save</CButton>
            </div>
        </div>
    )
}

export default SeriesCategory
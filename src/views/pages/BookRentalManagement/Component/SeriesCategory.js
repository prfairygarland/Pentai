import { enqueueSnackbar } from 'notistack'
import { CButton, CFormCheck, CFormInput, CFormSelect, CFormSwitch, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-date-picker'
import { deleteApi, postApi, putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const SeriesCategory = ({ subCategoryID, setSideSubBookBarId, setIconSubBookSet, setSideSubBarId, setIconSubSet, setIconSet, setSideBarId, setStateUpdate, subCategoryDetail, categoryID, setCategories }) => {

    const [title, setTitle] = useState('')
    const [deleteVisible, setdeleteVisible] = useState(false)

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

        if (title.trim() === '') {
            enqueueSnackbar('Please enter the title', { variant: 'error' })
            return false
        }
        const res = await postApi(url, body)
        if (res?.data?.status === 200) {
            setStateUpdate((prev) => prev + 1)
            enqueueSnackbar('series created successfully', { variant: 'success' })
            setCategories('AllCuration')
            setIconSet(null)
            setIconSubSet(null)
            setSideSubBookBarId(null)
            setIconSubBookSet(null)
            setSideBarId(null)
            setSideSubBarId(null)
        }
        else {
            enqueueSnackbar('Failed to create series', { variant: 'error' })
        }
    }

    const deleteSubCategory = async () => {
        let url = `${API_ENDPOINT.delete_subCategories}?id=`

        const res = await deleteApi(url, subCategoryDetail?.id)
        if (res?.data?.status === 200) {
            setStateUpdate((prev) => prev + 1)
            enqueueSnackbar('Deleted successfully', { variant: 'success' })
            setCategories('AllCuration')
            setIconSet(null)
            setIconSubSet(null)
            setSideSubBookBarId(null)
            setIconSubBookSet(null)
            setSideBarId(null)
            setSideSubBarId(null)
        }
        else {
            enqueueSnackbar('Failed to delete', { variant: 'error' })
        }

    }

    const updateSubCategory = async () => {
        let url = `${API_ENDPOINT.update_Subcategory}`

        const body = {
            id: subCategoryDetail?.id,
            categoryId: categoryID,
            name: title
        }

        const res = await putApi(url, body)
        if (res?.data?.status === 200) {
            enqueueSnackbar('updated successfully', { variant: 'success' })
            setStateUpdate((prev) => prev + 1)
            setCategories('AllCuration')
            setdeleteVisible(false)
            setIconSet(null)
            setIconSubSet(null)
            setSideSubBookBarId(null)
            setIconSubBookSet(null)
            setSideBarId(null)
            setSideSubBarId(null)
        }
        else {
            enqueueSnackbar('failed to update category', { variant: 'error' })
        }
    }

    const handleCancel = () => {
        setCategories('AllCuration')
        setTitle('')
        setIconSet(null)
        setIconSubSet(null)
        setSideSubBookBarId(null)
        setIconSubBookSet(null)
        setSideBarId(null)
        setSideSubBarId(null)
    }


    return (
        <div style={{ width: '100%' }}>
            <h1>SeriesCategory</h1>
            <div className='d-flex justify-content-end mb-4'>
                <CButton onClick={() => setdeleteVisible(true)}>Delete</CButton>
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
                <CButton onClick={handleCancel} style={{ marginRight: '2%', background: '#ccc', border: 'none' }}>Cancel</CButton>
                <CButton onClick={subCategoryID ? updateSubCategory : CreateSubCategories}>Save</CButton>
            </div>
            <CModal
                backdrop="static"
                visible={deleteVisible}
                onClose={() => setdeleteVisible(false)}
                aria-labelledby="StaticBackdropExampleLabel"
            >
                <CModalHeader>
                    <CModalTitle id="StaticBackdropExampleLabel">Delete</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>Are you sure you want to delete this category?
                        <br />
                        All categories and items belonging will be deleted.</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={deleteSubCategory}>Delete</CButton>
                    <CButton color="secondary" onClick={() => setdeleteVisible(false)}>
                        Cancel
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default SeriesCategory
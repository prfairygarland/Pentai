import { CButton, CCol, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { enqueueSnackbar } from 'notistack'
import React, { useState } from 'react'
import { useEffect } from 'react'
import Loader from 'src/components/common/Loader'
import { deleteApi, getApi, postApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const GreetingMessageManagement = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [inputList, setInputList] = useState([''])
    const [visible, setVisible] = useState(false)
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [index, setIndex] = useState(null)
    const [GreetingMessages, setGreetingMessages] = useState([])


    const handleRemoveInput = async () => {
        if (deleteID) {
            let url = `${API_ENDPOINT.delete_GreetingMessages}?id=${deleteID}`
            try {
                const response = await deleteApi(url)
                if (response?.data?.status === 200) {
                    enqueueSnackbar('Message deleted successfully', { variant: 'success' })
                    handleGetGreetingMessages()
                    setDeleteVisible(false)
                }
                else {
                    enqueueSnackbar('Failed to delete the message', { variant: 'error' })
                    setDeleteVisible(false)
                }
            } catch (error) {
                console.log(error)
            }
        }
        else {
            const newList = [...GreetingMessages];
            newList.splice(index, 1);
            setGreetingMessages(newList)
            setDeleteVisible(false)
        }

    }

    const handleAddInput = () => {
        if (GreetingMessages.length < 5) {
            setGreetingMessages([...GreetingMessages, { description: '' }])
        }
        else {
            enqueueSnackbar('You can’t create more than five', { variant: 'error' })
        }
    }

    console.log('deleteID', deleteID)

    const handleInputChange = (index, value) => {
        // const newList = [...GreetingMessages];
        const inputValue = value.substring(0, 40)
        const newList = GreetingMessages.map((obj, i) => index === i ? { ...obj, description: inputValue } : obj)
        console.log(newList)
        // newList[index] = value.substring(0, 40);
        setGreetingMessages(newList)
    }

    const saveAllInputMessage = () => {
        const value = GreetingMessages.every((input) => input.description.trim() !== '');
        console.log('value', value)
        if (value) {
            setVisible(true)
        }
        else {
            enqueueSnackbar('Please delete or enter an empty input box', { variant: 'error' })
        }
    }

    const handleSave = () => {
        handleCreateGreetingMessages()
        setVisible(false)

    }


    const handleGetGreetingMessages = async () => {
        setIsLoading(true)
    
        try {
            const response = await getApi(API_ENDPOINT.get_GreetingMessages)
            if (response?.status === 200) {
                setGreetingMessages(response?.data)
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        handleGetGreetingMessages()
    }, [])

    const handleCreateGreetingMessages = async () => {
        setIsLoading(true)
        let url = API_ENDPOINT.create_GreetingMessages

        const des = GreetingMessages.map((item) => item.description)

        const body = {
            description: des
        }

        console.log('body', body)

        console.log('body', body)

        try {
            const response = await postApi(url, body)
            if (response?.data?.status === 200) {
                // enqueueSnackbar('Greeting message created successfully', {variant:'success'})
                enqueueSnackbar('It has been saved', { variant: 'success' })
                handleGetGreetingMessages()
                setIsLoading(false)
            }
            else {
                enqueueSnackbar('Failed to create Greeting message', { variant: 'error' })
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div className='pageTitle mb-3 pb-2'>
                <h2>Greeting Message Management</h2>
            </div>
            {isLoading && <Loader />}
            <div className="formWraper mt-3">
                <div className="form-outline form-white  d-flex ">
                    <div className="formWrpLabel">
                        <label className="fw-bolder ">Greeting Message</label>
                    </div>
                    <div className="formWrpInpt">
                        <div className="d-flex w-100 mt-4 flex-column">
                            <div style={{ height: '300px' }} className="prowordsection">
                                <div className="d-flex flex-wrap">
                                    {inputList &&
                                        GreetingMessages.map((value, index) => (
                                            <div className="d-flex gap-3 w-100 m-2" key={index}>
                                                <CFormInput type='text' placeholder='Enter the Message' value={value.description} onChange={(e) => handleInputChange(index, e.target.value)} />
                                                <span className="txt-byte-information">
                                                    {value.description?.length ? value.description?.length : 0} / 40 byte
                                                </span>
                                                {GreetingMessages.length > 1 && <button onClick={() => { setDeleteID(value?.id); setDeleteVisible(true); setIndex(index) }}>
                                                    <i className='icon-close'></i>
                                                </button>}
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mt-2">
                                <CCol xs="auto">
                                    <CButton type="submit" disabled={GreetingMessages.length >= 5} onClick={handleAddInput} className="mb-3 btn-black">
                                        add
                                    </CButton>
                                </CCol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center mt-2">
                <CCol xs="auto">
                    <CButton onClick={saveAllInputMessage} type="submit" className="mb-3">
                        Save
                    </CButton>
                </CCol>
            </div>
            <CModal
                visible={visible}
                onClose={() => setDeleteVisible(false)}
            >
                <CModalHeader>
                    <CModalTitle>Save confirmation</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>Are you sure to save?</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                    <CButton color="primary" onClick={handleSave}>Ok</CButton>
                </CModalFooter>
            </CModal>
            <CModal
                visible={deleteVisible}
                onClose={() => setDeleteVisible(false)}
            >
                <CModalHeader>
                    <CModalTitle>Delete confirmation</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>Are you sure you want to delete</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setDeleteVisible(false)}>Close</CButton>
                    <CButton color="primary" onClick={handleRemoveInput}>Ok</CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default GreetingMessageManagement
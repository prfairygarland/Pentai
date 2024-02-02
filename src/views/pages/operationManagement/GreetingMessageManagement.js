import { CButton, CCol, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { enqueueSnackbar } from 'notistack'
import React, { useState } from 'react'

const GreetingMessageManagement = () => {

    const [inputList, setInputList] = useState([''])
    const [value, setValue] = useState('')
    const [visible, setVisible] = useState(false)

    const handleRemoveInput = (index) => {
        const newList = [...inputList];
        newList.splice(index, 1);
        setInputList(newList)
    }

    const handleAddInput = () => {
        if (inputList.length < 5) {
            setInputList([...inputList, ''])
        }
        else {
            enqueueSnackbar('You can’t create more than five', { variant: 'error' })
        }
    }

    const handleInputChange = (index, value) => {
        const newList = [...inputList];
        newList[index] = value;
        setInputList(newList)
    }

    const saveAllInputMessage = () => {
        const value = inputList.every((input) => input.trim() !== '');
        if (value) {
            setVisible(true)
        }
        else {
            enqueueSnackbar('Please delete or enter an empty input box', { variant: 'error' })
        }
    }

    const handleSave = () =>{
        setVisible(false)
        enqueueSnackbar('It has been saved', {variant: 'success'})
    }

    return (
        <div>
            <div className='pageTitle mb-3 pb-2'>
                <h2>Greeting Message Management</h2>
            </div>
            <div className="formWraper mt-3">
                <div className="form-outline form-white  d-flex ">
                    <div className="formWrpLabel">
                        <label className="fw-bolder ">Greetings</label>
                    </div>
                    <div className="formWrpInpt">
                        <div className="d-flex w-100 mt-4 flex-column">
                            <div className="prowordsection">
                                <div className="d-flex flex-wrap">
                                    {inputList &&
                                        inputList.map((value, index) => (
                                            <div className="d-flex gap-3 w-100 m-2" key={index}>
                                                <CFormInput type='text' placeholder='Enter the Message' value={value} onChange={(e) => handleInputChange(index, e.target.value)} />
                                                {inputList.length > 1 && <button onClick={() => handleRemoveInput(index)}>
                                                    <i className='icon-close'></i>
                                                </button>}
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mt-2">
                                <CCol xs="auto">
                                    <CButton type="submit" onClick={handleAddInput} className="mb-3 btn-black">
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
            onClose={() => setVisible(false)}
            >
            <CModalHeader>
              <CModalTitle>React Modal title</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <p>Are you sure to save?</p>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary">Close</CButton>
              <CButton color="primary" onClick={handleSave}>Ok</CButton>
            </CModalFooter>
          </CModal>
        </div>
    )
}

export default GreetingMessageManagement
import { CButton, CCol, CFormCheck, CFormInput } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { getApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const UsageSetting = (props) => {
    console.log('UsageSetting')
    const [radioGroupValue, setradioGroupValue] = useState({
        bulletin_board: '1',
        club_board: '1',
        welfare_board: '1'
    })
    const [prohabitedWords, setProhabitedWords] = useState([])
    const [addInputValue, setAddInputValue] = useState('')
    const [isLoading,setIsLoading] = useState(false)

    useEffect(() => {
        getUsageStatus()
        getProhabitedWords()
    }, [])

    console.log('radioGroupValue', radioGroupValue)
    const handleRadioCheck = (event) => {
        const value = event.target.value
        const groupName = event.target.name
        setradioGroupValue((prev => {
            return {
                ...prev,
                [groupName]: value
            }
        }))
    }

    const getUsageStatus = async () => {
        try {
            const res = await getApi(API_ENDPOINT.get_board_usage_setting)
            console.log('getapi usage status');
            if (res.status === 200) {

            }
        } catch (error) {
            console.log(error)
        }
    }

    const getProhabitedWords = async () => {

        try {
            const res = await getApi(API_ENDPOINT.get_prohabited_words)
            console.log('getapi prohabited Words', res);
            if (res.status === 200) {
                setProhabitedWords(res.data)
            }
        } catch (error) {
            console.log(error);
        }

    }

    const handleRemoveWord = (id) => {
        console.log(id)
        const filterdWord = prohabitedWords.filter((word) => word.id != id)
        setProhabitedWords(filterdWord)
    }

    const handleRemoveAllWords = () => {
        setProhabitedWords([])
    }
    
    const handleAddInput = (event) => {
        const value = event.target.value 
        setAddInputValue(value)
    }

    const addProhabitedWord = () => {
        console.log(addInputValue) 
    }


    const disableStyle = {
        'pointer-events': 'none',
        opacity: 0.4
    }
    return (
        <section>
            <div className='formWraper mt-3'>
                <div className="form-outline form-white  d-flex ">
                    <div className='formWrpLabel'>
                        <label className="fw-bolder ">Usage status</label>
                    </div>
                    <div className='formWrpInpt'>
                        {<div className='d-flex formradiogroup mb-2' style={radioGroupValue.club_board === '0' && radioGroupValue.welfare_board === '0' ? disableStyle : {}}>
                            <label className='radiolabel' htmlFor="Bulletin board">Bulletin board​</label>
                            <CFormCheck type="radio" name="bulletin_board" id="exampleRadios1" checked={radioGroupValue.bulletin_board === '1'} onChange={handleRadioCheck} value="1" label="Grant" />
                            <CFormCheck type="radio" name="bulletin_board" id="exampleRadios2" checked={radioGroupValue.bulletin_board === '0'} onChange={handleRadioCheck} value="0" label="Deny" />
                        </div>}
                        <div className='d-flex formradiogroup mb-2' style={radioGroupValue.bulletin_board === '0' && radioGroupValue.welfare_board === '0' ? disableStyle : {}}>
                            <label className='radiolabel' htmlFor="Club board">Club board​</label>
                            <CFormCheck type="radio" name="club_board" id="exampleRadios1" checked={radioGroupValue.club_board === '1'} onChange={handleRadioCheck} value="1" label="Grant" />
                            <CFormCheck type="radio" name="club_board" id="exampleRadios2" checked={radioGroupValue.club_board === '0'} onChange={handleRadioCheck} value="0" label="Deny" />
                        </div>
                        <div className='d-flex formradiogroup mb-2' style={radioGroupValue.club_board === '0' && radioGroupValue.bulletin_board === '0' ? disableStyle : {}}>
                            <label className='radiolabel' htmlFor="Welfare board​">Welfare board​</label>
                            <CFormCheck type="radio" name="welfare_board" id="exampleRadios1" checked={radioGroupValue.welfare_board === '1'} onChange={handleRadioCheck} value="1" label="Grant" />
                            <CFormCheck type="radio" name="welfare_board" id="exampleRadios2" checked={radioGroupValue.welfare_board === '0'} onChange={handleRadioCheck} value="0" label="Deny" />
                        </div>
                    </div>
                </div>

                <div className="form-outline form-white  d-flex "> 
                    <div className='formWrpLabel'>
                        <label className="fw-bolder ">Prohibited Words</label>
                    </div>
                    <div className='formWrpInpt'>
                        <div className='prohabitinfo'>
                            <p>※ Guide for setting prohibited words on Community.</p>
                            <p>1. If prohibited words are set, the corresponding prohibited words are equally applied to all boards and sub-boards in community.</p>
                            <p>2. Prohibited words cannot be included in the board/club name, post, or comment.</p>
                        </div>
                        <div className='d-flex w-100 mt-4'>
                            <CCol xs="auto" className='w-75 me-3'>
                                <CFormInput type="text" id="inputPassword2" onChange={handleAddInput} placeholder="Please enter prohibited words" />
                            </CCol>
                            <CCol xs="auto">
                                <CButton type="submit" onClick={addProhabitedWord} className="mb-3 btn-dark">
                                    Add
                                </CButton>
                            </CCol>
                        </div>
                        <div className='d-flex w-100 mt-4 flex-column'>
                            <div className='prowordsection'>
                                <div className='d-flex flex-wrap'>
                                    {prohabitedWords && prohabitedWords.map((word,i) => (
                                        <div className='prohibitword m-2' key={i}>
                                            <p>{word.word} </p>
                                            <button onClick={()=>handleRemoveWord(word.id)}><span>x</span></button>
                                        </div>
                                    ))}
                                    {/* <div className='prohibitword m-2'>
                                        <span>Test123<button>x</button></span>
                                    </div>
                                    <div className='prohibitword m-2'>
                                        <span>Test-1234 <button>x</button></span>
                                    </div> */}
                                </div>
                            </div>
                            <div className='d-flex justify-content-end mt-2'>
                                <CCol xs="auto">
                                    <CButton type="submit" onClick={handleRemoveAllWords} className="mb-3 text-white bg-dark">
                                        Delete All
                                    </CButton>
                                </CCol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className='d-flex justify-content-center'>
                <CCol xs="auto">
                    <CButton type="submit" className="mb-3 text-white bg-dark">
                        Save
                    </CButton>
                </CCol>
            </div>
        </section>
    )
}

export default UsageSetting

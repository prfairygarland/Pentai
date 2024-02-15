import React from "react"
import { CButton } from "@coreui/react"
import { useNavigate } from "react-router-dom"

const LuckyDrawEventManagement = () => {
    const navigate = useNavigate()
    const registrationHandler = () => {
        navigate('../LuckyDrawEventRegistration')
    }
    return (
        <>
            <div>
                <CButton className='btn-success' onClick={registrationHandler}>Registration</CButton>
            </div>
            <div>
                Listing
            </div>
        </>
    )
}

export default LuckyDrawEventManagement
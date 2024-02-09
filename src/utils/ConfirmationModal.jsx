import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React from 'react'

const ConfirmationModal = (props) => {
  const closeHandler = () => {
    if (props?.modalProps?.modalCloseHandler) {
      props?.modalProps?.modalCloseHandler(false)
    }
  }
  return (
    <CModal
      alignment="center"
      visible={props?.modalProps?.isModalOpen}
      onClose={() => closeHandler()}
      aria-labelledby="LiveDemoExampleLabel"
    >
      <CModalHeader onClose={() => closeHandler()} style={{ borderWidth: 0 }}>
        <CModalTitle>{props?.modalProps?.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p className="text-center">{props?.modalProps?.content}</p>
      </CModalBody>
      <CModalFooter className="d-flex justify-content-center gap-2">
        {props?.modalProps?.cancelBtn && (
          <>
            <CButton className="btn-black" onClick={props?.modalProps?.cancelBtnHandler}>
              {props?.modalProps?.cancelBtn}
            </CButton>
          </>
        )}
        {props?.modalProps?.successBtn && (
          <CButton onClick={props?.modalProps?.successBtnHandler}>
            {props?.modalProps?.successBtn}
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  )
}

export default ConfirmationModal

import { CButton, CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
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
      <CModalHeader onClose={() => closeHandler()}>
        <CModalTitle>{props?.modalProps?.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>{props?.modalProps?.content}</div>
        <div className="d-flex justify-content-end">
          {props?.modalProps?.cancelBtn && (
            <>
              <CButton onClick={props?.modalProps?.cancelBtnHandler}>
                {props?.modalProps?.cancelBtn}
              </CButton>
              &nbsp;
            </>
          )}
          {props?.modalProps?.successBtn && (
            <CButton onClick={props?.modalProps?.successBtnHandler}>
              {props?.modalProps?.successBtn}
            </CButton>
          )}
        </div>
      </CModalBody>
    </CModal>
  )
}

export default ConfirmationModal

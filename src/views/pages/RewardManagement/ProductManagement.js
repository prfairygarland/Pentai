import { CButton, CFormSelect } from '@coreui/react'
import React from 'react'

const ProductManagement = () => {
    return (
      <div>
          <div className='container p-3 justify-align-content-around w-100 mt-3'>
         <div className='d-flex '>
             <div className='d-flex  align-items-center justify-content-between w-100 gap-3 '>
             <div className="col-md-12">
                         <div className="d-flex form-inline w-100">
                             <input className="form-control mr-sm-10 me-2"  type="search" placeholder="Product Name" aria-label="Search" />
                         </div>
                     </div>
                 <CButton className="btn btn-primary my-2 my-sm-0" type="submit" >Search</CButton>
  
             </div>
  
             <div className='d-flex  align-items-center justify-content-between w-100 gap-3 '>
                 <div className='d-flex  align-items-center gap-3 w-100'>
                 </div>
                 <CButton className="w-50" type="submit" >Registration</CButton>
             </div>
         </div>
             <p className='mt-3 mb-3'>Total : </p>
          <div>
          </div>
     </div>
      </div>
    )
  }
  
  export default ProductManagement
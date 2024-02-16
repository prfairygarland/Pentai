import { CButton } from '@coreui/react'
import React, { useState } from 'react'
import ProductManagementRegistration from './ProductManagementRegistration'

const ProductManagement = () => {

    const [productModal, setProductModal] = useState(false)
    const [productData, setProductData] = useState({
        prodTitle : '',
        prodPrice : '',
        imagePath : ''
    })

    const viewHandler = (prodTitle, prodPrice, imagePath) => {
        setProductData(prodTitle, prodPrice, imagePath)
        setProductModal(true)
    }
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
                 <CButton className="w-50" type="button" onClick={() => setProductModal(true)} >Registration</CButton>
             </div>
         </div>
             <p className='mt-3 mb-3'>Total : </p>
          <div>
          </div>
     </div>

     {
        productModal && <ProductManagementRegistration show={productModal} setShow={setProductModal} productData={productData} />
     }
      </div>
    )
  }
  
  export default ProductManagement
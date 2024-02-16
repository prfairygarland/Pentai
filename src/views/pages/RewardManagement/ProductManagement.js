import { CButton, CFormSelect, CFormSwitch } from '@coreui/react'
import moment from 'moment/moment'
import React, { useEffect, useMemo, useState } from 'react'
import ReactTable from 'src/components/common/ReactTable'
import { getApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import { imageUrl } from '../BookRentalManagement/BookRentalStatus'
import Loader from 'src/components/common/Loader'
import ReactPaginate from 'react-paginate'
import ProductManagementRegistration from './ProductManagementRegistration'

const ProductManagement = () => {

    const initialData = {
        search: '',
    }

    // const navigate = useNavigate()
    const [filterData, setFilterData] = useState(initialData)
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [RewardProduct, setRewardProduct] = useState([])
    const [productModal, setProductModal] = useState(false)
    const [productData, setProductData] = useState({
        prodTitle : '',
        prodPrice : '',
        imagePath : ''
    })

    const viewHandler = (prodTitle, prodPrice, imagePath) => {
        setProductData({prodTitle, prodPrice, imagePath})
        setProductModal(true)
    }

    const perPageValue = [
        { label: '10', value: 10 },
        { label: '30', value: 30 },
        { label: '50', value: 50 },
        { label: '100', value: 100 }

    ]

    const handleSearch = (e) => {
        const value = e.target.value
        setFilterData((prev) => {
            return {
                ...prev,
                search: value
            }
        })
    }

      useEffect(() => {
        getRewardProduct()
      }, [itemsPerPage, currentPage, filterData.Status])

    useEffect(() => {
        if (filterData?.search === '') {
            getRewardProduct()
        }
    }, [filterData.search])

    const getRewardProduct = async () => {
        setIsLoading(true)
        try {
            let url =   API_ENDPOINT.getRewardProduct + `?pageNo=${currentPage + 1}&pageSize=${itemsPerPage}`

            if (filterData?.search) {
                url = url + `&searchTerm=${filterData?.search}`
            }

            const response = await getApi(url)
            console.log('getproduct', response)
            if (response?.status === 200) {
                setRewardProduct(response?.data)
                setTotalPages(Math.ceil(response?.total / Number(itemsPerPage)))
                setIsLoading(false)
            } else {
                setRewardProduct([])
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected)
    }


    useEffect(() => {
        getRewardProduct()
    }, [])

    const columns = useMemo(() => [

        {
            Header: "Image",
            accessor: 'image',
            Cell: ({ row }) => <img crossOrigin='anonymous' src={row?.original?.image ? imageUrl + row?.original?.image : null} alt=" " />
        },
        {
            Header: "Product name",
            accessor: 'status',
            Cell: ({ row }) => <p style={{ textTransform: 'capitalize', cursor:'pointer' }} onClick={() => viewHandler(row?.original?.label, row?.original?.price, row?.original?.image)} className='text-center'>{row.original.label ? row.original.label : '-'}</p>
        },
        {
            Header: "Price",
            accessor: 'price',
            Cell: ({ row }) => <a className='Livetitle' style={{ cursor: 'pointer' }}> {row.original.price ? row.original.price : '-'}</a>
        },
        {
            Header: "Creator",
            accessor: '',
            Cell: ({ row }) => <p className='text-center'>{row.original.authorName ? row.original.authorName : '-'}</p>
        },
        {
            Header: '',
            accessor: 'switch',
            Cell: ({ row }) => <CFormSwitch
                id="club_banner"
                className="cFormSwitch"
                defaultChecked={row.original.isEnabled === 1}
            />
        }

    ], [currentPage, itemsPerPage])


    
    return (
        <div>
            {isLoading && <Loader />}
            <div className='container p-3 justify-align-content-around w-100 mt-3'>
                <div className='d-flex '>
                    <div className='d-flex  align-items-center justify-content-between w-100 gap-3 '>
                        <div className="col-md-12">
                            <div className="d-flex form-inline w-100">
                                <input value={filterData.search} onChange={handleSearch} className="form-control mr-sm-10 me-2" type="search" placeholder="Product Name" aria-label="Search" />
                            </div>
                        </div>
                    </div>
                    <CButton type="button" onClick={getRewardProduct} className="btn btn-primary" >Searching</CButton>

                    <div className='d-flex  align-items-center justify-content-between w-100 gap-3 '>
                        <div className='d-flex  align-items-center gap-3 w-100'>
                        </div>
                        <CButton className="w-50" type="button" onClick={() => {setProductModal(true); setProductData({})}} >Registration</CButton>
                    </div>
                </div>
                <p className='mt-3 mb-3'>Total : </p>
                <div>
                    <ReactTable columns={columns} data={RewardProduct} showCheckbox={false} onSelectionChange={() => { }} />
                </div>
                <p className='text-end'>*Reflected as soon as the toggle is ON/OFF.</p>
                {RewardProduct.length > 0 &&
                    <div className='d-flex w-100 justify-content-center mt-3  gap-3'>
                        <div className='d-flex gap-3'>
                            <div className='userlist-pagination'>
                                <div className='userlist-pagination dataTables_paginate'>
                                    <ReactPaginate
                                        breakLabel={'...'}
                                        marginPagesDisplayed={1}
                                        previousLabel={<button>Previous</button>}
                                        nextLabel={<button>Next</button>}
                                        pageCount={totalPages}
                                        onPageChange={handlePageChange}
                                        forcePage={currentPage}
                                        renderOnZeroPageCount={null}
                                        pageRangeDisplayed={4}
                                    />
                                </div>

                            </div>
                            <div className='d-flex align-items-center gap-2'>
                                <label>Show</label>
                                <CFormSelect
                                    className=''
                                    aria-label=""
                                    value={itemsPerPage}
                                    options={perPageValue}
                                    onChange={(event) => {
                                        setItemsPerPage(parseInt(event?.target?.value));
                                        setCurrentPage(0)
                                    }}
                                />
                                <label>Lists</label>
                            </div>
                        </div>
                    </div>
                }
            </div>
  
     {
        productModal && <ProductManagementRegistration show={productModal} setShow={setProductModal} productData={productData} />
     }
      </div>
    )
}

export default ProductManagement
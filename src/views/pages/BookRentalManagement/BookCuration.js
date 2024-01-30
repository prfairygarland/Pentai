import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem, CBadge, CButton, CFormCheck, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CNavGroup, CNavItem, CNavTitle, CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import { API_ENDPOINT } from 'src/utils/config'
import { deleteApi, getApi, getUserListExportData, putApi } from 'src/utils/Api'
import ReactTable from 'src/components/common/ReactTable'
import { cilArrowThickRight, cilCaretBottom, cilCaretRight, cilList, cilLockLocked, cilLockUnlocked, cilPencil, cilPuzzle, cilSpeedometer, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { paginationItemPerPageOptions } from 'src/utils/constant'
import ReactPaginate from 'react-paginate'
import SearchBooks from './Component/SearchBooks'
import RegisterBook from './Component/RegisterBook'
import Library from './Component/Library'
import BookGenre from './Component/BookGenre'
import SubBooks from './Component/BooksDetail'
import BooksDetail from './Component/BooksDetail'
import ItemNumber from './Component/ItemNumber'
import CurationForm from './Component/CurationForm'
import SeriesCategory from './Component/SeriesCategory'
import IndividualCurBook from './Component/IndividualCurBook'
import CurationSearchBook from './Component/CurationSearchBook'
import CurationRegisterBook from './Component/CurationRegisterBook'
import CurationBookDetails from './Component/CurationBookDetails'
import moment from 'moment/moment'

const BookCuration = () => {

    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [currentPage, setCurrentPage] = useState(0)
    const [Genre, setGenre] = useState()
    const [AllCurationList, setAllCurationList] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [Curationbook, setCurationBook] = useState('Curationsearch')
    const [categories, setCategories] = useState('AllCuration')
    const [searchBooks, setSearchBooks] = useState([])
    const [searchBookFilter, setSearchBookFilter] = useState({ title: '' })
    const [AllGenreData, setSubAllGenreData] = useState([])
    const [genreBooks, setGenreBooks] = useState([])
    const [iconSet, setIconSet] = useState(null)
    const [iconSubSet, setIconSubSet] = useState(null)
    const [iconSubBookSet, setIconSubBookSet] = useState(null)
    const [sideBarId, setSideBarId] = useState(null)
    const [sideSubBarId, setSideSubBarId] = useState(null)
    const [sideSubBookBarId, setSideSubBookBarId] = useState(null)
    const [genreId, setGenreId] = useState(null)
    const [bookId, setBookId] = useState(null)
    const [categoryID, setCategoryID] = useState(null)
    const [subCategoryID, setSubCategoryID] = useState(null)
    const [subCategoryBookID, setSubCategoryBookID] = useState(null)
    const [subCategory, setSubCategory] = useState([])
    const [subCategoryBook, setSubCategoryBook] = useState([])
    const [categoryDetails, setCategoryDetails] = useState()
    const [subCategoryDetail, setSubCategoryDetail] = useState()
    const [bookCategory, setBookCategory] = useState([])
    const [bookDisplay, setBookDisplay] = useState({})
    const [deleted, setDeleted] = useState(0)
    const [curationEye, setCurationEye] = useState(true)
    const [stateupDate, setStateUpdate] = useState(0)
    const [visible, setVisible] = useState(false)
    const [curation, setCuration] = useState('')

    const [library, setLibrary] = useState([
        { id: 1, name: 'Library', subcategories: [] },
    ]);
    const [searchBookId, setSearchBookId] = useState(null)
    const [searchCurationBookDetail, setCurationSearchBookDetail] = useState({})
    const [searchItemPerPage, setItemSearchPerPage] = useState(3)
    const [currentSearchPage, setSearchCurrentPage] = useState(0)
    const [totalSearchPage, setSearchtotalPage] = useState(0)


    //displaying all the curationlists
    const getBookList = async () => {
        let url = `${API_ENDPOINT.categoryList}`

        try {
            const response = await getApi(url)
            if (response.status === 200) {
                setAllCurationList(response?.data)
                setTotalCount(response?.totalCount)
                setTotalPages(Math.ceil(response.totalCount / Number(itemsPerPage)))
            } else {
                setAllCurationList([])
            }
        } catch (error) {
            console.log(error)
        }

    }




    //displaying the subCategory
    const handleAddSubcategory = async (categoryId) => {
        setAllCurationList((prevLibrary) =>
            prevLibrary.map((category) =>
                category.id === categoryId
                    ? { ...category, subcategories: [...subCategory] }
                    : category
            )
        );
    };

    //get all the subcategorylist by category id
    const getSubCategoryList = async (id) => {
        setSideBarId(id)
        const url = `${API_ENDPOINT.subCategoryList}?categoryId=${id}`
        const res = await getApi(url)
        if (res.status === 200) {
            setSubCategory(res.data)
            setStateUpdate((prev) => prev + 1)
        }
        else {
            setSubCategory([])
        }
    }


    // search the book from google and adding it into category
    const SearchBookList = async () => {
        let url = `${API_ENDPOINT.searchGoogleBook}`
        if (searchBookFilter.title) {
            url = url + `?searchByName=${searchBookFilter.title}&limit=${searchItemPerPage}&offset=${currentSearchPage + 1}`
        }

        try {
            const res = await getApi(url)
            if (res?.status === 200) {
                setSearchBooks(res?.data)
                console.log('totle', res?.totalItems)
                setSearchtotalPage(Math.ceil(res?.totalItems / Number(searchItemPerPage)))
            }
            else{
                setSearchBooks([])
            }
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        SearchBookList()
    }, [currentSearchPage, searchItemPerPage])
    



    useEffect(() => {
        const data = searchBooks[searchBookId]
  
        setCurationSearchBookDetail(data)
  
      }, [searchBookId])


    //hiding or showing the category based on visibility
    const VisibilityHide = async (id, type) => {
        let url = `${API_ENDPOINT.VisibilityHide}`

        setDeleted((prev) => prev + 1)
        const body = {
            id: id,
            visibility: type
        }


        const res = await putApi(url, body)
        if (res?.data?.status === 200) {
            getBookList()
        }
        else {
            console.log('error occured')
        }

    }



    const getBookGenre = useCallback(async () => {
        const res = await getApi(API_ENDPOINT.get_genre_list)
        if (res?.status === 200) {
            const data = await res?.data?.map((op) => {
                return { 'label': op.name, 'value': op.id }

            })
            setGenre((pre) => {
                return [{ label: 'All', value: 0 }, ...data]
            })
        }
    }, [])


    //deleting the category based on the id
    const deleteCategory = async () => {
        const url = `${API_ENDPOINT.delete_category}?id=`
        try {
            const res = await deleteApi(url, categoryID)
            if (res.status === 200) {
                setStateUpdate((prev) => prev + 1)
                setVisible(false)
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getBookGenre()
    }, [])


    const handleSetCategory = (type, id) => {
        setSubCategoryID(id)
        if (type === 'individual') {
            setCategories('indvBook')
        }
        else if (type === 'series') {
            setCategories('seriesBook')
        }
    }

    const getCategoryDetails = async (id) => {
        setCategoryID(id)
        let url = `${API_ENDPOINT.get_categoryDetails}?id=${id}`

        const res = await getApi(url)
        if (res.status == 200) {
            setCategoryDetails(res.data)
        }
        else {
            console.log('error')
        }
    }

    const columns = useMemo(() => [
        {
            Header: 'No.',
            accessor: '',
            Cell: ({ row }) => {
                return currentPage * itemsPerPage + (row?.index + 1)
            }
        },
        {
            Header: 'Curation Type',
            accessor: 'Curation',
            Cell: ({ row }) => <p>{`${row.original.curationType}`}</p>
        },
        {
            Header: 'Title',
            accessor: 'title',
            Cell: ({ row }) => <p>{row.original.categoryName}</p>
        },
        {
            Header: 'Display period',
            accessor: 'display',
            Cell: ({ row }) => <p>{row.original.isExpired === 'yes' ? 'No expiration date' : <><p>{moment(row.original.startDateTime).format("YYYY-MM-DD HH:mm")}</p><p>{moment(row.original.endDateTime).format("YYYY-MM-DD HH:mm")}</p></>}</p>,
            Cell: ({ row }) => <p>{row.original.isExpired === 'yes' ? 'No expiration date' : <><p>{moment(row.original.startDateTime).format("YYYY-MM-DD HH:mm")}</p><p>{moment(row.original.endDateTime).format("YYYY-MM-DD HH:mm")}</p></>}</p>,

        },

        {
            Header: 'Status',
            accessor: '',
            Cell: ({ row }) => <p>{row.original.status}</p>
        },
        {
            Header: 'Visibility',
            accessor: '',
            Cell: ({ row }) => <div className='justify-content-center '>
                {row.original.visibility === 'hide' && <p className='text-center ' ><CIcon onClick={() => VisibilityHide(row?.original?.categoryId, 'visible')} icon={cilLockLocked} size="lg" /></p>}
                {row.original.visibility === 'visible' && <p className='px-3 py-2   border-1'><CIcon onClick={() => VisibilityHide(row?.original?.categoryId, 'hide')} icon={cilLockUnlocked} size='lg' /></p>}
            </div>
        },
        {
            Header: 'Modify',
            accessor: '',
            Cell: ({ row }) => <div className='d-flex'>
                <p className='px-3 py-2 rounded border-1 mx-2'><CIcon onClick={() => { setCategories('Curation'); getCategoryDetails(row?.original?.categoryId); }} icon={cilPencil} size="lg" /></p>
            </div>
        },
        {
            Header: 'Delete',
            accessor: '',
            Cell: ({ row }) => <div className='d-flex'>
                <p className='px-3 py-2 rounded border-1 mx-2'><CIcon onClick={() => { setCategoryID(row.original.categoryId); setVisible(true) }} icon={cilTrash} size="lg" /></p>
            </div>
        },
    ], [])


    const handleSelectionChange = useCallback((selectedRowsIds) => {
        // setSelectedRows([...selectedRows, selectedRowsIds]);
        // console.log('selected rows type =>', typeof selectedRowsIds);

        // const getIds = selectedRowsIds.map((item) => {
        //   console.log('ites =>', item);
        //   return item.id.toString();
        // })
        // console.log('getIds', getIds)
        // console.log('getIds =>', typeof getIds);
        // setDataIds(getIds)

    }, []);


    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected)
    }

    const subBooks = [
        { id: 1, title: 'P001' },
        { id: 2, title: 'P002' },
    ]

    const handleGetbookBysubCategory = async (catId, subID) => {
        setCategoryID(catId)
        let url = `${API_ENDPOINT.getbook_bySubCategory}?categoryId=${catId}`
        if (subID) {
            url = url + `&subCategoryId=${subID}`
            setSubCategoryID(subID)
        }

        const res = await getApi(url)
        if (res?.status === 200) {
            setSubCategoryBook(res?.data)
        }
        else {
            setSubCategoryBook([])
        }


    }



    const handleAddBook = async (categoryId, subcategoryId) => {
        let url = `${API_ENDPOINT.get_bookListByGenre}?genreId=${subcategoryId}`

        const res = await getApi(url)
        if (res?.status === 200) {
            setGenreBooks(res?.data)
        }
        // else{
        //     setGenreBooks([])
        // }


        // }
        setCategoryID(categoryId)
        setSubCategoryID(subcategoryId)
        setLibrary((prevLibrary) =>
            prevLibrary.map((category) =>
                category.id === categoryId
                    ? {
                        ...category,
                        subcategories: category.subcategories.map((subcategory) =>
                            subcategory.id === subcategoryId
                                ? { ...subcategory, books: [...res?.data] }
                                : subcategory
                        ),
                    }
                    : category
            )
        );

    };



    const handleAddSubBook = (categoryId, subcategoryId, bookId) => {
        const newData = subBooks.map((item) => {
            return {
                ...item
            }
        })
        setLibrary((prevLibrary) =>
            prevLibrary.map((category) =>
                category.id === categoryId
                    ? {
                        ...category,
                        subcategories: category.subcategories.map((subcategory) =>
                            subcategory.id === subcategoryId
                                ? {
                                    ...subcategory, books: subcategory.books.map((book) =>
                                        book.id === bookId ?
                                            { ...book, subBook: [...newData] }
                                            : book)
                                }
                                : subcategory
                        ),
                    }
                    : category
            )
        );
    };

    // list of all genre
    const getALLBookgenre = async () => {

        const url = `${API_ENDPOINT.getAll_genreList}`

        const res = await getApi(url)
        if (res?.status === 200) {
            setSubAllGenreData(res?.data)
        }
    }

    //get books by genreId


    useEffect(() => {
        getBookList()
        getBookList()
        getALLBookgenre()
    }, [stateupDate])



    // get singleBook By Id
    const DisplayBook = async (id) => {
        setSubCategoryBookID(id)
        let url = `${API_ENDPOINT.get_ALLBooksDetails}?id=${id}`

        const res = await getApi(url)
        if (res?.status === 200) {
            setBookDisplay(res?.data)
        }
    }

    const getSubCategoryDetails = async (id) => {
        let url = `${API_ENDPOINT.get_subCategoryDetails}?id=${id}`

        const res = await getApi(url)
        if (res.status === 200) {
            setSubCategoryDetail(res.data)
        }
    }

    useEffect(() => {
        getALLBookgenre()
    }, [])


    const handleChangeIcon = (id) => {
        setIconSet(id)
        setSideBarId(id)
    }

    const handleChangeIconSUb = (id) => {
        setIconSubSet(id)
        setSideSubBarId(id)
    }

    const handleChangeIconSubBook = (id) => {
        setIconSubBookSet(id)
        setSideSubBookBarId(id)
    }

    return (
        <div style={{ display: 'flex' }}>
        <div className='col-md-4'>
        <CSidebar className='w-100 pe-3'>
            <CSidebarBrand className=' black-text d-flex justify-content-start p-3' style={{ color: 'black', background: 'none' }}><h5>Category Hierarchy</h5></CSidebarBrand>
            <div>
                <CSidebarBrand className=' black-text mb-2' style={{ color: 'black', background: 'none' }}>
                    <p onClick={() => setCategories('AllCuration')} role='button'>All Curation</p>
                </CSidebarBrand>
                <CSidebarBrand className='black-text mb-2 pb-3' style={{ background: 'none', display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid #000' }}>
                    <CButton onClick={() => { setCategories('Curation'); setCuration('individual'); setCategoryID(null) }}>Add Curation</CButton>
                    <CButton onClick={() => { setCategories('Curation'); setCuration('series'); setCategoryID(null) }}>Add Series</CButton>
                </CSidebarBrand>
            </div>
            <CSidebarNav style={{ color: 'black', padding: '3px', maxHeight: '500px', overflow: 'auto' }}>
                {AllCurationList?.map((category) => (
                    <CNavItem className='mb-3' key={category.id} >
                        <div className='d-flex w-100'>
                            <div className='d-flex w-100 flex-column'>
                                <div className='d-flex w-100 justify-content-between align-items-center '>
                                    <div className='d-flex justify-content-between w-100'>
                                    <div className='d-flex align-items-center gap-1'>
                                        {iconSet !== category.categoryId && <CIcon icon={cilCaretRight} size="sm" onClick={() => { getSubCategoryList(category?.categoryId); handleChangeIcon(category.categoryId); handleGetbookBysubCategory(category.categoryId) }} />}
                                        {iconSet === category.categoryId && <CIcon icon={cilCaretBottom} size="sm" onClick={() => handleChangeIcon(null)} />}
                                        <p onClick={() => {setCategories('Curation');setCategoryID(category.categoryId);getCategoryDetails(category.categoryId)}} role='button' >{category.categoryName}</p>
                                    </div>
                                    <div className='pe-1'>
                                        <p>{category.curationType}</p>
                                    </div>
                                    </div>
                                    <div className='flex'>
                                        <CButton onClick={() => {handleSetCategory(category.curationType, null);setCategoryID(category?.categoryId)}} className=' flex-nowrap' style={{whiteSpace:'nowrap'}} >Add sub</CButton>
                                    </div>
                                </div>
                                <div>
                                    {
                                        sideBarId === category.categoryId &&
                                        <div>
                                            {subCategory?.map((subcategory) => (
                                                <CNavItem style={{ marginTop: '20px' }} key={subcategory.id}>
                                                    <div className='d-flex justify-content-between ms-2 mt-2'>
                                                        <div className='d-flex align-items-center gap-1'>
                                                            {iconSubSet !== subcategory.id && <CIcon icon={cilCaretRight} size="sm" onClick={() => { handleAddBook(category.id, subcategory.id); handleChangeIconSUb(subcategory.id); handleGetbookBysubCategory(category.categoryId, subcategory.id) }} />}
                                                            {iconSubSet === subcategory.id && <CIcon icon={cilCaretBottom} size="sm" onClick={() => handleChangeIconSUb(null)} />}
                                                            <p onClick={() => { getSubCategoryDetails(subcategory.id); handleSetCategory(category.curationType, subcategory.id) }} role='button' >{subcategory.name}</p>
                                                        </div>
                                                        <div>
                                                            <CButton onClick={() => { setCategories('indvBook'); setSubCategoryBookID(null);setCategoryID(category?.categoryId);setSubCategoryID(subcategory.id)}} className='btn-sm' >Add sub</CButton>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {
                                                            sideSubBarId === subcategory?.id &&
                                                            <div>
                                                                {subCategoryBook?.map((book, index) => (
                                                                    <CNavItem style={{ marginTop: '20px' }} key={book.id}>
                                                                        <div className='d-flex justify-content-between ms-3 mt-2'>
                                                                            <div className='d-flex align-items-center gap-1'>
                                                                                {iconSubBookSet !== book.id && <CIcon icon={cilCaretRight} size="sm" onClick={() => { handleAddSubBook(category.id, subcategory.id, book.id); handleChangeIconSubBook(book.id) }} />}
                                                                                {iconSubBookSet === book.id && <CIcon icon={cilCaretBottom} size="sm" onClick={() => handleChangeIconSubBook(null)} />}
                                                                                <p onClick={() => { setCategories('curationBookdetails'); DisplayBook(book.id) }} role='button'>{book?.title}</p>
                                                                            </div>
                                                                            {/* s */}
                                                                        </div>
                                                                    </CNavItem>
                                                                ))}
                                                            </div>
                                                        }
                                                    </div>
                                                </CNavItem>
                                            ))}
                                        </div>
                                    }

                                    {
                                        (category.curationType === 'individual' && category.categoryId === sideBarId) &&
                                        <div>
                                            {
                                                // sideSubBarId === subcategory?.id &&
                                                <div>
                                                    {subCategoryBook?.map((book, index) => (
                                                        <CNavItem style={{ marginTop: '20px' }} key={book.id}>
                                                            <div className='d-flex justify-content-between ms-3 mt-2'>
                                                                <div className='d-flex align-items-center gap-1'>
                                                                    {iconSubBookSet !== book.id && <CIcon icon={cilCaretRight} size="sm" />}
                                                                    {iconSubBookSet === book.id && <CIcon icon={cilCaretBottom} size="sm" onClick={() => handleChangeIconSubBook(null)} />}
                                                                    <p onClick={() => { setCategories('curationBookdetails'); DisplayBook(book.id); setBookId(book.id) }} role='button'>{book?.title}</p>
                                                                </div>
                                                                {/* s */}
                                                            </div>
                                                        </CNavItem>
                                                    ))}
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>

                        </div>
                    </CNavItem>
                ))}

            </CSidebarNav>

        </CSidebar>
        </div>
        {/* </div>   */}
        {categories === 'itemNumber' && <ItemNumber Genre={Genre} bookId={bookId} genreBooks={genreBooks} library={library} />}
        {categories === 'Curation' && <CurationForm setCuration={setCuration} setCategories={setCategories} categoryID={categoryID} categoryDetails={categoryDetails} curation={curation} setStateUpdate={setStateUpdate} />}
        {/* {categories === 'indvBook' && <IndividualCurBook setStateUpdate={setStateUpdate} />} */}

        {categories === 'curationBookdetails' && <CurationBookDetails setSideBarId={setSideBarId} setIconSet={setIconSet}  setStateUpdate={setStateUpdate} setCategories={setCategories} categoryID={categoryID} bookId={bookId} subCategoryID={subCategoryID} subCategoryBookID={subCategoryBookID} bookDisplay={bookDisplay} />}
        {categories === 'seriesBook' && <SeriesCategory  setSideBarId={setSideBarId} setIconSet={setIconSet} setCategories={setCategories} categoryID={categoryID} subCategoryDetail={subCategoryDetail} subCategoryID={subCategoryID} setStateUpdate={setStateUpdate} />}
        {categories === 'AllCuration' && 
        
        <div className='col-md-8' style={{ padding: 5, minHeight: '100%' }}>
            <div>
                <p style={{ fontSize: 'medium', padding: 5, marginTop: '10%' }}>Total: {totalCount ? totalCount : '0'}</p>
            </div>  
            <div>
                <ReactTable columns={columns} data={AllCurationList} showCheckbox={false} onSelectionChange={handleSelectionChange} />
            </div>
            <div className='d-flex w-100 justify-content-center gap-3'>
                {AllCurationList.length > 0 &&
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
                                // renderOnZeroPageCount={null}
                                pageRangeDisplayed={4}
                            />
                        </div>

                    </div>

                }
                {AllCurationList.length > 0 && <div className='d-flex align-items-center gap-2 mt-2'>
                    <label>Show</label>
                    <CFormSelect
                        className=''
                        aria-label=""
                        options={paginationItemPerPageOptions}
                        onChange={(event) => {
                            setItemsPerPage(parseInt(event?.target?.value));
                            setCurrentPage(0)
                        }}
                    />
                    <label>Lists</label>
                </div>}
            </div>
        </div>}
        {categories === "indvBook" && <div className='w-100 px-2'>
            <div className='d-flex justify-content-between'>
                <div>
                    <p>Book (ISBN)</p>
                </div>
                <div className='clearfix'>
                    <CButton className='float-end'>Delete</CButton>
                </div>
            </div>
            <div style={{ width: '40%', display: 'flex', justifyContent: 'space-between', marginLeft: '5%' }}>
                <div onClick={() => setCurationBook('Curationsearch')} style={{ textDecoration: Curationbook === 'search' ? 'underline' : '', textUnderlinePosition: 'under', textUnderlineOffset: '5px' }} >
                    <p>Search Book</p>
                </div>
                <div onClick={() => setCurationBook('CurationRegister')} style={{ textDecoration: Curationbook === 'Register' ? 'underline' : '', textUnderlinePosition: 'under', textUnderlineOffset: '5px' }}>
                    <p>Register Book</p>
                </div>
            </div>
            {categories === 'indvBook' && (<div>
                {Curationbook === 'Curationsearch' && <CurationSearchBook setItemSearchPerPage={setItemSearchPerPage} currentSearchPage={currentSearchPage} totalSearchPage={totalSearchPage} setSearchCurrentPage={setSearchCurrentPage} setSearchBookId={setSearchBookId} setCurationBook={setCurationBook} searchBookFilter={searchBookFilter} setSearchBookFilter={setSearchBookFilter} searchBooks={searchBooks} SearchBookList={SearchBookList} />}
                {Curationbook === 'CurationRegister' && <CurationRegisterBook setSearchBookFilter={setSearchBookFilter} setSearchCurrentPage={setSearchCurrentPage} setSideBarId={setSideBarId} setIconSet={setIconSet} setCategoryID={setCategoryID} categoryID={categoryID} subCategoryID={subCategoryID} searchBookId={searchBookId} setCurationSearchBookDetail={setCurationSearchBookDetail} searchCurationBookDetail={searchCurationBookDetail} setCategories={setCategories} setCurationBook={setCurationBook} setDeleted={setDeleted} setSearchBooks={setSearchBooks} searchBooks={searchBooks} />}
            </div>)}

        </div>}
        <CModal
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="LiveDemoExampleLabel"
        >
            <CModalHeader onClose={() => setVisible(false)}>
                <CModalTitle id="LiveDemoExampleLabel">Delete the category</CModalTitle>
            </CModalHeader>
            <CModalBody className='text-center'>
                <p>Are you sure you want to delete
                </p>
            </CModalBody>
            <CModalFooter className='d-flex justify-content-center gap-md-4 border-0 '>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                    Cancel
                </CButton>
                <CButton className='px-4' color="primary" onClick={deleteCategory}>Yes</CButton>
            </CModalFooter>
        </CModal>
    </div>

    )
}

export default BookCuration
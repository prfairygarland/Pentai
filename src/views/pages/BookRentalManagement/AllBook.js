import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem, CBadge, CButton, CFormCheck, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CNavGroup, CNavItem, CNavTitle, CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import { API_ENDPOINT } from 'src/utils/config'
import { deleteApi, getApi, getUserListExportData } from 'src/utils/Api'
import ReactTable from 'src/components/common/ReactTable'
import { cibZeit, cilArrowThickRight, cilCaretBottom, cilCaretRight, cilList, cilPuzzle, cilSpeedometer } from '@coreui/icons'
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
import { enqueueSnackbar } from 'notistack'

const initialData = {
    title: '',
    bookGenre: '',
    itemStatus: '',
    visibility: '',
    status: ''
}

const AllBook = () => {

    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [currentPage, setCurrentPage] = useState(0)
    const [filterData, setFilteredData] = useState(initialData)
    const [Genre, setGenre] = useState()
    const [AllBookList, setAllBookList] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [isFilterApplied, setIsFilterApplied] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const [items, setItems] = useState([])
    const [book, setBook] = useState('search')
    const [categories, setCategories] = useState('AllBooks')
    const [searchBooks, setSearchBooks] = useState([])
    const [searchBookFilter, setSearchBookFilter] = useState({ title: '' })
    const [CategoryId, setCategoryId] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
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
    const [bookDisplay, setBookDisplay] = useState({})
    const [deleted, setDeleted] = useState(0)
    const [library, setLibrary] = useState([
        { id: 1, name: 'Library', subcategories: [] },
    ]);
    const [LibraryList, setLibraryList] = useState([])
    const [libraryDetails, setLibraryDetail] = useState()
    const [bookListItem, setBookListItem] = useState([])
    const [libraryId, setLibraryId] = useState(null)
    const [bookItemDetail, setItemBookDetail] = useState({})
    const [bookItemId, setBookItemId] = useState(null)
    const [deleteVisible, setdeleteVisible] = useState(false)
    const [deletebookId, setDeleteBookId] = useState(null)
    const [searchBookId, setSearchBookId] = useState('')
    const [searchBookDetail, setSearchBookDetail] = useState({})
    const [searchItemPerPage, setItemSearchPerPage] = useState(3)
    const [currentSearchPage, setSearchCurrentPage] = useState(0)
    const [totalSearchPage, setSearchtotalPage] = useState(0)


    const getLibraryLists = async () => {

        const res = await getApi(API_ENDPOINT.get_libraryList)
        if (res?.status === 200) {
            setLibraryList(res?.data)
        }

    }

    const getLibraryDetails = async (id) => {

        let url = `${API_ENDPOINT.get_libraryDetails}?id=${id}`

        const res = await getApi(url)
        if (res?.status === 200) {
            setLibraryDetail(res?.data)
        }

    }

    useEffect(() => {

        getLibraryDetails(libraryId)

    }, [libraryId])




    const getBookList = async () => {
        let url = `${API_ENDPOINT.get_all_book}?limit=${itemsPerPage}&offset=${currentPage + 1}`

        if (filterData.status && filterData.status !== 'All') {
            url = url + `&status=${filterData.status}`
        }
        if (filterData.title) {
            url = url + `&search=${filterData.title}`
        }
        if (filterData.bookGenre && filterData.bookGenre !== 0) {
            url = url + `&genreId=${filterData.bookGenre}`
        }
        if (filterData.visibility && filterData.visibility !== 'All') {
            url = url + `&visibility=${filterData.visibility}`
        }

        try {
            const response = await getApi(url)

            if (response?.status === 200) {
                setAllBookList(response?.data)
                setTotalCount(response?.totalCount)
                setTotalPages(Math.ceil(response.totalCount / Number(itemsPerPage)))
                console.log('books', response?.data)
            } else {
                setAllBookList([])
                setTotalCount(0)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const SearchBookList = async () => {
        let url = `${API_ENDPOINT.searchGoogleBook}`
        if (searchBookFilter.title) {
            url = url + `?searchByName=${searchBookFilter.title}&limit=${searchItemPerPage}&offset=${currentSearchPage + 1}`
        }

        try {
            const res = await getApi(url)
            if (res?.status === 200) {
                setSearchBooks(res?.data)
                setSearchtotalPage(Math.ceil(res?.totalItems / searchItemPerPage))
            }
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        SearchBookList()
    }, [currentSearchPage, searchItemPerPage])



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


    const deleteBook = async (id) => {
        const url = `${API_ENDPOINT.delete_book}?id=`
        try {
            setdeleteVisible(false)
            const res = await deleteApi(url, id)
            if (res?.data?.status === 200) {
                enqueueSnackbar('book deleted sucessfully', { variant: 'success' })
                getBookList()
                setdeleteVisible(false)
            }
            else {
                enqueueSnackbar('failed to delete book', { variant: 'error' })
            }
        } catch (error) {
            console.log(error)
        }
    }

    //get bookdetail by id
    const getBookDetailItem = async (id) => {
        setBookItemId(id)
        let url = `${API_ENDPOINT.get_bookDetailItem}?id=${id}`

        const res = await getApi(url)
        if (res?.status === 200) {
            setItemBookDetail(res.data)

        }

    }

    useEffect(() => {
        getBookList()
    }, [filterData.bookGenre, filterData.status, filterData.visibility, itemsPerPage, currentPage])

    useEffect(() => {
        if (filterData?.title === '') {
            getBookList()
        }
    }, [filterData.title])



    useEffect(() => {
        getBookGenre()
    }, [])

    const columns = useMemo(() => [
        {
            Header: 'Book Genre',
            accessor: 'genreBane',
            Cell: ({ row }) => <p>{`${row.original.genreBane}`}</p>,
        },
        {
            Header: 'Book Title',
            accessor: 'title',
            Cell: ({ row }) => <p>{`${row.original.title.charAt(0).toUpperCase() + row.original.title.slice(1)}`}</p>
        },
        {
            Header: 'ISBN',
            accessor: 'SIBNCode',
            Cell: ({ row }) => <p>{row.original.SIBNCode}</p>
        },
        {
            Header: 'Item Number',
            accessor: 'ItemNumber',
            Cell: ({ row }) => <p className='text-center'>{row.original.itemNumber ? row.original.itemNumber : '-'}</p>

        },
        {
            Header: 'Item Status',
            accessor: 'status',
            Cell: ({ row }) => <p className='text-center'>{row.original.itemStatus ? row.original.itemStatus : '-'}</p>,

        },


        {
            Header: 'Action',
            accessor: '',
            Cell: ({ row }) => <div className='d-flex justify-content-center align-items-center gap-3'>
                <a onClick={() => { setCategories('BookDetail'); setBookId(row.original.id); DisplayBook(row.original.id) }} className='greenTxt'>Modify</a>
                <a onClick={() => { setdeleteVisible(true); setDeleteBookId(row.original.id) }} className='primTxt'>Delete</a>
            </div>
        },
    ], [])


    const getUserListExport = async () => {
        let url = `${API_ENDPOINT.All_Bookexport}?offset=${currentPage + 1}&limit=${4}`;

        if (filterData?.title) {
            url = url + `&search=${filterData?.title}`
        }
        if (filterData?.status) {
            url = url + `&status=${filterData?.status}`
        }
        if (filterData.bookGenre && filterData.bookGenre !== 'All') {
            url = url + `&genreId=${filterData?.bookGenre}`
        }
        // console.log('url check =>', url);

        const res = await getApi(url)
        console.log('res =>', res);
        if (res?.filePath) {
            const downloadLink = res?.filePath;
            const link = document.createElement('a');
            link.href = 'https://ptkapi.experiencecommerce.com/' + downloadLink;
            link.setAttribute('download', `exported_data_${new Date().getTime()}.xlsx`);

            link.click();
            //   checkExportSelectid(false)

        } else {
            //   checkExportSelectid(false)
            console.log('No data found');
        }
    }

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


    const handleChangeInput = (e) => {
        const value = e.target.value
        setFilteredData((prev) => {
            return {
                ...prev,
                title: value
            }
        })
    }

    const handleItemChange = (e) => {
        const id = e.target.value
        setFilteredData((prev) => {
            return {
                ...prev,
                bookGenre: id
            }
        })
    }




    const handleStatusChange = (e) => {
        const value = e.target.value
        setFilteredData((prev) => {
            return {
                ...prev,
                status: value
            }
        })
    }

    const handleVisibilityChange = (e) => {
        const value = e.target.value
        setFilteredData((prev) => {
            return {
                ...prev,
                visibility: value === 'Hidden' ? 'hide' : value
            }
        })
    }

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected)
    }

    //for creating subCategory inside category
    const handleAddSubcategory = (categoryId) => {
        setSideBarId(categoryId)
        setModalOpen(true)
        const newSubCatData = AllGenreData.map(data => {
            return {
                ...data,
                books: []
            }
        })
        setLibrary((prevLibrary) =>
            prevLibrary.map((category) =>
                category.id === categoryId
                    ? { ...category, subcategories: [...newSubCatData] }
                    : category
            )
        );
    }


    //creating book inside subcategory
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



    const handleAddSubBook = async (categoryId, subcategoryId, bookId) => {
        let url = `${API_ENDPOINT.get_bookListItem}?bookId=${bookId}`
        setBookId(bookId)
        const res = await getApi(url)
        if (res?.status === 200) {
            setBookListItem(res?.data)
        }
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
                                            { ...book, subBook: [...res?.data] }
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

    useEffect(() => {
        getALLBookgenre()
        getBookList()
        getLibraryLists()
        getLibraryLists()
    }, [deleted])


    // get singleBook By Id
    const DisplayBook = async (id) => {
        let url = `${API_ENDPOINT.get_ALLBooksDetails}?id=${id}`

        const res = await getApi(url)
        if (res?.status === 200) {
            setBookDisplay(res?.data)
        }
    }

    //deletebook book
    const deleteSingleBook = async () => {
        const url = `${API_ENDPOINT.delete_book}?id=`
        try {
            const res = await deleteApi(url, bookId)
            if (res?.data?.status === 200) {
                setDeleted((prev) => prev + 1)
                getBookList()
            }
        }
        catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        // const data = searchBooks[searchBookId]

        setSearchBookDetail(searchBooks[searchBookId])

    }, [searchBookId, book])


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

        <><div className="pageTitle mb-3 pb-2">
            <h2>All Books</h2>
        </div>
            <div style={{ display: 'flex', borderRadius: 10, padding: 5, width: '100%' }}>
                <div className='col-md-4'>
                    <CSidebar className='w-100 pe-3'>
                        <CSidebarBrand className=' black-text d-flex justify-content-start p-3' style={{ color: 'black', background: 'none' }}><h5 style={{ fontSize: '15px' }}>Category Hierarchy</h5></CSidebarBrand>
                        <div className=' black-text d-flex justify-content-between mb-2 p-2' style={{ color: 'black', borderBottom: '1px solid #000', background: 'none', alignItems: 'center' }}>
                            <b onClick={() => setCategories('AllBooks')} role='button'>All Books</b>
                        </div>
                        <CSidebarNav style={{ color: 'black', padding: '3px', maxHeight: '500px', overflow: 'auto' }}>
                            {library?.map((category) => (
                                <CNavItem className='mb-3' key={category.id} >
                                    <div className='d-flex w-100'>
                                        <div className='d-flex w-100 flex-column '>
                                            <div className='d-flex w-100 justify-content-between'>
                                                <div className='d-flex align-items-center gap-1'>
                                                    {iconSet !== category.id && <CIcon style={{ transform: 'rotate(90deg)' }} icon={cibZeit} size="sm" onClick={() => { handleChangeIcon(category?.id); handleAddSubcategory(category?.id) }} />}
                                                    {iconSet === category.id && <CIcon style={{ transform: 'rotate(180deg)' }} icon={cibZeit} size="sm" onClick={() => handleChangeIcon(null)} />}
                                                    <p onClick={() => { setCategories('library'); getLibraryDetails(category.id); setLibraryId(category.id) }} role='button'>{category.name}</p>
                                                </div>
                                                <div>
                                                    <CButton onClick={() => { setCategories('bookgenre'); setGenreId(null) }} className='btn-sm' style={{ whiteSpace: 'nowrap' }}>Add sub</CButton>
                                                </div>
                                            </div>
                                            <div>
                                                {
                                                    sideBarId === category.id &&
                                                    <div>
                                                        {category?.subcategories?.map((subcategory) => (
                                                            <CNavItem style={{ marginTop: '20px' }} key={subcategory.id}>
                                                                <div className='d-flex justify-content-between ms-2 mt-2 gap-2'>
                                                                    <div className='d-flex align-items-center gap-1'>
                                                                        {iconSubSet !== subcategory.id && <CIcon style={{ transform: 'rotate(90deg)' }} icon={cibZeit} size="sm" onClick={() => { handleAddBook(category.id, subcategory.id); handleChangeIconSUb(subcategory.id); setGenreId(subcategory.id) }} />}
                                                                        {iconSubSet === subcategory.id && <CIcon style={{ transform: 'rotate(180deg)' }} icon={cibZeit} size="sm" onClick={() => handleChangeIconSUb(null)} />}
                                                                        <p onClick={() => { setGenreId(subcategory.id); setCategories('bookgenre'); setLibraryId(category.id) }} role='button' >{subcategory.name}</p>
                                                                    </div>
                                                                    <div>
                                                                        <CButton onClick={() => { setCategories('Sub'); setGenreId(subcategory.id); setSearchBooks([]); setSearchBookDetail([]) }} className='btn-sm' style={{ whiteSpace: 'nowrap' }}>Add sub</CButton>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    {
                                                                        sideSubBarId === subcategory?.id &&
                                                                        <div>
                                                                            {subcategory?.books?.map((book, index) => (
                                                                                <CNavItem style={{ marginTop: '20px' }} key={book.id}>
                                                                                    <div className='d-flex justify-content-between ms-3 mt-2 gap-2'>
                                                                                        <div className='d-flex align-items-center gap-1'>
                                                                                            {iconSubBookSet !== book.id && <CIcon style={{ transform: 'rotate(90deg)' }} icon={cibZeit} size="sm" onClick={() => { handleAddSubBook(category.id, subcategory.id, book.id); handleChangeIconSubBook(book.id) }} />}
                                                                                            {iconSubBookSet === book.id && <CIcon style={{ transform: 'rotate(180deg)' }} icon={cibZeit} size="sm" onClick={() => handleChangeIconSubBook(null)} />}
                                                                                            <p onClick={() => { setCategories('BookDetail'); setBookId(book.id); DisplayBook(book.id) }} role='button'>{book.title}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <CButton onClick={() => { setCategories('itemNumber'); setBookItemId(null); DisplayBook(book.id) }} className='btn-sm' style={{ whiteSpace: 'nowrap' }}>Add sub</CButton>
                                                                                        </div>
                                                                                    </div>
                                                                                    {
                                                                                        sideSubBookBarId === book.id &&
                                                                                        <div>
                                                                                            {book.subBook?.map((subBook, index) => (
                                                                                                <CNavItem style={{ marginTop: '20px' }} key={subBook.id}>
                                                                                                    <div className='d-flex justify-content-between ms-4 mt-2'>
                                                                                                        <div className='d-flex align-items-center gap-1'>
                                                                                                            <p onClick={() => { setCategories('itemNumber'); getBookDetailItem(subBook.id) }} role='button' >{subBook?.itemNumber}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </CNavItem>
                                                                                            ))}
                                                                                        </div>
                                                                                    }
                                                                                </CNavItem>
                                                                            ))}
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </CNavItem>
                                                        ))}
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
                {categories === 'library' && <Library
                    setCategories={setCategories}
                    libraryDetails={libraryDetails}
                    CategoryId={CategoryId}
                    library={library} />}
                {categories === 'bookgenre' && <BookGenre
                    libraryDetails={libraryDetails}
                    setSideSubBarId={setSideSubBarId}
                    setIconSubSet={setIconSubSet}
                    setSideBarId={setSideBarId}
                    setIconSet={setIconSet}
                    setFilteredData={setFilteredData}
                    setCategories={setCategories}
                    setDeleted={setDeleted}
                    genreId={genreId}
                    getALLBookgenre={getALLBookgenre}
                    library={library} />}
                {categories === 'BookDetail' && <BooksDetail
                    setSideSubBookBarId={setSideSubBookBarId}
                    setIconSubBookSet={setIconSubBookSet}
                    setSideSubBarId={setSideSubBarId}
                    setIconSubSet={setIconSubSet}
                    setBookId={setBookId}
                    setSideBarId={setSideBarId}
                    setIconSet={setIconSet}
                    setFilteredData={setFilteredData}
                    genreId={genreId}
                    deleteSingleBook={deleteSingleBook}
                    setDeleted={setDeleted}
                    getBookList={getBookList}
                    setCategories={setCategories}
                    bookDisplay={bookDisplay}
                    Genre={Genre}
                    bookId={bookId}
                    genreBooks={genreBooks}
                    library={library} />}
                {categories === 'itemNumber' && <ItemNumber
                    setSideSubBookBarId={setSideSubBookBarId}
                    setSideBarId={setSideBarId}
                    setIconSubBookSet={setIconSubBookSet}
                    setIconSubSet={setIconSubSet}
                    setIconSet={setIconSet}
                    setFilteredData={setFilteredData}
                    setCategories={setCategories}
                    bookDisplay={bookDisplay}
                    bookItemDetail={bookItemDetail}
                    setDeleted={setDeleted}
                    Genre={Genre}
                    bookId={bookId}
                    bookItemId={bookItemId}
                    genreBooks={genreBooks}
                    library={library} />}
                {categories === 'AllBooks' &&
                    <div className='col-md-8' style={{ padding: 5, minHeight: '100%' }}>
                        <div className='d-flex justify-content-end m-1 '>
                            <CButton onClick={getUserListExport} className='btn-success'>Export</CButton>
                        </div>
                        <div className='d-flex justify-content-end px-4 py-2'>
                            <div className='d-flex'>
                                <CFormSelect
                                    className='mx-3 px-8'
                                    options={Genre}
                                    onChange={handleItemChange}
                                />
                                <CFormSelect
                                    className='me-3'
                                    options={[
                                        { label: 'All', value: 'All' },
                                        { label: 'Available', value: 'available' },
                                        { label: 'Unavailable', value: 'unAvailable' },
                                    ]}
                                    onChange={handleStatusChange}
                                />
                                <CFormSelect
                                    options={[
                                        { label: 'All', value: 'All' },
                                        { label: 'visible', value: 'visible' },
                                        { label: 'Hidden', value: 'Hidden' }
                                    ]}
                                    onChange={handleVisibilityChange}
                                />
                            </div>

                        </div>
                        <div className='d-flex gap-3'>
                            <input value={filterData.title} placeholder='Search' onChange={handleChangeInput} className='form-control' />
                            <CButton onClick={getBookList}>Search</CButton>
                        </div>
                        <div>
                            <p style={{ fontSize: 'medium', padding: 5 }}>Total: {totalCount > 0 ? totalCount : '0'}</p>
                        </div>

                        <ReactTable columns={columns} data={AllBookList} showCheckbox={false} onSelectionChange={handleSelectionChange} />
                        <div className='d-flex w-100 justify-content-center my-3 gap-3'>
                            {AllBookList.length > 0 &&
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
                            {AllBookList.length > 0 && <div className='d-flex align-items-center gap-2 '>
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
                {categories === "Sub" && <div className='w-100 px-2'>
                    <div className='d-flex justify-content-between'>
                        <div>
                            <p>Book (ISBN)</p>
                        </div>
                        <div className='clearfix'>
                            <CButton className='float-end btn-black'>Delete</CButton>
                        </div>
                    </div>
                    <div className='camp-tab-cont'>
                    <div
                        className='nav nav-tabs'
                        id='nav-tab'
                        role='tablist'
                    >
                        <button
                            className={`primary-btn ${book === 'search' && 'active'}`}
                            id='edit-tab'
                            data-bs-toggle='tab'
                            data-bs-target='#edit'
                            type='button'
                            role='tab'
                            aria-selected='true'
                            onClick={() => setBook('search')}
                        >
                            Search Book
                        </button>
                        <button
                            className={`primary-btn ${book === 'Register' && 'active'}`}
                            id='review-tab'
                            data-bs-toggle='tab'
                            data-bs-target='#review'
                            type='button'
                            role='tab'
                            aria-selected='false'
                            onClick={() => setBook('Register')}
                        >
                            Register Book
                        </button>
                    </div>
                    </div>
                    {categories === 'Sub' && (<div>
                        {book === 'search' && <SearchBooks SearchBookList={SearchBookList}
                            searchItemPerPage={searchItemPerPage}
                            setItemSearchPerPage={setItemSearchPerPage}
                            totalSearchPage={totalSearchPage}
                            currentSearchPage={currentSearchPage}
                            setSearchCurrentPage={setSearchCurrentPage}
                            setSearchBookId={setSearchBookId}
                            setBook={setBook}
                            searchBookFilter={searchBookFilter}
                            setSearchBookFilter={setSearchBookFilter}
                            searchBooks={searchBooks} />}
                        {book === 'Register' && <RegisterBook AllBookList={AllBookList} setSearchBookFilter={setSearchBookFilter}
                            setSearchCurrentPage={setSearchCurrentPage}
                            setSearchBookId={setSearchBookId}
                            searchBookId={searchBookId}
                            setSearchBookDetail={setSearchBookDetail}
                            searchBookDetail={searchBookDetail}
                            setFilteredData={setFilteredData}
                            genreId={genreId}
                            setCategories={setCategories}
                            setDeleted={setDeleted}
                            setBook={setBook}
                            setSearchBooks={setSearchBooks}
                            searchBooks={searchBooks} />}
                    </div>)}

                </div>}
                <CModal
                    backdrop="static"
                    visible={deleteVisible}
                    onClose={() => setdeleteVisible(false)}
                    aria-labelledby="StaticBackdropExampleLabel"
                >
                    <CModalHeader>
                        <CModalTitle id="StaticBackdropExampleLabel">Delete</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <p>Are you sure you want to delete this book</p>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="primary" onClick={() => deleteBook(deletebookId)}>Delete</CButton>
                        <CButton onClick={() => setdeleteVisible(false)} color="secondary">
                            Cancel
                        </CButton>
                    </CModalFooter>
                </CModal>
            </div></>

    )
}


export default AllBook
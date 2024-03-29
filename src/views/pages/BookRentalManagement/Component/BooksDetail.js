import { CButton, CFormCheck, CFormInput, CFormSelect, CFormSwitch, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-date-picker'
import Loader from 'src/components/common/Loader'
import { deleteApi, getApi, postApi, putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import { imageUrl } from '../BookRentalStatus'

const BooksDetail = ({ bookId, genreId, setBookId, setSideSubBookBarId, setIconSubBookSet, setSideSubBarId, setIconSubSet, setIconSet, setSideBarId, setFilteredData, setDeleted, bookDisplay, setCategories }) => {

    const [bookData, setBookData] = useState({
        bookgenre: '',
        title: '',
        ISBN: '',
        author: '',
        image: null,
        bookdesr: '',
        visibility: true,
        visibility: true,
        AssociatedItem: null
    })
    const [genre, setGenre] = useState([])
    const [deleteVisible, setdeleteVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [postImage, setPostImage] = useState(null)
    const inputRef = useRef(null)
    const [image, setImage] = useState(null);

    console.log('bookImage', bookData)

    useEffect(() => {
        setBookData({
            bookgenre: genre?.filter((ele) => ele?.label === bookDisplay?.genreName)[0]?.value?.toString(),
            title: bookDisplay.title,
            ISBN: bookDisplay.SIBNCode,
            author: bookDisplay.author,
            image: bookDisplay.image ? bookDisplay.image : null,
            bookdesr: bookDisplay.description,
            visibility: bookDisplay.visibility === 'visible' ? true : false,
            AssociatedItem: bookDisplay.associatedItem ? bookDisplay.associatedItem : 0,
            AvailabilityCount: bookDisplay.availabilityCount,

        })
        // setImage(bookDisplay.image)
        // setImage(bookDisplay.image)
    }, [bookDisplay, bookId])

    useEffect(() => {
        const getBookGenreData = async () => {
            setIsLoading(true)
            try {
                const res = await getApi(API_ENDPOINT.get_genre_list)
                if (res?.status === 200) {
                    const data = await res?.data?.map((op) => {
                        return { 'label': op?.name, 'value': op?.id }

                    })
                    setGenre(data)
                    let val = data?.filter((ele) => ele?.label === bookDisplay?.genreName)[0]?.value?.toString()
                    setBookData((prev) => {
                        return {
                            ...prev,
                            bookgenre: val
                        }
                    })
                    setIsLoading(false)
                }
            } catch (error) {
               console.log(error)
               setIsLoading(false)
            }
        }
        getBookGenreData()
    }, [bookId, bookDisplay])

    const handleChange = (e) => {
        setBookData((prev) => {
            return {
                ...prev,
                bookgenre: e.target.value
            }
        })
    }

    // useEffect(() => {
    // getBookList()  
    // }, [deleted])


    const deleteSingleBook = async () => {
        const url = `${API_ENDPOINT.delete_book}?id=`
        try {
            const res = await deleteApi(url, bookId)
            if (res?.data?.status === 200) {
                enqueueSnackbar('book deleted sucessfully', { variant: 'success' })
                setDeleted((prev) => prev + 1)
                setCategories('AllBooks')
                setdeleteVisible(false)
                setIconSet(null)
                setSideBarId(null)
            }
            else {
                enqueueSnackbar('failed to delete book', { variant: 'error' })
            }
        } catch (error) {
            console.log(error)
        }
    }



    //delete particular book
    const UpdateBook = async () => {
        const url = `${API_ENDPOINT.Edit_book}`
        const body = {
            id: bookId,
            genreId: bookData?.bookgenre ? bookData?.bookgenre : '',
            title: bookData?.title,
            author: bookData?.author,
            SIBNCode: bookData?.ISBN,
            description: bookData?.bookdesr,
            image: image ? image : bookData?.image,
            visibility: bookData?.visibility === true ? 'visible' : 'hide',
            associatedItem: bookData.AssociatedItem ? bookData.AssociatedItem : 0,
            visibility: bookData?.visibility === true ? 'visible' : 'hide',
            associatedItem: bookData.AssociatedItem ? bookData.AssociatedItem : 0
        }


        if (bookData.ISBN === '') {
            enqueueSnackbar('Please enter Book ISBN number', { variant: 'error' })
            return false
        }
        if (bookData.title.trim() === '') {
            enqueueSnackbar('Please enter Book title', { variant: 'error' })
            return false
        }
        if (bookData.author === '') {
            enqueueSnackbar('Please enter author name', { variant: 'error' })
            return false
        }
        if (bookData.image === null) {
            enqueueSnackbar('Please select Book cover image', { variant: 'error' })
            return false
        }
        if (bookData.bookdesr === '') {
            enqueueSnackbar('Please enter Book description', { variant: 'error' })
            return false
        }
        if (bookData.AssociatedItem < 0) {
            enqueueSnackbar('Please enter valid associate Item', { variant: 'error' })
            return false
        }

        try {
            const res = await putApi(url, body)
            if (res?.data?.status === 200) {
                enqueueSnackbar('book updated successfully', { variant: 'success' })
                setDeleted((prev) => prev + 1)
                setCategories('AllBooks')
                setIconSet(null)
                setIconSubSet(null)
                setSideSubBookBarId(null)
                setIconSubBookSet(null)
                setSideBarId(null)
                setBookId(null)
                setSideSubBarId(null)
            }
            else {
                enqueueSnackbar('failed to update book', { variant: 'error' })
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handleUpload = async (e) => {
        if (e.target.files[0].type === 'image/png' || e.target.files[0].type === 'image/jpg' || e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/gif') {
            setImage(URL.createObjectURL(e.target.files[0]))
            const formData = new FormData()
            formData.append('images', e?.target?.files[0])
            formData.append('images', e?.target?.files[0])
            let url = API_ENDPOINT.uploadImages
            const res = await postApi(url, formData)
            setPostImage(res?.data?.processedImageUrls[0]?.imageUrl)
        }

    }

    const handleIsbnChange = (e) => {
        setBookData((prev) => {
            return {
                ...prev,
                ISBN: e.target.value
            }
        })
    }

    const handleTitleChange = (e) => {
        setBookData((prev) => {
            return {
                ...prev,
                title: e.target.value
            }
        })
    }

    const handleAuthorChange = (e) => {
        setBookData((prev) => {
            return {
                ...prev,
                author: e.target.value
            }
        })
    }

    const handleDesrChange = (e) => {
        setBookData((prev) => {
            return {
                ...prev,
                bookdesr: e.target.value
            }
        })
    }

    const handleAssociatedItem = (e) => {
        setBookData((prev) => {
            return {
                ...prev,
                AssociatedItem: e.target.value
            }
        })
    }

    const handleImageChange = () => {
        inputRef.current.click()

    }

    const handleCancel = () => {
        setCategories('AllBooks')
        setDeleted((prev) => prev + 1)
        setFilteredData({
            title: '',
            bookGenre: '',
            itemStatus: '',
            visibility: '',
            status: ''
        })
        setIconSet(null)
        setIconSubSet(null)
        setSideSubBookBarId(null)
        setIconSubBookSet(null)
        setSideBarId(null)
        setBookId(null)
        setSideSubBarId(null)
    }

    const imgUrl = bookData?.image?.includes('https://ptkapi.experiencecommerce.com')
    const imageProps = imgUrl ? { crossOrigin: 'anonymous' } : {}


    return (
        <div style={{ width: '100%' }}>

            <div>
                {isLoading && <Loader />}
                <div>
                    <div className='d-flex justify-content-between'>
                        <h4>Books details</h4>
                        <CButton onClick={() => setdeleteVisible(true)} className='btn-black'>Delete</CButton>
                    </div>
                    <div className="dropdown-container mb-2">
                        {/* <h5 className="me-3">Item Number</h5> */}
                    </div>
                    <div className="card-body">
                        <div className="formWraper">
                            <div className="form-outline form-white   d-flex ">
                                <div className="formWrpLabel" >
                                    <label className="fw-bolder ">
                                        Book Genre
                                    </label>
                                </div>
                                <div className="formWrpInpt d-flex">
                                    <div className="d-flex formradiogroup mb-2 gap-3">
                                        <CFormSelect
                                            // className='mx-4'
                                            style={{ width: '190px' }}
                                            name='itemStatus'
                                            options={genre}
                                            onChange={handleChange}
                                            value={bookData.bookgenre}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-outline form-white d-flex ">
                                <div className="formWrpLabel" >
                                    <label className="fw-bolder ">
                                        ISBN
                                    </label>
                                </div>
                                <div className="formWrpInpt d-flex">
                                    <div className="d-flex formradiogroup mb-2 gap-3">
                                        <CFormInput
                                            value={bookData.ISBN}
                                            onChange={handleIsbnChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-outline form-white d-flex gap-3">
                                <div className="formWrpLabel" >
                                    <label className="fw-bolder ">
                                        Book Title
                                    </label>
                                </div>
                                <div className="formWrpInpt d-flex">
                                    <div className="d-flex formradiogroup mb-2 gap-3">
                                        <CFormInput
                                            value={bookData.title}
                                            onChange={handleTitleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-outline form-white d-flex gap-3">
                                <div className="formWrpLabel" >
                                    <label className="fw-bolder ">
                                        Author
                                    </label>
                                </div>
                                <div className="formWrpInpt d-flex">
                                    <div className="d-flex formradiogroup mb-2 gap-3">
                                        <CFormInput
                                            value={bookData.author}
                                            onChange={handleAuthorChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-outline form-white   d-flex ">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">
                                        Book Cover Image
                                    </label>
                                </div>
                                <div className="formWrpInpt d-flex">
                                    <div className='useDetailImgWrp' >
                                        {bookData?.image ? <img alt='' {...imageProps} src={image ? image : bookData?.image} style={{ height: '100%', width: '100%' }} /> : <img alt='' src='https://www.beelights.gr/assets/images/empty-image.png' style={{ height: '100%', width: '100%' }} />}
                                        <input style={{ display: 'none' }} type="file" name="upload" accept=".png, .jpg, .jpeg" ref={inputRef} onChange={handleUpload} />
                                    </div>
                                    <div className='ms-4'>
                                        <ul>
                                            <li>※ You can upload 1 image only</li>
                                            <li>Maximum File Size : 00</li>
                                            <li>File type : png , jpg , jpeg , gif</li>
                                        </ul>
                                        <button className='mt-2 btn btn-primary' onClick={handleImageChange}>Upload</button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='formWrpLabel' />
                                <div className="form-outline form-white  d-flex ">
                                    <div className="formWrpLabel" >
                                        <label className="fw-bolder">
                                            Book Description
                                        </label>
                                    </div>
                                    <div className="formWrpInpt">
                                        <div className="d-flex formradiogroup mb-2 gap-3">
                                            <CFormTextarea
                                                id="exampleFormControlTextarea1"
                                                rows={3}
                                                name='rentalGuideDescription'
                                                value={bookData.bookdesr}
                                                onChange={handleDesrChange}
                                            // value={addItemData.rentalGuideDescription}
                                            // onChange={(e) => {
                                            //   handleInputChange(e)
                                            // }}
                                            ></CFormTextarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex col-md-12">
                                    <div className="form-outline form-white d-flex w-100">
                                        <div className="formWrpLabel" >
                                            <label className="fw-bolder ">Visibility</label>
                                        </div>
                                        <div className="push-notification-container gap-3">
                                            <CFormCheck type="radio" name="visibility" id="exampleRadios1" label="Visible"
                                                defaultChecked={bookData.visibility}
                                                onClick={() => setBookData((prev) => ({ ...prev, visibility: true }))}
                                                value={true}

                                            />
                                            <CFormCheck type="radio" name="visibility" id="exampleRadios2" label="Hide"
                                                defaultChecked={!bookData.visibility}
                                                onClick={() => setBookData((prev) => ({ ...prev, visibility: false }))}
                                                value={false}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="form-outline form-white   d-flex ">
                                    <div className="formWrpLabel" >
                                        <label className="fw-bolder ">
                                            Associated Items
                                        </label>
                                    </div>
                                    <div className="formWrpInpt d-flex">
                                        <div className="d-flex formradiogroup mb-2 gap-3">
                                            <CFormInput type='number' value={bookData.AssociatedItem} onChange={handleAssociatedItem} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-center gap-3 my-3'>
                    <CButton onClick={handleCancel} className='btn-black'>Cancel</CButton>
                    <CButton onClick={UpdateBook}>Save</CButton>
                </div>
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
                        <p>Are you sure you want to delete this category?
                            <br />
                            All categories and items belonging will be deleted.</p>
                    </CModalBody>
                    <CModalFooter>
                        <CButton onClick={deleteSingleBook} color="primary">Delete</CButton>
                        <CButton onClick={() => setdeleteVisible(false)} color="secondary">
                            Cancel
                        </CButton>
                    </CModalFooter>
                </CModal>
            </div>
        </div>
    )
}

export default BooksDetail;
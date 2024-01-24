import { CButton, CFormCheck, CFormInput, CFormSelect, CFormSwitch, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-date-picker'
import Loader from 'src/components/common/Loader'
import { deleteApi, getApi, postApi, putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const BooksDetail = ({ bookId,genreId, setFilteredData, setDeleted, deleteSingleBook, bookDisplay, setCategories }) => {

    const [bookData, setBookData] = useState({
        bookgenre: '',
        title: '',
        ISBN: '',
        author: '',
        image: null,
        bookdesr: '',
        visibility: false,
        AssociatedItem: null
    })
    const [genre, setGenre] = useState([])
    const [deleteVisible, setdeleteVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [postImage, setPostImage] = useState(null)
    const inputRef = useRef(null)
    const [image, setImage] = useState(null);
    console.log('boodis',bookDisplay)
    useEffect(() => {
        // console.log('test2',genre,genre.filter((ele)=>ele.label === 'Tech')[0].value)
        setBookData({
            bookgenre: genre?.filter((ele)=>ele.label === bookDisplay.genreName)[0]?.value.toString(),
            title: bookDisplay.title,
            ISBN: bookDisplay.SIBNCode,
            author: bookDisplay.author,
            image: bookDisplay.image,
            bookdesr: bookDisplay.description,
            visibility: bookDisplay.visibility === 'visibilty' ? true : false,
            AssociatedItem: bookDisplay.AssociatedItem ? bookDisplay.AssociatedItem : 0,
            AvailabilityCount: bookDisplay.availabilityCount,

        })

        return (() => {
            setImage(null)
        })

    }, [bookDisplay])
    console.log(bookData)

    useEffect(() => {
        const getBookGenreData = async () => {
            const res = await getApi(API_ENDPOINT.get_genre_list)
            if (res?.status === 200) {
                const data = await res?.data?.map((op) => {
                    return { 'label': op?.name, 'value': op?.id }

                })
                setGenre(data)
            }
        }
        getBookGenreData()
    }, [])

    console.log('genre',genre)
    const handleChange = (e) => {
        console.log('ee.atdh',typeof e.target.value)
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



    //delete particular book
    const UpdateBook = async () => {
        const url = `${API_ENDPOINT.Edit_book}`
        const body = {
            id: bookId,
            genreId:bookData?.bookgenre ? bookData?.bookgenre : '' ,
            title: bookData?.title,
            author: bookData?.author,
            SIBNCode: bookData?.ISBN,
            description: bookData?.bookdesr,
            image: image ? image : bookData?.image,
            // availabilityCount: bookDisplay.availabilityCount ? bookDisplay.availabilityCount : '',
            // address: bookDisplay.address ? bookDisplay.address : ''
        }

        try {
            const res = await putApi(url, body)
            if (res?.data?.status === 200) {
                enqueueSnackbar('book updated successfully',{variant : 'success'})
                setDeleted((prev) => prev + 1)
                setCategories('AllBooks')
            }
            else{
                enqueueSnackbar('failed to update book',{variant : 'error'})
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handleUpload = async (e) => {
        if (e.target.files[0].type === 'image/png' || e.target.files[0].type === 'image/jpg' || e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/gif') {
            setImage(URL.createObjectURL(e.target.files[0]))
            const formData = new FormData()
            formData.append('images', e.target.files[0])
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
    }


    return (
        <div style={{ width: '100%' }}>
            <h1>Books details</h1>
            <div>
                {isLoading && <Loader />}
                <div>
                    <div className='d-flex justify-content-end'>
                        <CButton onClick={() => setdeleteVisible(true)}>Delete</CButton>
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
                                            className='mx-4'
                                            style={{ width: '170px' }}
                                            name='itemStatus'
                                            options={genre}
                                            onChange={handleChange}
                                            value={bookData.bookgenre}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-outline form-white   d-flex ">
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
                                <div className='d-flex'>
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
                            </div>
                            <div className="form-outline form-white d-flex gap-3">
                                <div className='d-flex'>
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
                            </div>
                            <div className="form-outline form-white   d-flex ">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">
                                        Book Cover Image
                                    </label>
                                </div>
                                <div className="formWrpInpt d-flex">
                                    <div style={{ width: '180px', overflow: 'hidden', marginBottom: '5%' }} >
                                        {bookData.image !== null ? <img alt='' src={image ? image : bookData.image} style={{ height: '100%', width: '100%' }} /> : <img alt='' src='https://www.beelights.gr/assets/images/empty-image.png' style={{ height: '100%', width: '100%' }} />}
                                        <input style={{ display: 'none' }} type="file" name="upload" accept=".png, .jpg, .jpeg" ref={inputRef} onChange={handleUpload} />
                                    </div>
                                    <div className='ms-4'>
                                        <ul>
                                            <li>※ You can upload 1 image only</li>
                                            <li>Maximum File Size : 00</li>
                                            <li>File type : png , jpg , jpeg , gif</li>
                                        </ul>
                                        <button className='mt-2' style={{ background: '#4f5d73', height: '40px', width: '80px', cursor: 'pointer', borderRadius: 8, color: 'white' }} onClick={handleImageChange}>Upload</button>
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
                                                defaultChecked={!bookData.visibility}
                                                // onClick={() => setAddItemData((prev) => ({ ...prev, visibility: true }))}
                                                // value={true}
                                                // checked={bookData.visibility}
                                                value={bookData.visibility}
                                            />
                                            <CFormCheck type="radio" name="visibility" id="exampleRadios2" label="Hide"
                                                defaultChecked={bookData.visibility}
                                                // onClick={() => setAddItemData((prev) => ({ ...prev, visibility: false }))}
                                                value={bookData.visibility}
                                            //  checked={bookData.visibility}
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
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5%', gap: 10 }}>
                    <CButton onClick={handleCancel} style={{ marginRight: '2%', background: '#ccc', border: 'none' }}>Cancel</CButton>
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
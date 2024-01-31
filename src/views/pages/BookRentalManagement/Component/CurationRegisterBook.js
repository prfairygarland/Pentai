import { CButton, CFormCheck, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { getApi, postApi } from 'src/utils/Api';
import { API_ENDPOINT } from 'src/utils/config';
import { imageUrl } from '../BookRentalStatus';
import { useCallback } from 'react';
import { enqueueSnackbar } from 'notistack';

const CurationRegisterBook = ({ setDeleted, setSearchBookFilter, setSearchCurrentPage, setIconSet, setSideBarId, setCategoryID, searchBookId, categoryID, subCategoryID, setCurationSearchBookDetail, searchCurationBookDetail, setCategories, searchBooks, setCurationBook, setSearchBooks }) => {
    const [RegisteredData, setRegisteredData] = useState({
        bookgenre: '',
        ISBN: '',
        title: '',
        Author: '',
        categoryID: '',
        subCategoryID: '',
        description: '',
        image: null,
        description: '',
        image: null
    })
    const [image, setImage] = useState(null);
    const inputRef = useRef(null)
    const [genre, setGenre] = useState();
    const [category, setCategory] = useState()
    const [Subcategory, setSubCategory] = useState()
    const [postImage, setPostImage] = useState(null)
    const [filterBook, setFilterBook] = useState()


    useEffect(() => {
        if (searchCurationBookDetail) {
            setRegisteredData({
                bookgenre: RegisteredData.bookgenre,
                categoryID: RegisteredData.categoryID,
                subCategoryID: RegisteredData.subCategoryID,
                title: searchCurationBookDetail?.title,
                Author: searchCurationBookDetail?.authors ? searchCurationBookDetail?.authors[0] : '',
                ISBN: searchCurationBookDetail?.industryIdentifiers ? searchCurationBookDetail?.industryIdentifiers[0].identifier.replace('/[^0-9]/g', '') : '',
                description: searchCurationBookDetail?.description ? searchCurationBookDetail.description : '',
                image: searchCurationBookDetail?.imageLinks ? searchCurationBookDetail?.imageLinks.thumbnail : null,
            })
        }
        else {
            setRegisteredData({
                bookgenre: '',
                ISBN: '',
                title: '',
                Author: '',
                categoryID: '',
                subCategoryID: '',
                description: '',
                image: null
            })
        }
    }, [searchCurationBookDetail])



    const hanldleGenreSelect = (e) => {
        const value = e.target.value
        setRegisteredData((prev) => {
            return {
                ...prev,
                bookgenre: value
            }
        })
    }

    const hanldleChangeISBN = (e) => {
        const value = e.target.value
        setRegisteredData((prev) => {
            return {
                ...prev,
                ISBN: value
            }
        })
    }

    const hanldleChangeTitle = (e) => {
        const value = e.target.value
        setRegisteredData((prev) => {
            return {
                ...prev,
                title: value
            }
        })
    }

    const hanldleChangeAuthor = (e) => {
        const value = e.target.value
        setRegisteredData((prev) => {
            return {
                ...prev,
                Author: value
            }
        })
    }

    const hanldleChangeCategory = (e) => {
        const value = e.target.value
        setRegisteredData((prev) => {
            return {
                ...prev,
                categoryID: value
            }
        })
        subCategoryList(value)

    }

    const hanldleChangeSubCategory = (e) => {
        const value = e.target.value
        setRegisteredData((prev) => {
            return {
                ...prev,
                subCategoryID: value
            }
        })
    }

    const hanldleChangedecr = (e) => {
        const value = e.target.value
        setRegisteredData((prev) => {
            return {
                ...prev,
                description: value
            }
        })
    }

    const subCategoryList = async (id) => {
        const url = `${API_ENDPOINT.subCategoryList}?categoryId=${id}`
        const res = await getApi(url)
        if (res.status === 200) {
            const Subcategorydata = res?.data?.map((op) => {
                return { 'label': op?.name, 'value': op?.id }

            })
            setSubCategory(Subcategorydata)
            setRegisteredData((prev) => {
                return {
                    ...prev,
                    subCategoryID: (subCategoryID && categoryID) ? subCategoryID.toString() : Subcategorydata[0].value.toString()
                }
            })

        }
        else {
            setSubCategory([])
            setRegisteredData((prev) => {
                return {
                    ...prev,
                    subCategoryID: ''
                }
            })
        }
    }


    useEffect(() => {
        const getBookGenreData = async () => {
            const res = await getApi(API_ENDPOINT.get_genre_list)
            if (res?.status === 200) {
                const data = await res?.data?.map((op) => {
                    return { 'label': op?.name, 'value': op?.id }

                })
                setGenre(data)
                setRegisteredData((prev) => {
                    return {
                        ...prev,
                        bookgenre: data[0].value.toString()
                    }
                })
            }
        }
        getBookGenreData()


    }, [])

    useEffect(() => {
        subCategoryList(categoryID)
    }, [categoryID])

    const handleCancel = () => {
        setCategories('AllCuration')
        setCurationBook('Curationsearch')
        setSearchBooks([])
        setCurationSearchBookDetail({})
        setCategoryID(null)
        setIconSet(null)
        setSideBarId(null)
        setSearchCurrentPage(0)
        setSearchBookFilter({
            title: ''
        })
    }



    useEffect(() => {
        const BookCategoryList = async () => {
            let sub = []
            const res = await getApi(API_ENDPOINT.categoryList)
            if (res?.status === 200) {
                const categorydata = await res?.data?.map((op) => {
                    return { 'label': op?.categoryName, 'value': op?.categoryId }
                })

                setCategory(categorydata)
                setRegisteredData((prev) => {
                    return {
                        ...prev,
                        categoryID: categoryID ? categoryID.toString() : categorydata[0].value.toString()
                    }
                })

            }
        }
        BookCategoryList()
    }, [categoryID, subCategoryID])



    const handleImageChange = (e) => {
        inputRef.current.click()
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


    const PostData = async () => {
        let Imgurl = RegisteredData?.image?.toString().replace('http:', 'https:')
        const url = `${API_ENDPOINT.createBook}`
        try {
            const body = {
                genreId: RegisteredData.bookgenre,
                categoryId: RegisteredData.categoryID,
                // subCategoryId: RegisteredData.subCategory ? RegisteredData.subCategory : '',
                title: filterBook?.title ? filterBook?.title : RegisteredData.title,
                author: filterBook?.author ? filterBook?.author : RegisteredData.Author,
                SIBNCode: filterBook?.SIBNCode ? filterBook?.SIBNCode : RegisteredData.ISBN,
                description: filterBook?.description ? filterBook?.description : RegisteredData.description,
                image: RegisteredData?.image ? Imgurl : imageUrl + postImage,
                image: RegisteredData?.image ? Imgurl : imageUrl + postImage,
                // availabilityCount: 6,
                // address: 'PTK 16F'

            }

            if (RegisteredData.subCategoryID != '') {
                body['subCategoryId'] = RegisteredData.subCategoryID
            }
            if (RegisteredData.ISBN === '') {
                enqueueSnackbar('Please enter ISBN', { variant: 'error' })
                return false
            }
            if (RegisteredData.title.trim() === '') {
                enqueueSnackbar('Please enter title', { variant: 'error' })
                return false
            }
            if (RegisteredData.Author === '') {
                enqueueSnackbar('Please enter author name', { variant: 'error' })
                return false
            }
            if (RegisteredData.description === '') {
                enqueueSnackbar('Please enter description', { variant: 'error' })
                return false
            }
            if (RegisteredData.image === null) {
                enqueueSnackbar('Please add book Image', { variant: 'error' })
                return false
            }

            const res = await postApi(url, body)
            if (res?.data?.status === 200) {
                enqueueSnackbar("book created successfully", { variant: 'success' })
                setCategories('AllCuration')
                setCurationBook('Curationsearch')
                setIconSet(null)
                setSideBarId(null)
                // setBook('search')
                // setSearchBooks([])
                setDeleted((prev) => prev + 1)
                setSearchCurrentPage(0)
                setSearchBookFilter({
                    title: ''
                })

            }
            else {
                enqueueSnackbar("failed to creat book", { variant: 'error' })
            }
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div style={{ marginTop: '2%' }}>
            <table border="1" className="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th width="150">Book Cover Image</th>
                        <th>Book Information</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div>
                                <div style={{ width: '180px', overflow: 'hidden', marginBottom: '5%' }} >
                                    {RegisteredData?.image !== null ? <img src={image ? image : RegisteredData?.image} style={{ height: '100%', width: '100%' }} /> : <img alt='' src='https://www.beelights.gr/assets/images/empty-image.png' style={{ height: '100%', width: '100%' }} />}
                                    <input style={{ display: 'none' }} type="file" name="upload" accept=".png, .jpg, .jpeg, .gif" ref={inputRef} onChange={handleUpload} />
                                </div>
                                <button style={{ background: '#4f5d73', height: '40px', width: '80px', cursor: 'pointer', borderRadius: 8, color: 'white' }} onClick={handleImageChange}>Upload</button>
                                <div className="file-information">
                                    <ul>
                                        <li>Maximum File Size : 00</li>
                                        <li>File type : png , jpg , jpeg , gif</li>
                                    </ul>
                                </div>
                            </div></td>
                        <td>
                            <table className="table table-bordered">
                                <tr>
                                    <td>Book Genre</td>
                                    <td>
                                        <div style={{ padding: 5 }}>
                                            <CFormSelect
                                                options={genre}
                                                onChange={hanldleGenreSelect}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Category</td>
                                    <td>
                                        <div style={{ padding: 5 }}>
                                            <CFormSelect
                                                options={category ? category : []}
                                                onChange={hanldleChangeCategory}
                                                value={RegisteredData.categoryID}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>SubCategory</td>
                                    <td>
                                        <div style={{ padding: 5 }}>
                                            <CFormSelect
                                                options={Subcategory ? Subcategory : []}
                                                onChange={hanldleChangeSubCategory}
                                                value={RegisteredData.subCategoryID}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>ISBN</td>
                                    <td>
                                        <input style={{ border: '1px solid #ccc', width: '98%', margin: 5 }} value={RegisteredData.ISBN ? RegisteredData.ISBN : filterBook?.SIBNCode} onChange={hanldleChangeISBN} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Book Title</td>
                                    <td>
                                        <input style={{ border: '1px solid #ccc', width: '98%', margin: 5 }} value={RegisteredData.title ? RegisteredData.title : filterBook?.title} onChange={hanldleChangeTitle} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Author </td>
                                    <td>
                                        <input style={{ border: '1px solid #ccc', width: '98%', margin: 5 }} value={RegisteredData.Author ? RegisteredData.Author : filterBook?.author} onChange={hanldleChangeAuthor} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Book Description</td>
                                    <td>
                                        <textarea rows="8" cols="50" style={{ border: '1px solid #ccc', width: '98%', margin: 5 }} value={RegisteredData.description ? RegisteredData.description : filterBook?.description} onChange={hanldleChangedecr} />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </tbody>
            </table>

            <div className='d-flex justify-content-center align-items-center my-3'>
                <CButton onClick={handleCancel} className="btn btn-black" >Cancel</CButton>
                <CButton className="btn "  onClick={PostData}>Add</CButton>
            </div>
        </div>
    )
}

export default CurationRegisterBook;
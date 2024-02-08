import { CButton, CFormCheck, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { getApi, postApi } from 'src/utils/Api';
import { API_ENDPOINT } from 'src/utils/config';
import { imageUrl } from '../BookRentalStatus';
import { useCallback } from 'react';
import { enqueueSnackbar } from 'notistack';
import Loader from 'src/components/common/Loader';

const RegisterBook = ({ setDeleted, book, setSideSubBookBarId, setIconSubBookSet, setIconSubSet, setIconSet, setSideBarId, setSearchBookFilter, setSearchCurrentPage, setBook, setSearchBookId, searchBookId, searchBookDetail, setSearchBookDetail, searchBooks, genreId, setFilteredData, setSearchBooks, setCategories }) => {
    const [RegisteredData, setRegisteredData] = useState({
        bookgenre: '',
        ISBN: '',
        title: '',
        Author: '',
        categoryID: '',
        subCategoryID: '',
        description: '',
        image: null
    })

    const [isLoading, setIsLoading] = useState(false)
    const [image, setImage] = useState(null);
    const inputRef = useRef(null)
    const [genre, setGenre] = useState();
    const [category, setCategory] = useState()
    const [Subcategory, setSubCategory] = useState()
    const [postImage, setPostImage] = useState(null)
    const [filterBook, setFilterBook] = useState()

    console.log('searchBookDetail', searchBookDetail)
    console.log('RegisteredData', RegisteredData)


    useEffect(() => {
            setRegisteredData({
                bookgenre: RegisteredData.bookgenre,
                categoryID: RegisteredData.categoryID,
                subCategoryID: RegisteredData.subCategoryID,
                title: searchBookDetail?.title,
                Author: searchBookDetail?.authors ? searchBookDetail?.authors[0] : '',
                ISBN: searchBookDetail?.industryIdentifiers ? (searchBookDetail?.industryIdentifiers[0]?.type === "ISBN_13" ? searchBookDetail?.industryIdentifiers[0]?.identifier : '') : '',
                description: searchBookDetail?.description ? searchBookDetail.description : '',
                image: searchBookDetail?.imageLinks ? searchBookDetail?.imageLinks.thumbnail : null,
            })
    }, [searchBookDetail, searchBookId])



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
                    subCategoryID: Subcategorydata[0].value.toString()
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
             setIsLoading(true)
             try {     
                 const res = await getApi(API_ENDPOINT.get_genre_list)
                 if (res?.status === 200) {
                     const data = await res?.data?.map((op) => {
                         return { 'label': op?.name, 'value': op?.id }
                      
                     })
                     setIsLoading(false)
                     setGenre(data)
                     setRegisteredData((prev) => {
                         return {
                             ...prev,
                             bookgenre: genreId.toString()
                         }
                     })
                 }
             } catch (error) {
                console.log(error)
                setIsLoading(false)
             }
        }
        getBookGenreData()
        // FilterBookData()
    }, [genreId])


    useEffect(() => {
        subCategoryList()
    }, [])

    const handleCancel = () => {
        setCategories('AllBooks')
        setBook('search')
        setDeleted((prev) => prev + 1)
        setFilteredData({
            title: '',
            bookGenre: '',
            itemStatus: '',
            visibility: '',
            status: ''
        })
        setBook('search')
        setSearchBooks([])
        setSearchBookDetail({})
        setSearchBookId(null)
        setSearchCurrentPage(0)
        setSearchBookFilter({
            title: ''
        })
        setIconSet(null)
        setIconSubSet(null)
        setSideSubBookBarId(null)
        setIconSubBookSet(null)
        setSideBarId(null)
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
                        categoryID: categorydata[0]?.value?.toString()
                    }
                })
            }
        }
        BookCategoryList()
    }, [])



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
        setRegisteredData((prev) =>{
            return {
                ...prev,
                image: (imageUrl + postImage)
            }
        })


    }

    console.log('image', image)
    console.log('postImage', postImage)


    const PostData = async () => {
        let Imgurl = RegisteredData?.image?.toString().replace('http:', 'https:')
        const url = `${API_ENDPOINT.createBook}`
        try {
            const body = {
                genreId: RegisteredData.bookgenre,
                categoryId: RegisteredData.categoryID,
                // subCategoryId: RegisteredData.subCategory ? RegisteredData.subCategory : '',
                title: RegisteredData.title,
                author: RegisteredData.Author,
                SIBNCode: RegisteredData.ISBN,
                description: RegisteredData.description,
                image: RegisteredData?.image ? Imgurl : imageUrl + postImage,
                title: RegisteredData.title,
                author: RegisteredData.Author,
                SIBNCode: RegisteredData.ISBN,
                description: RegisteredData.description,
                image: RegisteredData?.image ? Imgurl : imageUrl + postImage,
            }

            if (RegisteredData.subCategoryID != '') {
                body['subCategoryId'] = RegisteredData.subCategoryID
            }
            if (RegisteredData.categoryID === '') {
                enqueueSnackbar('Please select category', { variant: 'error' })
                return false
            }
            if (RegisteredData.ISBN === '') {
                enqueueSnackbar('Please enter ISBN', { variant: 'error' })
                return false
            }
            if (RegisteredData.ISBN) {
                const validISBN = /\d+$/.test(RegisteredData?.ISBN)
                const CheckisISBN = (RegisteredData.ISBN.length === 10 || RegisteredData.ISBN.length === 13)
                if (!validISBN) {
                    enqueueSnackbar('ISBN should be digit', { variant: 'error' })
                    return false
                }
                if (!CheckisISBN) {
                    enqueueSnackbar('ISBN should be 10 or 13 digits', { variant: 'error' })
                    return false
                }
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
                enqueueSnackbar("Book created successfully", { variant: "success" })
                setCategories('AllBooks')
                setSearchBooks([])
                setDeleted((prev) => prev + 1)
                setBook('search')
                setSearchCurrentPage(0)
                setSearchBookFilter({ title: '' })
                setIconSet(null)
                setIconSubSet(null)
                setSideSubBookBarId(null)
                setIconSubBookSet(null)
                setSideBarId(null)
            }
            else {
                enqueueSnackbar("Failed to create book", { variant: "error" })
            }


        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div style={{ marginTop: '2%' }}>
            {isLoading && <Loader />}
            <table border="1" className="table table-bordered">
                <thead>
                    <tr>
                        <th>Book Cover Image</th>
                        <th>Book Information</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div>
                                <div style={{ width: '180px', overflow: 'hidden', marginBottom: '5%' }} >
                                    {(RegisteredData?.image || image) ? <img src={image ? image : RegisteredData?.image} style={{ height: '100%', width: '100%' }} /> : <img alt='' src='https://www.beelights.gr/assets/images/empty-image.png' style={{ height: '100%', width: '100%' }} />}
                                    <input style={{ display: 'none' }} type="file" name="upload" accept=".png, .jpg, .jpeg, .gif" ref={inputRef} onChange={handleUpload} />
                                </div>
                                <button className='btn btn-primary mb-2' onClick={handleImageChange}>Upload</button>
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
                                                value={RegisteredData.bookgenre}
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
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>ISBN</td>
                                    <td>
                                        <input style={{ border: '1px solid #ccc', width: '98%', margin: 5 }} value={RegisteredData.ISBN} onChange={hanldleChangeISBN} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Book Title</td>
                                    <td>
                                        <input style={{ border: '1px solid #ccc', width: '98%', margin: 5 }} value={RegisteredData.title} onChange={hanldleChangeTitle} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Author </td>
                                    <td>
                                        <input style={{ border: '1px solid #ccc', width: '98%', margin: 5 }} value={RegisteredData.Author} onChange={hanldleChangeAuthor} />
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

            <div className='d-flex justify-content-center align-items-center gap-3 my-3'>
                <CButton onClick={handleCancel} className="btn btn-black" >Cancel</CButton>
                <CButton className="btn" onClick={PostData}>Add</CButton>
            </div>
        </div>
    )
}

export default RegisterBook
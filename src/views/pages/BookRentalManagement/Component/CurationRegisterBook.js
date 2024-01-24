import { CButton, CFormCheck, CFormInput, CFormSelect, CFormTextarea } from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import { getApi, postApi } from 'src/utils/Api';
import { API_ENDPOINT } from 'src/utils/config';
import { imageUrl } from '../BookRentalStatus';
import { useCallback } from 'react';
import { enqueueSnackbar } from 'notistack';

const CurationRegisterBook = ({setDeleted, searchBooks, setCurationBook, setSearchBooks }) => {
    const [RegisteredData, setRegisteredData] = useState({
        bookgenre: '',
        ISBN: '',
        title: '',
        Author: '',
        categoryID: '',
        subCategoryID: '',
        description: ''
    })
    const [image, setImage] = useState(null);
    const inputRef = useRef(null)
    const [genre, setGenre] = useState();
    const [category, setCategory] = useState()
    const [Subcategory, setSubCategory] = useState()
    const [postImage, setPostImage] = useState(null)
    const [filterBook, setFilterBook] = useState()

    const FilterBookData = () => {
        searchBooks.map((item) => {
            setFilterBook({
                genreId: RegisteredData.bookgenre,
                categoryId: RegisteredData.categoryID,
                subCategoryId: RegisteredData.subCategoryID,
                title: item?.title,
                author: item?.authors ? item?.authors[0] : '',
                SIBNCode: item?.industryIdentifiers ? item?.industryIdentifiers[0].identifier.replace('/[^0-9]/g', '') : '',
                description: item?.description,
                image: item?.imageLinks ? item?.imageLinks.thumbnail : '',
                availabilityCount: 5,
                address: 'PTK 17s'
            })
        })
    }

    console.log('cat', genre)

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
        FilterBookData()

        console.log('hello')

    }, [])

    useEffect(() => {
        subCategoryList()
    }, [])

    const handleCancel = () =>{
        setCurationBook('Curationsearch')
        setSearchBooks([])
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

    }


    const PostData = async () => {
        let Imgurl = filterBook?.image?.toString().replace('http:', 'https:')
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
                image: filterBook?.image ? Imgurl : imageUrl + postImage,
                // availabilityCount: 6,
                // address: 'PTK 16F'

            }

            if (RegisteredData.subCategoryID != '') {
                body['subCategoryId'] = RegisteredData.subCategoryID
            }

            const res = await postApi(url, body)
            console.log('body', body)
            if (res.status === 200) {
                enqueueSnackbar({ variant: 'Book added sucessfully' })
                console.log('sucessfully updated')
                // setBook('search')
                // setSearchBooks([])
                setDeleted((prev) => prev + 1)
                
            }
        } catch (error) {
            console.log(error)
        }
    }

    // const cancelPostHandler = () => {
    //     setRegisteredData({
    //         genreId: '',
    //         image: '',
    //         availabilityCount: '',
    //         address: '',
    //         bookgenre: '',
    //         ISBN: '',
    //         title: '',
    //         Author: '',
    //         category: '',
    //         subCategory: '',
    //         description: ''
    //     })
    // }




    return (
        <div style={{ marginTop: '2%' }}>
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
                                    {(filterBook?.image || image) ? <img src={image ? image : filterBook?.image} style={{ height: '100%', width: '100%' }} /> : <img alt='' src='https://www.beelights.gr/assets/images/empty-image.png' style={{ height: '100%', width: '100%' }} />}
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
                                        <input style={{ border: '1px solid #ccc', width: '98%', margin: 5 }} value={ RegisteredData.ISBN ?  RegisteredData.ISBN : filterBook?.SIBNCode} onChange={hanldleChangeISBN} />
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
                                        <input style={{ border: '1px solid #ccc', width: '98%', margin: 5 }} value={RegisteredData.Author ? RegisteredData.Author :  filterBook?.author} onChange={hanldleChangeAuthor} />
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

            <div style={{ margin: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CButton onClick={handleCancel} className="btn save-cancel-btn" style={{ marginRight: '2%', background: '#ccc', border: 'none' }}>Cancel</CButton>
                <CButton className="btn save-cancel-btn" color="dark" onClick={PostData}>Add</CButton>
            </div>
        </div>
    )
}

export default CurationRegisterBook;
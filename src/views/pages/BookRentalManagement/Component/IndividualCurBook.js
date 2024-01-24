import { CButton } from '@coreui/react'
import React, { useEffect } from 'react'
import ReactTable from 'src/components/common/ReactTable'
import { API_ENDPOINT } from 'src/utils/config'

const IndividualCurBook = () => {

    // const handleChange = (e) => {
    //     const value = e.target.value
    //     setSearchBookFilter((prev) => {
    //         return {
    //             ...prev,
    //             title: value
    //         }
    //     })
    // }

    const data = [
        { title: 'history', ISBN: 86578587, Author: 'Don Norman' },
        { title: 'history', ISBN: 86578587, Author: 'Don Norman' },
        { title: 'history', ISBN: 86578587, Author: 'Don Norman' },
        { title: 'history', ISBN: 86578587, Author: 'Don Norman' },
    ]

    // useEffect(() => {
    //     SearchBookList()
    // }, [])


    const PostData = () => {
        // let formData = new FormData()
        // formData.append('image', image)
        // const url = `${API_ENDPOINT.createBook}`
        // const data = searchBooks.map((item) => {
        //     return { 
        //     genreId: item.bookgenre,
        //     categoryId: item.categories[0],
        //     subCategoryId: item.subCategory,
        //     title: item.title,
        //     author: item.authors[0],
        //     SIBNCode: item.industryIdentifiers[0].identifier,
        //     description: item.description,
        //     image: item.imageLinks.thumbnail,
        //     availabilityCount:12,
        //     address: 'PTK 16F'
        // }
        // })
        // try {
        //     // const body = {
        //     //     genreId: searchBooks.bookgenre,
        //     //     categoryId: searchBooks.categories[0],
        //     //     subCategoryId: searchBooks.subCategory,
        //     //     title: searchBooks.title,
        //     //     author: searchBooks.authors[0],
        //     //     SIBNCode: searchBooks.industryIdentifiers[0].identifier,
        //     //     description: searchBooks.description,
        //     //     image: searchBooks.imageLinks.thumbnail,
        //     //     availabilityCount:12,
        //     //     address: 'PTK 16F'

        //     // }

        //     // const res = await postApi(url, body)
        //     console.log('body', data)
        //     // if(res.status===200){
        //     //     console.log('sucessfully updated')
        //     // }
        // } catch (error) {
        //     console.log(error)
        // }
        // setBook('Register')
        // setSearchBookFilter({
        //     title:''
        // })


    }

  return (
    <div style={{width:'100%'}}>
            <div>
                <input className='px-3 py-1 m-3'   />
                <CButton >search</CButton>
            </div>
            <div>

                {
                    data?.map((item, i) => (
                        <table border="1" className="table table-bordered" key={i}>
                            <thead>
                                <tr>
                                    <th>Book Cover Image</th>
                                    <th>Book Information</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td> <img    />  </td>
                                    <td>
                                        <table className="table table-bordered">
                                            <tr>
                                                <td>ISBN</td>
                                                <td>{item?.industryIdentifiers ? item?.industryIdentifiers[0]?.identifier : 'NA'}</td>
                                            </tr>
                                            <tr>
                                                <td>Title</td>
                                                <td>{item?.title ? item?.title : ''}</td>
                                            </tr>
                                            <tr>
                                                <td>Author </td>
                                                <td>jjjj</td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td><CButton>Add</CButton></td>
                                </tr>

                            </tbody>
                        </table>
                    ))
                }

            </div>
         </div >
  )
}

export default IndividualCurBook
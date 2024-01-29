import { CButton } from '@coreui/react'
import React, { useEffect } from 'react'
import ReactTable from 'src/components/common/ReactTable'
import { API_ENDPOINT } from 'src/utils/config'

const CurationSearchBook = ({ searchBooks, setSearchBookId, SearchBookList, searchBookFilter, setCurationBook, setSearchBookFilter }) => {

    const handleChange = (e) => {
        const value = e.target.value
        setSearchBookFilter((prev) => {
            return {
                ...prev,
                title: value
            }
        })
    }

    const PostData = (id) => {
        setCurationBook('CurationRegister')
        setSearchBookFilter({
            title: ''
        })

        setSearchBookId(id)
    }

    console.log('curSearch', searchBooks)

    return (
        <div style={{ width: '100%' }}>
            <div>
                <input className='px-3 py-1 m-3' value={searchBookFilter.title} onChange={handleChange} />
                <CButton onClick={SearchBookList} >search</CButton>
            </div>
            <div>

                <table border="1" className="table table-bordered">
                  {searchBooks.length > 0 &&  <thead>
                        <tr>
                            <th>Book Cover Image</th>
                            <th>Book Information</th>
                            <th>Action</th>
                        </tr>
                    </thead>}
                    <tbody>
                        {
                            searchBooks?.map((item, i) => (
                                <tr key={i}>
                                    <td> <img src={item?.imageLinks?.thumbnail} /></td>
                                    <td>
                                        <table className="table table-bordered">
                                            <tr>
                                                <td>ISBN</td>
                                                <td>{item?.industryIdentifiers ? item?.industryIdentifiers[0]?.identifier : 'NA'}</td>
                                            </tr>
                                            <tr>
                                                <td>Book Title</td>
                                                <td>{item?.title ? item?.title : ''}</td>
                                            </tr>
                                            <tr>
                                                <td>Author </td>
                                                <td>{item?.authors ? item?.authors[0] : 'NA'}</td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td><CButton onClick={() => PostData(i)}>Add</CButton></td>
                                </tr>

                            ))
                        }
                    </tbody>
                </table>

            </div>
        </div >
    )
}

export default CurationSearchBook
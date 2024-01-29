import { CButton } from '@coreui/react'
import React, { useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import ReactTable from 'src/components/common/ReactTable'
import { API_ENDPOINT } from 'src/utils/config'

const SearchBooks = ({ searchBooks, totalSearchPage, currentSearchPage,setSearchCurrentPage, setSearchBookId, searchBookFilter, SearchBookList, setSearchBookFilter, setBook }) => {

    const handleChange = (e) => {
        const value = e.target.value
        setSearchBookFilter((prev) => {
            return {
                ...prev,
                title: value
            }
        })
    }

    console.log('searchBooks', searchBooks.length)

    const PostData = (id) => {
        setBook('Register')
        setSearchBookFilter({
            title: ''
        })

        setSearchBookId(id)
    }

    const handlePageChange = (selectedPage) => {
        // setCurrentPage(selectedPage.selected)
        setSearchCurrentPage(selectedPage)
    }

    return (
        <div>
            <div>
                <input className='px-3 py-1 m-3' onChange={handleChange} value={searchBookFilter.title} />
                <CButton onClick={SearchBookList}>search</CButton>
            </div>
            <div>


              <table border="1" className="table table-bordered" >
                    {searchBooks.length > 0 && <thead>
                        <tr>
                            <th>Book Cover Image</th>
                            <th>Book Information</th>
                            <th>Action</th>
                        </tr>
                    </thead>}
                    <tbody>
                        {
                            searchBooks?.map((item, index) => (
                                <tr key={index}>
                                    <td> <img src={item?.imageLinks?.thumbnail} />  </td>
                                    <td>
                                        <table className="table table-bordered">
                                            <tr>
                                                <td>ISBN</td>
                                                <td>{item?.industryIdentifiers ? item?.industryIdentifiers[0]?.identifier : 'NA'}</td>
                                            </tr>
                                            <tr>
                                                <td>Book Title</td>
                                                <td>Book Title</td>
                                                <td>{item?.title ? item?.title : ''}</td>
                                            </tr>
                                            <tr>
                                                <td>Author </td>
                                                <td>{item?.authors ? item?.authors[0] : 'NA'}</td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td><CButton onClick={() => PostData(index)}>Add</CButton></td>
                                </tr>
                            ))
                        }
                    

                    </tbody>
                </table>
                {searchBooks.length > 0 &&
                    <div className='userlist-pagination'>
                        <div className='userlist-pagination dataTables_paginate'>
                            <ReactPaginate
                                breakLabel={'...'}
                                marginPagesDisplayed={1}
                                previousLabel={<button>Previous</button>}
                                nextLabel={<button>Next</button>}
                                pageCount={totalSearchPage}
                                onPageChange={handlePageChange}
                                forcePage={currentSearchPage}
                                // renderOnZeroPageCount={null}
                                pageRangeDisplayed={3}
                            />
                        </div>

                    </div> }               
         </div >
         </div >
    )
}

export default SearchBooks
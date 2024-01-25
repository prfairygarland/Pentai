import { CButton } from '@coreui/react'
import React, { useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import ReactTable from 'src/components/common/ReactTable'
import { API_ENDPOINT } from 'src/utils/config'

const SearchBooks = ({ searchBooks, totalSearchPage, currentSearchPage,setSearchCurrentPage, setSearchBookTitle, searchBookFilter, SearchBookList, setSearchBookFilter, setBook }) => {

    const handleChange = (e) => {
        const value = e.target.value
        setSearchBookFilter((prev) => {
            return {
                ...prev,
                title: value
            }
        })
    }


    const PostData = (title) => {
        setBook('Register')
        setSearchBookFilter({
            title: ''
        })

        setSearchBookTitle(title)
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
                    {searchBooks.length > 0 && (<thead>
                        <tr>
                            <th>Book Cover Image</th>
                            <th>Book Information</th>
                            <th>Action</th>
                        </tr>
                    </thead>)}
                    <tbody>
                        {
                            searchBooks?.map((item, i) => (
                                <tr key={i}>
                                    <td> <img src={item?.imageLinks?.thumbnail} />  </td>
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
                                    <td><CButton onClick={() => PostData(item?.title)}>Add</CButton></td>
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

                    </div>

                }

            </div>
            {/* </div> */}

            {/* <div className='bookListHeader'>
                <div className='booklstLft'>
                    <h3>Book Cover Image</h3>
                </div>
                <div className='booklstMidd'>
                    <h3 style={{textAlign:'center'}}>Book Information</h3>
                </div>
                <div className='booklstRgt'>
                    <h3>Action</h3>
                </div>
            </div>
            <div className='bookListbody'>
                <div className='bookContList'>
                    <div className='booklstLft'>
                        <img src='https://www.bing.com/th?id=OIP.h_SWAoj5tw44YwJnJ2XN3QHaEz&w=310&h=201&c=8&rs=1&qlt=30&o=6&pid=3.1&rm=2' style={{ height: '100px', width: '100px' }} />
                    </div>
                    <div className='booklstMidd'>
                        <div className='booklstMiddInn'>
                            <div className='leftTxt'>
                                <h4>ISBN</h4>
                            </div>
                            <div className='rightTxt'>
                                <p>86578587</p>
                            </div>
                        </div>
                        <div className='booklstMiddInn'>
                            <div className='leftTxt'>
                                <h4>ISBN</h4>
                            </div>
                            <div className='rightTxt'>
                                <p>86578587</p>
                            </div>
                        </div>
                        <div className='booklstMiddInn'>
                            <div className='leftTxt'>
                                <h4>ISBN</h4>
                            </div>
                            <div className='rightTxt'>
                                <p>86578587</p>
                            </div>
                        </div>
                    </div>
                    <div className='booklstRgt'>
                        <button className='btn btn-primary '>Action</button>
                    </div>
                </div>
            </div> */}
        </div >
    )
}

export default SearchBooks
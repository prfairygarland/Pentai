import { CButton, CFormSelect } from '@coreui/react'
import React, { useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import ReactTable from 'src/components/common/ReactTable'
import { API_ENDPOINT } from 'src/utils/config'
import { paginationItemPerPageOptions } from 'src/utils/constant'

const SearchBooks = ({ searchBooks,
    totalSearchPage,
    setItemSearchPerPage,
    currentSearchPage,
    setSearchCurrentPage,
    setSearchBookId,
    searchBookFilter,
    SearchBookList,
    setSearchBookFilter,
    setBook }) => {

    const handleChange = (e) => {
        const value = e.target.value
        setSearchBookFilter((prev) => {
            return {
                ...prev,
                title: value
            }
        })
    }

    useEffect(() => {
        if(searchBooks.length === 0){
            setSearchBookFilter({title:''})
        }
    }, [searchBooks])
    

    const PostData = (id) => {
        setBook('Register')

        setSearchBookId(id)
    }


    const handlePageChange = (selectedPage) => {
        setSearchCurrentPage(selectedPage.selected)
    }

    const paginationsearch = [
        { label: '3', value: 3 },
        { label: '6', value: 6 },
        { label: '9', value: 9 },
    ]

    return (
        <div style={{ width: '100%' }}>
            <div className='d-flex gap-3 mt-4 w-50'>
                <input className='form-control py-1 ' value={searchBookFilter.title} onChange={handleChange} />
                <CButton onClick={SearchBookList} >search</CButton>
            </div>
            <div>

                <table border="1" className="table table-bordered mt-3">
                    {searchBooks.length > 0 && <thead>
                        <tr>
                            <th width="150">Book Cover Image</th>
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
                <div className='d-flex w-100 justify-content-center gap-3 my-3'>
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
                                    pageRangeDisplayed={4}
                                />
                            </div>

                        </div>

                    }
                    {searchBooks.length > 0 && <div className='d-flex align-items-center gap-2'>
                        <label>Show</label>
                        <CFormSelect
                            className=''
                            aria-label=""
                            options={paginationsearch}
                            onChange={(event) => {
                                setItemSearchPerPage(parseInt(event?.target?.value));
                                setSearchCurrentPage(0)
                            }}
                        />
                        <label>Lists</label>
                    </div>}
                </div>

            </div>
        </div >
    )
}

export default SearchBooks
import { CButton } from '@coreui/react'
import React, { useEffect } from 'react'
import ReactTable from 'src/components/common/ReactTable'
import { API_ENDPOINT } from 'src/utils/config'

const SearchBooks = ({ searchBooks, searchBookFilter, SearchBookList, setSearchBookFilter, setBook }) => {

    const handleChange = (e) => {
        const value = e.target.value
        setSearchBookFilter((prev) => {
            return {
                ...prev,
                title: value
            }
        })
    }


    const PostData = () => {
        setBook('Register')
        setSearchBookFilter({
            title: ''
        })


    }

    return (
        <div>
            <div>
                <input className='px-3 py-1 m-3' onChange={handleChange} value={searchBookFilter.title} />
                <CButton onClick={SearchBookList}>search</CButton>
            </div>
            <div>

                {
                    searchBooks?.map((item, i) => (
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
                                    <td> <img src={item?.imageLinks?.thumbnail} />  </td>
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
                                                <td>{item?.authors ? item?.authors[0] : 'NA'}</td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td><CButton onClick={PostData}>Add</CButton></td>
                                </tr>

                            </tbody>
                        </table>
                        // <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }} key={i}>
                        //     <div style={{ width: '25%', border: '1px solid black', paddingLeft:'5%'}}>
                        //         <div style={{height:'100px', width:'50%', margin:'5%'}}>
                        //         <img  src={item?.imageLinks?.thumbnail} style={{ width: '100px', height:'100px' }} />
                        //         </div>
                        //     </div>
                        //     <div style={{ display: 'flex', flexDirection: 'row', border: '1px solid black', width: '50%' }}>
                        //         <div style={{ borderRight: '1px solid black', width: '30%' }}>
                        //             <p style={{ padding: 8, borderBottom:'1px solid' }}>ISBN</p>
                        //             <p style={{ padding: 8 , borderBottom:'1px solid' }}>title</p>
                        //             <p style={{ padding: 5  }}>Author</p>
                        //         </div>
                        //         <div style={{width:'100%'}}>
                        //             <p style={{ padding: 8,  borderBottom:'1px solid' }}>{item?.industryIdentifiers ? item?.industryIdentifiers[0]?.identifier : 'NA' }</p>
                        //             <p style={{ padding: 8,  borderBottom:'1px solid' }}>{item?.title ? item?.title : ''}</p>
                        //             <p style={{ padding: 5 }}>{item?.authors ? item?.authors[0] : 'NA'}</p>
                        //         </div>
                        //     </div>
                        //     <div style={{ width: '25%', alignItems: 'center', justifyContent: 'center', border: '1px solid black', paddingLeft:'60px', paddingTop:'30px' }}>
                        //         <CButton onClick={PostData}>Add</CButton>
                        //     </div>
                        // </div>
                    ))
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
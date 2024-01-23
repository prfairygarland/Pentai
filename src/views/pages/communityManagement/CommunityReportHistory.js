import { CButton } from '@coreui/react'
import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { NavLink, useLocation } from 'react-router-dom'
import Loader from 'src/components/common/Loader'
import ReactTable from 'src/components/common/ReactTable'
import { getApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'
import { useTranslation } from 'react-i18next'


const CommunityReportHistory = () => {

  const [getPostReportListData, setPostReportListData] = useState([])
  const [getReportCommentListData, setReportCommentListData] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [postReportListTotalCount, setPostReportListTotalCount] = useState(0)
  const [currentPostReportListPage, setCurrentPostReportListPage] = useState(1)
  const [commentReportListTotalCount, setCommentReportListTotalCount] = useState(0)
  const [currentCommentReportListPage, setCurrentCommentReportListPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation()
  const { i18n } = useTranslation()
  const translationObject = i18n.getDataByLanguage(i18n.language)
  const multiLangObj = translationObject?.translation?.communityBulletinAndWelfare


  const communityReportHistoryColumns = useMemo(() => [
    {
      Header: multiLangObj?.no,
      accessor: 'id',
      Cell: ({ row }) => {
        return (currentPostReportListPage - 1) * 5 + (row.index + 1)
      }
    },
    {
      Header: multiLangObj?.writerUsername,
      accessor: 'authUserName',
      Cell: ({ row }) => <p>{row.original.authUserName != null ? row.original.authUserName : '-'}</p>
    },
    {
      Header: multiLangObj?.fullName,
      // accessor: 'authUserName'
      Cell: ({ row }) => <p>{row.original.authUserName != null ? row.original.authUserName : '-'}</p>
    },
    {
      Header: multiLangObj?.historyClassification,
      accessor: 'approvalStatus',
    },
    {
      Header: multiLangObj?.reporterUsername,
      accessor: 'reportedUserName',
      Cell: ({ row }) => <p>{row.original.reportedUserName != null ? row.original.reportedUserName : '-'}</p>
    },
    {
      Header: multiLangObj?.adminUsername,
      accessor: 'adminUserName',
      Cell: ({ row }) => <p>{row.original.adminUserName != null ? row.original.adminUserName : '-'}</p>
    },
    {
      Header: multiLangObj?.reason,
      accessor: 'textReasons',
      Cell: ({ row }) => <p >{row.original.textReasons != null ? row.original.textReasons : row.original.title}</p>

    },
    {
      Header: multiLangObj?.date,
      accessor: 'reportedAt',
      Cell: ({ row }) => <p>{row.original.reportedAt ? moment(row.original.reportedAt).format('YYYY-MM-DD HH:mm:ss') : (row.original.approveOn ? moment(row.original.approveOn).format('YYYY-MM-DD HH:mm:ss') : '-')}</p>
    }

  ], [])

  const communityCommentReportHistoryColumns = useMemo(() => [
    {
      Header: multiLangObj?.no,
      accessor: 'id',
      // Cell: ({ row }) => {
      //   return (currentPostReportListPage - 1) * itemsPerPage + (row.index + 1)
      // }
    },
    {
      Header: multiLangObj.writerUsername,
      accessor: 'authUserName',
      Cell: ({ row }) => <p>{row.original.authUserName != null ? row.original.authUserName : '-'}</p>
    },
    {
      Header: multiLangObj?.fullName,
      // accessor: 'authUserName'
      Cell: ({ row }) => <p>{row.original.authUserName != null ? row.original.authUserName : '-'}</p>

    },
    {
      Header: multiLangObj?.historyClassification,
      accessor: 'approvalStatus',
      Cell: ({ row }) => <p>{row.original.approvalStatus != null ? row.original.approvalStatus : '-'}</p>
    },
    {
      Header: multiLangObj?.reportedUserName,
      accessor: 'reportedUserName',
      Cell: ({ row }) => <p>{row.original.reportedUserName != null ? row.original.reportedUserName : '-'}</p>
    },
    {
      Header: multiLangObj?.adminUsername,
      // accessor: 'reportedUserName',
      Cell: ({ row }) => <p>{row.original.adminUserName != null ? row.original.adminUserName : '-'}</p>
    },
    {
      Header: multiLangObj?.reason,
      accessor: 'textReasons',
      Cell: ({ row }) => <p >{row.original.textReasons != null ? row.original.textReasons : row.original.title}</p>

    },
    {
      Header: multiLangObj?.date,
      accessor: 'reportedAt',
      Cell: ({ row }) => <p>{row.original.approveOn ? moment(row.original.approveOn).format('YYYY-MM-DD HH:mm:ss') : (row.original.reportedAt ? moment(row.original.reportedAt).format('YYYY-MM-DD HH:mm:ss') : (row.original.AdminCommentDeletedOn ? moment(row.original.AdminCommentDeletedOn).format('YYYY-MM-DD HH:mm:ss') : ('-')))}</p>
    }

  ], [])


  useEffect(() => {
    getPostReportData(1);
    geCommentReportData(1);
  }, [])

  console.log('location =>', location.state.postId)


  const getPostReportData = async (currentPostReportListPage) => {
    setIsLoading(true)
    try {
      const res = await getApi(API_ENDPOINT.bulletin_board_post_history + `?postId=${location.state.postId}&pageNo=${currentPostReportListPage}`)
      console.log('getapi usage 1=>', res.data);
      if (res.status === 200) {
        setCurrentPostReportListPage(currentPostReportListPage)
        setPostReportListData(res.data)
        // setPostReportListTotalCount(res.totalCount)
        setPostReportListTotalCount(Math.ceil(res.totalCount / Number(5)));
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const geCommentReportData = async (currentCommentReportListPage) => {
    setIsLoading(true)
    try {
      const res = await getApi(API_ENDPOINT.bulletin_board_post_comment_history + `?postId=${location.state.postId}&pageNo=${currentCommentReportListPage}`)
      console.log('getapi usage 2=>', res.data);
      if (res.status === 200) {
        setReportCommentListData(res.data)
        setCurrentCommentReportListPage(currentCommentReportListPage)
        setCommentReportListTotalCount(Math.ceil(res.totalCount / Number(5)));
        setIsLoading(false)

      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const handleSelectionChange = useCallback((selectedRowsIds) => {
    setSelectedRows([...selectedRows, selectedRowsIds]);

    const getIds = selectedRowsIds.map((item) => {
      console.log('ites =>', item);
      return item.id.toString();
    })


  }, []);

  const handlePostReportListPageChange = (selectedPage) => {
    // setCurrentSuppliesRentalPage(selectedPage.selected)
    console.log('selectedPage.selected =>', selectedPage.selected);
    getPostReportData(selectedPage.selected + 1)
  }

  const handleCommentReportListPageChange = (selectedPage) => {
    // setCurrentSuppliesRentalPage(selectedPage.selected)
    console.log('selectedPage.selected =>', selectedPage.selected);
    geCommentReportData(selectedPage.selected + 1)
  }

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <h1>{multiLangObj?.postCommentReportHistory}</h1>
        <div className='mt-4'>
          <h4 className='p-2'>Post</h4>
          <ReactTable showCheckbox={false} columns={communityReportHistoryColumns} data={getPostReportListData} totalCount={10} onSelectionChange={handleSelectionChange} />
          <div className='userlist-pagination'>
            <div className='userlist-pagination dataTables_paginate'>
              <ReactPaginate
                breakLabel={'...'}
                marginPagesDisplayed={1}
                previousLabel={<button>{multiLangObj?.previous}</button>}
                nextLabel={<button>{multiLangObj?.next}</button>}
                pageCount={postReportListTotalCount}
                onPageChange={handlePostReportListPageChange}
                forcePage={currentPostReportListPage - 1}
                renderOnZeroPageCount={null}
                pageRangeDisplayed={1}
              />
            </div>
          </div>
        </div>
        <div className='mt-4'>
          <h4 className='p-2'>{multiLangObj?.comments}</h4>
          <ReactTable showCheckbox={false} columns={communityCommentReportHistoryColumns} data={getReportCommentListData} totalCount={10} onSelectionChange={handleSelectionChange} />
          <div className='userlist-pagination'>
            <div className='userlist-pagination dataTables_paginate'>
              <ReactPaginate
                breakLabel={'...'}
                marginPagesDisplayed={1}
                previousLabel={<button>{multiLangObj?.previous}</button>}
                nextLabel={<button>{multiLangObj?.next}</button>}
                pageCount={commentReportListTotalCount}
                onPageChange={handleCommentReportListPageChange}
                forcePage={currentCommentReportListPage - 1}
                renderOnZeroPageCount={null}
                pageRangeDisplayed={1}
              />
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-end mt-2 mb-4'>
          <NavLink to='/BulletinBoard'> <CButton>{multiLangObj?.back}</CButton></NavLink>
        </div>
      </div>
    </>
  )
}

export default CommunityReportHistory

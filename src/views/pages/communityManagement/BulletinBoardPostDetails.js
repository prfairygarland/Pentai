import { cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem, CButton, CForm, CFormCheck, CFormSelect, CFormTextarea, CImage, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { NavLink, useNavigate } from 'react-router-dom'
import ReactTable from 'src/components/common/ReactTable'
import { deleteApi, getApi, getBulletinBoardPostDetails, getDeleteReasonsList, getPostCommentListData, getPostLikeListData, getRepoerHistoryList, postApi } from 'src/utils/Api'
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config'

const getUserData = JSON.parse(localStorage.getItem('userdata') ? localStorage.getItem('userdata') : sessionStorage.getItem('sessionUserdata'))

console.log('id check =>', getUserData.id);


const BulletinBoardPostDetails = () => {
  const [bulletinBoardPostDetail, setBulletinBoardPostDetail] = useState([])
  const [postLikeListData, setPostLikeListData] = useState([])
  const [postLikeListDataTotalCount, setPostLikeListDataTotalCount] = useState(0)
  const [postCommentListData, setPostCommentListData] = useState([])
  const [commentsData, setCommentsData] = useState([])
  const [commentCurrentPage, setCommentCurrentPage] = useState(0)
  const [selectedRows, setSelectedRows] = useState([]);
  const [likeCurrentPage, setLikeCurrentPage] = useState(0)
  const [commentcurrentTab, setCommentCurrentTab] = useState('currentComments');
  const [visible, setVisible] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteReason, setDeleteReason] = useState([])
  const [reportHistoryData, setReportHistoryData] = useState([])
  const [selectedDeleteReason, setSelectedDeleteReason] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [otherDeleteInput, setOtherDeleteInput] = useState('');
  const [reportCancelvisible, setReportCancelvisible] = useState(false)
  const [deleteCommentModal, setDeleteCommentModal] = useState(false)
  const [deleteParticipantUserModal, setDeleteParticipantUserModal] = useState(false)
  const [getIdAnduserId, setGetIdAnduserId] = useState({ type: '', ids: null, userIds: null })
  const [postPollParticipantDetail, setPostPollParticipantDetail] = useState([])
  const [postRecuritParticipantDetail, setPostRecuritParticipantDetail] = useState([])
  const [drawWinnersvisible, setDrawWinnersvisible] = useState(false)
  const [winnerListData, setWinnerListData] = useState([])
  const [visibleDeadline, setVisibleDeadline] = useState(false)
  const [enoughParticiapantValues, setEnoughParticiapantValues] = useState(null);
  const [showEnoughParticiapantModal, setShowEnoughParticiapantModal] = useState(false)
  const [winnerCurrentPage, setWinnerCurrentPage] = useState(0)
  const [editComment, setEditComment] = useState({ mode: '', ids: null })




  const navigate = useNavigate();
  const createPostHandler = () => {
    navigate("./", {
      state: {
        postId: id,
        boardID: boardId
      }
    })
  }

  const { id, boardId } = useParams();
  console.log("id", id);
  console.log("boardId", boardId);


  const reportHistoryColumns = useMemo(() => [
    {
      Header: 'No',
      accessor: 'id',

    },
    {
      Header: 'Reporter username',
      accessor: 'EnglishName'
    },
    {
      Header: 'Reason',
      accessor: 'reasonTitle'
    },
    {
      Header: 'Reported time',
      accessor: 'commentReportedAt',
    }


  ], [])

  const handleSelectionChange = useCallback((selectedRowsIds) => {
    setSelectedRows([...selectedRows, selectedRowsIds]);
    console.log('selected rows type =>', typeof selectedRowsIds);

    const getIds = selectedRowsIds.map((item) => {
      console.log('ites =>', item);
      return item.id.toString();
    })
    console.log('getIds', getIds)
    console.log('getIds =>', typeof getIds);

  }, []);

  useEffect(() => {
    BulletinBoardPostDetail();
    getPostLikeList(1);
  }, [])

  useEffect(() => {
    getPostCommentList(1);
  }, [commentcurrentTab])

  const setCommentTab = (tab) => {
    setCommentCurrentTab(tab);
  };

  // https://ptkapi.experiencecommerce.com
  // https://ptkapi.experiencecommerce.com

  const BulletinBoardPostDetail = async () => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/community/postDetailsBulletin?postId=${id}&boardId=${boardId}`
      const res = await getBulletinBoardPostDetails(url);
      console.log('res BulletinBoardPostDetail=>', res);

      if (res.status == 200) {
        setBulletinBoardPostDetail(res.getPostdetails)
        if (res.getPostdetails[0].type == 'poll') {
          pollParticipantData()
        } else if (res.getPostdetails[0].type == 'recruit' || res.getPostdetails[0].type == 'raffle') {
          recuritmentParticipantData(res.getPostdetails[0].recruitmentId, id)
        }

        console.log('date q=>', res.getPostdetails[0]?.recruitmentId);

        if (res.getPostdetails[0]?.isDrawWinners == 1) {
          handleWinnerList(res.getPostdetails[0]?.recruitmentId, id, 1)
        }


      }
    } catch (error) {
      console.log('error getCompaniesData =>', error);
    }
  }

  const getPostLikeList = async (likePageNo) => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/community/postlikeList?postId=${id}&pageNo=${likePageNo}`
      setLikeCurrentPage(likePageNo)
      const res = await getPostLikeListData(url);
      console.log('res like=>', res.data);
      console.log('res totalCount=>', res.totalCount);

      if (res.status == 200) {
        setPostLikeListDataTotalCount(res.totalCount)
        if (likePageNo == 1) {
          setPostLikeListData(res.data)
        } else {
          setPostLikeListData((prevData) => [...prevData, ...res.data]);
        }
      }
    } catch (error) {
      console.log('error getCompaniesData =>', error);
    }
  }

  const getPostCommentList = async (cummentpageNo) => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/community/commentDetails?postId=${id}&pageNo=${cummentpageNo}`
      if (commentcurrentTab == 'currentComments') {
        url = url + `&currentComments=true`
      }
      if (commentcurrentTab == 'deletedByAdmin') {
        url = url + `&deletedByAdmin=true`
      }
      if (commentcurrentTab == 'deletedByWriter') {
        url = url + `&deletedByWriter=true`
      }
      if (commentcurrentTab == 'commentReported') {
        url = url + `&commentReported=true`
      }
      const res = await getPostCommentListData(url);
      setCommentCurrentPage(cummentpageNo)
      console.log('page No =>', cummentpageNo);
      console.log('res =>', res.data);
      if (res.status == 200) {
        setCommentsData(res.data)
        // setPostCommentListData(res.commentsList)
        if (cummentpageNo == 1) {
          setPostCommentListData(res.commentsList)
        } else {
          setPostCommentListData((prevData) => [...prevData, ...res.commentsList]);
        }
      }
    } catch (error) {
      console.log('error getCompaniesData =>', error);
    }
  }

  const getReportHistoryData = async (commentid) => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/community/reportHistoryComments?postId=${id}&commentId=${commentid}`
      const res = await getRepoerHistoryList(url);
      console.log('ReportHistoryData =>', res);
      if (res.status == 200) {
        setReportHistoryData(res.data)
      }
    } catch (error) {
      console.log('error getCompaniesData =>', error);
    }
  }

  const getDeleteReason = async () => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/community/deleteReason?reasonType=deleteUser`
      const res = await getDeleteReasonsList(url);
      console.log('getDeleteReasonsList =>', res);
      if (res.status == 200) {
        setDeleteReason(res.data)
      }
    } catch (error) {
      console.log('error getCompaniesData =>', error);
    }
  }

  const handleSelectChange = (event) => {
    setSelectedDeleteReason(event.target.value);

  };


  const handleICommentnputChange = (event) => {
    setCommentInput(event.target.value)
  }

  const handleDeleteReasonInputChange = (event) => {
    console.log('event =>', event);
    setOtherDeleteInput(event?.target?.value)
  }

  console.log('selectedDeleteReason =>', otherDeleteInput)

  const clearDeleteModuleValues = () => {
    setSelectedDeleteReason('')
  }

  const handlePostComment = async () => {

    try {
      const url = editComment?.mode === 'update' ? API_ENDPOINT.bulletin_post_comment_edit : API_ENDPOINT.bulletin_post_add_comment
      const body = editComment?.mode === 'update' ? { postId: id, text: commentInput, commentId: editComment.ids } : { postId: id, text: commentInput }
      const res = await postApi(url, body)
      console.log('test new =>', res.status)

      if (res.status == 200) {
        console.log('test new test=>', res.status)
        setEditComment({ mode: '', ids: null })
        setCommentInput('')
        getPostCommentList(1)
      }

    } catch (error) {
      console.log('error =>', error)
    }
  }

  const handlePostDelete = async () => {
    try {

      let data = {
        postId: id,
        deleteReasonId: selectedDeleteReason
      }

      if (otherDeleteInput != '') {
        data['text'] = otherDeleteInput
      }

      const res = await postApi(API_ENDPOINT.bulletin_post_delete, data)
      console.log('res =>', res.data.status);
      if (res.data.status == 200) {
        navigate('/BulletinBoard')
      }
    } catch (error) {
      console.log('handlePostDelete error =>', error);
    }
  }




  const handleReportCancle = async (comId, useId) => {
    try {
      const res = await postApi(API_ENDPOINT.bulletin_post_cancel, { postId: id, commentId: comId, commentCancel: true, reportedUserId: useId })
      console.log('res =>', res);
      if (res.status == 200) {
        getPostCommentList(1)
        setReportCancelvisible(false)
      }
    } catch (error) {
      setReportCancelvisible(false)
      console.log('handlePostDelete error =>', error);
    }
  }

  const handlePostCommentDelete = async (comId, useId) => {
    console.log('useId', useId);
    console.log('comId', comId);

    let dataPass = {
      postId: id, commentId: comId,
      commentDelete: true,
      reportedUserId: useId,
      deleteReasonIdAdmin: selectedDeleteReason,
    }
    if (otherDeleteInput != '') {
      dataPass['deleteReasonTextAdmin'] = otherDeleteInput
    }

    try {
      const res = await postApi(API_ENDPOINT.bulletin_post_cancel, dataPass)
      console.log('res =>', res);
      if (res.status == 200) {
        setSelectedDeleteReason('');
        setOtherDeleteInput('')
        clearDeleteModuleValues()
        getPostCommentList(1)
        setDeleteCommentModal(false)
        setGetIdAnduserId({ type: '', ids: null, userIds: null })
      }
    } catch (error) {
      setSelectedDeleteReason('');
      setOtherDeleteInput('')
      clearDeleteModuleValues()
      setDeleteCommentModal(false)
      setGetIdAnduserId({ type: '', ids: null, userIds: null })
      console.log('handlePostDelete error =>', error);
    }
  }

  const handlePostParticipantDelete = async (comId, useId) => {
    console.log('useId new', useId);
    console.log('comId new', comId);

    let dataPass = {
      postId: id,
      deleteUserId: comId,
      recuritmentId: useId,
      deletedReasonId: selectedDeleteReason,
      reasonText: null
    }
    if (otherDeleteInput != '') {
      dataPass['reasonText'] = otherDeleteInput
    }

    try {
      const res = await postApi(API_ENDPOINT.bulletin_post_recurit_delete_participant, dataPass)
      console.log('res =>', res);
      if (res.status == 200) {
        setSelectedDeleteReason('');
        setOtherDeleteInput('')
        clearDeleteModuleValues()
        BulletinBoardPostDetail()
        setDeleteParticipantUserModal(false)
        setGetIdAnduserId({ type: '', ids: null, userIds: null })
      }
    } catch (error) {
      setSelectedDeleteReason('');
      setOtherDeleteInput('')
      clearDeleteModuleValues()
      setDeleteParticipantUserModal(false)
      setGetIdAnduserId({ type: '', ids: null, userIds: null })
      console.log('handlePostDelete error =>', error);
    }
  }

  const handleIdAndUserID = (type, ids, userids) => {


    if (type == 'commentDelete') {
      setDeleteCommentModal(!deleteCommentModal);
    } else if (type == 'participantUserDelete') {
      setDeleteParticipantUserModal(!deleteParticipantUserModal)
    }
    getDeleteReason();
    setGetIdAnduserId({ type: type, ids: ids, userIds: userids })
  }

  const handleDeleteAll = () => {
    console.log('getIdAnduserId =>', getIdAnduserId);
    if (getIdAnduserId.type == 'commentDelete') {
      handlePostCommentDelete(getIdAnduserId.ids, getIdAnduserId.userIds)
    } else if (getIdAnduserId.type == 'participantUserDelete') {
      console.log('new');
      handlePostParticipantDelete(getIdAnduserId.ids, getIdAnduserId.userIds)
    }
  }

  const pollParticipantData = async () => {
    try {
      const res = await getApi(API_ENDPOINT.bulletin_post_poll_participant + `?postId=${id}`)
      console.log('getapi usage =>', res.data);
      if (res.status === 200) {
        setPostPollParticipantDetail(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const recuritmentParticipantData = async (reqId, postId) => {
    try {
      const res = await getApi(API_ENDPOINT.bulletin_post_recurit_participant + `?recuritmentId=${reqId}&postId=${postId}`)
      console.log('getapi usage status =>', res);
      if (res.status === 200) {
        setPostRecuritParticipantDetail(res.data)
        console.log('ProceedAnyway =>', postRecuritParticipantDetail.length);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDrawWinner = async (reqId, postId) => {
    console.log('delete post');
    try {
      const res = await postApi(API_ENDPOINT.bulletin_post_recurit_draw_winners, { recuritmentId: reqId, postId: postId })
      console.log('res =>', res.status)
      if (res.status == 200) {
        BulletinBoardPostDetail()
      }

    } catch (error) {
      console.log('error =>', error)
    }
  }

  const handleRadioButtonClick = (value) => {
    setEnoughParticiapantValues(value);
  };

  const handleEnoughParticiapantValues = () => {

    console.log('test =>', enoughParticiapantValues);
    if (enoughParticiapantValues == 'ExtendDeadline') {
      createPostHandler()
      console.log('gshsh');

    } else if (enoughParticiapantValues == 'ProceedAnyway') {
      setShowEnoughParticiapantModal(true)
    } else if (enoughParticiapantValues == 'CancelRecruitment') {
      console.log('cancel');
      handleCancelRecruitMent()
    }
  }

  const handleCancelRecruitMent = async () => {
    console.log('delete post');
    try {
      const res = await postApi(API_ENDPOINT.bulletin_post_recurit_cancel, { recuritmentId: bulletinBoardPostDetail[0]?.recruitmentId, postId: id })
      console.log('res =>', res.status)
      if (res.status == 200) {
        setVisibleDeadline(false)
        BulletinBoardPostDetail()
      } else {
        setVisibleDeadline(false)
      }

    } catch (error) {
      console.log('error =>', error)
    }
  }

  const handleConfirmParticipantCheck = () => {
    if (bulletinBoardPostDetail[0]?.recruitmentMaxParticipants != bulletinBoardPostDetail[0]?.recruitmentParticipants && showEnoughParticiapantModal == false) {
      setVisibleDeadline(true)
    } else {
      handleConfirmParticipant()
    }
  }

  const handleConfirmParticipant = async () => {
    try {
      console.log('test success');
      const res = await postApi(API_ENDPOINT.bulletin_post_confirm_participant, { recuritmentId: bulletinBoardPostDetail[0]?.recruitmentId, postId: id })
      console.log('res ets=>', res.status)
      if (res.status == 200) {
        BulletinBoardPostDetail()
      }

    } catch (error) {
      console.log('error =>', error)
    }
  }

  const handleWinnerList = async (reqId, ids, pageNo) => {
    try {
      console.log('test success =>', bulletinBoardPostDetail[0]?.recruitmentId);
      const res = await postApi(API_ENDPOINT.bulletin_post_winnerList, { recuritmentId: reqId, postId: ids, pageNo: pageNo })
      setWinnerCurrentPage(pageNo)
      console.log('res ets=>', res.data)
      if (res.status == 200) {
        if (pageNo == 1) {
          setWinnerListData(res.data.data)
        } else {
          setWinnerListData((prevData) => [...prevData, ...res.data.data]);
        }
      }

    } catch (error) {
      console.log('error =>', error)
    }
  }

  const modifyHandler = async (value) => {
    console.log('value =>', value?.comment);
    setCommentInput(value?.comment)
    setEditComment({ mode: 'update', ids: value.id })
  // handlePostComment('update', value.id)
  }



  return (
    <>
      <div>
        <div className='container bg-light p-3 mb-3'>
          <div className='d-flex mb-3 gap-5'>
            <div className='d-flex gap-3'>
              <h6>
                Bulletin Board
              </h6>
              <p>{bulletinBoardPostDetail[0]?.boardName}</p>
            </div>
            <div className='d-flex gap-3'>
              <h6>
                Classification
              </h6>
              <p>{bulletinBoardPostDetail[0]?.status}</p>
            </div>
            <div className='d-flex gap-3'>
              <h6>
                Reported Post
              </h6>
              <p>{bulletinBoardPostDetail[0]?.isReported == 0 ? 'N' : 'Y'}</p>
            </div>
            <div className='d-flex gap-3'>
              <h6>
                Type
              </h6>
              <p>{bulletinBoardPostDetail[0]?.type}</p>
            </div>
          </div>
        </div>
        <div className='container bg-light p-3 mb-3 mt-4'>
          <div>
            <CAccordion alwaysOpen activeItemKey={1}>
              <CAccordionItem itemKey={1}>
                <CAccordionHeader>Post</CAccordionHeader>
                <CAccordionBody>
                  <section className="d-flex flex-row align-items-center">
                    <div className='container'>
                      <div className="row justify-content-center">
                        <div className='col-md-12' >
                          <div className="card p-2">
                            <div className='card-body p-0'>
                              <div className='formWraper'>

                                <div className='d-flex col-md-12'>
                                  <div className="form-outline form-white d-flex col-md-6">
                                    <div className='formWrpLabel'>
                                      <label className="fw-bolder ">Date</label>
                                    </div>
                                    <div className='formWrpInpt'>{bulletinBoardPostDetail[0]?.createdAt?.split('T')[0]}
                                    </div>
                                  </div>
                                  <div className="form-outline form-white  d-flex  col-md-6">
                                    <div className='formWrpLabel'>
                                      <label className="fw-bolder ">Views</label>
                                    </div>
                                    <div className='formWrpInpt'>
                                      {bulletinBoardPostDetail[0]?.views}
                                    </div>
                                  </div>
                                </div>

                                <div className="form-outline form-white d-flex ">
                                  <div className='formWrpLabel'>
                                    <label className="fw-bolder ">Writer</label>
                                  </div>
                                  <div className='formWrpInpt'>{bulletinBoardPostDetail[0]?.authorEnglishName ? bulletinBoardPostDetail[0]?.authorEnglishName : bulletinBoardPostDetail[0]?.AdminUserName}
                                  </div>
                                </div>

                                <div className="form-outline form-white d-flex ">
                                  <div className='formWrpLabel'>
                                    <label className="fw-bolder ">Title*</label>
                                  </div>
                                  <div className='formWrpInpt'>{bulletinBoardPostDetail[0]?.title}
                                  </div>
                                </div>

                                <div className="form-outline form-white d-flex ">
                                  <div className='formWrpLabel'>
                                    <label className="fw-bolder ">Content*</label>
                                  </div>
                                  <div className='formWrpInpt'>{bulletinBoardPostDetail[0]?.content}

                                    {(bulletinBoardPostDetail[0]?.type == 'recruit' || bulletinBoardPostDetail[0]?.type == 'raffle')
                                      &&
                                      <div className='container p-3 mb-3 mt-4'>
                                        <div className='d-flex gap-2'>
                                          <p>Date:</p>
                                          <p>{bulletinBoardPostDetail[0]?.createdAt?.split('T')[0]}</p>
                                        </div>
                                        <div className='d-flex gap-2 mt-3'>
                                          <div className='d-flex gap-2'>
                                            <p>Status:</p>
                                            <p>{bulletinBoardPostDetail[0]?.status}</p>
                                          </div>
                                          <div className='d-flex gap-2'>
                                            <p>No. of Participants
                                              :</p>
                                            <p >{bulletinBoardPostDetail[0]?.type == 'poll' ? bulletinBoardPostDetail[0]?.pollParticipants : bulletinBoardPostDetail[0]?.recruitmentParticipants ? bulletinBoardPostDetail[0]?.recruitmentParticipants : 0}</p>
                                          </div>
                                          <div className='d-flex gap-2'>
                                            <p>Raffel</p>
                                            <p>{bulletinBoardPostDetail[0]?.recruitAllowRaffle == 0 ? 'No' : 'Yes'}</p>
                                          </div>
                                        </div>
                                      </div>
                                    }

                                    {bulletinBoardPostDetail[0]?.type == 'poll'
                                      &&
                                      <div className='container p-3 mb-3 mt-4'>
                                        <div className='d-flex gap-2 mt-3'>
                                          <div className='d-flex gap-2'>
                                            <p>Status:</p>
                                            <p>{bulletinBoardPostDetail[0]?.status}</p>
                                          </div>

                                          <div className='d-flex gap-2'>
                                            <p>Anonymous</p>
                                            <p>{bulletinBoardPostDetail[0]?.annonymousBoard == 0 ? 'No' : 'Yes'}</p>
                                          </div>

                                          <div className='d-flex gap-2'>
                                            <p>Select</p>
                                            <p>{bulletinBoardPostDetail[0]?.annonymousBoard == 0 ? 'Single' : 'Multiple'}</p>
                                          </div>
                                        </div>
                                        <div className='d-flex justify-content-between mt-4'>
                                          <div className='d-flex gap-2'>
                                            <p>{bulletinBoardPostDetail[0]?.pollTitle}</p>
                                          </div>
                                          <div>
                                            <div className='d-flex gap-2'>
                                              <p>Date:</p>
                                              <p>{bulletinBoardPostDetail[0]?.pollCreatedAt?.split('T')[0]}</p>
                                            </div>
                                            <div className='d-flex gap-2 justify-content-end mt-3'>
                                              <p >{bulletinBoardPostDetail[0]?.type == 'poll' ? bulletinBoardPostDetail[0]?.pollParticipants : bulletinBoardPostDetail[0]?.recruitmentParticipants ? bulletinBoardPostDetail[0]?.recruitmentParticipants : 0} Participants</p>
                                            </div>
                                          </div>
                                        </div>

                                        {bulletinBoardPostDetail[0]?.pollInfo?.map((item, index) => (
                                          <div className='d-flex justify-content-between col-md-8 gap-2' key={index}>
                                            <div>
                                              <p>{item?.title}</p>
                                            </div>
                                            <div>
                                              <p>{item?.votes}</p>
                                            </div>
                                          </div>
                                        ))}


                                      </div>
                                    }


                                  </div>
                                </div>

                                <div className="form-outline form-white d-flex ">
                                  <div className='formWrpLabel'>
                                    <label className="fw-bolder ">Upload image</label>
                                  </div>
                                  <div className='formWrpInpt d-flex'>
                                    {bulletinBoardPostDetail[0]?.images?.map((imageUrl, index) => (
                                      <div className='d-flex' key={index}>
                                        <CImage crossOrigin='anonymous' src={ALL_CONSTANTS.API_URL + imageUrl} fluid />
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className='d-flex'>
                                  <div className="form-outline form-white  d-flex ">
                                    <div className='formWrpLabel'>
                                      <label className="fw-bolder ">Push Notification</label>
                                    </div>
                                    <div className='formWrpInpt'>
                                      <div className='d-flex formradiogroup mb-2 gap-3' >
                                        <CFormCheck type="radio" name="club_board" id="exampleRadios1" label="Yes" checked={bulletinBoardPostDetail[0]?.pushNotificationSent == 1} />
                                        <CFormCheck type="radio" name="club_board" id="exampleRadios2" label="No" checked={bulletinBoardPostDetail[0]?.pushNotificationSent == 0} />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="form-outline form-white  d-flex ">
                                    <div className='formWrpLabel'>
                                      <label className="fw-bolder ">Add as Notice</label>
                                    </div>
                                    <div className='formWrpInpt'>
                                      <div className='d-flex formradiogroup mb-2 gap-3' aria-readonly>
                                        <CFormCheck type="radio" name="club_board" id="exampleRadios1" label="Yes" checked={bulletinBoardPostDetail[0]?.isAnnouncement == 1} />
                                        <CFormCheck type="radio" name="club_board" id="exampleRadios2" label="No" checked={bulletinBoardPostDetail[0]?.isAnnouncement == 0} />
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
            <div>
              <div className='d-flex gap-5 mt-3'>
                <div>
                  <button className='btn btn-danger' onClick={() => { setDeleteModal(!deleteModal); getDeleteReason() }}>
                    Delete
                  </button>
                  <CModal
                    backdrop="static"
                    visible={deleteModal}
                    onClose={() => { setDeleteModal(false); clearDeleteModuleValues() }}
                    aria-labelledby="StaticBackdropExampleLabel"
                  >
                    <CModalHeader>
                      <CModalTitle id="StaticBackdropExampleLabel">Reason for deletion</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                      <div className="mb-3">
                        <CFormSelect
                          id="exampleFormControlSelect1"
                          value={selectedDeleteReason}
                          onChange={handleSelectChange}
                        >
                          <option value="" disabled>Please select a reason for deletion of the post.</option>
                          {deleteReason?.map((option, index) => (
                            <option key={index} value={option?.id}>
                              {option?.title}
                            </option>
                          ))}
                        </CFormSelect>
                      </div>
                      {selectedDeleteReason == 8
                        &&
                        <div>
                          <CFormTextarea
                            id="floatingTextarea"
                            floatingLabel="Enter the report details."
                            placeholder="Leave a comment here"
                            onChange={handleDeleteReasonInputChange}
                          ></CFormTextarea>
                        </div>
                      }
                    </CModalBody>
                    <CModalFooter className='d-flex justify-content-center'>
                      <CButton color="secondary" onClick={() => { setDeleteModal(false); clearDeleteModuleValues() }}>
                        Cancel
                      </CButton>
                      <CButton color="primary" disabled={selectedDeleteReason == ''} onClick={() => handlePostDelete()} >Confirm</CButton>
                    </CModalFooter>
                  </CModal>
                </div>
                <div>
                  {bulletinBoardPostDetail[0]?.isReported == 1
                    &&
                    <button className='btn btn-danger'>
                      Cancel Report
                    </button>
                  }
                </div>
                <div className='d-flex gap-3'>
                  {(getUserData.id == bulletinBoardPostDetail[0]?.authorId && bulletinBoardPostDetail[0]?.status != 'cancelled')
                    &&
                    <CButton className='btn btn-primary'>Modify</CButton>
                  }
                  <NavLink to='/BulletinBoard'><CButton className='btn btn-primary'  >Back</CButton></NavLink>
                </div>
              </div>

            </div>

          </div>
        </div>
        <div className='container bg-light p-3 mb-3 mt-4'>
          <div>
            <CAccordion alwaysOpen activeItemKey={1}>
              <CAccordionItem >
                <CAccordionHeader>Likes</CAccordionHeader>
                <CAccordionBody>
                  {postLikeListData?.map((item, index) => (
                    <div className='participantList' key={index}>
                      <div className='participatntCont'>
                        <div className='participatntimgBox'>
                          {item?.profileImage ?
                            <CImage rounded crossorigin="anonymous" src={ALL_CONSTANTS.API_URL + item?.profileImage} /> : <CIcon icon={cilUser} size="lg" />
                          }
                        </div>
                        <h3>{item?.englishName}</h3>
                      </div>

                    </div>
                  ))}
                  {(postLikeListData.length >= 5 && postLikeListData.length != postLikeListDataTotalCount) &&
                    <div className="text-center mt-3">
                      <CButton color="primary" onClick={() => getPostLikeList(likeCurrentPage + 1)}>
                        See More
                      </CButton>
                    </div>
                  }
                  {postLikeListData.length == 0 &&
                    <div className="text-center mt-3">
                      <h5>No data Available</h5>
                    </div>
                  }
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>

          </div>
        </div>
        {(bulletinBoardPostDetail[0]?.type == 'poll' || bulletinBoardPostDetail[0]?.type == 'standard') &&
        <div className='container bg-light p-3 mb-3 mt-4'>
          <div>
            <CAccordion alwaysOpen activeItemKey={1}>
              <CAccordionItem >
                <CAccordionHeader>Comments</CAccordionHeader>
                <CAccordionBody>
                  <div>
                    <div className='container d-flex justify-content-center gap-5'>
                      <div>
                        <p>
                          Current Comments
                        </p>
                        <p onClick={() => setCommentTab('currentComments')}>
                          {commentsData[0]?.currentCommentCount}
                        </p>
                      </div>
                      <div>
                        <p>
                          Deleted by Admin
                        </p>
                        <p onClick={() => setCommentTab('deletedByAdmin')}>
                          {commentsData[0]?.deletedByAdmin}
                        </p>
                      </div>
                      <div>
                        <p>
                          Deleted by Writer
                        </p>
                        <p onClick={() => setCommentTab('deletedByWriter')}>
                          {commentsData[0]?.deletedByUserId}
                        </p>
                      </div>
                      <div>
                        <p>
                          Reported
                        </p>
                        <p onClick={() => setCommentTab('commentReported')}>
                          {commentsData[0]?.commentsReported}
                        </p>
                      </div>
                    </div>
                    <div className='mt-4'>
                      <CForm>
                        <CFormTextarea
                          id="postTextarea"
                          placeholder="Write your post here..."
                          value={commentInput}
                          onChange={handleICommentnputChange}
                        />
                        <CButton
                          color="primary"
                          // onClick={handlePost}
                          className="mt-2"
                          disabled={commentInput == ''}
                            onClick={() => { handlePostComment() }}
                        >
                          Post
                        </CButton>
                      </CForm>
                    </div>

                    {postCommentListData?.map((item, index) => (
                      <div className=' mb-4 mt-3' key={index}>
                        <div className='d-flex justify-content-between align-items-center'>
                          <div className='flex'>
                            <h4 style={{ margin: 0 }}>{item?.commentPostedAt} | {item?.englishName}</h4>
                          </div>
                          {commentcurrentTab != 'deletedByAdmin' && commentcurrentTab != 'deletedByWriter' &&
                            <div >
                              {commentcurrentTab == 'commentReported' && <a onClick={() => setReportCancelvisible(!reportCancelvisible)} > Report Cancel &nbsp; | &nbsp; </a>}
                              {(commentcurrentTab == 'currentComments' && getUserData.id == bulletinBoardPostDetail[0]?.authorId) && <a onClick={() => { modifyHandler(item) }} > Modify &nbsp; | &nbsp; </a>}
                              <CModal
                                backdrop="static"
                                visible={reportCancelvisible}
                                onClose={() => setReportCancelvisible(false)}
                                aria-labelledby="LiveDemoExampleLabel"
                              >
                                <CModalHeader onClose={() => setReportCancelvisible(false)}>
                                  <CModalTitle id="LiveDemoExampleLabel">Report Cancel</CModalTitle>
                                </CModalHeader>
                                <CModalBody>
                                  <p>Are you sure !</p>
                                </CModalBody>
                                <CModalFooter>
                                  <CButton color="secondary" onClick={() => setReportCancelvisible(false)}>
                                    Close
                                  </CButton>
                                  <CButton color="primary" onClick={() => handleReportCancle(item?.id, item?.userId)}>Report Cancel</CButton>
                                </CModalFooter>
                              </CModal>
                              <a onClick={() => { handleIdAndUserID('commentDelete', item?.id, item?.userId) }} >Delete</a>

                            </div>
                          }
                        </div>
                        <div>
                          <p style={{ margin: 0, marginBottom: 5 }}>{item?.comment}</p>
                        </div>
                        {commentcurrentTab == 'commentReported' &&
                          <div className='d-flex justify-content-end'>
                            <a onClick={() => { setVisible(!visible); getReportHistoryData(item?.id) }}>View Report History</a>
                          </div>
                        }


                      </div>
                    ))}

                      {/* Report History */}

                      <div>
                        <CModal
                          backdrop="static"
                          visible={visible}
                          alignment="center"
                          size='lg'
                          onClose={() => setVisible(false)}
                          aria-labelledby="StaticBackdropExampleLabel"
                        >
                          <CModalHeader>
                            <CModalTitle id="StaticBackdropExampleLabel">Report history</CModalTitle>
                          </CModalHeader>
                          <CModalBody>
                            <ReactTable showCheckbox={false} columns={reportHistoryColumns} data={reportHistoryData} totalCount={5} onSelectionChange={handleSelectionChange} />
                          </CModalBody>

                        </CModal>
                      </div>


                      {/* comment delete */}
                      <div>
                        <CModal
                          backdrop="static"
                          visible={deleteCommentModal}
                          onClose={() => { setDeleteCommentModal(false); clearDeleteModuleValues(); setGetIdAnduserId({ type: '', ids: null, userIds: null }) }}
                          aria-labelledby="StaticBackdropExampleLabel"
                        >
                          <CModalHeader>
                            <CModalTitle id="StaticBackdropExampleLabel">Reason for deletion</CModalTitle>
                          </CModalHeader>
                          <CModalBody>
                            <div className="mb-3">
                              <CFormSelect
                                id="exampleFormControlSelect1"
                                value={selectedDeleteReason}
                                onChange={handleSelectChange}
                              >
                                <option value="" disabled>Please select a reason for deletion of the post.</option>
                                {deleteReason?.map((option, index) => (
                                  <option key={index} value={option?.id}>
                                    {option?.title}
                                  </option>
                                ))}
                              </CFormSelect>
                            </div>
                            {selectedDeleteReason == 8 &&
                              <div>
                                <CFormTextarea
                                  id="floatingTextarea"
                                  floatingLabel="Enter the report details."
                                  placeholder="Leave a comment here"
                                  onChange={handleDeleteReasonInputChange}
                                ></CFormTextarea>
                              </div>
                            }
                          </CModalBody>
                          <CModalFooter className='d-flex justify-content-center'>
                            <CButton color="secondary" onClick={() => { setDeleteCommentModal(false); clearDeleteModuleValues(); setGetIdAnduserId({ type: '', ids: null, userIds: null }) }}>
                              Cancel
                            </CButton>
                            <CButton color="primary" disabled={selectedDeleteReason == ''} onClick={() => handleDeleteAll()} >Confirm</CButton>
                          </CModalFooter>
                        </CModal>
                      </div>

                  </div>
                  {postCommentListData.length >= 5 &&
                    <div className="text-center mt-3">
                      <CButton color="primary" onClick={() => getPostCommentList(commentCurrentPage + 1)}>
                          See More
                      </CButton>
                    </div>
                  }

                    {postCommentListData.length == 0 &&
                      <div className="text-center mt-3">
                        <h5>No data Available</h5>
                      </div>
                    }

                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>

          </div>
        </div>
        }
        {bulletinBoardPostDetail[0]?.type == 'poll' &&
          <div className='container bg-light p-3 mb-3 mt-4'>
            <div>
              <CAccordion alwaysOpen activeItemKey={1}>
                <CAccordionItem >
                  <CAccordionHeader>Participants</CAccordionHeader>
                  <CAccordionBody>
                    {postPollParticipantDetail?.map((item, index) => (
                      <div key={index}>
                        <div className='container' >
                          <div>
                            <h4>{item?.title}</h4>
                          </div>
                          {item?.participants?.map((items, index) => (
                            <div className='p-3 col-md-12' key={index}>
                              <div className='d-flex gap-4'>
                                {items?.url ?
                                  <CImage style={{ width: '5%' }} rounded crossorigin="anonymous" src={'https://ptkapi.experiencecommerce.com' + items?.url} /> : <CIcon icon={cilUser} size="lg" />
                                }
                                <p>{items?.englishName}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                  </CAccordionBody>
                </CAccordionItem>
              </CAccordion>

            </div>
          </div>
        }
        {(bulletinBoardPostDetail[0]?.type == 'recruit' || bulletinBoardPostDetail[0]?.type == 'raffle') &&
          <div className='container bg-light p-3 mb-3 mt-4'>
            <div>
              <CAccordion alwaysOpen activeItemKey={1}>
                <CAccordionItem >
                  <div>
                    <CAccordionHeader>Participants  &nbsp;&nbsp;&nbsp;
                      {bulletinBoardPostDetail[0]?.type == 'raffle' && getUserData.id == bulletinBoardPostDetail[0]?.authorId && bulletinBoardPostDetail[0].isConfirmed == 1 && bulletinBoardPostDetail[0].isDrawWinners == null && <CButton className='btn btn-primary' onClick={() => setDrawWinnersvisible(!drawWinnersvisible)}>Draw Winners</CButton>}
                      &nbsp;&nbsp;&nbsp;
                      {bulletinBoardPostDetail[0]?.type == 'raffle' && getUserData.id == bulletinBoardPostDetail[0]?.authorId && bulletinBoardPostDetail[0]?.recruitmentDeadlineExceeded == 1 && bulletinBoardPostDetail[0]?.status != 'cancelled' && bulletinBoardPostDetail[0]?.isConfirmed == null && <CButton className='btn btn-primary' onClick={() => handleConfirmParticipantCheck()}>Confirm</CButton>}
                    </CAccordionHeader>
                    <CModal
                      backdrop="static"
                      visible={drawWinnersvisible}
                      onClose={() => setDrawWinnersvisible(false)}
                      aria-labelledby="StaticBackdropExampleLabel"
                    >
                      <CModalHeader>
                        <CModalTitle id="StaticBackdropExampleLabel">Post</CModalTitle>
                      </CModalHeader>
                      <CModalBody>
                        Are you sure you want to draw winners?
                      </CModalBody>
                      <CModalFooter>
                        <CButton color="secondary" onClick={() => setDrawWinnersvisible(false)}>
                          Cancel
                        </CButton>
                        <CButton color="primary" onClick={() => { handleDrawWinner(bulletinBoardPostDetail[0]?.recruitmentId, id); setDrawWinnersvisible(false) }} >Confirm</CButton>
                      </CModalFooter>
                    </CModal>
                  </div>
                  <CAccordionBody>
                    {postRecuritParticipantDetail?.map((item, index) => (
                      <div className='participantList' key={index}>
                        <div className='participatntCont'>
                          <div className='participatntimgBox'>
                            {item?.profileImage ?
                              <CImage rounded crossorigin="anonymous" src={ALL_CONSTANTS.API_URL + item?.profileImage} /> : <CIcon icon={cilUser} size="lg" />
                            }
                          </div>
                          <div>
                            <h3>{item?.englishName}</h3>
                            <p>{item?.participantscreatedAt.split('T')[0]}</p>
                          </div>
                        </div>
                        {getUserData.id == bulletinBoardPostDetail[0]?.authorId &&
                          <div>
                            <CButton className='btn btn-danger' onClick={() => { handleIdAndUserID('participantUserDelete', item?.userId, item?.recruitmentId) }}>Delete user</CButton>
                          </div>
                        }
                      </div>
                    ))}



                    {/* <div className="text-center mt-3">
                    <CButton color="primary">
                        See More
                    </CButton>
                  </div> */}

                    {postRecuritParticipantDetail.length == 0 &&
                      <div className="text-center mt-3">
                        <h5>No data Available</h5>
                      </div>
                    }


                    {/* Participant User delete */}
                    <div>
                      <CModal
                        backdrop="static"
                        visible={deleteParticipantUserModal}
                        onClose={() => { setDeleteParticipantUserModal(false); clearDeleteModuleValues(); setGetIdAnduserId({ type: '', ids: null, userIds: null }) }}
                        aria-labelledby="StaticBackdropExampleLabel"
                      >
                        <CModalHeader>
                          <CModalTitle id="StaticBackdropExampleLabel">Reason for deletion</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                          <div className="mb-3">
                            <CFormSelect
                              id="exampleFormControlSelect1"
                              value={selectedDeleteReason}
                              onChange={handleSelectChange}
                            >
                              <option value="" disabled>Please select a reason for deletion of the post.</option>
                              {deleteReason?.map((option, index) => (
                                <option key={index} value={option?.id}>
                                  {option?.title}
                                </option>
                              ))}
                            </CFormSelect>
                          </div>
                          {selectedDeleteReason == 8 &&
                            <div>
                              <CFormTextarea
                                id="floatingTextarea"
                                floatingLabel="Enter the report details."
                                placeholder="Leave a comment here"
                                onChange={handleDeleteReasonInputChange}
                              ></CFormTextarea>
                            </div>
                          }
                        </CModalBody>
                        <CModalFooter className='d-flex justify-content-center'>
                          <CButton color="secondary" onClick={() => { setDeleteParticipantUserModal(false); clearDeleteModuleValues(); setGetIdAnduserId({ type: '', ids: null, userIds: null }) }}>
                            Cancel
                          </CButton>
                          <CButton color="primary" disabled={selectedDeleteReason == ''} onClick={() => handleDeleteAll()} >Confirm</CButton>
                        </CModalFooter>
                      </CModal>
                    </div>
                  </CAccordionBody>
                </CAccordionItem>
              </CAccordion>

            </div>
          </div>
        }

        {bulletinBoardPostDetail[0]?.isDrawWinners == 1 &&
          <div className='container bg-light p-3 mb-3 mt-4'>
            <div>
              <CAccordion alwaysOpen activeItemKey={1}>
                <CAccordionItem >
                  <CAccordionHeader>Winner</CAccordionHeader>
                  <CAccordionBody>
                    {winnerListData?.map((item, index) => (
                      <div className='participantList' key={index}>
                        <div className='participatntCont'>
                          <div className='participatntimgBox'>
                            {item?.profileImage ?
                              <CImage rounded crossorigin="anonymous" src={ALL_CONSTANTS.API_URL + item?.profileImage} /> : <CIcon icon={cilUser} size="lg" />
                            }
                          </div>
                          <div>
                            <h3>{item?.englishName}</h3>
                            <p>{item?.participantscreatedAt?.split('T')[0]}</p>
                          </div>
                        </div>

                      </div>
                    ))}
                    {winnerListData.length >= 1 &&
                      <div className="text-center mt-3">
                        <CButton color="primary" onClick={() => handleWinnerList(bulletinBoardPostDetail[0]?.recruitmentId, id, winnerCurrentPage + 1)}>
                          See More
                        </CButton>
                      </div>
                    }
                    {winnerListData.length == 0 &&
                      <div className="text-center mt-3">
                        <h5>No data Available</h5>
                      </div>
                    }
                  </CAccordionBody>
                </CAccordionItem>
              </CAccordion>

            </div>
          </div>
        }


        <div>
          <CModal
            backdrop="static"
            visible={visibleDeadline}
            onClose={() => { setVisibleDeadline(false); setEnoughParticiapantValues(null) }}
            aria-labelledby="StaticBackdropExampleLabel"
          >
            <CModalHeader>
              <CModalTitle id="StaticBackdropExampleLabel">Not enough participants</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <p>There are not enough participants. Please select one of the options below.</p>
              <div className='mt-3'>
                <CFormCheck
                  type="checkbox"
                  id="button1"
                  label="Extend deadline"
                  checked={enoughParticiapantValues == 'ExtendDeadline'}
                  onChange={() => handleRadioButtonClick('ExtendDeadline')}
                />
                <CFormCheck
                  type="checkbox"
                  id="button2"
                  label="Proceed anyway"
                  checked={enoughParticiapantValues == 'ProceedAnyway'}
                  onChange={() => handleRadioButtonClick('ProceedAnyway')}
                />
                <CFormCheck
                  type="checkbox"
                  id="button3"
                  label="Cancel recruitment"
                  checked={enoughParticiapantValues == 'CancelRecruitment'}
                  onChange={() => handleRadioButtonClick('CancelRecruitment')}
                />
              </div>
            </CModalBody>
            <CModalFooter>
              <CButton disabled={enoughParticiapantValues == null || (enoughParticiapantValues == 'ProceedAnyway' && postRecuritParticipantDetail.length == 0)} onClick={() => handleEnoughParticiapantValues()} color="primary">Ok</CButton>
            </CModalFooter>
          </CModal>
        </div>


      </div>
    </>
  )
}


export default BulletinBoardPostDetails
import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons'
import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CButton,
  CFormCheck,
  CFormSelect,
  CFormTextarea,
  CImage,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Loader from 'src/components/common/Loader'
import {
  getApi,
  getDeleteReasonsList,
  getPostLikeListData,
  getPostCommentListData,
  postApi,
} from 'src/utils/Api'
import { ALL_CONSTANTS, API_ENDPOINT } from 'src/utils/config'

const BulletinBoardPostDetails = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [clubPostData, setClubPostData] = useState([])
  const [postLikeListData, setPostLikeListData] = useState([])
  const [likeCurrentPage, setLikeCurrentPage] = useState(0)
  const [postLikeListDataTotalCount, setPostLikeListDataTotalCount] = useState(0)

  const [postCommentListData, setPostCommentListData] = useState([])
  const [commentCurrentPage, setCommentCurrentPage] = useState(0)
  const [postCommentListDataTotalCount, setPostCommentListDataTotalCount] = useState(0)

  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteReason, setDeleteReason] = useState([])
  const [selectedDeleteReason, setSelectedDeleteReason] = useState('')
  const [otherDeleteInput, setOtherDeleteInput] = useState('')
  const [deletePostConfirm, setDeletePostConfirm] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const getClubPostDetails = async () => {
    try {
      let url = `${API_ENDPOINT.get_club_post_details}?postId=${location.state.postId}`
      const res = await getApi(url)

      if (res.status === 200) {
        setClubPostData(res.getPostdetails)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getPostLikeList = async (likePageNo) => {
    try {
      let url = `${ALL_CONSTANTS.API_URL}/api/adminPanel/community/postlikeList?postId=${location.state.postId}&pageNo=${likePageNo}`
      setLikeCurrentPage(likePageNo)
      const res = await getPostLikeListData(url)
      console.log('res like=>', res.data)
      console.log('res totalCount=>', res.totalCount)

      if (res.status == 200) {
        setPostLikeListDataTotalCount(res.totalCount)
        if (likePageNo == 1) {
          setPostLikeListData(res.data)
        } else {
          setPostLikeListData((prevData) => [...prevData, ...res.data])
        }
      }
    } catch (error) {
      console.log('error getCompaniesData =>', error)
    }
  }

  const getPostCommentList = async (commentPageNo) => {
    try {
      let url = `${ALL_CONSTANTS.API_URL}/api/adminPanel/community/clubPostCommentList?postId=${location.state.postId}&pageNo=${commentPageNo}`

      setCommentCurrentPage(commentPageNo)
      const res = await getPostCommentListData(url)
      console.log('res comment=>', res.data)
      console.log('res totalCount=>', res.totalCount)

      if (res.status == 200) {
        setPostCommentListDataTotalCount(res.totalCount)
        if (commentPageNo == 1) {
          setPostCommentListData(res.data)
        } else {
          setPostCommentListData((prevData) => [...prevData, ...res.data])
        }
      }
    } catch (error) {
      console.log('error getCompaniesData =>', error)
    }
  }

  const getDeleteReason = async () => {
    try {
      let url = `https://ptkapi.experiencecommerce.com/api/adminPanel/community/deleteReason?reasonType=deleteUser`
      const res = await getDeleteReasonsList(url)
      console.log('getDeleteReasonsList =>', res)
      if (res.status == 200) {
        setDeleteReason(res.data)
      }
    } catch (error) {
      console.log('error getCompaniesData =>', error)
    }
  }

  const clearDeleteModuleValues = () => {
    setSelectedDeleteReason('')
    setOtherDeleteInput('')
  }

  const handleSelectChange = (event) => {
    setSelectedDeleteReason(event.target.value)
  }

  const handleDeleteReasonInputChange = (event) => {
    console.log('event =>', event)
    let value = event.target.value
    value = value.substring(0, 500)

    setOtherDeleteInput(value)
  }

  const handlePostDelete = async () => {
    console.log('console Delete')
    setIsLoading(true)
    try {
      let data = {
        postId: location.state.postId,
        deleteReasonId: selectedDeleteReason,
      }

      if (otherDeleteInput != '') {
        data['text'] = otherDeleteInput
      }

      const res = await postApi(API_ENDPOINT.club_post_delete, data)
      console.log('res =>', res.data.status)
      if (res.data.status == 200) {
        setDeletePostConfirm(false)
        setDeleteModal(false)
        setIsLoading(false)
        navigate('/ClubBoard')
      }
    } catch (error) {
      console.log('handlePostDelete error =>', error)
    }
  }

  useEffect(() => {
    getClubPostDetails()
    getPostLikeList(1)
    getPostCommentList(1)
  }, [])

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <div className="container bg-light p-3 mb-3 mt-4">
          <div>
            <CAccordion alwaysOpen activeItemKey={1}>
              <CAccordionItem itemKey={1}>
                <CAccordionHeader>Post</CAccordionHeader>
                <CAccordionBody>
                  <section className="d-flex flex-row align-items-center">
                    <div className="container">
                      <div className="row justify-content-center">
                        <div className="col-md-12">
                          <div className="card p-2">
                            <div className="card-body p-0">
                              <div className="formWraper">
                                <div className="d-flex col-md-12">
                                  <div className="form-outline form-white d-flex col-md-6">
                                    <div className="formWrpLabel">
                                      <label className="fw-bolder ">Date</label>
                                    </div>
                                    <div className="formWrpInpt">
                                      {new Date(clubPostData?.createdAt).toLocaleString()}
                                    </div>
                                  </div>
                                  <div className="form-outline form-white  d-flex  col-md-6">
                                    <div className="formWrpLabel">
                                      <label className="fw-bolder ">Views</label>
                                    </div>
                                    <div className="formWrpInpt">{clubPostData?.views}</div>
                                  </div>
                                </div>

                                <div className="form-outline form-white d-flex ">
                                  <div className="formWrpLabel">
                                    <label className="fw-bolder ">Writer</label>
                                  </div>
                                  <div className="formWrpInpt">
                                    {clubPostData?.authorEnglishName}
                                  </div>
                                </div>

                                <div className="form-outline form-white d-flex ">
                                  <div className="formWrpLabel">
                                    <label className="fw-bolder ">Title*</label>
                                  </div>
                                  <div className="formWrpInpt">{clubPostData?.title}</div>
                                </div>

                                <div className="form-outline form-white d-flex ">
                                  <div className="formWrpLabel">
                                    <label className="fw-bolder ">Content*</label>
                                  </div>
                                  <div className="formWrpInpt">{clubPostData?.content}</div>
                                </div>

                                <div className="form-outline form-white d-flex ">
                                  <div className="formWrpLabel">
                                    <label className="fw-bolder ">Upload image</label>
                                  </div>
                                  {clubPostData?.images?.length > 0 && (
                                    <div className="upload-images-container uploadImgWrap">
                                      {clubPostData?.images.map((imgFile, index) => (
                                        <div
                                          className={
                                            index === 0
                                              ? 'thubmnail-img-container'
                                              : 'remaining-img-container'
                                          }
                                          key={index}
                                        >
                                          <img src={ALL_CONSTANTS.BASE_URL + imgFile.url} alt="" />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="d-flex">
                                  <div className="form-outline form-white  d-flex ">
                                    <div className="formWrpLabel">
                                      <label className="fw-bolder ">Push Notification</label>
                                    </div>
                                    <div className="formWrpInpt">
                                      <div className="d-flex formradiogroup mb-2 gap-3">
                                        <CFormCheck
                                          type="radio"
                                          name="isPushNotificationSent"
                                          id="exampleRadios1"
                                          label="Yes"
                                          checked={
                                            clubPostData?.isPushNotificationSent === 1
                                              ? true
                                              : false
                                          }
                                          disabled={true}
                                        />
                                        {console.log(clubPostData?.isPushNotificationSent)}
                                        <CFormCheck
                                          type="radio"
                                          name="isPushNotificationSent"
                                          id="exampleRadios2"
                                          label="No"
                                          checked={
                                            clubPostData?.isPushNotificationSent === 0
                                              ? true
                                              : false
                                          }
                                          disabled={true}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="form-outline form-white  d-flex ">
                                    <div className="formWrpLabel">
                                      <label className="fw-bolder ">Add as Notice</label>
                                    </div>
                                    <div className="formWrpInpt">
                                      <div
                                        className="d-flex formradiogroup mb-2 gap-3"
                                        aria-readonly
                                      >
                                        <CFormCheck
                                          type="radio"
                                          name="isAnnouncement"
                                          id="exampleRadios1"
                                          label="Yes"
                                          checked={
                                            clubPostData?.isAnnouncement === 1 ? true : false
                                          }
                                          disabled={true}
                                        />
                                        <CFormCheck
                                          type="radio"
                                          name="isAnnouncement"
                                          id="exampleRadios2"
                                          label="No"
                                          checked={
                                            clubPostData?.isAnnouncement === 0 ? true : false
                                          }
                                          disabled={true}
                                        />
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
          </div>
        </div>
        <div className="text-center mt-3">
          <CButton
            color="primary"
            onClick={() => {
              setDeleteModal(!deleteModal)
              getDeleteReason()
            }}
          >
            Delete Post
          </CButton>
          <CModal
            backdrop="static"
            visible={deleteModal}
            onClose={() => {
              setDeleteModal(false)
              clearDeleteModuleValues()
            }}
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
                  <option value="" disabled>
                    Please select a reason for deletion of the post.
                  </option>
                  {deleteReason?.map((option, index) => (
                    <option key={index} value={option?.id}>
                      {option?.title}
                    </option>
                  ))}
                </CFormSelect>
              </div>
              {selectedDeleteReason == 8 && (
                <div>
                  <CFormTextarea
                    id="floatingTextarea"
                    label="Enter the report details."
                    placeholder="Leave a comment here"
                    value={otherDeleteInput}
                    onChange={(e) => handleDeleteReasonInputChange(e)}
                  ></CFormTextarea>
                  <div className="mt-2">
                    <span className="txt-byte-information">
                      {otherDeleteInput.length} / 500 byte
                    </span>
                  </div>
                </div>
              )}
            </CModalBody>
            <CModalFooter className="d-flex justify-content-center">
              <CButton
                color="secondary"
                onClick={() => {
                  setDeleteModal(false)
                  clearDeleteModuleValues()
                }}
              >
                Cancel
              </CButton>
              <CButton
                color="primary"
                disabled={selectedDeleteReason == ''}
                onClick={() => setDeletePostConfirm(true)}
              >
                Confirm
              </CButton>
            </CModalFooter>
          </CModal>

          <CModal
            backdrop="static"
            visible={deletePostConfirm}
            onClose={() => setDeletePostConfirm(false)}
            aria-labelledby="LiveDemoExampleLabel"
          >
            <CModalHeader onClose={() => setDeletePostConfirm(false)}>
              <CModalTitle id="LiveDemoExampleLabel">Delete Post</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <p>Are you sure you want to delete this post?</p>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setDeletePostConfirm(false)}>
                Close
              </CButton>
              <CButton
                color="primary"
                onClick={() => {
                  handlePostDelete()
                }}
              >
                Delete
              </CButton>
            </CModalFooter>
          </CModal>
        </div>
        <div className="container bg-light p-3 mb-3 mt-4">
          <div>
            <CAccordion alwaysOpen activeItemKey={1}>
              <CAccordionItem>
                <CAccordionHeader>Likes &nbsp; {postLikeListDataTotalCount}</CAccordionHeader>
                <CAccordionBody>
                  {postLikeListData?.map((item, index) => (
                    <div className="participantList" key={index}>
                      <div className="participatntCont">
                        <div className="participatntimgBox">
                          {item?.profileImage ? (
                            <CImage
                              rounded
                              crossorigin="anonymous"
                              src={ALL_CONSTANTS.API_URL + item?.profileImage}
                            />
                          ) : (
                            <CIcon icon={cilUser} size="lg" />
                          )}
                        </div>
                        <h3>{item?.englishName}</h3>
                      </div>
                    </div>
                  ))}
                  {postLikeListData.length >= 5 &&
                    postLikeListData.length != postLikeListDataTotalCount && (
                      <div className="text-center mt-3">
                        <CButton
                          color="primary"
                          onClick={() => getPostLikeList(likeCurrentPage + 1)}
                        >
                          See More
                        </CButton>
                      </div>
                    )}
                  {postLikeListData.length == 0 && (
                    <div className="text-center mt-3">
                      <h5>No data Available</h5>
                    </div>
                  )}
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
          </div>
        </div>
        <div className="container bg-light p-3 mb-3 mt-4">
          <div>
            <CAccordion alwaysOpen activeItemKey={1}>
              <CAccordionItem>
                <CAccordionHeader>Comments &nbsp; {postCommentListDataTotalCount}</CAccordionHeader>
                <CAccordionBody>
                  {postCommentListData?.map((item, index) => (
                    <div className="participantList" key={index}>
                      <div className="participatntCont">
                        <div className="participatntimgBox">
                          {item?.imageUrl ? (
                            <CImage
                              rounded
                              crossorigin="anonymous"
                              src={ALL_CONSTANTS.API_URL + item?.imageUrl}
                            />
                          ) : (
                            <CIcon icon={cilUser} size="lg" />
                          )}
                        </div>
                        <p>
                          <h5>
                            {item?.EnglishName} : {item?.commentText}
                          </h5>
                        </p>
                      </div>
                    </div>
                  ))}
                  {postCommentListData.length >= 5 &&
                    postCommentListData.length != postCommentListDataTotalCount && (
                      <div className="text-center mt-3">
                        <CButton
                          color="primary"
                          onClick={() => getPostCommentList(commentCurrentPage + 1)}
                        >
                          See More
                        </CButton>
                      </div>
                    )}
                  {postCommentListData.length == 0 && (
                    <div className="text-center mt-3">
                      <h5>No data Available</h5>
                    </div>
                  )}
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
          </div>
        </div>
      </div>
    </>
  )
}

export default BulletinBoardPostDetails

import React, { useEffect, useState } from 'react'
import { CButton, CFormCheck, CFormInput, CFormSelect, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { API_ENDPOINT } from 'src/utils/config'
import { deleteApi, getApi, postApi, putApi } from 'src/utils/Api'

const BookGenre = ({ library, setDeleted, getALLBookgenre, setCategories, genreId}) => {

    const [data, setData] = useState({
        title: 'New',
        code: '',
        AssociiatedItems: '',
        isVisible: true
    })

    const [genreDetails, setGenreDetails] = useState()
    const [deleteVisible, setdeleteVisible] = useState(false)

    // console.log('library', library)
    console.log("librarId", genreId)

    console.log('dataa', data)


    // useEffect(() => {
    //     console.log('render')
    //     library[0]?.subcategories?.map((item) => {
    //         console.log("yes",subCategoryId===item.id)
    //         if (subCategoryId === item.id){
    //             // console.log("bool",'true')
    //                 setData({
    //                     title: item.name,
    //                     code: '',
    //                     AssociiatedItems: '',
    //                     isVisible: false
    
    //                 })
    //         }
    //         else{
    //             // console.log("bool",'false')
    //         }
    //     })
    //     getBookgenre()
    // }, [subCategoryId])


    // console.log('dataaa', library[subCategoryId-1])

    //To get the particular genre by its Id
    const getGenreById = async () =>{
        if(genreId){

            let url = `${API_ENDPOINT.get_GenreDetails}?id=${genreId}`
  
            const res = await getApi(url)
            console.log('res', res)
            if(res?.status === 200){
                setGenreDetails(res.data)   
              setData({
                  title: res?.data.name,
                  code: res?.data.code ? res.data.code : '',
                  AssociiatedItems: res?.data.associatedItem,
                  isVisible: res.data.visibility === 'visible' ? true : false
              })
            }
        }
        else{
            setData({
                title: 'New',
                code: '',
                AssociiatedItems: '',
                isVisible: true
            })
        }
    
  }

  console.log('detals', genreDetails)
  
  useEffect(() =>{
      getGenreById()
    },[genreId])

    const handleChange = (ev) => {
        setData((prev) => {
            return {
                ...prev,
                isVisible: ev.target.value
            }
        })
    }



    const handleChangeTitle = (e) => {
        setData((prev) => {
            return {
                ...prev,
                title: e.target.value
            }
        })
    }

    const handleChangeGenreCode = (e) => {
        setData((prev) => {
            return {
                ...prev,
                code: e.target.value
            }
        })
    }

    const handleChangeAssociatedItem = (e) => {
        setData((prev) => {
            return {
                ...prev,
                AssociiatedItems: e.target.value
            }
        })
    }

    //creating the new genre
    const handleCreateGenre = async () => {
        let url = API_ENDPOINT.create_genre
        const body = {
            name: data.title ? data.title : '',
            code: data.code ? data.code : '',
            associatedItem: data.AssociiatedItems ? data.AssociiatedItems : '',
            visibility: data.isVisible === true ? 'visible' : 'hide',
            bookLibraryId:1
        }
        try {

            console.log('body', body)

            const res = await postApi(url, body)
            if (res?.status === 200) {
                console.log("Genre added Successfully")
                // getALLBookgenre()
                setDeleted((prev) => prev + 1)
            }
            else {
                console.log("error")
            }
        } catch (error) {
            console.log(error)
        }
    }

    //deleting the genre by Id
    const handleDelete = async () => {
      let url = `${API_ENDPOINT.delete_genre}?id=`

      const res = deleteApi(url, genreId)
      if(res?.data?.status === 200){
        setDeleted((prev) => prev + 1)
      }
      else{
        alert('not deleted')
      }
    
    }

    //updating the particular genre based on Id
    const handleUpdateGenre = async () => {
        let url = API_ENDPOINT.update_Genre
        const body = {
            id: genreDetails.id,
            name: data.title ? data.title : '',
            // code: genreDetails.code ? genreDetails.code : 'New_002',
            associatedItem: data.AssociiatedItems ? data.AssociiatedItems : '',
            visibility: data.isVisible === true ? 'visible' : 'hide',
            rentableDurationWeek : genreDetails.rentableDurationWeek ? genreDetails.rentableDurationWeek : '',
            extendDurationWeek: genreDetails.extendDurationWeek ? genreDetails.extendDurationWeek : '',
            pickUpAndReturn: genreDetails.pickUpAndReturn ? genreDetails.pickUpAndReturn : 'PTF17'
        }
        try {

            console.log('body', body)

            const res = await putApi(url, genreId, body)
            if (res?.status === 200) {
                console.log("Genre added Successfully")
                getALLBookgenre()
                 setDeleted((prev) => prev + 1)
                //
            }
            else {
                console.log("error")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div  style={{ width: '100%', borderRadius: '0' }}>
            <div className="card p-2">
                <div className="dropdown-container">
                    <label className="me-3">Book Genre</label>
                </div>
                <div className='clearfix '>
                    <CButton onClick={() => setdeleteVisible(true)} className='float-end'>Delete</CButton>
                </div>
                <div className="card-body">
                    <div className="formWraper">
                        <div className="form-outline form-white   d-flex ">
                            <div className="formWrpLabel">
                                <label className="fw-bolder ">
                                    Genre Name
                                </label>
                            </div>
                            <div className="formWrpInpt">
                                <div className="d-flex formradiogroup mb-2 gap-3">
                                    <CFormInput
                                        type="text"
                                        placeholder="Library"
                                        name="title"
                                        value={data.title}
                                        onChange={handleChangeTitle}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-outline form-white   d-flex ">
                            <div className="formWrpLabel">
                                <label className="fw-bolder ">
                                    Genre code
                                </label>
                            </div>
                            <div className="formWrpInpt">
                                <div className="d-flex formradiogroup mb-2 gap-3">
                                    <CFormInput
                                        type="text"
                                        placeholder="New_001"
                                        name="code"
                                        value={data.code}
                                        onChange={handleChangeGenreCode}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex col-md-12">
                            <div className="form-outline form-white d-flex col-md-6">
                                <div className="formWrpLabel">
                                    <label className="fw-bolder ">Visibility</label>
                                </div>
                                <div className="push-notification-container gap-3">
                                    <CFormCheck
                                        type="radio"
                                        name="isVisible"
                                        defaultChecked={data.isVisible}
                                        onChange={() => setData((prev) => ({ ...prev, isVisible: true }))}
                                        label="Yes"
                                        value={true}
                                    // checked={data.isVisible === true}
                                    //   disabled={location?.state?.postId ? true : false}
                                    />
                                    <CFormCheck
                                        type="radio"
                                        name="isVisiblea"
                                        defaultChecked={!data.isVisible}
                                        onChange={() => setData((prev) => ({ ...prev, isVisible: false }))}
                                        label="No"
                                        value={false}
                                    // checked={data.isVisible === false}
                                    //   disabled={location?.state?.postId ? true : false}
                                    />
                                </div>
                            </div>
                            <div className="form-outline form-white d-flex col-md-6">
                            </div>
                        </div>
                        <div className="form-outline form-white  d-flex ">
                            <div className="formWrpLabel">
                                <label className="fw-bolder ">
                                    Associated Items
                                </label>
                            </div>
                            <div className="formWrpInpt">
                                <div className="d-flex formradiogroup mb-2 gap-3">
                                    <p>
                                        <input type='number' placeholder='0'
                                            value={data.AssociiatedItems}
                                            onChange={handleChangeAssociatedItem}
                                            style={{ width: '30%' }} />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5%', gap: 10 }}>
                <CButton onClick={() =>setCategories('AllBooks') } style={{ marginRight: '2%', background: '#ccc', border: 'none' }}>Cancel</CButton>
                <CButton onClick={genreId ? handleUpdateGenre : handleCreateGenre}>Save</CButton>
            </div>
            <CModal
                    backdrop="static"
                      visible={deleteVisible}
                      onClose={() => setdeleteVisible(false)}
                    aria-labelledby="StaticBackdropExampleLabel"
                >
                    <CModalHeader>
                        <CModalTitle id="StaticBackdropExampleLabel">Delete</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <p>Are you sure you want to delete this category?
                            <br />
                            All categories and items belonging will be deleted.</p>
                    </CModalBody>
                    <CModalFooter>
                        <CButton onClick={handleDelete} color="primary">Delete</CButton>
                        <CButton onClick={() => setdeleteVisible(false)} color="secondary">
                            Cancel
                        </CButton>
                    </CModalFooter>
                </CModal>
        </div>
    )
}

export default BookGenre

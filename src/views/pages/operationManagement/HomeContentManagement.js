import { cilMenu } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CCol, CFormCheck, CFormInput, CFormLabel } from '@coreui/react';
import React, { useCallback, useMemo } from 'react'
import ReactTable from 'src/components/common/ReactTable';

const HomeContentManagement = () => {

    const bannerList = [
        { id: 1 }
    ]

    const handleSelectionChange = useCallback((selectedRowsIds) => {
        // setSelectedRows([...selectedRows, selectedRowsIds]);
        // console.log('selected rows type =>', typeof selectedRowsIds);

        // const getIds = selectedRowsIds.map((item) => {
        //   console.log('ites =>', item);
        //   return item.id.toString();
        // })
        // console.log('getIds', getIds)
        // console.log('getIds =>', typeof getIds);
        // setDataIds(getIds)

    }, []);

    const columns = useMemo(() => [
        {
            Header: 'Order',
            accessor: '',
            Cell: ({ row }) => <p><CIcon icon={cilMenu} size='sm' /></p>
        },
        {
            Header: 'No',
            accessor: '',
            // Cell: ({ row }) => {
            //     return currentPage * itemsPerPage + (row?.index + 1)
            // }
        },
        {
            Header: 'Content',
            accessor: '',
            // Cell: ({ row }) =>
            //     <img alt="" crossOrigin='anonymous' src={imageUrl + row?.original?.image} style={{ width: '100%', height: '100px' }}></img>

        },
        {
            Header: 'Show on app',
            accessor: 'title',
            Cell: ({ row }) => <div className='d-flex gap-4 '>
                <CFormCheck
                    className='d-flex gap-2'
                    label="Grant"
                    type='radio'
                    name='HomeManagement'
                />
                <CFormCheck
                    className='d-flex gap-2'
                    label="Deny"
                    type='radio'
                    name='HomeManagement'
                />
            </div>
        },
    ], [])

    return (
        <div>
            <div className='pageTitle mb-3 pb-2'>
                <h2>Home Content Management</h2>
            </div>
            <div className=''>
                <h2>Usage</h2>
            </div>
            <div className='my-3'>
                <ReactTable columns={columns} data={bannerList} showCheckbox={false} onSelectionChange={handleSelectionChange} />
            </div>
            <div className='card-body'>
                <div className='formWraper'>
                    <div className="form-outline form-white  d-flex ">
                        <div className="formWrpLabel">
                            <label className="fw-bolder ">Counting Period of
                                [Community Best] </label>
                        </div>
                        <div className="d-flex align-items-center  w-100">
                            <div className="push-notification-container gap-3 p-2">
                                <CFormCheck
                                    type="radio"
                                    name="imageType"
                                    // defaultChecked={imageType === 'bannerImageOnly'}
                                    // onClick={() => {
                                    //     setImageType('bannerImageOnly')
                                    //     setLinkToUrl('')
                                    //     setPopupImage('')
                                    // }}
                                    // value={true}
                                    label="1 Week"
                                />
                            </div>
                            <div className="push-notification-container gap-3 p-2 align-items-center">
                                <CFormCheck
                                    type="radio"
                                    name="imageType"
                                    // defaultChecked={imageType === 'linkTo'}
                                    // onClick={() => {
                                    //     setImageType('linkTo')
                                    //     setPopupImage('')
                                    // }}
                                    // value={false}
                                    label="2 Weeks"
                                />
                            </div>
                            <div className="d-flex  gap-3 p-2">
                                <CFormCheck
                                    type="radio"
                                    name="imageType"
                                    // defaultChecked={imageType === 'popUpImage'}
                                    // onClick={() => {
                                    //     setImageType('popUpImage')
                                    //     setLinkToUrl('')
                                    // }}
                                    // value={false}
                                    label="1 month"
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center mt-5">
                <CCol xs="auto">
                    <CButton type="submit" className="mb-3 btn-primary">
                        Save
                    </CButton>
                </CCol>
            </div>
        </div>
    )
}

export default HomeContentManagement
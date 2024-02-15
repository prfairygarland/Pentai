import { CButton, CFormSelect } from '@coreui/react'
import moment from 'moment/moment'
import React, { useMemo } from 'react'
import DatePicker from 'react-date-picker'
import ReactTable from 'src/components/common/ReactTable'

const RouletteventDetails = () => {

    const reward = [
        { label: 'All', value: '' },
        { label: 'banana', value: '1' },
        { label: 'gold', value: '2' },
        { label: 'device', value: '3' },
    ]

    const name = [
        { label: 'Name', value: 'name' },
        { label: 'English Name', value: 'englishName' },
        { label: 'E-mail', value: 'email' },
    ]

    const data = [
        { id: 1 }
    ]

    const columns = useMemo(() => [

        {
            //   Header: multiLang?.status,
            Header: 'E-mail',
            accessor: 'email',
            Cell: ({ row }) => <p style={{ textTransform: 'capitalize' }} className='text-center'>{row.original.id}</p>
        },
        {
            //   Header: multiLang?.title,
            Header: 'Name',
            accessor: 'name',
            // Cell: ({ row }) => <a className='Livetitle' style={{ cursor: 'pointer' }}> {row.original.title ? row.original.title : '-'}</a>
            Cell: ({ row }) => <a className='Livetitle' style={{ cursor: 'pointer' }}> {row.original.title ? row.original.title : '-'}</a>
        },
        {
            //   Header: multiLang?.period,
            Header: 'English Name',
            accessor: 'englishName',
            Cell: ({ row }) => <p style={{ maxWidth: 150, whiteSpace: 'normal' }}>{row.original.startTime ? `${moment(row.original.startTime).format("YYYY-MM-DD HH:mm")} ~ 
                                                          ${moment(row.original.endTime).format("YYYY-MM-DD HH:mm")}` : '-'}</p>
        },
        {
            //   Header: multiLang?.creator,
            Header: 'Phone Number',
            accessor: 'phoneNumber',
            Cell: ({ row }) => <p className='text-center'>{row.original.authorName ? row.original.authorName : '-'}</p>
        },
        {
            //   Header: multiLang?.participantsPoints,
            Header: 'Division',
            accessor: 'division',
            Cell: ({ row }) => <><p className='text-center'>{row.original.participationPoints ? `${(row?.original?.participationPoints)}
                                                             ` : ''}</p><p className='text-center'>{row.original.participationPoints ? `
                                                          (${(row?.original?.participants * row?.original?.participationPoints)} P)` : '-'}</p></>
        },
        {
            //   Header: multiLang?.eventCost,
            Header: 'Group',
            accessor: 'group',
            // Cell: ({ row }) => <p className='text-center'>{row.original.eventCost ? row.original.eventCost + " " + 'KRW' : '-'}</p>
        },
        {
            //   Header: multiLang?.eventCost,
            Header: 'Team',
            accessor: 'team',
            // Cell: ({ row }) => <p className='text-center'>{row.original.eventCost ? row.original.eventCost + " " + 'KRW' : '-'}</p>
        },
        {
            //   Header: multiLang?.eventCost,
            Header: 'Reward',
            accessor: 'reward',
            // Cell: ({ row }) => <p className='text-center'>{row.original.eventCost ? row.original.eventCost + " " + 'KRW' : '-'}</p>
        },
        {
            //   Header: multiLang?.eventCost,
            Header: 'Time',
            accessor: 'time',
            // Cell: ({ row }) => <p className='text-center'>{row.original.eventCost ? row.original.eventCost + " " + 'KRW' : '-'}</p>
        },


    ], [])

    return (
        // <div>
        <section className="flex-row align-items-center">
            <div className="w-100">
                <div className="card border-0 ">
                    <div className='card-body p-0'>
                        <div className='formWraper'>
                            <div>
                                <div className='d-flex'>
                                    <div className='d-flex col-md-6'>
                                        <div className="form-outline d-flex col-md-12">
                                            <div className='formWrpLabel'>
                                                <label className="fw-bolder ">Participants</label>
                                            </div>
                                            <div className='formWrpInpt text-center '>
                                                5000
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-outline  d-flex  col-md-6">
                                        <div className='formWrpLabel'>
                                            <label className="fw-bolder ">points</label>
                                        </div>
                                        <div className='formWrpInpt text-center '>
                                            5000
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex col-md-12'>
                                <div className='d-flex col-md-6'>
                                    <div className="form-outline d-flex col-md-12">
                                        <div className='formWrpLabel'>
                                            <label className="fw-bolder ">Participation</label>
                                        </div>
                                        <div className='formWrpInpt text-center '>
                                            5000
                                        </div>
                                    </div>
                                </div>
                                <div className="form-outline  d-flex  col-md-6">
                                    <div className='formWrpLabel'>
                                        <label className="fw-bolder ">Event Cost</label>
                                    </div>
                                    <div className='formWrpInpt text-center '>
                                        5000
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container p-3 justify-align-content-around w-100 mt-3'>
                <div className='d-flex mb-3'>
                    <div className="d-flex align-items-center me-5 ">
                        <label className="fw-medium me-3 " style={{ 'white-space': 'nowrap' }}>
                            Reward
                        </label>
                        <CFormSelect
                            className="me-2"
                            aria-label="Default select example"
                            options={reward}
                        // onChange={handleClassificationChange}
                        // value={filterData.classification}
                        />
                    </div>
                    <div className='d-flex align-items-center'>
                        <div className="d-flex align-items-center me-5 ">
                            {/* <label className="fw-medium me-3 " style={{ 'white-space': 'nowrap' }}>
                                Name
                            </label> */}
                            <CFormSelect
                                className="me-2"
                                aria-label="Default select example"
                                options={name}
                            //   onChange={handleStatusChange}
                            //   value={filterData.status}
                            />
                        </div>
                    </div>

                    <div className='d-flex  align-items-center justify-content-between  gap-3 pe-3'>
                        <div className='d-flex  align-items-center gap-3 w-100'>
                            <div className=''>
                                {/* <label>Title</label> */}
                            </div>
                            <div className="col-md-12">
                                <div className="d-flex form-inline w-100">
                                    <input className="form-control mr-sm-10 me-2" type="search" placeholder="Search" aria-label="Search" />
                                </div>
                            </div>
                        </div>
                        <CButton className="btn btn-primary my-2 my-sm-0" type="submit" >Search</CButton>
                        <CButton className="w-50" type="submit" >List Download</CButton>
                    </div>
                </div>
            </div>
            <div>
                <ReactTable columns={columns} data={data} showCheckbox={false} onSelectionChange={() => { }} />
            </div>
        </section>
    )
}

export default RouletteventDetails
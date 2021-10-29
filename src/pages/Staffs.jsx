import React from 'react'

import Table from '../components/table/Table'

import staffList from '../assets/JsonData/staff-list.json'

const staffTableHead = [
    '',
    'Name',
    'Email',
    'description',
    'Salon',
    'Email',
    'Phone Number'
]

const renderHead = (item, index) => <th key={index}>{item}</th>

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{item.staffId}</td>
        <td>{item.fullName}</td>
        <td>{item.staffType}</td>
        <td>{item.description}</td>
        <td>{item.salonName}</td>
        <td>{item.email}</td>
        <td>{item.phoneNumber}</td>
    </tr>
)

export default function Staffs() {
    return (
        <div>
            <h2 className="page-header">
                Staffs
            </h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='10'
                                headData={staffTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={staffList}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

import React from 'react'

import Table from '../components/table/Table'

import salonList from '../assets/JsonData/salon-list.json'

const salonTableHead = [
    '',
    'Name',
    'Description',
    'status',
    'createdDate',
    'lastUpdated'
]

const renderHead = (item, index) => <th key={index}>{item}</th>

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{item.id}</td>
        <td>{item.name}</td>
        <td>{item.description}</td>
        <td>{item.status}</td>
        <td>{item.createdDate}</td>
        <td>{item.lastUpdate}</td>
    </tr>
)

export default function Salon() {
    return (
        <div>
            <h2 className="page-header">
                Salon
            </h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='10'
                                headData={salonTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={salonList}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

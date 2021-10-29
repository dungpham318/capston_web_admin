import React from 'react'

import Table from '../components/table/Table'

import comboList from '../assets/JsonData/combo-list.json'

const comboTableHead = [
    '',
    'Name',
    'Description',
    'Status',
    'Duration',
    'price',
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
        <td>{item.duration}</td>
        <td>{item.price}</td>
        <td>{item.createdDate}</td>
        <td>{item.lastUpdated}</td>
    </tr>
)

export default function Combo() {
    return (
        <div>
            <h2 className="page-header">
                Combo
            </h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='10'
                                headData={comboTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={comboList}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

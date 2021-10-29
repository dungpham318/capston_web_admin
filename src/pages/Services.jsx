import React from 'react'

import Table from '../components/table/Table'

import serviceList from '../assets/JsonData/service-list.json'

const serviceTableHead = [
    '',
    'Service Name',
    'Description',
    'Status',
    // 'createdDate',
    // 'lastUpdated',
    'Price'
]

const renderHead = (item, index) => <th key={index}>{item}</th>

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{item.id}</td>
        <td>{item.name}</td>
        <td>{item.description}</td>
        <td>{item.status}</td>
        {/* <td>{item.createdDate}</td>
        <td>{item.lastUpdated}</td> */}
        <td>{item.price}</td>
    </tr>
)

const Services = () => {
    return (
        <div>
            <h2 className="page-header">
                services
            </h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='10'
                                headData={serviceTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={serviceList}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Services

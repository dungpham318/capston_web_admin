import React, {useEffect} from 'react'

import { Link } from 'react-router-dom'

import Chart from 'react-apexcharts'

import { useSelector } from 'react-redux'

import StatusCard from '../components/status-card/StatusCard'

import Table from '../components/table/Table'

import Badge from '../components/badge/Badge'

import statusCards from '../assets/JsonData/status-card-data.json'

const chartOptions = {
    series: [{
        name: 'Transactions',
        data: [40,70,20,90,36,80,30,91,60]
    }, {
        name: 'Customers',
        data: [40, 30, 70, 80, 40, 16, 40, 20, 51, 10]
    }],
    options: {
        color: ['#6ab04c', '#2980b9'],
        chart: {
            background: 'transparent'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
        },
        legend: {
            position: 'top'
        },
        grid: {
            show: false
        }
    }
}

const topStaffs = {
    head: [
        'staff',
        'total transactions'
    ],
    // body: [
    //     {
    //         "username": "john doe",
    //         "transaction": "15"
    //     },
    //     {
    //         "username": "frank iva",
    //         "order": "250",
    //         "price": "$12,251"
    //     },
    //     {
    //         "username": "anthony baker",
    //         "order": "120",
    //         "price": "$10,840"
    //     },
    //     {
    //         "username": "frank iva",
    //         "order": "110",
    //         "price": "$9,251"
    //     },
    //     {
    //         "username": "anthony baker",
    //         "order": "80",
    //         "price": "$8,840"
    //     }
    // ]
}

const renderCusomerHead = (item, index) => (
    <th key={index}>{item}</th>
)

const renderCusomerBody = (item, index) => (
    <tr key={index}>
        <td>{item.username}</td>
        <td>{item.order}</td>
        <td>{item.price}</td>
    </tr>
)

const latestTransactions = {
    header: [
        "transaction id",
        "customer",
        "total price",
        "date",
        "status"
    ],
    // body: [
    //     {
    //         id: "#OD1711",
    //         user: "john doe",
    //         date: "17 Jun 2021",
    //         price: "$900",
    //         status: "shipping"
    //     },
    //     {
    //         id: "#OD1712",
    //         user: "frank iva",
    //         date: "1 Jun 2021",
    //         price: "$400",
    //         status: "paid"
    //     },
    //     {
    //         id: "#OD1713",
    //         user: "anthony baker",
    //         date: "27 Jun 2021",
    //         price: "$200",
    //         status: "pending"
    //     },
    //     {
    //         id: "#OD1712",
    //         user: "frank iva",
    //         date: "1 Jun 2021",
    //         price: "$400",
    //         status: "paid"
    //     },
    //     {
    //         id: "#OD1713",
    //         user: "anthony baker",
    //         date: "27 Jun 2021",
    //         price: "$200",
    //         status: "refund"
    //     }
    // ]
}

const transactionStatus = {
    "shipping": "primary",
    "pending": "warning",
    "paid": "success",
    "refund": "danger"
}

const renderOrderHead = (item, index) => (
    <th key={index}>{item}</th>
)

const renderOrderBody = (item, index) => (
    <tr key={index}>
        <td>{item.id}</td>
        <td>{item.user}</td>
        <td>{item.price}</td>
        <td>{item.date}</td>
        <td>
            <Badge type={transactionStatus[item.status]} content={item.status}/>
        </td>
    </tr>
)

const Dashboard = () => {

    const themeReducer = useSelector(state => state.ThemeReducer.mode)

    return (
        <div>
            <h2 className="page-header">Dashboard</h2>
            <div className="row">
                <div className="col-6">
                    <div className="row">
                        {
                            statusCards.map((item, index) => (
                                <div className="col-6" key={index}>
                                    <StatusCard
                                        icon={item.icon}
                                        count={item.count}
                                        title={item.title}
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="col-6">
                    <div className="card full-height">
                        {/* chart */}
                        <Chart
                            options={themeReducer === 'theme-mode-dark' ? {
                                ...chartOptions.options,
                                theme: { mode: 'dark'}
                            } : {
                                ...chartOptions.options,
                                theme: { mode: 'light'}
                            }}
                            series={chartOptions.series}
                            type='line'
                            height='100%'
                        />
                    </div>
                </div>
                <div className="col-4">
                    <div className="card">
                        <div className="card__header">
                            <h3>top staffs</h3>
                        </div>
                        <div className="card__body">
                            <Table
                                headData={topStaffs.head}
                                renderHead={(item, index) => renderCusomerHead(item, index)}
                                bodyData={topStaffs.body}
                                renderBody={(item, index) => renderCusomerBody(item, index)}
                            />
                        </div>
                        <div className="card__footer">
                            <Link to='/staffs'>view all</Link>
                        </div>
                    </div>
                </div>
                <div className="col-8">
                    <div className="card">
                        <div className="card__header">
                            <h3>latest Transactions</h3>
                        </div>
                        <div className="card__body">
                            <Table
                                headData={latestTransactions.header}
                                renderHead={(item, index) => renderOrderHead(item, index)}
                                bodyData={latestTransactions.body}
                                renderBody={(item, index) => renderOrderBody(item, index)}
                            />
                        </div>
                        <div className="card__footer">
                            <Link to='/transactions'>view all</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

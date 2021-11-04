import React, { Component } from 'react';
//import axios from 'axios';
import Table from '../components/table/Table';
import { getTransactionList } from '../apis/transactionApi';

export default class Transaction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      transactionList: [],
    //   totalTransaction: 100,
      page: 1,
      pageSize: 10
    };
  }
  componentDidMount() {
    this.getTransaction()
  }

  getTransaction = async () => {
    let transactionList = await getTransactionList({
      "pageNumber": this.state.page,
      "pageSize": this.state.pageSize,
      "statuses": [   
    ],
    "customerIds": [     
    ],
    "customerUserIds": [     
    ],
    "comboIds": [      
    ],
    "salonIds": [      
    ],
    "customerName": "",
    "comboName": "",
    "salonName": "",
    "minCreatedDate": "",
    "maxCreatedDate": "",
    "minLastUpdate": "",
    "maxLastUpdate": "",
    "minDate": "",
    "maxDate": "",
    "minTotalPrice": -1,
    "maxTotalPrice": -1,
    "sortBy": ""
    })

    if (transactionList) {
      this.setState({
        transactionList: transactionList?.data?.items,
        totalTransaction: transactionList?.data?.totalCount
      })
    }

  }

  tabRow() {
    return this.state.business.map(function (object, i) {
      return <Table obj={object} key={i} />;
    });
  }

  render() {
    return (
      <div>
        <h2 className="page-header">
          Customers
        </h2>
        <div className='card'>
          <Table
            headers={[
              { id: 1, label: '#', value: 'id' },
              { id: 2, label: 'Customer Name', value: 'customerName' },
              { id: 3, label: 'Salon', value: 'salonName' },
              { id: 4, label: 'Status', value: 'status' },
              { id: 5, label: 'End Date', value: 'endDate' },
              { id: 6, label: 'Created Date', value: 'createdDate' },
              { id: 7, label: 'Combo', value: 'comboName' },
              { id: 7, label: 'Total Price', value: 'totalPrice' },
            ]}
            rows={this.state.transactionList}
            // actionList={[
            //   'view',
            //   'edit',
            //   'delete',
            // ]}
            // onClickView={(row) => {
            //   console.log(row)
            // }}
            // onClickEdit={(row) => {
            // }}
            // onClickDelete={(row) => {
            // }}
            pagination
            totalItem={this.state.totalTransaction}
            onChangePage={(page, pageSize) => {
              console.log(page, pageSize)
              this.setState({
                page: page,
                pageSize: pageSize
              }, () => {
                this.getTransaction()
              })
            }}
          />

        </div>

      </div>
    );
  }
}
import React, { Component } from 'react';
//import axios from 'axios';
import Table from '../components/table/Table';
import { getCustomerList } from '../apis/customerApi';

export default class Customers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customerList: [],
      //totalCustomer: 100,
      page: 1,
      pageSize: 10
    };
  }
  componentDidMount() {
    this.getCustomer()
  }

  getCustomer = async () => {
    let customerList = await getCustomerList({
      "pageNumber": this.state.page,
      "pageSize": this.state.pageSize,
      "roles": [
      ],
      "statuses": [
      ],
      "sortBy": ""
    })

    if (customerList) {
      this.setState({
        customerList: customerList?.data?.items,
        totalCustomer: customerList?.data?.totalCount
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
              { id: 1, label: '#', value: 'index' },
              { id: 2, label: 'FullName', value: 'fullName' },
              { id: 3, label: 'Email', value: 'email' },
              { id: 4, label: 'PhoneNumber', value: 'phoneNumber' },
              { id: 5, label: 'Status', value: 'status' },
            ]}
            rows={this.state.customerList}
            actionList={[
              'view',
              'edit',
              'delete',
            ]}
            onClickView={(row) => {
              console.log(row)
            }}
            onClickEdit={(row) => {
            }}
            onClickDelete={(row) => {
            }}
            pagination
            totalItem={this.state.totalCustomer}
            onChangePage={(page, pageSize) => {
              console.log(page, pageSize)
              this.setState({
                page: page,
                pageSize: pageSize
              }, () => {
                this.getCustomer()
              })
            }}
          />

        </div>

      </div>
    );
  }
}
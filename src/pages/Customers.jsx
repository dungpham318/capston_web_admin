import React, { Component } from 'react';
import axios from 'axios';
import Table from '../components/table/Table';

export default class Customers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customerList: rows,
      totalCustomer: 100,
      page: 1,
      pageSize: 10
    };
  }
  componentDidMount() {
    axios.get('https://localhost:5001/api/Customer/advanced_get_customers', {
      headers: {
        'Authorization': 'Bearer ' + "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJhZG1pbjEyM0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW5pc3RyYXRvciIsIm5iZiI6MTYzNTM5MDU3MSwiZXhwIjoxNjM1OTk1MzcxLCJpYXQiOjE2MzUzOTA1NzF9.1syRKZp5y7ImdhCnYRbPFo14QSqe9xDTSkTixKNe9nTeB3sVNsoy-dVyb9G7MsOt0IDcMWkmu3H7J_qbKSQAdg"
      }
    })
      .then(response => {
        // this.setState({ business: response.data });
      })
      .catch(function (error) {
        console.log(error);
      })
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
              { id: 4, label: 'PhoneNumber', value: 'status' },
              { id: 5, label: 'Status', value: 'phoneNumber' },
            ]}
            rows={this.state.customerList}
            actionList={[
              'view',
              'edit',
              'delete',
            ]}
            onClickView={(row) => {
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
              })
            }}
          />

        </div>

      </div>
    );
  }
}

let rows = [
  {
    id: 1,
    fullName: 'Pham Van A',
    email: 'Email1',
    status: 'status',
    phoneNumber: '0999999999'
  },
  {
    id: 2,
    fullName: 'Pham Van A',
    email: 'Email1',
    status: 'status',
    phoneNumber: '0999999999'
  },
  {
    id: 3,
    fullName: 'Pham Van A',
    email: 'Email1',
    status: 'status',
    phoneNumber: '0999999999'
  },
  {
    id: 3,
    fullName: 'Pham Van A',
    email: 'Email1',
    status: 'status',
    phoneNumber: '0999999999'
  },
  {
    id: 3,
    fullName: 'Pham Van A',
    email: 'Email1',
    status: 'status',
    phoneNumber: '0999999999'
  },
  {
    id: 3,
    fullName: 'Pham Van A',
    email: 'Email1',
    status: 'status',
    phoneNumber: '0999999999'
  },
  {
    id: 3,
    fullName: 'Pham Van A',
    email: 'Email1',
    status: 'status',
    phoneNumber: '0999999999'
  },
  {
    id: 3,
    fullName: 'Pham Van A',
    email: 'Email1',
    status: 'status',
    phoneNumber: '0999999999'
  },
  {
    id: 3,
    fullName: 'Pham Van A',
    email: 'Email1',
    status: 'status',
    phoneNumber: '0999999999'
  },
  {
    id: 3,
    fullName: 'Pham Van A',
    email: 'Email1',
    status: 'status',
    phoneNumber: '0999999999'
  },
]
import React, { Component, useState } from 'react';
//import axios from 'axios';
import Table from '../components/table/Table';
import { getCustomerList, getCustomerDetailApi } from '../apis/customerApi';
import Button from '@mui/material/Button';
import Modal from '../components/modal/Modal';
import { TextField } from '@material-ui/core';

export default class Customers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customerList: [],
      //totalCustomer: 100,
      page: 1,
      pageSize: 10,
      isOpenModal: false,
      selectedCustomer: undefined,
      loading: false
    };
  }
  componentDidMount() {
    this.getCustomer()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isOpenModal !== prevState.isOpenModal && !this.state.isOpenModal) {
      this.setState({ selectedCustomer: undefined })
    }
  }

  getCustomer = async () => {
    this.setState({ loading: true })
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
        loading: false,
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

  getCustomerDetail = async (id) => {
    let res = await getCustomerDetailApi({
      id: id
    })
    console.log(res)

    this.setState({
      isOpenModal: true,
      selectedCustomer: res?.data
    })
  }
  render() {
    return (
      <div>
        <h2 className="page-header">
          Customers List
        </h2>
        <div className='card'>
          <Table
            loading={this.state.loading}
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
              //'edit',
              // 'delete',
            ]}
            onClickView={(row) => {
              console.log(row)
              this.getCustomerDetail(row?.userId)
            }}
            // onClickEdit={(row) => {
            // }}
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

        <Modal isOpen={this.state.isOpenModal}>
          <h2 className="page-header">
            Customer
          </h2>
          <div style={{
            height: '90%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}>
            <div style={{
              height: '90%',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              overflowY: 'scroll',
              paddingRight: '2em'
            }}>
              <TextField
                required
                disabled
                id="outlined-basic"
                label="Customer ID"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.selectedCustomer?.customerId}
                onChange={(event) => {
                }}
              />
              <TextField
                required
                disabled
                id="outlined-basic"
                label="Customer Name"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.selectedCustomer?.fullName}
                onChange={(event) => {
                }}
              />
              <TextField
                required
                disabled
                id="outlined-basic"
                label="Status"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.selectedCustomer?.status}
                onChange={(event) => {
                }}
              />
              <TextField
                required
                disabled
                id="outlined-basic"
                label="Email"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.selectedCustomer?.email}
                onChange={(event) => {
                }}
              />
              <TextField
                required
                disabled
                id="outlined-basic"
                label="Phone Number"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.selectedCustomer?.phoneNumber}
                onChange={(event) => {
                }}
              />
            </div>
            <div>
              <Button variant="contained" color="inherit" onClick={() => {
                this.setState({
                  isOpenModal: false
                })
              }}>
                Close
              </Button>
            </div>
          </div>

        </Modal>

      </div>
    );
  }
}
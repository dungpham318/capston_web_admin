import React, { Component } from 'react';
//import axios from 'axios';
import Table from '../components/table/Table';
import Modal from '../components/modal/Modal';
import { getTransactionDetailApi, getTransactionList } from '../apis/transactionApi';
import { TextField } from '@material-ui/core';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete'

export default class Transaction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      transactionList: [],
      //   totalTransaction: 100,
      page: 1,
      pageSize: 10,
      isOpenModal: false,
      selectedTransaction: undefined
    };
  }
  componentDidMount() {
    this.getTransaction()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isOpenModal !== prevState.isOpenModal && !this.state.isOpenModal) {
      this.setState({ selectedTransaction: undefined })
    }
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
    console.log(transactionList)
  }

  tabRow() {
    return this.state.business.map(function (object, i) {
      return <Table obj={object} key={i} />;
    });
  }

  getTransactionDetail = async (id) => {
    console.log(id)
    let res = await getTransactionDetailApi({
      id: id
    })
    this.setState({
      isOpenModal: true,
      selectedTransaction: res?.data
    })

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
            actionList={[
              'view',
              // 'edit',
              // 'delete',
            ]}
            onClickView={(row) => {
              console.log(row)
              this.getTransactionDetail(row?.id)

            }}
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

        <Modal isOpen={this.state.isOpenModal}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1
          }}>
            <TextField
              required
              disabled
              id="outlined-basic"
              label="Combo"
              variant="outlined"
              style={{
                width: '100%',
                marginTop: '1em',
                marginBottom: '1em'
              }}
              value={this.state.selectedTransaction?.comboName}
              onChange={(event) => {
              }}
            />
            <TextField
              required
              disabled
              id="outlined-basic"
              label="Date"
              variant="outlined"
              style={{
                width: '100%',
                marginTop: '1em',
                marginBottom: '1em'
              }}
              value={this.state.selectedTransaction?.startDate ? this.state.selectedTransaction?.startDate.split(' ')[0] : ''}
              onChange={(event) => {
              }}
            />
            <TextField
              required
              disabled
              id="outlined-basic"
              label="Start Time"
              variant="outlined"
              style={{
                width: '100%',
                marginTop: '1em',
                marginBottom: '1em'
              }}
              value={this.state.selectedTransaction?.customerName}
              onChange={(event) => {
              }}
            />
            <TextField
              required
              disabled
              id="outlined-basic"
              label="Start Time"
              variant="outlined"
              style={{
                width: '100%',
                marginTop: '1em',
                marginBottom: '1em'
              }}
              value={this.state.selectedTransaction?.startDate ? this.state.selectedTransaction?.startDate.split(' ')[1] : ''}
              onChange={(event) => {
              }}
            />
            <TextField
              required
              disabled
              id="outlined-basic"
              label="End Time"
              variant="outlined"
              style={{
                width: '100%',
                marginTop: '1em',
                marginBottom: '1em'
              }}
              value={this.state.selectedTransaction?.endDate ? this.state.selectedTransaction?.endDate.split(' ')[1] : ''}
              onChange={(event) => {
              }}
            />
            <TextField
              required
              disabled
              id="outlined-basic"
              label="Total Price"
              variant="outlined"
              style={{
                width: '100%',
                marginTop: '1em',
                marginBottom: '1em'
              }}
              value={this.state.selectedTransaction?.totalPrice}
              onChange={(event) => {
              }}
            />
            <TextField
              disabled
              id="outlined-basic"
              label="Paid Amount"
              variant="outlined"
              style={{
                width: '100%',
                marginTop: '1em',
                marginBottom: '1em'
              }}
              value={this.state.selectedTransaction?.paidAmount}
              onChange={(event) => {
              }}
            />
            <div style={{
              width: '100%',
              marginTop: '1em',
              marginBottom: '1em'
            }}>
              <p style={{
                fontWeight: 'bold'
              }}>Service List</p>
              {
                this.state.selectedTransaction?.appointmentDetails && this.state.selectedTransaction?.appointmentDetails.map((item, index) => {
                  console.log(123, item)
                  return (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'row',
                      flex: 1,
                      alignItems: 'center'
                    }}>
                      <p style={{
                        lineHeight: '100%'
                      }}>{item?.serviceName}</p>
                      <div className='mt-6'>
                        <Autocomplete
                          // value={selectedSubject}
                          // onChange={(event, newValue) => {
                          //   setSelectedSubject(newValue);
                          // }}
                          // inputValue={inputValue}
                          // onInputChange={(event, newInputValue) => {
                          //   setInputValue(newInputValue);
                          // }}
                          disablePortal
                          id="combo-box-demo"
                          // options={subjectList}
                          sx={{ width: '100%' }}
                          renderInput={(params) => <TextField {...params} label="Staff" />}
                        />
                      </div>
                    </div>
                  )
                })
              }
            </div>
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
        </Modal>

      </div>
    );
  }
}
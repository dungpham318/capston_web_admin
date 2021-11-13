import React, { Component } from 'react';
//import axios from 'axios';
import Table from '../components/table/Table';
import Modal from '../components/modal/Modal';
import { assignAppointmentApi, cancelAppointmentApi, getTransactionDetailApi, getTransactionList } from '../apis/transactionApi';
import { TextField } from '@material-ui/core';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete'
import { getAvailableStaffList } from '../apis/staffApi';
import Loading from '../components/loading/Loading';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch'
export default class Transaction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      transactionList: [],
      staffList: [],
      //   totalTransaction: 100,
      page: 1,
      pageSize: 10,
      isOpenModal: false,
      selectedTransaction: undefined,
      loading: false,
      selectedStaffList: []
      // selectedStaff: undefined
    };
  }
  componentDidMount() {
    this.getTransaction()
  }

  // componentDidMount() {
  //   this.getAvailableStaff()
  // }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isOpenModal !== prevState.isOpenModal && !this.state.isOpenModal) {
      this.setState({ selectedTransaction: undefined, selectedStaffList: [] })
    }
  }

  getTransaction = async () => {
    this.setState({ loading: true })
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
      "sortBy": "lastupdate_desc"
    })
    this.setState({ loading: false })

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

  getTransactionDetail = async (id) => {
    this.setState({ loading: true })
    let res = await getTransactionDetailApi({
      id: id
    })
    let staffList = await await getAvailableStaffList({
      id: id
    })
    this.setState({ loading: false })
    let data = res?.data
    console.log(data)

    if (data?.appointmentDetails && data?.appointmentDetails.length > 0) {
      for (const item of data?.appointmentDetails) {
        if (staffList?.data && staffList?.data.length > 0) {
          let tmp = staffList?.data
          tmp.map(ele =>
            ele.label = `${ele?.name} (${ele?.numberOfAppointmentsOnDate})`
          )
          Object.assign(item, { staffList: tmp })
        }
      }
    }
    this.setState({
      isOpenModal: true,
      selectedTransaction: res?.data
    })
  }

  assignAppointment = async () => {
    this.setState({ loading: true })
    let staffList = await assignAppointmentApi({
      "appointmentId": this.state.selectedTransaction?.id,
      "staffDetailDTOs": this.state.selectedStaffList
    })
    if (staffList) {
      alert(staffList?.message)
      this.setState({ isOpenModal: false }, () => {
        this.getTransaction()
      })
    }
    this.setState({ loading: false })
    // if (staffList?.isSuccess) {
    //   this.setState({ isOpenModal: false }, () => {
    //     this.getTransaction()
    //   })
    // }
  }

  onSubmit = async () => {
    this.assignAppointment()
  }

  onCancel = async () => {
    let isConfirm = window.confirm("Do you want to cancel this appointment?")
    if (isConfirm) {
      this.setState({ loading: true })
      let res = await cancelAppointmentApi({
        id: this.state.selectedTransaction?.id
      })
      this.setState({ loading: false })
      if (res) {
        this.setState({ isOpenModal: false }, () => {
          this.getTransaction()
        })
      }
    }
  }

  render() {
    return (
      <div>
        <h2 className="page-header">
          Appointments
        </h2>
        <div className='card'>

          <Table
            loading={this.state.loading}
            headers={[
              { id: 1, label: '#', value: 'index' },
              { id: 2, label: 'Customer Name', value: 'customerName' },
              { id: 3, label: 'Salon', value: 'salonName' },
              { id: 4, label: 'Status', value: 'status' },
              { id: 5, label: 'Start Date', value: 'startDate' },
              { id: 6, label: 'End Date', value: 'endDate' },
              { id: 7, label: 'Created Date', value: 'createdDate' },
              { id: 8, label: 'Combo', value: 'comboName' },
              { id: 9, label: 'Total Price', value: 'totalPrice' },
            ]}
            rows={this.state.transactionList}
            actionList={[
              'view',
              // 'edit',
              // 'delete',
            ]}
            onClickView={(row) => {
              this.getTransactionDetail(row?.id)
            }}
            // onClickEdit={(row) => {
            // }}
            // onClickDelete={(row) => {
            // }}
            pagination
            totalItem={this.state.totalTransaction}
            onChangePage={(page, pageSize) => {
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
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}>
            <div style={{
              height: '100%',
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
                label="Customer Name"
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
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flex: '1 1 0%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '1em',
                  marginBottom: '1em',
                }}>
                  <p style={{
                    lineHeight: '100%',
                  }}>Booking Stylist</p>
                  <div style={{
                    width: '50%'
                  }}>
                    {this.state.selectedTransaction?.chosenStylist?.staffName}
                  </div>
                </div>
                {
                  this.state.selectedTransaction?.appointmentDetails && this.state.selectedTransaction?.appointmentDetails.map((item, index) => {
                    console.log(item)
                    return (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flex: '1 1 0%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '1em',
                        marginBottom: '1em',
                      }}>
                        <p style={{
                          lineHeight: '100%',
                        }}>{item?.serviceName}</p>
                        <div style={{
                          width: '50%'
                        }}>
                          {
                            this.state.selectedTransaction?.status === 'pending' ?
                              <Autocomplete
                                disabled={this.state.selectedTransaction?.status === 'pending' ? false : true}
                                value={this.state.staffList?.name}
                                onChange={(event, newValue) => {
                                  let tmp = this.state.selectedStaffList
                                  let index = this.state.selectedStaffList.findIndex(ele => ele?.serviceId === item?.serviceId)
                                  if (index !== -1) {
                                    this.state.selectedStaffList.splice(index, 1)
                                  }
                                  tmp.push({
                                    "staffId": newValue?.staffId,
                                    "serviceId": item?.serviceId
                                  })
                                  this.setState({
                                    selectedStaffList: tmp
                                  }, () => {
                                    console.log(tmp)
                                  })
                                }}
                                // inputValue={inputValue}
                                // onInputChange={(event, newInputValue) => {
                                //   setInputValue(newInputValue);
                                // }}
                                disablePortal
                                id="combo-box-demo"
                                options={item?.staffList}
                                sx={{ width: '100%' }}
                                renderInput={(params) => <TextField {...params} label="Staff" />}
                              /> :
                              <TextField
                                disabled
                                id="outlined-basic"
                                label="Staff"
                                variant="outlined"
                                style={{
                                  width: '100%',
                                  marginTop: '1em',
                                  marginBottom: '1em'
                                }}
                                value={item?.staffName}
                                onChange={(event) => {
                                }}
                              />
                          }

                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: '1em'

            }}>
              <div style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
                <Button variant="contained" color="inherit" onClick={() => {
                  this.setState({
                    isOpenModal: false
                  })
                }}>
                  Close
                </Button>
              </div>
              <div style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
                display: 'flex',
                flexDirection: 'row'
              }}>
                <div style={{ flex: 1 }} />
                <LoadingButton style={{
                  marginRight: '1em'
                }} variant="contained" color="error" loading={this.state.loading} onClick={() => {
                  this.onCancel()
                }}>
                  Cancel
                </LoadingButton>
                <LoadingButton variant="contained" color="success" loading={this.state.loading} onClick={() => {
                  this.onSubmit()
                }}>
                  Submit
                </LoadingButton>
              </div>
            </div>
          </div>
        </Modal>

      </div>
    );
  }
}



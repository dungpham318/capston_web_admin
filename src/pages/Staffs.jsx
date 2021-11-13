import React, { Component } from 'react';
//import axios from 'axios';
import Table from '../components/table/Table';
import { getStaffDetailApi, getStaffList } from '../apis/staffApi';
import Button from '@mui/material/Button';
import Modal from '../components/modal/Modal';
import { TextField } from '@material-ui/core';

export default class Staffs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      staffList: [],
      totalStaff: 100,
      page: 1,
      pageSize: 10,
      isOpenModal: false,
      selectedStaff: undefined
    };
  }
  componentDidMount() {
    this.getStaff()
  }

  getStaff = async () => {
    let staffList = await getStaffList({
      "pageNumber": this.state.page,
      "pageSize": this.state.pageSize,
    //   "statuses": [
    //     "active"
    //   ],
      "sortBy": ""
    })

    if (staffList) {
      this.setState({
        staffList: staffList?.data?.items,
        totalStaff: staffList?.data?.totalCount
      })
    }

  }

  tabRow() {
    return this.state.business.map(function (object, i) {
      return <Table obj={object} key={i} />;
    });
  }

  getStaffDetail = async (id) => {
    let res = await getStaffDetailApi({
      id: id
    })
    console.log(res)

    this.setState({
      isOpenModal: true,
      selectedStaff: res?.data
    })
  }

  render() {
    return (
      <div>
        <h2 className="page-header">
          Staffs List
        </h2>
        <div className='card'>
        <div style={{
            marginBottom: '1em',
          }}>
            <Button variant="outlined" onClick={() => {
              this.props.history.push({
                pathname: `/staffs/create`,
              })
            }}>
              New Staff
            </Button>
          </div>
          <Table
            headers={[
              { id: 1, label: '#', value: 'index' },
              { id: 2, label: 'Staff ID', value: 'staffId' },
              { id: 3, label: 'Full Name', value: 'fullName' },
              { id: 4, label: 'Role', value: 'staffType' },
              { id: 5, label: 'Description', value: 'description' },
            //   { id: 6, label: 'Salon', value: 'salon ID' },
              { id: 6, label: 'Salon Name', value: 'salonName' },
              { id: 7, label: 'Email', value: 'email' },
              { id: 8, label: 'Phone Number', value: 'phoneNumber' },
            ]}
            rows={this.state.staffList}
            actionList={[
              'view',
              //'edit',
              'delete',
            ]}
            onClickView={(row) => {
              console.log(row)
              this.getStaffDetail(row?.staffId)
            }}
            // onClickEdit={(row) => {
            // }}
            onClickDelete={(row) => {
            }}
            pagination
            totalItem={this.state.totalStaff}
            onChangePage={(page, pageSize) => {
              console.log(page, pageSize)
              this.setState({
                page: page,
                pageSize: pageSize
              }, () => {
                this.getStaff()
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
              label="Staff ID"
              variant="outlined"
              style={{
                width: '100%',
                marginTop: '1em',
                marginBottom: '1em'
              }}
              value={this.state.selectedStaff?.staffId}
              onChange={(event) => {
              }}
            />
            <TextField
              required
              disabled
              id="outlined-basic"
              label="Staff Name"
              variant="outlined"
              style={{
                width: '100%',
                marginTop: '1em',
                marginBottom: '1em'
              }}
              value={this.state.selectedStaff?.fullName}
              onChange={(event) => {
              }}
            />
            <TextField
              required
              disabled
              id="outlined-basic"
              label="Working Role"
              variant="outlined"
              style={{
                width: '100%',
                marginTop: '1em',
                marginBottom: '1em'
              }}
              value={this.state.selectedStaff?.staffType}
              onChange={(event) => {
              }}
            />
            <TextField
              required
              disabled
              id="outlined-basic"
              label="Description"
              variant="outlined"
              style={{
                width: '100%',
                marginTop: '1em',
                marginBottom: '1em'
              }}
              value={this.state.selectedStaff?.description}
              onChange={(event) => {
              }}
            />
            <TextField
              required
              disabled
              id="outlined-basic"
              label="Staff Email"
              variant="outlined"
              style={{
                width: '100%',
                marginTop: '1em',
                marginBottom: '1em'
              }}
              value={this.state.selectedStaff?.email}
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
              value={this.state.selectedStaff?.phoneNumber}
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
        </Modal>

      </div>
    );
  }
}
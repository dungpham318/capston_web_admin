/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
//import axios from 'axios';
import Table from '../components/table/Table';
import { createStaffApi, getStaffDetailApi, getStaffList, removeStaffApi, updateStaffApi } from '../apis/staffApi';
import Button from '@mui/material/Button';
import Modal from '../components/modal/Modal';
import { TextField } from '@material-ui/core';
import { LoadingButton } from '@mui/lab';
import Autocomplete from '@mui/material/Autocomplete'
import { getSalonList } from '../apis/salonApi';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ic_upload_avatar from '../assets/images/ic_upload_avatar.png'
export default class Staffs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      staffList: [],
      totalStaff: 100,
      page: 1,
      pageSize: 10,
      isOpenModal: false,
      selectedStaff: undefined,

      salonList: [],

      action: undefined,
      fullName: '',
      password: '',
      confirmPassword: '',
      description: '',
      email: '',
      phoneNumber: '',
      selectedSalon: undefined,
      staffType: undefined,
      image: '',
      imageURL: '',
    };
  }
  componentDidMount() {

    this.getStaff()
    this.getSalon()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isOpenModal !== prevState.isOpenModal && !this.state.isOpenModal) {
      this.setState({
        action: undefined,
        fullName: '',
        password: '',
        confirmPassword: '',
        description: '',
        email: '',
        phoneNumber: '',
        selectedSalon: undefined,
        staffType: undefined,
        image: '',
        imageURL: '',
      })
    }
  }

  getSalon = async () => {
    this.setState({ loading: true })
    let res = await getSalonList({
      "pageNumber": 1,
      "pageSize": 100,
      "statuses": [
        "active"
      ],
      "name": "",
      "minCreatedDate": "",
      "maxCreatedDate": "",
      "minLastUpdate": "",
      "maxLastUpdate": "",
      "sortBy": ""
    })
    this.setState({ loading: false })
    if (res?.data?.items) {
      this.setState({ salonList: res?.data?.items })
    }
  }

  getStaff = async () => {
    this.setState({ loading: true })
    let staffList = await getStaffList({
      "pageNumber": this.state.page,
      "pageSize": this.state.pageSize,
      "sortBy": "userid_desc"
    })
    this.setState({ loading: false })
    if (staffList) {
      this.setState({
        staffList: staffList?.data?.items,
        totalStaff: staffList?.data?.totalCount
      })
    }

  }

  getStaffDetail = async () => {
    this.setState({ loading: true })
    let res = await getStaffDetailApi({
      id: this.state.selectedStaff?.userId
    })
    this.setState({ loading: false })
    if (res?.data) {
      let selectedSalon
      let index = this.state.salonList.findIndex(ele => ele?.id === res?.data?.salonId)
      if (index !== -1) {
        selectedSalon = this.state.salonList[index]
      }
      console.log(res?.data)
      this.setState({
        isOpenModal: true,
        fullName: res?.data?.fullName,
        staffType: { name: res?.data?.staffType.charAt(0).toUpperCase() + res?.data?.staffType.slice(1) },
        description: this.state.description,
        selectedSalon: selectedSalon,
        email: res?.data?.email,
        phoneNumber: res?.data?.phoneNumber,
        imageURL: res?.data?.avatarUrl
      })
    }

  }

  createStaff = async () => {
    this.setState({ loading: true })
    let formData = new FormData()

    formData.append('FullName', this.state.fullName)
    formData.append('Password', this.state.password)
    formData.append('ConfirmPassword', this.state.confirmPassword)
    formData.append('Description', this.state.description)
    formData.append('Email', this.state.email)
    formData.append('PhoneNumber', this.state.phoneNumber)
    formData.append('SalonId', this.state.selectedSalon?.id)
    formData.append('StaffType', this.state.staffType?.name.toLowerCase())
    formData.append('ImageFile', this.state.image)

    let res = await createStaffApi(formData)
    if (res?.data) {
      this.setState({
        loading: false,
        isOpenModal: false
      }, () => {
        this.getStaff()
      })
    }
  }

  updateStaff = async () => {
    this.setState({ loading: true })
    console.log(this.state.selectedStaff)
    let res = await updateStaffApi({
      "staffId": this.state.selectedStaff?.staffId,
      "staffType": this.state.staffType?.name.toLowerCase(),
      "status": "active",
      "salonId": this.state.selectedSalon?.id,
      "description": this.state.description
    })
    if (res?.data) {
      this.setState({
        isOpenModal: false
      }, () => {
        this.getStaff()
      })
    }
    this.setState({ loading: false })

  }

  deleteStaff = async () => {
    this.setState({ loading: true })
    console.log(this.state.selectedStaff)
    let res = await removeStaffApi({
      "id": this.state.selectedStaff?.staffId,
    })
    this.setState({
      loading: false,
      selectedStaff: undefined
    })

    if (res?.data) {
      this.getStaff()
    }
  }

  render() {
    let actionList = [
      'view',
      'edit',
      'delete'
    ]

    if (localStorage.getItem('role') === 'manager') {
      actionList = ['view']
    }
    return (
      <div>
        <h2 className="page-header">
          Staffs List
        </h2>
        <div className='card'>
          <div style={{
            marginBottom: '1em',
          }}>
            {
              localStorage.getItem('role') !== 'manager' &&
              <Button variant="outlined" onClick={() => {
                this.setState({
                  isOpenModal: true,
                  action: 'create'
                })
              }}>
                New Staff
              </Button>
            }
          </div>
          <Table
            loading={this.state.loading}
            headers={[
              { id: 1, label: '#', value: 'index' },
              // { id: 2, label: 'Staff ID', value: 'staffId' },
              { id: 3, label: 'Full Name', value: 'fullName' },
              { id: 4, label: 'Role', value: 'staffType' },
              { id: 5, label: 'Description', value: 'description' },
              { id: 6, label: 'Salon Name', value: 'salonName' },
              { id: 7, label: 'Email', value: 'email' },
              { id: 8, label: 'Phone Number', value: 'phoneNumber' },
            ]}
            rows={this.state.staffList}
            actionList={actionList}
            onClickView={(row) => {
              this.setState({
                action: 'view',
                selectedStaff: row
              }, () => {
                this.getStaffDetail()
              })
            }}
            onClickEdit={(row) => {
              this.setState({
                action: 'edit',
                selectedStaff: row
              }, () => {
                this.getStaffDetail()
              })
            }}
            onClickDelete={(row) => {
              this.setState({
                selectedStaff: row
              }, () => {
                this.deleteStaff()
              })
            }}
            pagination
            totalItem={this.state.totalStaff}
            onChangePage={(page, pageSize) => {
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
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}>
            <h2 className="page-header">
              {
                this.state.action === 'view' ? 'Staff' : this.state.action === 'create' ? 'Create Staff' : 'Edit Staff'
              }
            </h2>
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              overflowY: 'scroll',
              paddingRight: '2em',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <p style={{
                  paddingRight: '2em'
                }}>Avatar</p>
                {
                  (this.state.imageURL && this.state.imageURL !== '') &&
                  <img
                    src={this.state.imageURL}
                    style={{
                      width: '5em',
                      height: '5em',
                      borderRadius: '5em'
                    }}
                  />
                }
                {
                  this.state.action !== 'view' &&
                  <input
                    type='file'
                    accept="image/*"
                    style={{
                      marginLeft: '2em'
                    }}
                    onChange={(event) => {
                      console.log(event.target.files[0])
                      let reader = new FileReader()
                      reader.readAsDataURL(event.target.files[0])
                      reader.onloadend = () => {
                        this.setState({
                          imageURL: reader?.result,
                          image: event.target.files[0]
                        })
                      }
                    }}
                  />
                }

              </div>
              <TextField
                required
                disabled={this.state.action === 'view'}
                id="outlined-basic"
                label="Staff Name"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.fullName}
                onChange={(event) => {
                  this.setState({ fullName: event.target.value })
                }}
              />
              {
                this.state.action === 'create' &&
                <TextField
                  required
                  disabled={this.state.action === 'view'}
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  style={{
                    width: '100%',
                    marginTop: '1em',
                    marginBottom: '1em'
                  }}
                  type='password'
                  value={this.state.password}
                  onChange={(event) => {
                    this.setState({ password: event.target.value })
                  }}
                />
              }
              {
                this.state.action === 'create' &&
                <TextField
                  required
                  disabled={this.state.action === 'view'}
                  id="outlined-basic"
                  label="Confirm Password"
                  variant="outlined"
                  style={{
                    width: '100%',
                    marginTop: '1em',
                    marginBottom: '1em'
                  }}
                  type='password'
                  value={this.state.confirmPassword}
                  onChange={(event) => {
                    this.setState({ confirmPassword: event.target.value })
                  }}
                />
              }

              <TextField
                disabled={this.state.action === 'view'}
                id="outlined-basic"
                label="Description"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.description}
                onChange={(event) => {
                  this.setState({ description: event.target.value })
                }}
              />

              <TextField
                required
                disabled={this.state.action === 'view'}
                id="outlined-basic"
                label="Email"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.email}
                onChange={(event) => {
                  this.setState({ email: event.target.value })
                }}
              />

              <TextField
                required
                disabled={this.state.action === 'view'}
                id="outlined-basic"
                label="Phone Number"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.phoneNumber}
                onChange={(event) => {
                  this.setState({ phoneNumber: event.target.value })
                }}
              />

              <Autocomplete
                disabled={this.state.action === 'view'}
                value={this.state.selectedSalon}
                onChange={(event, newValue) => {
                  this.setState({ selectedSalon: newValue })
                }}
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                getOptionLabel={(option) => option.name}
                disablePortal
                id="combo-box-demo"
                options={this.state.salonList}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Salon" variant="outlined" />}
              />

              <Autocomplete
                disabled={this.state.action === 'view'}
                value={this.state.staffType}
                onChange={(event, newValue) => {
                  this.setState({ staffType: newValue })
                }}
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                getOptionLabel={(option) => option.name}
                disablePortal
                id="combo-box-demo"
                options={[
                  { name: 'Stylist' },
                  { name: 'Beautician' },
                  { name: 'Manager' },
                ]}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Staff Type" variant="outlined" />}
              />



            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: '1em'
            }}>
              <Button variant="contained" color="inherit" onClick={() => {
                this.setState({
                  isOpenModal: false
                })
              }}>
                Close
              </Button>
              {
                (this.state.action === 'create' || this.state.action === 'edit') &&
                <div style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  display: 'flex',
                  flexDirection: 'row'
                }}>
                  <div style={{ flex: 1 }} />
                  <LoadingButton variant="contained" color="success" loading={this.state.loading} onClick={() => {
                    if (this.state.action === 'create') {
                      this.createStaff()
                    } else {
                      this.updateStaff()
                    }
                  }}>
                    {this.state.action === 'create' ? 'Save' : 'Update'}
                  </LoadingButton>
                </div>
              }

            </div>
          </div>
        </Modal>

      </div>
    );
  }
}
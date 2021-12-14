/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import axios from 'axios';
import Table from '../components/table/Table';
import { getComboList, getComboDetailApi, createComboApi, updateComboApi } from '../apis/comboApi';
import { getServiceList, } from '../apis/serviceApi';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';
import Modal from '../components/modal/Modal';
import { TextField } from '@material-ui/core';
import { convertMoney } from '../function';
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

export default class Combo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comboList: [],
      totalCombo: 100,
      page: 1,
      pageSize: 10,
      minPrice: 0,
      maxPrice: 100000000,
      minDuration: 0,
      maxDuration: 180,
      isOpenModal: false,
      loading: false,
      selectedCombo: undefined,
      selectedServiceList: [],

      comboName: '',
      comboDescription: '',
      avatarFile: undefined,
      price: '',
      image: undefined,

      action: undefined,

      serviceList: [],
      selectedService: undefined,
      comboServiceList: [],

      status: true
    };
  }
  componentDidMount() {
    this.getCombo()
    this.getService()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isOpenModal !== prevState.isOpenModal && !this.state.isOpenModal) {
      this.setState({
        selectedService: undefined,
        comboName: '',
        comboDescription: '',
        avatarFile: undefined,
        price: '',
        image: undefined,
        action: undefined,
        serviceList: [],
        comboServiceList: [],
      })
    }
  }


  getCombo = async () => {
    this.setState({ loading: true })
    let comboList = await getComboList({
      "pageNumber": this.state.page,
      "pageSize": this.state.pageSize,
      "statuses": [
        // "active"
      ],
      "minCreatedDate": "",
      "maxCreatedDate": "",
      "minPrice": this.state.minPrice,
      "maxPrice": this.state.maxPrice,
      "minDuration": this.state.minDuration,
      "maxDuration": this.state.maxDuration,
      "sortBy": ""
    })

    if (comboList) {
      if (comboList?.data?.items) {
        comboList.data.items.map(ele => {
          ele.convertPrice = convertMoney(ele?.price)
        })
      }
      this.setState({
        loading: false,
        comboList: comboList?.data?.items,
        totalCombo: comboList?.data?.totalCount
      })
    }
  }

  getService = async () => {
    this.setState({ loading: true })
    let serviceList = await getServiceList({
      "name": "",
      "minCreatedDate": "",
      "maxCreatedDate": "",
      "minLastUpdate": "",
      "maxLastUpdate": "",
      "minPrice": -1,
      "maxPrice": -1,
      "minDuration": -1,
      "maxDuration": -1,
      "sortBy": ""
    })
    console.log(serviceList)
    if (serviceList?.data?.items) {
      serviceList?.data?.items.map(ele => {
        ele.convertPrice = convertMoney(ele?.price)
        ele.time = ele?.duration * 10 + ' minutes'
        ele.label = ele?.name
      })
      this.setState({
        loading: false,
        serviceList: serviceList?.data?.items,
        totalService: serviceList?.data?.totalCount
      })
    }
  }

  getComboDetail = async (id) => {
    this.setState({ loading: true })
    let res = await getComboDetailApi({
      id: id
    })
    // let serviceList = await getServiceList({
    //   id: id
    // })
    let data = res?.data
    if (data?.services && data?.services.length > 0) {
      for (const item of data?.services) {
        if (res?.data?.services && res?.data?.services.length > 0) {
          let tmp = res?.data?.services
          tmp.map(ele => {
            ele.label = `${ele?.name} (${ele?.numberOfServicesOnDate})`
            ele.convertPrice = convertMoney(ele?.price)
            ele.time = ele?.duration * 10 + ' minutes'
            ele.checked = ele?.isDoneByStylist
          })
          console.log(tmp)
          Object.assign(item, { serviceList: tmp })
        }
      }
    }
    this.setState({
      loading: false,
      isOpenModal: true,
      selectedCombo: res?.data,
      comboName: res?.data?.name,
      comboDescription: res?.data?.description,
      status: res?.data?.status === 'active' ? true : false,
      avatarFile: undefined,
      price: convertMoney(res?.data?.price),
      comboServiceList: res?.data?.services,
      image: res?.data?.avatarUrl
    })
  }

  createCombo = async () => {
    console.log(this.state.comboServiceList)
    this.setState({ loading: true })
    let tmp = []
    let index = 1
    for (const item of this.state.comboServiceList) {
      tmp.push({
        "serviceId": item?.id,
        "isDoneByStylist": item?.checked || false,
        "serviceOrder": index
      })
      ++index
    }
    console.log(tmp)
    let formData = new FormData()

    formData.append('AvatarFile', this.state.avatarFile)
    formData.append('Name', this.state.comboName)
    formData.append('Description', this.state.comboDescription)
    formData.append('Status', this.state.status ? 'active' : 'inactive')
    // formData.append('Details', tmp)
    formData.append('Price', this.state.price.split('.').join(''))
    let res = await createComboApi(formData)
    console.log(res)
    if (res) {
      this.updateCombo(res?.data)
      // alert(res?.message)
      // this.setState({
      //   isOpenModal: false,
      //   loading: false,
      // }, () => {
      //   this.getCombo()
      // })
    }
  }

  updateCombo = async (id) => {
    console.log(this.state.comboServiceList)
    this.setState({ loading: true })
    let tmp = []
    let index = 1
    for (const item of this.state.comboServiceList) {
      tmp.push({
        "serviceId": item?.id,
        "isDoneByStylist": item?.checked || false,
        "serviceOrder": index
      })
      ++index
    }

    let res = await updateComboApi({
      "id": id,
      "name": this.state.comboName,
      "description": this.state.comboDescription,
      "status": this.state.status ? 'active' : 'inactive',
      "price": parseInt(this.state.price.split('.').join('')),
      "details": tmp
    })
    this.setState({ loading: false })
    if (res) {
      alert(res?.message)
      this.setState({
        isOpenModal: false,
      }, () => {
        this.getCombo()
      })
    }
  }

  render() {
    let actionList = [
      'view',
      'edit'
    ]

    if (localStorage.getItem('role') === 'manager') {
      actionList = ['view']
    }
    return (
      <div>
        <h2 className="page-header">
          Combo
        </h2>
        <div className='card'>
          <div style={{
            marginBottom: '1em',
          }}>
            {
              localStorage.getItem('role') !== 'manager' &&
              <Button variant="outlined" onClick={() => {
                this.getService()
                this.setState({ isOpenModal: true, action: 'create' })
              }}>
                New Combo
              </Button>
            }
          </div>
          <Table
            loading={this.state.loading}
            headers={[
              { id: 1, label: '#', value: 'index' },
              { id: 2, label: 'Name', value: 'name' },
              { id: 3, label: 'Description', value: 'description' },
              { id: 4, label: 'Status', value: 'status' },
              // { id: 5, label: 'Duration', value: 'duration' },
              { id: 6, label: 'Price', value: 'convertPrice' },
              // { id: 7, label: 'Created Date', value: 'createdDate' },
              // { id: 8, label: 'Last Update', value: 'lastUpdated' },
            ]}
            rows={this.state.comboList}
            actionList={actionList}
            onClickView={(row) => {
              this.getService()
              this.setState({ action: 'view' })
              this.getComboDetail(row?.id)
            }}
            onClickEdit={(row) => {
              this.getService()
              this.setState({ action: 'edit' })
              this.getComboDetail(row?.id)
            }}
            onClickDelete={(row) => {
            }}
            pagination
            totalItem={this.state.totalCombo}
            onChangePage={(page, pageSize) => {
              console.log(page, pageSize)
              this.setState({
                page: page,
                pageSize: pageSize
              }, () => {
                this.getCombo()
              })
            }}
          />

        </div>

        <Modal isOpen={this.state.isOpenModal}>
          <h2 className="page-header">
            {
              this.state.action === 'view' ? 'Combo' : this.state.action === 'create' ? 'Create Combo' : 'Edit Combo'
            }
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
                disabled={this.state.action === 'view'}
                required
                id="outlined-basic"
                label="Name"
                variant="outlined"
                style={{
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.comboName}
                onChange={(event) => {
                  this.setState({ comboName: event.target.value })
                }}
              />
              <TextField
                disabled={this.state.action === 'view'}
                required
                id="outlined-basic"
                label="Description"
                variant="outlined"
                style={{
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.comboDescription}
                onChange={(event) => {
                  this.setState({ comboDescription: event.target.value })
                }}
              />
              <TextField
                disabled={this.state.action === 'view'}
                required
                id="outlined-basic"
                label="Price"
                variant="outlined"
                style={{
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.price}
                onChange={(event) => {
                  this.setState({ price: convertMoney(event.target.value) })
                }}
              />

              <FormControlLabel control={
                <Checkbox
                  disabled={this.state.action === 'view'}
                  checked={this.state.status}
                  onChange={(event) => {
                    this.setState({
                      status: event.target.checked
                    })
                  }} />} label={'Active'} />

              {
                this.state.action !== 'view' &&
                <div className={'flex flex-row my-1 items-center '} style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <span style={{
                    textAlign: 'left',
                    width: '8rem',
                    marginTop: '1em',
                    marginBottom: '1em'
                  }}>Upload image</span>
                  <div>
                    {/* <img src={imageLink} className='w-40 mx-10' /> */}
                    <input
                      type='file'
                      accept="image/*"
                      style={{
                        display: 'flex',
                        flex: '1 1 auto',
                        outline: '2px solid transparent',
                        outlineOffset: '2px',
                      }}
                      onChange={(event) => {
                        console.log(event.target.files[0])
                        this.setState({ avatarFile: event.target.files[0] })
                        // setImageFile(event.target.files[0])
                      }}
                    />
                  </div>
                </div>
              }

              {
                this.state.image &&
                <img
                  src={this.state.image}
                  style={{
                    width: '10em',
                    height: '10em'
                  }}
                />
              }
              {
                this.state.action !== 'view' &&
                <div style={{
                  marginTop: '1em',
                  marginBottom: '1em'
                }}>
                  <p style={{
                    fontWeight: 'bold'
                  }}>Service</p>
                  <div style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Autocomplete
                      value={this.state.selectedService}
                      onChange={(event, newValue) => {
                        this.setState({ selectedService: newValue })
                      }}
                      disablePortal
                      id="combo-box-demo"
                      options={this.state.serviceList}
                      sx={{ width: '100%' }}
                      renderInput={(params) => <TextField {...params} label="Service" variant="outlined" />}
                    />
                    <div style={{ marginLeft: '2em' }}>
                      <LoadingButton variant="outlined" color="primary" loading={this.state.loading} onClick={() => {
                        this.setState({
                          comboServiceList: [...this.state.comboServiceList, this.state.selectedService],
                          selectedService: undefined
                        })
                      }}>
                        Add Service
                      </LoadingButton>
                    </div>
                  </div>
                </div>
              }

              <div style={{
                marginTop: '1em',
                marginBottom: '1em'
              }}>
                <Table
                  loading={this.state.loading}
                  headers={[
                    { id: 1, label: '#', value: 'index' },
                    { id: 2, label: 'Name', value: 'name' },
                    { id: 3, label: 'Description', value: 'description' },
                    { id: 4, label: 'Duration', value: 'time' },
                    { id: 4, label: 'Stylist', value: 'checkbox' },
                    { id: 7, label: 'Price', value: 'convertPrice' },
                  ]}
                  rows={this.state.comboServiceList}
                  actionList={this.state.action !== 'view' ? [
                    'delete',
                  ] : []}
                  onClickDelete={(row, index) => {
                    this.state.comboServiceList.splice(index, 1)
                    this.setState({ comboServiceList: this.state.comboServiceList })
                  }}
                />
              </div>
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
                this.state.action !== 'view' &&
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
                      this.createCombo()
                    } else {
                      this.updateCombo(this.state.selectedCombo?.id)
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


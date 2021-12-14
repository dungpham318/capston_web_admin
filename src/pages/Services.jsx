import React, { Component, useState } from 'react';
import axios from 'axios';
import Table from '../components/table/Table';
import { getServiceList, getServiceDetail, createServiceApi, updateServiceApi } from '../apis/serviceApi';
import AddIcon from '@material-ui/icons/Add';
import Popup from '../components/popup/Popup';
import Button from '@mui/material/Button';
import Modal from '../components/modal/Modal';
import { TextField } from '@material-ui/core';
import { convertMoney } from '../function';
import LoadingButton from '@mui/lab/LoadingButton';

export default class Services extends Component {

  constructor(props) {
    super(props);
    this.state = {
      serviceList: [],
      totalService: 0,
      page: 1,
      pageSize: 10,
      minPrice: -1,
      maxPrice: -1,
      isOpenModal: false,
      selectedService: undefined,
      loading: false,

      name: '',
      description: '',
      price: '',
      duration: '',
      action: undefined
    };
  }
  componentDidMount() {
    this.getService()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isOpenModal !== prevState.isOpenModal && !this.state.isOpenModal) {
      this.setState({
        selectedService: undefined,
        action: undefined,
        name: '',
        description: '',
        price: '',
        duration: '',
      })
    }
  }

  getService = async () => {
    this.setState({ loading: true })
    let serviceList = await getServiceList({
      "pageNumber": this.state.page,
      "pageSize": this.state.pageSize,
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
    if (serviceList && serviceList?.data?.items) {
      serviceList?.data?.items.map(ele => {
        ele.convertPrice = convertMoney(ele?.price)
        ele.time = ele?.duration * 10 + ' minutes'
      })
      this.setState({
        loading: false,
        serviceList: serviceList?.data?.items,
        totalService: serviceList?.data?.totalCount
      })
    }
  }

  getDetail = async (id) => {
    this.setState({ loading: true })
    let res = await getServiceDetail({
      id: id
    })
    if (res?.data) {
      this.setState({
        selectedService: res?.data,
        name: res?.data?.name,
        description: res?.data?.description,
        duration: res?.data?.duration * 10,
        price: convertMoney(res?.data?.price),
      })
    }
    this.setState({
      loading: false,
      isOpenModal: true,
    })
  }

  createService = async () => {
    this.setState({ loading: true })
    let res = await createServiceApi({
      name: this.state.name,
      description: this.state.description,
      duration: Math.round(this.state.duration / 10),
      price: this.state.price.split('.').join('')
    })
    if (res) {
      alert(res?.message)
      this.setState({
        isOpenModal: false,
        loading: false
      }, () => {
        this.getService()
      })
    }
  }

  updateService = async () => {
    this.setState({ loading: true })
    let res = await updateServiceApi({
      id: this.state.selectedService?.id,
      name: this.state.name,
      description: this.state.description,
      duration: Math.round(this.state.duration / 10),
      price: this.state.price.split('.').join('')
    })
    if (res) {
      alert(res?.message)
      this.setState({
        isOpenModal: false,
        loading: false
      }, () => {
        this.getService()
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
          Services
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
                // this.props.history.push({
                //   pathname: `/services/create`,
                // })
              }}>
                New Service
              </Button>
            }

          </div>
          {/* <div className='card'> */}
          <Table
            loading={this.state.loading}
            headers={[
              { id: 1, label: '#', value: 'index' },
              { id: 2, label: 'Name', value: 'name' },
              { id: 3, label: 'Description', value: 'description' },
              { id: 4, label: 'Duration', value: 'time' },
              // { id: 5, label: 'Created Date', value: 'createdDate' },
              // { id: 6, label: 'Last Update', value: 'lastUpdated' },
              { id: 7, label: 'Price', value: 'convertPrice' },
            ]}
            rows={this.state.serviceList}
            actionList={actionList}
            onClickView={(row) => {
              this.setState({ action: 'view' })
              this.getDetail(row?.id)
            }}
            onClickEdit={(row) => {
              this.setState({ action: 'edit' })
              this.getDetail(row?.id)
            }}
            onClickDelete={(row) => {
              this.deleteService(row?.id)
            }}
            pagination
            totalItem={this.state.totalService}
            onChangePage={(page, pageSize) => {
              console.log(page, pageSize)
              this.setState({
                page: page,
                pageSize: pageSize
              }, () => {
                this.getService()
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
                this.state.action === 'view' ? 'Service' : this.state.action === 'create' ? 'Create Service' : 'Edit Service'
              }
            </h2>
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
                disabled={this.state.action === 'view'}
                id="outlined-basic"
                label="Service Name"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.name}
                onChange={(event) => {
                  this.setState({ name: event.target.value })
                }}
              />
              <TextField
                required
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
              {/* <TextField
              required
               disabled={this.state.action === 'view'}
              id="outlined-basic"
              label="Status"
              variant="outlined"
              style={{
                width: '100%',
                marginTop: '1em',
                marginBottom: '1em'
              }}
              value={this.state.selectedService?.status}
              onChange={(event) => {
              }}
            /> */}
              <TextField
                required
                disabled={this.state.action === 'view'}
                id="outlined-basic"
                label="Duration (minutes)"
                variant="outlined"
                placeholder='60'
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.duration}
                onChange={(event) => {
                  this.setState({ duration: event.target.value })
                }}
              />
              {/* <TextField
                required
                disabled={this.state.action === 'view'}
                id="outlined-basic"
                label="Created Date"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.selectedService?.createdDate ? this.state.selectedService?.createdDate.split(' ')[0] : ''}
                onChange={(event) => {
                }}
              /> */}
              <TextField
                required
                disabled={this.state.action === 'view'}
                id="outlined-basic"
                label="Price"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.price}
                onChange={(event) => {
                  this.setState({ price: convertMoney(event.target.value) })
                }}
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
                    this.createService()
                  } else {
                    this.updateService()
                  }
                }}>
                  {this.state.action === 'create' ? 'Save' : 'Update'}
                </LoadingButton>
              </div>
            </div>
          </div>

        </Modal>

      </div>
    );
  }
}


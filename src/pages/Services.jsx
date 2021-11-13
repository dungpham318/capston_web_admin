import React, { Component, useState } from 'react';
import axios from 'axios';
import Table from '../components/table/Table';
import { getServiceList } from '../apis/serviceApi';
import AddIcon from '@material-ui/icons/Add';
import Popup from '../components/popup/Popup';
import Button from '@mui/material/Button';
import Modal from '../components/modal/Modal';
import { TextField } from '@material-ui/core';
import { getServiceDetail } from '../apis/serviceApi'

export default class Services extends Component {

  constructor(props) {
    super(props);
    this.state = {
      serviceList: [],
      totalService: 100,
      page: 1,
      pageSize: 10,
      minPrice: -1,
      maxPrice: -1,
      isOpenModal: false,
      selectedService: undefined
    };
  }
  componentDidMount() {
    this.getService()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isOpenModal !== prevState.isOpenModal && !this.state.isOpenModal) {
      this.setState({ selectedService: undefined })
    }
  }

  getService = async () => {
    let serviceList = await getServiceList({
      "pageNumber": this.state.page,
      "pageSize": this.state.pageSize,
      "statuses": [
        "active"
      ],
      "minCreatedDate": "",
      "maxCreatedDate": "",
      "minLastUpdate": "",
      "maxLastUpdate": "",
      "minPrice": this.state.minPrice,
      "maxPrice": this.state.maxPrice,
      "sortBy": "id_asc"
    })

    if (serviceList) {
      this.setState({
        serviceList: serviceList?.data?.items,
        totalService: serviceList?.data?.totalCount
      })
    }

  }

  tabRow() {
    return this.state.business.map(function (object, i) {
      return <Table obj={object} key={i} />;
    });
  }

  getDetail = async (id) => {
    let res = await getServiceDetail({
      id: id
    })
    console.log(res)

    this.setState({
      isOpenModal: true,
      selectedService: res?.data
    })
  }
  

  render() {
    return (
      <div>
        <h2 className="page-header">
          Services List
        </h2>
        <div className='card'>
          <div style={{
            marginBottom: '1em',
          }}>
            <Button variant="outlined" onClick={() => {
              this.props.history.push({
                pathname: `/services/create`,
              })
            }}>
              New Service
            </Button>
          </div>
          {/* <div className='card'> */}
          <Table
            headers={[
              { id: 1, label: '#', value: 'id' },
              { id: 2, label: 'Name', value: 'name' },
              { id: 3, label: 'Description', value: 'description' },
              { id: 4, label: 'Status', value: 'status' },
              { id: 5, label: 'Created Date', value: 'createdDate' },
              { id: 6, label: 'Last Update', value: 'lastUpdated' },
              { id: 7, label: 'Price', value: 'price' },
            ]}
            rows={this.state.serviceList}
            actionList={[
              'view',
              'edit',
              //'delete',
            ]}
            onClickView={(row) => {
              console.log(row)
              this.getDetail(row?.id)
            }}
            onClickEdit={(row) => {
              this.props.history.push({
                pathname:`/services/create`,
                state:{
                  serviceData: row
                }
              })
            }}
            // onClickDelete={(row) => {
            //   console.log(row)
            //   this.deleteService(row?.id)
            // }}
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
            display: 'flex',
            flexDirection: 'column',
            flex: 1
          }}>
            <TextField
              required
              disabled
              id="outlined-basic"
              label="Service Name"
              variant="outlined"
              style={{
                width: '100%',
                marginTop: '1em',
                marginBottom: '1em'
              }}
              value={this.state.selectedService?.name}
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
              value={this.state.selectedService?.description}
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
              value={this.state.selectedService?.status}
              onChange={(event) => {
              }}
            />
            <TextField
                required
                disabled
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
              />
            <TextField
              required
              disabled
              id="outlined-basic"
              label="Price"
              variant="outlined"
              style={{
                width: '100%',
                marginTop: '1em',
                marginBottom: '1em'
              }}
              value={this.state.selectedService?.price}
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


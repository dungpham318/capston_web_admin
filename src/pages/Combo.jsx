import React, { Component } from 'react';
import axios from 'axios';
import Table from '../components/table/Table';
import { getComboList, getComboDetailApi } from '../apis/comboApi';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';
import { getServiceList } from '../apis/serviceApi';
import Modal from '../components/modal/Modal';
import { TextField } from '@material-ui/core';

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
      selectedServiceList: []
    };
  }
  componentDidMount() {
    this.getCombo()
  }

  getCombo = async () => {
    this.setState({ loading: true })
    let comboList = await getComboList({
      "pageNumber": this.state.page,
      "pageSize": this.state.pageSize,
      "statuses": [
        "active"
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
      this.setState({
        loading: false,
        comboList: comboList?.data?.items,
        totalCombo: comboList?.data?.totalCount
      })
    }

  }

  tabRow() {
    return this.state.business.map(function (object, i) {
      return <Table obj={object} key={i} />;
    });
  }

  getComboDetail = async (id) => {
    this.setState({ loading: true })

    let res = await getComboDetailApi({
      id: id
    })
    let serviceList = await await getServiceList({
      id: id
    })
    let data = res?.data

    if (data?.services && data?.services.length > 0) {
      for (const item of data?.services) {
        if (serviceList?.data && serviceList?.data.length > 0) {
          let tmp = serviceList?.data
          tmp.map(ele =>
            ele.label = `${ele?.name} (${ele?.numberOfServicesOnDate})`
          )
          Object.assign(item, { serviceList: tmp })
        }
      }
    }
    this.setState({
      loading: false,
      isOpenModal: true,
      selectedCombo: res?.data
    })
  }

  render() {
    return (
      <div>
        <h2 className="page-header">
          Combo
        </h2>
        <div className='card'>
          <div style={{
            marginBottom: '1em',
          }}>
            <Button variant="outlined" onClick={() => {
              this.props.history.push({
                pathname: `/combo/create`,
              })
            }}>
              New Combo
            </Button>
          </div>
          <Table
            loading={this.state.loading}
            headers={[
              { id: 1, label: '#', value: 'id' },
              { id: 2, label: 'Name', value: 'name' },
              { id: 3, label: 'Description', value: 'description' },
              { id: 4, label: 'Status', value: 'status' },
              { id: 5, label: 'Duration', value: 'duration' },
              { id: 6, label: 'Price', value: 'price' },
              { id: 7, label: 'Created Date', value: 'createdDate' },
              { id: 8, label: 'Last Update', value: 'lastUpdated' },
            ]}
            rows={this.state.comboList}
            actionList={[
              'view',
              'edit',
              'delete',
            ]}
            onClickView={(row) => {
              console.log(row)
              this.getComboDetail(row?.id)
            }}
            onClickEdit={(row) => {
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
                value={this.state.selectedCombo?.name}
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
                value={this.state.selectedCombo?.description}
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
                value={this.state.selectedCombo?.status}
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
                value={this.state.selectedCombo?.price}
                onChange={(event) => {
                }}
              />
              <TextField
                required
                disabled
                id="outlined-basic"
                label="Duration (hour)"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.selectedCombo?.duration}
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


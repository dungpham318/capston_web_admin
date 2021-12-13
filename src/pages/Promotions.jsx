import React, { Component } from 'react';
//import axios from 'axios';
import Table from '../components/table/Table';
import Modal from '../components/modal/Modal';
import { createPromotionApi, getDetailPromotionApi, getPromotionList, updatePromotionApi, updatePromotionCodeApi } from '../apis/promotionApi';
import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import { TextField } from '@material-ui/core';
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { getSalonList } from '../apis/salonApi';
import { convertDate, convertDateTime } from '../function';
import FormControlLabel from '@mui/material/FormControlLabel'

export default class Promotions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      promotionList: [],
      totalPromotion: 100,
      page: 1,
      pageSize: 10,
      minPercentage: 0,
      maxPercentage: 100,
      minUsesPerCustomer: 0,
      maxUsesPerCustomer: 10000000,

      selectedPromotion: undefined,
      salonList: [],
      code: '',
      percentage: '',
      startDate: new Date(),
      expirationDate: new Date(),
      selectedSalon: [],
      isUniversal: true,
      usersPerCustomer: 1,

      action: undefined,

      loading: false
    };
  }
  componentDidMount() {
    this.getPromotion()
    this.getSalon()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isOpenModal !== prevState.isOpenModal && !this.state.isOpenModal) {
      this.setState({
        selectedPromotion: undefined,
        code: '',
        percentage: '',
        startDate: new Date(),
        expirationDate: new Date(),
        selectedSalon: [],
        isUniversal: true,
        usersPerCustomer: 1,
      })
    }
  }

  getPromotion = async () => {
    this.setState({ loading: true })
    let promotionList = await getPromotionList({
      "pageNumber": this.state.page,
      "pageSize": this.state.pageSize,
      "code": "",
      "isUniversal": -1,
      "statuses": [

      ],
      "minPercentage": -1,
      "maxPercentage": -1,
      "minCreatedDate": "",
      "maxCreatedDate": "",
      "minLastUpdate": "",
      "maxLastUpdate": "",
      "minStartDate": "",
      "maxStartDate": "",
      "minExpirationDate": "",
      "maxExpirationDate": "",
      "minUsesPerCustomer": -1,
      "maxUsesPerCustomer": -1,
      "sortBy": ""
    })
    this.setState({ loading: false })

    if (promotionList?.data?.items) {
      this.setState({
        promotionList: promotionList?.data?.items,
        totalPromotion: promotionList?.data?.totalCount
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
    if (res?.data?.items && res?.data?.items.length > 0) {
      this.setState({
        salonList: res?.data?.items
      })
    }
  }

  createPromotion = async () => {
    let salonList = []
    for (const item of this.state.selectedSalon) {
      salonList.push(item?.id)
    }
    this.setState({ loading: true })
    let res = await createPromotionApi({
      "code": this.state.code,
      "percentage": parseInt(this.state.percentage),
      "startDate": convertDateTime(this.state.startDate),
      "expirationDate": convertDateTime(this.state.expirationDate),
      "isUniversal": this.state.isUniversal,
      "salonIds": salonList,
      "usesPerCustomer": parseInt(this.state.usersPerCustomer)
    })
    this.setState({ loading: false })
    if (res) {
      alert(res?.message)
      this.setState({ isOpenModal: false })
      this.getPromotion()
    }
  }


  getDetailPromotion = async () => {
    let salonList = []
    for (const item of this.state.selectedSalon) {
      salonList.push(item?.id)
    }
    this.setState({ loading: true })
    let res = await getDetailPromotionApi({
      id: this.state.selectedPromotion?.id
    })
    this.setState({ loading: false })
    if (res?.data) {
      if (res?.data?.salons && res?.data?.salons.length > 0) {
        for (const item of this.state.salonList) {
          let index = res?.data?.salons.findIndex(ele => ele?.salonId === item?.id)
          if (index !== -1) {
            this.state.selectedSalon.push(this.state.salonList[index])
          }
        }
        this.setState({ selectedSalon: this.state.selectedSalon })
      }
      this.setState({
        isOpenModal: true,
        code: res?.data?.code,
        percentage: res?.data?.percentage,
        startDate: new Date(),
        expirationDate: new Date(),
        isUniversal: res?.data?.isUniversal,
        usersPerCustomer: 1,
      })
    }
  }

  updatePromotionCode = async () => {
    let salonList = []
    for (const item of this.state.selectedSalon) {
      salonList.push(item?.id)
    }
    const res = await updatePromotionApi({
      "id": this.state.selectedPromotion?.id,
      "code": this.state.code,
      "percentage": parseInt(this.state.percentage),
      "startDate": convertDateTime(this.state.startDate),
      "expirationDate": convertDateTime(this.state.startDate),
      "isUniversal": this.state.isUniversal,
      "status": "active",
      "salonIds": salonList,
      "usesPerCustomer": parseInt(this.state.usersPerCustomer)
    })
    if (res) {
      alert(res?.message)
      this.setState({ isOpenModal: false })
      this.getPromotion()
    }
  }

  render() {
    return (
      <div>
        <h2 className="page-header">
          Promotions
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
                New Promotion Code
              </Button>
            }
          </div>
          <Table
            headers={[
              { id: 1, label: '#', value: 'id' },
              { id: 2, label: 'Code Name', value: 'code' },
              { id: 3, label: 'Percentage', value: 'percentage' },
              // { id: 4, label: 'Created Date', value: 'createdDate' },
              // { id: 5, label: 'Last Update', value: 'lastUpdate' },
              { id: 6, label: 'Status', value: 'status' },
              { id: 6, label: 'Start Date', value: 'startDate' },
              { id: 7, label: 'Expiration Date', value: 'expirationDate' },
              // { id: 8, label: 'Is Universal', value: 'isUniversal' },
            ]}
            loading={this.state.loading}
            rows={this.state.promotionList}
            actionList={[
              'view',
              'edit',
              // 'delete',
            ]}
            onClickView={(row) => {
              this.setState({ action: 'view', selectedPromotion: row }, () => {
                this.getDetailPromotion()
              })
            }}
            onClickEdit={(row) => {
              this.setState({ action: 'edit', selectedPromotion: row }, () => {
                this.getDetailPromotion()
              })
            }}
            onClickDelete={(row) => {
              this.setState({ action: 'delete', selectedPromotion: row })
            }}
            pagination
            totalItem={this.state.totalPromotion}
            onChangePage={(page, pageSize) => {
              console.log(page, pageSize)
              this.setState({
                page: page,
                pageSize: pageSize
              }, () => {
                this.getPromotion()
              })
            }}
          />
        </div>
        <Modal isOpen={this.state.isOpenModal}>
          <h2 className="page-header">
            Promotion
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

              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: '1em',
                marginBottom: '1em'
              }}>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label=" From Date"
                    value={this.state.startDate}
                    onChange={(date) => {
                      this.setState({ startDate: date })
                    }}
                    renderInput={(params) => <TextField type='outlined' {...params} />}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Expired Date"
                    value={this.state.expirationDate}
                    onChange={(date) => {
                      this.setState({ expirationDate: date })
                    }}
                    renderInput={(params) => <TextField type='outlined' style={{
                      marginLeft: '2em'
                    }} {...params} />}
                  />
                </LocalizationProvider>
              </div>

              <TextField
                required
                disabled={this.state.action === 'view'}
                id="outlined-basic"
                label="Promotion Code"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.code}
                onChange={(event) => {
                  this.setState({ code: event.target.value })
                }}
              />
              <TextField
                required
                disabled={this.state.action === 'view'}
                id="outlined-basic"
                label="Percentage discount"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.percentage}
                onChange={(event) => {
                  this.setState({ percentage: event.target.value })
                }}
              />
              <TextField
                required
                disabled={this.state.action === 'view'}
                id="outlined-basic"
                label="Limit used by customer"
                variant="outlined"
                style={{
                  width: '100%',
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                value={this.state.usersPerCustomer}
                onChange={(event) => {
                  this.setState({ usersPerCustomer: event.target.value })
                }}
              />
              <FormControlLabel control={
                <Checkbox
                  checked={this.state.isUniversal}
                  onChange={(event) => {
                    console.log(event.target.checked)
                    this.setState({
                      isUniversal: event.target.checked
                    })
                  }} />} label={'Apply for all salon'} />
              {
                !this.state.isUniversal &&
                <Autocomplete
                  value={this.state.selectedSalon}
                  onChange={(event, newValue) => {
                    this.setState({
                      selectedSalon: newValue
                    })
                  }}
                  style={{
                    marginTop: '1em',
                    marginBottom: '1em'
                  }}
                  multiple
                  disablePortal
                  getOptionLabel={(option) => option.name}
                  id="combo-box-demo"
                  options={this.state.salonList || []}
                  sx={{ width: '100%' }}
                  renderInput={(params) => <TextField {...params} label="Salon" variant="outlined" />}
                />
              }

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
              { }
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
                    this.createPromotion()
                  } else {
                    this.updatePromotionCode()
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
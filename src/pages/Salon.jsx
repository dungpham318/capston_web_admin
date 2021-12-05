/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
//import axios from 'axios';
import Table from '../components/table/Table';
import { createSalonApi, getAddressByIDApi, getSalonDetailApi, getSalonList, searchAddressApi, updateSalonApi } from '../apis/salonApi';
import Button from '@mui/material/Button';
import Modal from '../components/modal/Modal';
import { TextField } from '@material-ui/core';
import { LoadingButton } from '@mui/lab';
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from "@material-ui/core/CircularProgress"
import ReactMapGL, { MapContext } from '@goongmaps/goong-map-react'
import { MAP_KEY } from '../config/index'
import ic_marker from '../assets/images/ic_marker.png'

var timeoutCallback = null
export default class Salon extends Component {

  constructor(props) {
    super(props);
    this.state = {
      salonList: [],
      totalSalon: 100,
      page: 1,
      pageSize: 10,
      isOpenModal: false,
      loading: false,
      action: undefined,

      addressList: [],
      selectedAddress: undefined,

      selectedSalon: undefined,
      name: '',
      description: '',
      image: '',
      address: '',
      long: '',
      lat: '',
      mapView: {
        width: 500,
        height: 500,
        latitude: 10.816128715830608,
        longitude: 106.67656939773919,
        zoom: 15
      },
      imageLink: undefined
    };
  }
  componentDidMount() {
    this.getSalon()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState?.isOpenModal !== this.state.isOpenModal && !this.state.isOpenModal) {
      this.setState({
        name: '',
        description: '',
        image: '',
        address: '',
        long: '',
        lat: '',
        mapView: {
          width: 500,
          height: 500,
          latitude: 10.816128715830608,
          longitude: 106.67656939773919,
          zoom: 15
        },
        image: undefined,
        addressList: [],
        selectedAddress: undefined,
      })
    }
  }

  getSalon = async () => {
    this.setState({ loading: true })
    let salonList = await getSalonList({
      "pageNumber": this.state.page,
      "pageSize": this.state.pageSize,
      "statuses": [
        "active"
      ],
      "sortBy": ""
    })
    this.setState({ loading: false })

    if (salonList?.data?.items) {
      this.setState({
        salonList: salonList?.data?.items,
        totalSalon: salonList?.data?.totalCount
      })
    }

  }

  searchAddress = async () => {
    this.setState({ loading: true })
    if (this.state.address !== '' && this.state.address) {
      let res = await searchAddressApi({
        input: this.state.address
      })
      if (res?.predictions && res?.predictions.length > 0) {
        this.setState({ addressList: res?.predictions, loading: false })
      } else {
        this.setState({ addressList: [], loading: false })
      }
    }
  }

  getAddressDetail = async () => {
    let res = await getAddressByIDApi({
      place_id: this.state.selectedAddress?.place_id
    })
    if (res?.result?.geometry?.location) {
      this.setState({
        mapView: {
          width: 500,
          height: 500,
          latitude: res?.result?.geometry?.location?.lat,
          longitude: res?.result?.geometry?.location?.lng,
          zoom: 15
        }
      })
    }
  }

  createSalon = async () => {
    this.setState({ loading: true })
    let formData = new FormData()

    formData.append('Name', this.state.name)
    formData.append('Description', this.state.description)
    formData.append('Address', this.state.address)
    formData.append('Longitude', this.state.mapView?.longitude)
    formData.append('Latitude', this.state.mapView?.latitude)
    formData.append('ImageFile', this.state.image)

    let res = await createSalonApi(formData)
    if (res?.data) {
      this.setState({
        loading: false,
        isOpenModal: false
      }, () => {
        this.getSalon()
      })
    }
  }

  getSalonDetail = async () => {
    this.setState({ loading: true })
    let res = await getSalonDetailApi({
      id: this.state.selectedSalon?.id
    })
    console.log(res)
    this.setState({ loading: false })

    if (res?.data) {
      console.log(res?.data?.latitude)
      this.setState({
        isOpenModal: true,
        name: res?.data?.name,
        description: res?.data?.description,
        mapView: {
          width: 500,
          height: 500,
          latitude: res?.data?.latitude || 10.816128715830608,
          longitude: res?.data?.longitude || 106.67656939773919,
          zoom: 15
        },
        imageLink: res?.data?.avatarUrl
      })
    }
  }

  updateSalon = async () => {
    this.setState({ loading: true })
    let formData = new FormData()

    formData.append('Id', this.state.selectedSalon?.id)
    formData.append('Name', this.state.name)
    formData.append('Description', this.state.description)
    formData.append('Address', this.state.address)
    formData.append('Status', 'active')
    formData.append('Longitude', this.state.mapView?.longitude)
    formData.append('Latitude', this.state.mapView?.latitude)
    if (this.state.image) {
      formData.append('AvatarFile', this.state.image)
    }

    let res = await updateSalonApi(formData)
    if (res?.data) {
      this.setState({
        loading: false,
        isOpenModal: false
      }, () => {
        this.getSalon()
      })
    }
  }

  render() {
    return (
      <div>
        <h2 className="page-header">
          Salon List
        </h2>
        <div className='card'>
          <div style={{
            marginBottom: '1em',
          }}>
            <Button variant="outlined" onClick={() => {
              this.setState({ isOpenModal: true, action: 'create' })
            }}>
              New Salon
            </Button>
          </div>
          <Table
            loading={this.state.loading}
            headers={[
              { id: 1, label: '#', value: 'id' },
              { id: 2, label: 'Salon Name', value: 'name' },
              { id: 3, label: 'Description', value: 'description' },
              { id: 4, label: 'Status', value: 'status' },
              { id: 5, label: 'Created Date', value: 'createdDate' },
              { id: 6, label: 'Last Updated', value: 'lastUpdate' },
            ]}
            rows={this.state.salonList}
            actionList={[
              'view',
              'edit',
              'delete',
            ]}
            onClickView={(row) => {
              this.setState({
                selectedSalon: row,
                action: 'view'
              }, () => {
                this.getSalonDetail()
              })
            }}
            onClickEdit={(row) => {
              console.log(row)
              this.setState({
                selectedSalon: row,
                action: 'edit'
              }, () => {
                this.getSalonDetail()
              })
            }}
            onClickDelete={(row) => {
            }}
            pagination
            totalItem={this.state.totalSalon}
            onChangePage={(page, pageSize) => {
              console.log(page, pageSize)
              this.setState({
                page: page,
                pageSize: pageSize
              }, () => {
                this.getSalon()
              })
            }}
          />

        </div>
        <Modal isOpen={this.state.isOpenModal}>
          <h2 className="page-header">
            {
              this.state.action === 'view' ? 'Salon' : this.state.action === 'create' ? 'Create Salon' : 'Edit Salon'
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
                required
                disabled={this.state.action === 'view'}
                id="outlined-basic"
                label="Salon Name"
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
                      this.setState({ image: event.target.files[0] })
                    }}
                  />
                </div>
              </div>
              {
                this.state.imageLink &&
                <img
                  src={this.state.imageLink}
                  style={{
                    width: '10em',
                    height: '10em'
                  }}
                />
              }

              <Autocomplete
                required
                freeSolo
                value={this.state.selectedAddress}
                onChange={(event, newValue) => {
                  this.setState({
                    selectedAddress: newValue
                  }, async () => {
                    this.getAddressDetail()
                  })
                }}
                style={{
                  marginTop: '1em',
                  marginBottom: '1em'
                }}
                onOpen={() => {
                  this.setState({ isOpenSearch: !this.state.isOpenSearch });
                }}
                onClose={() => {
                  this.setState({ isOpenSearch: !this.state.isOpenSearch });
                }}
                disablePortal
                getOptionLabel={(option) => option.description}
                id="combo-box-demo"
                options={this.state.addressList}
                sx={{ width: '100%' }}
                onInputChange={(event, value, reason) => {
                  this.setState({ address: value }, () => {
                    timeoutCallback && clearTimeout(timeoutCallback)
                    timeoutCallback = setTimeout(() => {
                      this.searchAddress()
                    }, 1000)
                  })
                }}
                filterOptions={(options, state) => options}
                renderInput={(params) => <TextField
                  required
                  {...params} label="Address"
                  variant="outlined"
                  value={this.state.address}
                  // onChange={(event) => {
                  //   this.setState({ address: event.target.value }, () => {
                  //     timeoutCallback && clearTimeout(timeoutCallback)
                  //     timeoutCallback = setTimeout(() => {
                  //       // this.searchAddress()
                  //     }, 5000)
                  //   })
                  // }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {this.state.loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    )
                  }}
                />}
              />
              <div style={{
                height: 400,
                width: '100%'
              }}>

                <ReactMapGL
                  {...this.state.mapView}
                  width="100%"
                  height={400}
                  goongApiAccessToken={'2TwiD4I2KXgGEpISQ6y1JQZPGRzGFzA2Z9mgYtn4'}
                // onViewportChange={(viewport) => setViewport(viewport)}
                >
                  <CustomMarker longitude={this.state.mapView?.longitude} latitude={this.state.mapView?.latitude} />
                </ReactMapGL>
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
                      this.createSalon()
                    } else {
                      this.updateSalon()
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

const CustomMarker = (props) => {
  const context = React.useContext(MapContext);

  const { longitude, latitude } = props;

  const [x, y] = context.viewport.project([longitude, latitude]);

  const markerStyle = {
    position: 'absolute',
    // background: 'red',
    left: x,
    top: y,
  };

  return (
    <div style={markerStyle} >
      {/* ({longitude}, {latitude}) */}
      <img
        src={ic_marker}
        style={{
          width: '2em',
          height: '2em'
        }}
      />
    </div>
  );
}
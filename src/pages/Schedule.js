import React, { Component } from 'react'
import { getSalonList } from '../apis/salonApi'
import { getStaffList, getAllSlot } from '../apis/staffApi'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField } from '@material-ui/core';
import { getRandomColor } from '../function'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { Table as BootstrapTable } from 'react-bootstrap'
import { convertDate, convertDateTime } from '../function'
import { Button } from '@mui/material'
import Modal from '../components/modal/Modal'
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { createBulkScheduleApi, getScheduleApi, getScheduleByStaffApi, getScheduleBySalonApi } from '../apis/scheduleApi'
export default class Schedule extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpenModal: false,
      fromDate: new Date(new Date().setUTCHours(0, 0, 0, 0)),
      toDate: new Date(new Date().setUTCHours(0, 0, 0, 0) + 86400000 * 7),
      dateList: [],


      salonList: [],
      selectedSalon: undefined,

      staffList: [],

      slotList: [],

      selectedStaff: undefined,

      selectedDate: [],
      selectedSlot: [],
      startSlot: undefined,
      endSlot: undefined,

      scheduleData: [],

    }
  }

  componentDidMount() {
    this.convertDate()
    this.getSalonList()
    this.getAllSlot()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isOpenModal !== prevState.isOpenModal && !this.state.isOpenModal) {
      this.setState({
        selectedSlot: [],
        scheduleData: [],
        startSlot: undefined,
        endSlot: undefined,
      })
    }
  }

  convertDate = () => {
    let dateList = []
    let tmp = this.state.fromDate.getTime()
    while (this.state.toDate.getTime() - tmp > 0) {
      dateList.push(convertDate(new Date(tmp)))
      tmp = tmp + 86400000
    }
    this.setState({ dateList: dateList })
  }

  getStaffList = async () => {
    let res = await getStaffList({
      "pageNumber": 1,
      "pageSize": 100,
      "userIds": [],
      "staffIds": [],
      "salonIds": [
        this.state.selectedSalon
      ],
      "staffTypes": [],
      "statuses": [
        "active"
      ],
      "sortBy": "",
      "fullName": "",
      "salonName": "",
      "email": ""
    })
    if (res?.data?.items) {
      res?.data?.items.map(ele => {
        ele.color = getRandomColor()
        ele.label = ele?.fullName + ' - ' + ele?.staffType
      })
      let tmp = res?.data?.items.filter(ele => ele?.staffType !== 'manager')
      this.setState({
        staffList: tmp
      }, () => {
        // this.getScheduleByStaff()
        this.getScheduleBySalon()
      })
    }
  }

  getScheduleBySalon = async () => {
    for (const item of this.state.dateList) {
      const res = await getScheduleBySalonApi({
        id: this.state.selectedSalon,
        date: item
      })
      if (res?.data?.staffs) {
        let tmp = []
        let staffList = []
        for (const ele of this.state.staffList) {
          let index = res?.data?.staffs.findIndex(_ => _?.staffId === ele?.staffId)
          if (index !== -1) {
            ele.workSlot = res?.data?.staffs[index]?.workSlots
          }
          staffList.push({
            ...ele,
            workSlot: ele?.workSlot
          })
        }
        tmp.push({
          date: item,
          staffs: staffList
        })
        this.setState({
          scheduleData: [...this.state.scheduleData, ...tmp]
        }, () => {
          console.log(this.state.scheduleData)
        })
      }
    }
  }

  getSalonList = async () => {
    let res = await getSalonList({
      "pageNumber": 1,
      "pageSize": 100,
      "statuses": [],
      "name": "",
      "minCreatedDate": "",
      "maxCreatedDate": "",
      "minLastUpdate": "",
      "maxLastUpdate": "",
      "sortBy": ""
    })
    if (res?.data?.items) {
      this.setState({
        salonList: res?.data?.items,
      })
    }
  }

  getAllSlot = async () => {
    let res = await getAllSlot()
    if (res?.data) {
      this.setState({ slotList: res?.data })
    }
  }

  onSelectSlot = async (item) => {
    if (this.state.endSlot === undefined && this.state.startSlot === undefined) {
      this.setState({ startSlot: item }, () => {
        this.setState({ selectedSlot: [item] })
      })
    } else {

      if (this.state.endSlot?.id > this.state.startSlot?.id || item?.id > this.state.startSlot?.id) {
        this.setState({ endSlot: item }, () => {
          let tmp = []
          for (const ele of this.state.slotList) {
            if (ele?.id >= this.state.startSlot?.id && ele?.id <= this.state.endSlot?.id) {
              tmp.push(ele)
            }
          }
          this.setState({ selectedSlot: tmp })
        })
      }
      if (this.state.endSlot?.id < this.state.startSlot?.id) {
        this.setState({
          startSlot: item,
          endSlot: undefined,
          selectedSlot: [item]
        })
      }
      if (this.state.startSlot?.id === this.state.endSlot?.id || this.state.startSlot?.id === item?.id) {
        this.setState({
          startSlot: undefined,
          endSlot: undefined,
          selectedSlot: []
        })
      }
    }
  }
  // {
  //   "code": "DISCOUNT10",
  //   "percentage": 10,
  //   "startDate": "10/11/2021",
  //   "expirationDate": "30/11/2021",
  //   "isUniversal": true,
  //   "salonIds": [

  //   ],
  //   "usesPerCustomer": 10
  // }
  createSchedule = async () => {
    let data = []
    for (const ele of this.state.selectedDate) {
      for (const item of this.state.selectedSlot) {
        data.push({
          "staffId": this.state.selectedStaff?.staffId,
          "slotOfDayId": item?.id,
          "date": ele
        })
      }
    }

    const res = await createBulkScheduleApi(data)
    if (res) {
      alert(res?.message)
      this.setState({ isOpenModal: false })
      this.getScheduleBySalon()
      // this.getScheduleByStaff()
    }
  }

  // getScheduleByStaff = async () => {
  //   for (const item of this.state.staffList) {
  //     let res = await getScheduleApi({
  //       "pageNumber": 1,
  //       "pageSize": 100000,
  //       "statuses": [],
  //       "staffIds": [
  //         item?.staffId
  //       ],
  //       "slotOfDayIds": [],
  //       "exactStaffNames": [],
  //       "staffName": "",
  //       "minDate": convertDateTime(this.state.fromDate),
  //       "maxDate": convertDateTime(this.state.toDate),
  //       "minTime": "",
  //       "maxTime": "",
  //       "sortBy": ""
  //     })
  //   }
  // }

  render() {

    return (
      <div>

        <div className='card'>
          <div style={{
            display: 'flex',
            flex: '1 1 0%',
            flexDirection: 'row',
            alignItems: 'flex-center',
            justifyContent: 'flex-start',
          }}>
            <FormControl style={{ width: '15em', marginRight: '1em' }}>
              <InputLabel id="demo-simple-select-label">Salon</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.selectedSalon}
                label="Salon"
                style={{
                  height: '3em',
                  paddingLeft: '1em'
                }}
                onChange={(e) => {
                  this.setState({
                    selectedSalon: e.target.value
                  }, () => {
                    this.getStaffList()
                  })
                }}
              >
                {
                  this.state.salonList.map(ele => {
                    return <MenuItem value={ele?.id}>{ele?.name}</MenuItem>
                  })
                }
              </Select>
            </FormControl>

            <div style={{ marginRight: '1em' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} >
                <DesktopDatePicker
                  label="From Date"
                  inputFormat="MM/dd/yyyy"
                  value={this.state.fromDate}
                  onChange={(value) => {
                    this.setState({ fromDate: value })
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="To Date"
                inputFormat="MM/dd/yyyy"
                value={this.state.toDate}
                onChange={(value) => {
                  this.setState({ toDate: value })
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <div style={{ flex: 1 }} />
            <div>
              <Button variant="outlined" onClick={() => {
                this.setState({ isOpenModal: true })
              }}>
                Add Schedule
              </Button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flex: '1 1 0%',
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}>
            {
              (this.state.staffList && this.state.staffList.length > 0) &&
              this.state.staffList.map((item, index) => {
                return (
                  <div key={index} style={{
                    display: 'flex',
                    flex: '1 1 0%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                  }}>
                    <div style={{
                      width: '1em',
                      height: '1em',
                      borderRadius: '1em',
                      borderWidth: 1,
                      backgroundColor: item?.color,
                      marginRight: '1em'
                    }} />
                    <p>{item?.fullName}</p>
                  </div>
                )
              })
            }
          </div>

          <div style={{

          }}>
            <BootstrapTable striped bordered hover style={{
              width: '100%',
              textAlign: 'left',
              borderCollapse: 'collapse',
              // max-height: 100px,
              maxHeight: '40em',
              overflow: 'auto',
              display: 'inline-block'
              // overflow: 'auto',
              // display: 'inline-block'
            }}>
              <thead style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                marginBottom: '10em'
              }}>
                <tr>
                  <td style={{
                    paddingTop: '0.5em',
                    paddingBottom: '0.5em',
                    textAlign: 'center'
                  }}>#</td>
                  <td style={{
                    paddingTop: '0.5em',
                    paddingBottom: '0.5em',
                    textAlign: 'center'
                  }}
                    colSpan={1}>Staff</td>
                  {
                    this.state.slotList.map((item, index) => {
                      return (
                        <td style={{
                          paddingTop: '0.5em',
                          paddingBottom: '0.5em',
                          textAlign: 'center'
                        }}>{item?.startTime}</td>
                      )
                    })
                  }
                </tr>

              </thead>
              <tbody>
                {
                  this.state.scheduleData.map((item, index) => {
                    return (
                      <tr style={{
                        paddingTop: '0.5em',
                        paddingBottom: '0.5em',
                        textAlign: 'center'
                      }}>
                        <td style={{
                          paddingTop: '0.5em',
                          paddingBottom: '0.5em',
                          textAlign: 'center'
                        }}
                        // rowSpan={0}
                        >
                          {item?.date}
                        </td>

                        {
                          item?.staffs.map((staff, index2) => {
                            return (
                              <tr>
                                <td style={{
                                  // paddingTop: '0.5em',
                                  // paddingBottom: '0.5em',
                                  textAlign: 'center',

                                }}
                                // rowSpan={6}
                                >
                                  <div style={{
                                    width: '5em',
                                    height: '3em',
                                    textAlign: 'center',
                                  }}>
                                    {staff?.fullName}

                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        }

                        {
                          this.state.slotList.map((slot, index2) => {
                            return (
                              <td style={{
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingLeft: 0,
                                paddingRight: 0,
                                textAlign: 'center',
                              }}
                              // rowSpan={6}
                              >
                                {
                                  item?.staffs.map((staff, index2) => {
                                    let isAvailable = -1
                                    if (staff?.workSlot) {
                                      isAvailable = staff?.workSlot.findIndex(_ => _.slotOfDayId === slot?.id)
                                    }
                                    return (
                                      <tr style={{
                                        width: '3em',
                                        height: '3em',
                                        textAlign: 'center',
                                        backgroundColor: isAvailable !== -1 ? '#2980b9' : '#ffffff',

                                      }}>
                                        <td style={{
                                          width: '3em',
                                          height: '3em',
                                          textAlign: 'center',
                                          backgroundColor: isAvailable !== -1 ? '#2980b9' : '#ffffff',
                                        }}
                                        // rowSpan={6}
                                        >
                                          <div style={{
                                            width: '3em',
                                            height: '3em',
                                            textAlign: 'center',
                                            backgroundColor: isAvailable !== -1 ? '#2980b9' : '#ffffff',
                                          }}>
                                            {/* {staff?.fullName} */}

                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  })
                                }

                              </td>
                            )
                          })
                        }
                      </tr>
                    )
                  })
                }


              </tbody>

            </BootstrapTable>
          </div>

        </div>
        <Modal isOpen={this.state.isOpenModal}>
          <h2 className="page-header">
            Schedule
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
              <Autocomplete
                value={this.state.selectedStaff}
                onChange={(event, newValue) => {
                  this.setState({
                    selectedStaff: newValue
                  })
                }}
                style={{
                  marginBottom: '1em'
                }}
                disablePortal
                id="combo-box-demo"
                options={this.state.staffList || []}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Staff" />}
              />

              <p style={{
                marginTop: '1em',
                fontWeight: 'bold'
              }}>Time</p>

              <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: '1em'
              }}>
                {
                  this.state.slotList.map((item, index) => {
                    let isSelected = this.state.selectedSlot.findIndex(ele => ele?.id === item?.id)
                    return (
                      <button style={{
                        paddingLeft: '1em',
                        paddingRight: '1em',
                        paddingTop: '0.5em',
                        paddingBottom: '0.5em',
                        borderStyle: 'solid',
                        borderWidth: 'thin',
                        margin: '0.5em',
                        borderRadius: 5,
                        backgroundColor: '#ffffff',
                        borderColor: isSelected !== -1 ? '#349eff' : '#8C8C8C',
                        width: '5em'
                      }}
                        onClick={() =>
                          this.onSelectSlot(item)
                        }>
                        <p style={{
                          color: isSelected !== -1 ? '#349eff' : '#8C8C8C',
                          fontWeight: isSelected !== -1 ? 'bold' : 'inherit',
                        }}>{item.startTime}</p>
                      </button>
                    )
                  })
                }
              </div>
              <p style={{
                marginTop: '1em',
                marginBottom: '1em',
                fontWeight: 'bold'
              }}>Date</p>
              <FormGroup>
                {
                  this.state.dateList.map((ele => {
                    return <FormControlLabel control={
                      <Checkbox
                        // checked={_?.checked}
                        onChange={(event) => {
                          let index = this.state.dateList.findIndex(e => e?.id === ele?.id)
                          if (event.target.checked) {
                            this.state.selectedDate.push(ele)
                          } else {
                            this.state.selectedDate.splice(index, 1)
                          }
                          this.setState({ selectedDate: this.state.selectedDate })
                        }} />} label={ele} />
                  }))
                }
              </FormGroup>
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
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
                <Button variant="contained" color="success" onClick={() => {
                  this.createSchedule()
                }}>
                  Update
                </Button>
              </div>
            </div>
          </div>
        </Modal >
      </div >
    )

  }

}
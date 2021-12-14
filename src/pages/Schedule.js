/* eslint-disable jsx-a11y/anchor-is-valid */
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
import { createBulkScheduleApi, getScheduleApi, getScheduleByStaffApi, getScheduleBySalonApi, removeScheduleApi, createBulkScheduleSpanTimeApi } from '../apis/scheduleApi'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { minHeight } from '@mui/system'
import { LoadingButton } from '@mui/lab';

export default class Schedule extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpenModal: false,
      fromDate: new Date(new Date().setUTCHours(0, 0, 0, 0)),
      toDate: new Date(new Date().setUTCHours(0, 0, 0, 0) + 86400000 * 7),
      dateList: [],
      loading: false,

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

      selectedSchedule: undefined,
      action: undefined

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
        selectedSchedule: undefined,
        action: undefined,
        selectedStaff: undefined,
        selectedDate: [],
      }, () => {

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
    this.setState({ loading: true })
    this.convertDate()
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
    this.setState({ loading: false })

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
    this.setState({ loading: true })

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
          ele.workSlot = []
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
        })
      }
      this.setState({ loading: false })

    }
  }

  getSalonList = async () => {
    this.setState({ loading: true })

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
    this.setState({ loading: false })

    if (res?.data?.items) {

      this.setState({
        salonList: res?.data?.items,
      }, () => {
        if (localStorage.getItem('role') === 'manager') {
          let selectedSalonID = localStorage.getItem('salonId')
          if (selectedSalonID) {
            this.setState({
              selectedSalon: selectedSalonID
            }, () => {
              this.getStaffList()
            })
          }
        }
      })
    }
  }

  getAllSlot = async () => {
    this.setState({ loading: true })
    let res = await getAllSlot()
    this.setState({ loading: false })

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

  createSchedule = async () => {
    if (this.state.action === 'edit') {
      let dateIndex = this.state.scheduleData.findIndex(ele => ele?.date === this.state.selectedDate[0])
      let added = []
      let removed = []
      if (dateIndex !== -1) {
        let scheduleByDate = this.state.scheduleData[dateIndex]
        let scheduleIndex = scheduleByDate?.staffs.findIndex(ele => ele?.staffId === this.state.selectedStaff?.staffId)
        let schedule = this.state.scheduleData[dateIndex]?.staffs[scheduleIndex]?.workSlot
        for (const item of schedule) {
          let index = this.state.selectedSlot.findIndex(ele => ele?.id === item?.slotOfDayId)
          if (index === -1) {
            removed.push(item)
          }
        }

        for (const item of this.state.selectedSlot) {
          let index = schedule.findIndex(ele => ele?.slotOfDayId === item?.id)
          if (index === -1) {
            added.push(item)
          }
        }
      }


      let dataAdded = []
      console.log(12732, added)
      if (added.length > 0) {
        // for (const item of added) {
        //   dataAdded.push({
        //     "staffId": this.state.selectedStaff?.staffId,
        //     "slotOfDayId": item?.id,
        //     "date": this.state.selectedDate[0]
        //   })
        // }
        // this.setState({ loading: true })

        // const res = await createBulkScheduleApi(dataAdded)
        // this.setState({ loading: false })
        let tmp = []
        for (const item of added) {
          tmp.push(item)
          // data.push({
          //   "staffId": this.state.selectedStaff?.staffId,
          //   "slotOfDayId": item?.id,
          //   "date": ele
          // })
        }
        console.log(tmp)
        let startTime = tmp[0]?.startTime + ':00'
        let endTime = tmp[tmp.length - 1]?.endTime + ':00'
        for (const ele of this.state.selectedDate) {
          const res = await createBulkScheduleSpanTimeApi({
            "staffId": this.state.selectedStaff?.staffId,
            "startDate": ele + ' ' + startTime,
            "endDate": ele + ' ' + endTime,
          })
        }

      }

      if (removed.length > 0) {
        removed.sort((a, b) => (a.slotOfDayId > b.slotOfDayId) ? 1 : ((b.slotOfDayId > a.slotOfDayId) ? -1 : 0))
        let startTimeIndex = this.state.slotList.findIndex(ele => removed[0]?.slotOfDayId === ele?.id)
        let endTimeIndex = this.state.slotList.findIndex(ele => removed[removed.length - 1]?.slotOfDayId === ele?.id)
        const res = await removeScheduleApi({
          "staffId": this.state.selectedStaff?.staffId,
          "startDate": this.state.selectedDate[0] + ' ' + this.state.slotList[startTimeIndex]?.startTime + ':00',
          "endDate": this.state.selectedDate[0] + ' ' + this.state.slotList[endTimeIndex]?.endTime + ':00',
        })
        this.setState({ loading: false })
      }


      this.setState({ isOpenModal: false })
      this.getScheduleBySalon()



    } else {
      this.setState({ loading: true })
      let data = []
      let tmp = []
      for (const item of this.state.selectedSlot) {
        tmp.push(item)
        // data.push({
        //   "staffId": this.state.selectedStaff?.staffId,
        //   "slotOfDayId": item?.id,
        //   "date": ele
        // })
      }
      let startTime = tmp[0]?.startTime + ':00'
      let endTime = tmp[tmp.length - 1]?.endTime + ':00'
      for (const ele of this.state.selectedDate) {
        const res = await createBulkScheduleSpanTimeApi({
          "staffId": this.state.selectedStaff?.staffId,
          "startDate": ele + ' ' + startTime,
          "endDate": ele + ' ' + endTime,
        })
      }


      // const res = await createBulkScheduleApi(data)
      // if (res) {
      this.setState({ isOpenModal: false })
      this.getScheduleBySalon()
      // }
      // this.setState({ loading: false })
    }


  }


  render() {

    return (
      <div>

        <div className='card' style={{
          minHeight: '40em'
        }}>
          {
            this.state.loading &&
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              left: '60%',
              top: 0,
              position: 'absolute',

            }}>
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            </div>
          }
          <div style={{
            display: 'flex',
            flex: '1 1 0%',
            flexDirection: 'row',
            alignItems: 'flex-center',
            justifyContent: 'flex-start',
          }}>
            {
              localStorage.getItem('role') !== 'manager' &&
              <FormControl style={{ width: '15em', marginRight: '1em' }}>
                <InputLabel id="demo-simple-select-label">Salon</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.state.selectedSalon}
                  label="Salon"
                  style={{
                    height: '3em',
                    paddingLeft: '2em'
                  }}
                  onChange={(e) => {
                    this.setState({
                      staffList: [],
                      selectedSalon: e.target.value,
                      scheduleData: []
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
            }


            <div style={{ marginRight: '1em' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} >
                <DesktopDatePicker
                  label="From Date"
                  inputFormat="MM/dd/yyyy"
                  value={this.state.fromDate}
                  onChange={(value) => {
                    this.setState({ fromDate: new Date(value.setHours(0, 0, 0, 0)), scheduleData: [] }, () => {
                      this.getStaffList()
                    })
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
                  this.setState({ toDate: new Date(value.setHours(0, 0, 0, 0)), scheduleData: [] }, () => {
                    this.getStaffList()
                  })
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <div style={{ flex: 1 }} />
            <div>
              {
                localStorage.getItem('role') === 'manager' &&
                <Button variant="outlined" onClick={() => {
                  this.setState({ isOpenModal: true })
                }}>
                  Add Schedule
                </Button>
              }
            </div>
          </div>

          <div style={{
            display: 'flex',
            flex: '1 1 0%',
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}>
            {/* {
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
            } */}
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
                                  <a href='' onClick={(e) => {
                                    e.preventDefault()
                                    staff?.workSlot.sort((a, b) => (a.slotOfDayId > b.slotOfDayId) ? 1 : ((b.slotOfDayId > a.slotOfDayId) ? -1 : 0))
                                    staff?.workSlot.map(_ => _.id = _.slotOfDayId)
                                    staff.workSlot = staff?.workSlot.filter(_ => _.status !== 'not available')
                                    this.setState({
                                      isOpenModal: true,
                                      selectedSchedule: staff,
                                      action: 'edit',
                                      selectedSlot: staff?.workSlot,
                                      startSlot: staff?.workSlot[0],
                                      endSlot: staff?.workSlot[staff?.workSlot.length - 1],
                                      selectedStaff: staff,
                                      selectedDate: [item?.date]
                                    })
                                  }}>

                                    <div style={{
                                      width: '5em',
                                      height: '3em',
                                      textAlign: 'center',
                                    }}>
                                      {staff?.fullName}

                                    </div>
                                  </a>

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
                              >
                                {
                                  item?.staffs.map((staff, index2) => {
                                    let color = '#ffffff'
                                    let isAvailable = -1
                                    if (staff?.workSlot) {
                                      isAvailable = staff?.workSlot.findIndex(_ => _.slotOfDayId === slot?.id && _.status !== 'not available')
                                    }
                                    if (isAvailable !== -1) {
                                      if (staff?.workSlot[isAvailable].status === 'taken') {
                                        color = '#019707'
                                      } else {
                                        color = '#62b4ff'
                                      }
                                    }
                                    return (
                                      <tr style={{
                                        width: '3em',
                                        height: '3em',
                                        textAlign: 'center',
                                        backgroundColor: color,

                                      }}>
                                        <td style={{
                                          width: '3em',
                                          height: '3em',
                                          textAlign: 'center',
                                          backgroundColor: color,
                                        }}
                                        // rowSpan={6}
                                        >
                                          <div style={{
                                            width: '3em',
                                            height: '3em',
                                            textAlign: 'center',
                                            backgroundColor: color,
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
                disabled={this.state.action === 'edit' ? true : false}
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
                renderInput={(params) => <TextField {...params} label="Staff" variant="outlined" />}
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
                    let isSelected = this.state.selectedSlot.findIndex(ele => ele?.id === item?.id || ele?.slotOfDayId === item?.id)
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
              {
                this.state.action !== 'edit' &&
                <>
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
                </>
              }

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
                  }, () => {
                    this.getScheduleBySalon()
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
                <LoadingButton loading={this.state.loading} variant="contained" color="success" onClick={() => {
                  this.createSchedule()
                }}>
                  Update
                </LoadingButton>
              </div>
            </div>
          </div>
        </Modal >
      </div >
    )

  }

}
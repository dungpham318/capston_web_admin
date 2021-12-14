import React, { Component } from 'react';
import LineChart from '../components/chart/LineChart'
import {
  getRevenueApi, getRevenueBySalonApi, getTopCustomerApi, getTotalAppointmentApi, getTotalCustomerApi, getUsedComboApi
} from '../apis/dashboardApi'
import { getSalonList } from '../apis/salonApi';
import { convertDate } from '../function';
import BarChart from '../components/chart/BarChart';
import PieChart from '../components/chart/PieChart';
import Table from '../components/table/Table';
import { getTransactionList } from '../apis/transactionApi';
let colorList = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
]
export default class Dashboard extends Component {

  constructor(props) {
    super(props);
    let date = new Date(new Date().setHours(0, 0, 0, 0))
    this.state = {
      startDate: new Date(date.getFullYear(), date.getMonth(), 1),
      endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      dateList: [],
      revenueList: [],
      salonList: [],
      totalRevenue: 0,
      totalCustomer: 0,
      totalAppointment: 0,
      totalRevenueInMonth: 0,

      revenueListBarChart: [],
      salonNameList: [],

      comboPieChart: [],

      page: 1,
      pageSize: 10,
      transactionList: [],
      loading: false
    }
  }


  async componentDidMount() {
    let dateList = []
    let tmp = this.state.startDate.getTime() + 86400000
    while (this.state.endDate.getTime() + 86400000 - tmp > 0) {
      dateList.push(convertDate(new Date(tmp)))
      tmp = tmp + 86400000
    }

    this.setState({ dateList: dateList })

    this.getRevenue()
    this.getTotalCustomer()
    this.getAppointmentBySalon()
    this.getUsedCombo()
    this.getTransaction()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.salonList !== this.state.salonList && this.state.salonList.length > 0) {
      this.getRevenueBySalon()
    }
  }

  getRevenue = async () => {
    let date = new Date()
    date = convertDate(date)
    let res = await getRevenueApi(date)
    if (res?.data) {
      let revenue = 0
      if (localStorage.getItem('salonId') !== 'null') {
        for (const item of res?.data) {
          revenue = revenue + item?.amount
        }
        this.setState({ totalRevenue: revenue })
      } else {
        let index = res?.data.findIndex(ele => ele?.id == localStorage.getItem('salonId'))
        if (index !== -1) {
          revenue = res?.data[index]?.amount
        }
        this.setState({ totalRevenue: revenue })
      }
    }
  }

  getTotalCustomer = async () => {
    let res = await getTotalCustomerApi()
    if (res?.data) {
      let totalCustomer = 0
      if (localStorage.getItem('salonId') !== 'null') {
        for (const item of res?.data) {
          totalCustomer = totalCustomer + item?.customerCount
        }
        this.setState({ totalCustomer: totalCustomer })
      } else {
        let index = res?.data.findIndex(ele => ele?.id == localStorage.getItem('salonId'))
        if (index !== -1) {
          totalCustomer = res?.data[index]?.customerCount
        }
        this.setState({ totalCustomer: totalCustomer })
      }
    }
  }

  getAppointmentBySalon = async () => {
    let totalAppointment = 0
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
    if (res?.data?.items) {
      await this.setState({
        salonList: res?.data?.items
      })
    }

    if (localStorage.getItem('salonId') !== 'null') {
      let appointmentData = await this.getTotalAppointment(parseInt(localStorage.getItem('salonId')))
      if (appointmentData?.data) {
        totalAppointment = totalAppointment + totalAppointment?.totalAppointments
      }
    } else {
      for (const item of this.state.salonList) {
        let appointmentData = await this.getTotalAppointment(item?.id)
        if (appointmentData?.data) {
          totalAppointment = totalAppointment + totalAppointment?.totalAppointments
        }
      }
    }
    this.setState({
      totalAppointment: totalAppointment
    })
  }

  getTotalAppointment = async (salonID) => {
    let date = new Date()
    date = convertDate(date)
    let res = await getTotalAppointmentApi({
      "date": date,
      "salonId": salonID
    })
    return res?.data
  }

  getRevenueBySalon = async () => {
    let revenueList = []
    let index = 0
    let salonNameList = []
    let revenueListBarChart = []

    for (const item of this.state.salonList) {
      let res = await getRevenueBySalonApi({
        "salonId": item?.id,
        "fromDate": convertDate(this.state.startDate),
        "toDate": convertDate(this.state.endDate)
      })
      let revenue = []
      let total = 0
      for (const item of res?.data?.dayInfos) {
        revenue.push(item?.totalEarning)
        total = total + item?.totalEarning
      }
      revenueList.push({
        label: item.name,
        data: revenue,
        fill: false,
        borderColor: colorList[index],
      })
      console.log(total)
      revenueListBarChart.push(total)
      salonNameList.push(item.name)
      ++index
    }
    console.log(revenueListBarChart)

    this.setState({
      revenueList: revenueList,
      salonNameList: salonNameList,
      revenueListBarChart: revenueListBarChart
    })
  }

  getRevenueInMonth = async () => {
    for (const item of this.state.salonList) {
      let res = await getRevenueBySalonApi({
        "salonId": item?.id,
        "fromDate": convertDate(this.state.startDate),
        "toDate": convertDate(this.state.startDate)
      })
      console.log(res)
    }
  }

  getTopCustomer = async () => {
    let res = await getTopCustomerApi(convertDate(this.state.startDate))
    if (res?.data) {
      this.setState({
        totalRevenueInMonth: res?.data
      })
    }
  }

  getUsedCombo = async (salonID) => {
    let res = await getUsedComboApi()
    console.log(res)
    let label = []
    let datasets = []
    let data = []
    let index = 0
    if (res?.data) {
      for (const item of res?.data) {
        label.push(item?.name)
        data.push(item?.timesUsed)
        // datasets.push([
        //   {
        //     label: item?.name,
        //     data: [item?.timesUsed],
        //     backgroundColor: [colorList[index]],
        //   }
        // ]
        // )
      }
    }
    console.log(datasets)
    this.setState({
      comboPieChart: {
        labels: label,
        datasets: [
          {
            label: '',
            data: data,
            backgroundColor: colorList,
          }
        ]
      }

    })
  }

  getTransaction = async () => {
    this.setState({ loading: true })
    let salonId = []
    if (localStorage.getItem('salonId') !== 'null') {
      salonId.push(localStorage.getItem('salonId'))
    }
    let transactionList = await getTransactionList({
      "pageNumber": this.state.page,
      "pageSize": this.state.pageSize,
      "statuses": ['ongoing'],
      "customerIds": [
      ],
      "customerUserIds": [
      ],
      "comboIds": [
      ],
      "salonIds": salonId,
      "customerName": "",
      "comboName": "",
      "salonName": "",
      "minCreatedDate": "",
      "maxCreatedDate": "",
      "minLastUpdate": "",
      "maxLastUpdate": "",
      "minDate": "",
      "maxDate": "",
      "minTotalPrice": -1,
      "maxTotalPrice": -1,
      "sortBy": "lastupdate_desc"
    })
    this.setState({ loading: false })

    if (transactionList) {
      this.setState({
        transactionList: transactionList?.data?.items,
        totalTransaction: transactionList?.data?.totalCount
      })
    }
  }


  render() {
    return (
      <div style={{
        marginLeft: '3em',
        marginRight: '3em',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div className='card' style={{
            width: '20em',
          }}>
            <p>Today Revenue</p>
            <h2 style={{
              paddingTop: '1em',
            }}>{this.state.totalRevenue}</h2>
          </div>
          <div className='card' style={{
            width: '20em',
          }}>
            <p>Today Month Revenue</p>
            <h2 style={{
              paddingTop: '1em',
            }}>{this.state.totalRevenueInMonth}</h2>
          </div>
          <div className='card' style={{
            width: '20em',
          }}>
            <p>Today Appointment</p>
            <h2 style={{
              paddingTop: '1em',
            }}>{this.state.totalAppointment}</h2>
          </div>
          <div className='card' style={{
            width: '20em'
          }}>
            <p>Total Customer</p>
            <h2 style={{
              paddingTop: '1em',
            }}>{this.state.totalCustomer}</h2>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'row'
        }}>
          <div className='card' style={{
            width: '35em'
          }}>
            <h2 style={{
              paddingBottom: '1em'
            }}>Combo</h2>
            <PieChart
              data={this.state.comboPieChart}
            />
          </div>
          <div className='card' style={{
            flex: 1,
            marginLeft: '2em'
          }}>
            <h2 style={{
              paddingBottom: '1em'
            }}>Ongoing Appointment</h2>
            <div>
              <Table
                loading={this.state.loading}
                headers={[
                  { id: 1, label: '#', value: 'index' },
                  { id: 2, label: 'Customer Name', value: 'customerName' },
                  { id: 3, label: 'Salon', value: 'salonName' },
                  { id: 4, label: 'Status', value: 'status' },
                  { id: 5, label: 'Start Date', value: 'startDate' },
                  { id: 6, label: 'End Date', value: 'endDate' },
                  { id: 8, label: 'Combo', value: 'comboName' },
                  { id: 9, label: 'Total Price', value: 'totalPrice' },
                ]}
                height='30vh'
                rows={this.state.transactionList}
                actionList={[
                  'view',
                  // 'edit',
                  // 'delete',
                ]}
                onClickView={(row) => {
                  this.props.history.push({
                    pathname: `/transactions`,
                    state: {
                      appointmentId: row?.id,
                    }
                  })
                }}
                // onClickEdit={(row) => {
                // }}
                // onClickDelete={(row) => {
                // }}
                // pagination
                totalItem={this.state.totalTransaction}
                onChangePage={(page, pageSize) => {
                  this.setState({
                    page: page,
                    pageSize: pageSize
                  }, () => {
                    this.getTransaction()
                  })
                }}
              />
            </div>
          </div>
        </div>


        <div className='card'>
          <h2 style={{
            paddingLeft: '2em',
            paddingBottom: '1em'
          }}>Revenue By Salon</h2>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{
              width: '50em'
            }}>
              <LineChart
                label={this.state.dateList}
                displayLegend={true}
                datasets={this.state.revenueList}
              />
            </div>
            <div style={{
              width: '40em'
            }}>
              <BarChart
                label={this.state.salonNameList}
                data={this.state.revenueListBarChart}
                displayLegend={false}
              />
            </div>
          </div>
        </div>

      </div >
    )
  }

}
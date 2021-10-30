import React, { Component } from 'react';
//import axios from 'axios';
import Table from '../components/table/Table';
import { getStaffList } from '../apis/staffApi';

export default class Staffs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      staffList: [],
      totalStaff: 100,
      page: 1,
      pageSize: 10
    };
  }
  componentDidMount() {
    this.getStaff()
  }

  getStaff = async () => {
    let staffList = await getStaffList({
      "pageNumber": this.state.page,
      "pageSize": this.state.pageSize,
    //   "statuses": [
    //     "active"
    //   ],
      "sortBy": ""
    })

    if (staffList) {
      this.setState({
        staffList: staffList?.data?.items,
        totalStaff: staffList?.data?.totalCount
      })
    }

  }

  tabRow() {
    return this.state.business.map(function (object, i) {
      return <Table obj={object} key={i} />;
    });
  }

  render() {
    return (
      <div>
        <h2 className="page-header">
          Staffs List
        </h2>
        <div className='card'>
          <Table
            headers={[
              { id: 1, label: '#', value: 'index' },
              { id: 2, label: 'Staff ID', value: 'staffId' },
              { id: 3, label: 'Full Name', value: 'fullName' },
              { id: 4, label: 'Role', value: 'staffType' },
              { id: 5, label: 'Description', value: 'description' },
            //   { id: 6, label: 'Salon', value: 'salon ID' },
              { id: 6, label: 'Salon Name', value: 'salonName' },
              { id: 7, label: 'Email', value: 'email' },
              { id: 8, label: 'Phone Number', value: 'phoneNumber' },
            ]}
            rows={this.state.staffList}
            actionList={[
              'view',
              'edit',
              'delete',
            ]}
            onClickView={(row) => {
              console.log(row)
            }}
            onClickEdit={(row) => {
            }}
            onClickDelete={(row) => {
            }}
            pagination
            totalItem={this.state.totalStaff}
            onChangePage={(page, pageSize) => {
              console.log(page, pageSize)
              this.setState({
                page: page,
                pageSize: pageSize
              }, () => {
                this.getStaff()
              })
            }}
          />

        </div>

      </div>
    );
  }
}
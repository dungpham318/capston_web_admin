import React, { Component, useState } from 'react';
import axios from 'axios';
import Table from '../components/table/Table';
import { getServiceList } from '../apis/serviceApi';
import AddIcon from '@material-ui/icons/Add';
import Popup from '../components/popup/Popup';
//import Button from '@mui/material/Button';

export default class Services extends Component {

  constructor(props) {
    super(props);
    this.state = {
      serviceList: [],
      totalService: 100,
      page: 1,
      pageSize: 10,
      minPrice: 0,
      maxPrice: 100000000
    };
  }
  componentDidMount() {
    this.getService()
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
      "minPrice": this.state.minPrice,
      "maxPrice": this.state.maxPrice,
      "sortBy": ""
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

  render() {
    return (
      <div>
        <h2 className="page-header">
          Services
        </h2>
        {/* <Button variant="outlined" onClick={handleClickOpen}>
        Add new
        </Button> */}
        <div className='card'>
          <Table
            headers={[
              { id: 1, label: '#', value: 'id' },
              { id: 2, label: 'Name', value: 'name' },
              { id: 3, label: 'Description', value: 'description' },
              { id: 4, label: 'Status', value: 'status' },
              { id: 5, label: 'Created Date', value: 'createdDate' },
              { id: 6, label: 'Last Update', value: 'lastupdated' },
              { id: 7, label: 'Price', value: 'price' },
            ]}
            rows={this.state.serviceList}
            actionList={[
              'view',
              'edit',
              'delete',
            ]}
            onClickView={(row) => {
              // openInPopup(row)
            }}
            onClickEdit={(row) => {
            }}
            onClickDelete={(row) => {
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
      </div>
    );
  }
}


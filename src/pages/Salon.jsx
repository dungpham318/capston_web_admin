import React, { Component } from 'react';
//import axios from 'axios';
import Table from '../components/table/Table';
import { getSalonList } from '../apis/salonApi';
import Button from '@mui/material/Button';
import Modal from '../components/modal/Modal';
import { TextField } from '@material-ui/core';

export default class Salon extends Component {

  constructor(props) {
    super(props);
    this.state = {
      salonList: [],
      totalSalon: 100,
      page: 1,
      pageSize: 10,
      isOpenModal: false
    };
  }
  componentDidMount() {
    this.getSalon()
  }

  getSalon = async () => {
    let salonList = await getSalonList({
      "pageNumber": this.state.page,
      "pageSize": this.state.pageSize,
      "statuses": [
        "active"
      ],
      "sortBy": ""
    })

    if (salonList) {
      this.setState({
        salonList: salonList?.data?.items,
        totalSalon: salonList?.data?.totalCount
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
          Salon List
        </h2>
        <div className='card'>
          <div style={{
            marginBottom: '1em',
          }}>
            <Button variant="outlined" onClick={() => {
              this.props.history.push({
                pathname: `/salon/create`,
              })
            }}>
              New Salon
            </Button>
          </div>
          <Table
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
              //'view',
              'edit',
              //'delete',
            ]}
            // onClickView={(row) => {
            //   console.log(row)
            //   // this.getSalonDetail(row?.id)
            // }}
            onClickEdit={(row) => {
              this.props.history.push({
                pathname:`/salon/create`,
                state:{
                  salonData: row
                }
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

      </div>
    );
  }
}
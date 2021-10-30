import React, { Component } from 'react';
import axios from 'axios';
import Table from '../components/table/Table';
import { getComboList } from '../apis/comboApi';

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
      maxDuration: 180
    };
  }
  componentDidMount() {
    this.getCombo()
  }

  getCombo = async () => {
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

  render() {
    return (
      <div>
        <h2 className="page-header">
          Combo
        </h2>
        <div className='card'>
          <Table
            headers={[
              { id: 1, label: '#', value: 'id' },
              { id: 2, label: 'Name', value: 'name' },
              { id: 3, label: 'Description', value: 'description' },
              { id: 4, label: 'Status', value: 'status' },
              { id: 5, label: 'Duration', value: 'duration' },
              { id: 6, label: 'Price', value: 'price' },
              { id: 7, label: 'Created Date', value: 'createdDate' },
              { id: 8, label: 'Last Update', value: 'lastupdated' },
            ]}
            rows={this.state.comboList}
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

      </div>
    );
  }
}


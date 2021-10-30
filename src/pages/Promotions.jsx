import React, { Component } from 'react';
//import axios from 'axios';
import Table from '../components/table/Table';
import { getPromotionList } from '../apis/promotionApi';

export default class Promotions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      promotionList: [],
      totalPromotion: 100,
      page: 1,
      pageSize: 10,
      isUniversal: 0,
      minPercentage: 0,
      maxPercentage: 100,
      minUsesPerCustomer: 0,
      maxUsesPerCustomer: 10000000
    };
  }
  componentDidMount() {
    this.getPromotion()
  }

  getPromotion = async () => {
    let promotionList = await getPromotionList({
      "pageNumber": this.state.page,
      "pageSize": this.state.pageSize,
      "isUniversal": this.state.isUniversal,
      "statuses": [
        "active"
      ],
      "minPercentage": this.state.minPercentage,
      "maxPercentage": this.state.maxPercentage,
      "minUsesPerCustomer": this.state.minUsesPerCustomer,
      "maxUsesPerCustomer": this.state.maxUsesPerCustomer,
      "sortBy": ""
    })

    if (promotionList) {
      this.setState({
        promotionList: promotionList?.data?.items,
        totalPromotion: promotionList?.data?.totalCount
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
          Customers
        </h2>
        <div className='card'>
          <Table
            headers={[
              { id: 1, label: '#', value: 'id' },
              { id: 2, label: 'Code Name', value: 'code' },
              { id: 3, label: 'Percentage', value: 'percentage' },
              { id: 4, label: 'Created Date', value: 'createdDate' },
              { id: 5, label: 'Last Update', value: 'lastUpdate' },
              { id: 6, label: 'Start Date', value: 'startDate' },
              { id: 7, label: 'Expiration Date', value: 'expirationDate' },
              { id: 8, label: 'Is Universal', value: 'isUniversal' },
            ]}
            rows={this.state.promotionList}
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

      </div>
    );
  }
}
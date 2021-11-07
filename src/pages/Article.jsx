import React, { Component } from 'react';
//import axios from 'axios';
import Table from '../components/table/Table';
import Modal from '../components/modal/Modal';
import { getArticleListApi } from '../apis/articleApi';
import { TextField } from '@material-ui/core';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete'
export default class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleList: [],
      //   totalTransaction: 100,
      page: 1,
      pageSize: 10,
      totalItem: 0,
      isOpenModal: false,
      selectedTransaction: undefined
    };
  }
  componentDidMount() {
    this.getArticleList()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isOpenModal !== prevState.isOpenModal && !this.state.isOpenModal) {
      this.setState({ selectedTransaction: undefined })
    }
  }

  getArticleList = async () => {
    let res = await getArticleListApi({
      "pageNumber": this.state.page,
      "pageSize": this.state.pageSize,
      "filterIds": [

      ],
      "authorUserIds": [

      ],
      "filterTittle": "",
      "minCreatedDate": "",
      "maxCreatedDate": "",
      "minLastUpdate": "",
      "maxLastUpdate": "",
      "sortBy": "createddate_desc"
    })
    if (res) {
      this.setState({
        articleList: res?.data?.items,
        totalItem: res?.data?.totalCount
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
        {/* <h2 className="page-header">
          Article
        </h2> */}

        <div className='card'>
          <div style={{
            marginBottom: '1em',
          }}>
            <Button variant="outlined" onClick={() => {
              this.props.history.push({
                pathname: `/article/create`,
              })
            }}>
              Create
            </Button>
          </div>

          <Table
            headers={[
              { id: 1, label: '#', value: 'index' },
              { id: 2, label: 'Title', value: 'tittle' },
              { id: 3, label: 'Status', value: 'status' },
              { id: 4, label: 'AuthorName', value: 'authorName' },
              { id: 5, label: 'Created Date', value: 'createdDate' },
              { id: 6, label: 'Last Update', value: 'lastUpdate' },
            ]}
            totalItem={this.state.totalItem}
            rows={this.state.articleList}
            actionList={[
              'view',
              'edit',
              'delete',
            ]}
            onClickView={(row) => {
              this.props.history.push({
                pathname: `/article/create`,
                state: {
                  articleData: row
                }
              })
            }}
            onClickEdit={(row) => {
            }}
            onClickDelete={(row) => {
            }}
            pagination
            onChangePage={(page, pageSize) => {
              console.log(page, pageSize)
              this.setState({
                page: page,
                pageSize: pageSize
              }, () => {
                this.getArticleList()
              })
            }}
          />

        </div>

      </div>
    );
  }
}
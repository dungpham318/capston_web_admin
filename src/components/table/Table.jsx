/* eslint-disable no-useless-constructor */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table as BootstrapTable } from 'react-bootstrap'
import ic_view from '../../assets/images/ic_view.png'
import ic_edit from '../../assets/images/ic_edit.png'
import ic_delete from '../../assets/images/ic_delete.png'
import ic_next from '../../assets/images/ic_next.png'
import ic_back from '../../assets/images/ic_back.png'
import Form from 'react-bootstrap/Form'

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: this.props.page || 1,
      pageSize: this.props.pageSize || 10,
    }
  }

  componentDidUpdate(prevProp, prevState) {
    if (prevState.page !== this.state.page || prevState.pageSize !== this.state.pageSize) {
      this.props.onChangePage(this.state.page, this.state.pageSize)
    }
  }


  render() {
    const {
      headers,
      rows,
      actionList,
      onClickView,
      onClickEdit,
      onClickDelete,
      totalItem
    } = this.props
    let keys = []
    headers && headers.map((_, index) => {
      return keys.push(_.value)
    })
    // actionList && actionList.length > 0 && headers.push({
    //   id: 'action',
    //   label: 'Action'
    // })
    return (
      <div>
        <BootstrapTable striped bordered hover responsive style={{
          width: '100%',
          textAlign: 'left'
        }}>
          <thead>
            <tr>
              {
                headers && headers.map((_, index) => {
                  return <th>{_.label}</th>
                })
              }
              {
                actionList && actionList.length > 0 &&
                <th style={{
                  textAlign: 'center'
                }}>Action</th>
              }
            </tr>
          </thead>
          <tbody>
            {
              rows && rows.map((_, index) => {
                return <tr>
                  {
                    keys.map((key, index1) => {
                      if (key === 'index') {
                        return <td style={{
                          paddingTop: '2em'
                        }}>{index + 1 + ((this.state.page - 1) * this.state.pageSize)} </td>
                      } else {
                        return <td style={{
                          paddingTop: '2em'
                        }}>{_[key]}</td>
                      }
                    })
                  }
                  {
                    actionList && actionList.length > 0 &&
                    <td style={{
                      paddingTop: '2em',
                      textAlign: 'center'
                    }}>
                      {
                        actionList.map((actionName, index) => {
                          let icon
                          let action
                          switch (actionName) {
                            case 'view':
                              icon = ic_view
                              action = () => onClickView(_)
                              break;
                            case 'edit':
                              icon = ic_edit
                              action = () => onClickEdit(_)
                              break;
                            case 'delete':
                              icon = ic_delete
                              action = () => onClickDelete(_)
                              break;
                            default:
                              break;
                          }
                          return (
                            <button
                              style={{
                                backgroundColor: '#ffffff'
                              }}
                              onClick={() => { action() }}>
                              <img
                                src={icon}
                                style={{
                                  width: '1.5em',
                                  height: '1.5em',
                                  marginLeft: '0.5em',
                                  marginRight: '0.5em',
                                }} />
                            </button>
                          )
                        })
                      }
                    </td>
                  }
                </tr>
              })
            }
          </tbody>
        </BootstrapTable>

        {
          this.props.pagination &&
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: '2em'
          }}>
            <div style={{ flex: 1 }}>
              <span style={{
                lineHeight: '2em'
              }}>{rows.length + ((this.state.page - 1) * this.state.pageSize)} items of {totalItem} results</span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                marginRight: '3em'
              }}>
                <button style={{
                  backgroundColor: '#eeeeee',
                  width: '2.5em',
                  height: '2.5em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10
                }}
                  onClick={() => {
                    if (this.state.page > 1) {
                      this.setState({ page: this.state.page - 1 })
                    }
                  }}
                >
                  <img
                    src={ic_back}
                    style={{
                      width: '1em',
                      alignSelf: 'center',
                    }} />
                </button>

                <span style={{
                  paddingLeft: '2em',
                  paddingRight: '2em',
                  textAlign: 'justify',
                  height: '2em',
                  lineHeight: '2em'
                }}>{this.state.page}</span>

                <button style={{
                  backgroundColor: '#eeeeee',
                  width: '2.5em',
                  height: '2.5em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10
                }}
                  onClick={() => {
                    if (totalItem > (this.state.page * this.state.pageSize) && rows.length >= this.state.pageSize)
                      this.setState({ page: this.state.page + 1 })
                  }}
                >
                  <img
                    src={ic_next}
                    style={{
                      width: '1em',
                      alignSelf: 'center',
                    }} />
                </button>
              </div>

              <select style={{
                padding: '0.4em',
                fontSize: '1em',
                alignSelf: 'flex-end',
              }}
                onChange={(e) => {
                  this.setState({ pageSize: parseInt(e.target.value), page: 1 })
                }}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        }

      </div>
    );
  }
}

Table.defaultProps = {
  rows: [],
  headers: [],
  page: 1,
  pageSize: 10
}

export default Table;
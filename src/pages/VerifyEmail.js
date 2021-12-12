import React, { Component } from 'react';
import { verifyEmailApi } from '../apis/loginApi';


export default class VerifyEmail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSuccess: undefined
    }
  }


  async componentDidMount() {
    let res = await verifyEmailApi({
      token: this.props.history?.location?.search?.replace('?token=', '')
    })
    if (res) {
      this.setState({ isSuccess: true })
    } else {
      this.setState({ isSuccess: false })
    }
  }

  render() {
    return (
      <div>
        <p>{this.state.isSuccess ? 'Success' : 'Fail'}</p>
      </div>
    )
  }

}
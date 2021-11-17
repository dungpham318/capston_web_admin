/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react'
import img_login from '../assets/images/img_login.svg'
//import usePrevious from '../../functions/usePrevious'
import { Redirect, useHistory } from 'react-router-dom'
import { TextField } from '@material-ui/core';
import bg_login from '../assets/images/bg_login.png'
import logo from '../assets/images/logo.png'
import Button from '@mui/material/Button'
import { loginApi } from '../apis/loginApi';
import LoadingButton from '@mui/lab/LoadingButton'
export default function Login(props) {
  let history = useHistory()
  const [username, setUsername] = useState('manager123@gmail.com')
  const [password, setPassword] = useState('Test123')
  const [loading, setLoading] = useState(false)

  const onLogin = async () => {
    setLoading(true)
    let res = await loginApi({
      "email": username,
      "password": password,
      "deviceId": "string",
      "deviceToken": "string"
    })
    setLoading(false)
    console.log(res?.data?.role)
    if (res && res?.data) {
      if (res?.data?.role === 'manager' || res?.data?.role === 'administrator') {
        localStorage.setItem('token', res?.data?.token)
        localStorage.setItem('email', res?.data?.email)
        localStorage.setItem('avatar', res?.data?.avatar)
        localStorage.setItem('role', res?.data?.role)
      }
      history.push({
        pathname: `/dashboard`
      })
    }
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${bg_login})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}>

      <div
        className='card'
        style={{
          width: '30em',
          height: '30em',
          display: 'flex',
          flexDirection: 'column',
          alignItem: 'center',
          alignItems: 'center',
        }}>
        <img
          src={logo}
          style={{
            width: '6em',
          }}
        />
        <div style={{
          marginTop: '2em',
          flex: '1 1 auto',
        }}>
          <TextField
            required
            id="outlined-basic"
            label="Username"
            variant="outlined"
            style={{
              width: '100%',
              marginTop: '2em',
            }}
            value={username}
            onChange={(event) => {
              setUsername(event.target.value)
            }}
          />
          <TextField
            type='password'
            required
            id="outlined-basic"
            label="Password"
            variant="outlined"
            style={{
              width: '100%',
              marginTop: '2em',
              marginBottom: '2em',
            }}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
            }}
          />
        </div>
        <LoadingButton style={{
          width: '90%',
          backgroundColor: '#2980b9',
        }}
          variant="contained"
          loading={loading}
          onClick={() => {
            onLogin()
          }}>
          Login
        </LoadingButton>
      </div>

    </div>
  )

}


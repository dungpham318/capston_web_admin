import React, { useState, useEffect } from 'react'
import logo from '../assets/images/logo.jpg'
import img_login from '../assets/images/img_login.svg'
import Button from '../components/custom/Button'
import TextField from '../components/custom/TextField'
//import usePrevious from '../../functions/usePrevious'
import { useNavigate } from 'react-router-dom';
// import { Redirect, useHistory } from 'react-router-dom'
export default function Login(props) {
  const [username, setUsername] = useState('fis.tdc.hcm')
  const [password, setPassword] = useState('123123')

  const onLogin = () => {
    //navigate("/fisinsight/admin/dashboard")

    // props.loginAction({
    //   "username": username,
    //   "password": password
    // })
  }

  return (
    <div className='flex flex-auto flex-row items-center justify-center h-screen w-screen px-32'>

      <div className='flex flex-col flex-initial items-start px-20'>
        <img
          className='w-20 py-4'
          src={logo}
        />
        <span className='text-text font-text text-2xl font-black'>
          Sign in to your account
          </span>
        <span className='text-left font-text text-sm font-bold text-text py-1 px-1 mt-3'>Username</span>
        <TextField
          className='mx-0.5 my-0.5 py-3 flex w-96'
          container='my-0.5'
          onChange={(text) => {
            setUsername(text)
          }}
          value={username}
        />

        <span className='text-left font-text text-sm font-bold text-text py-1 px-1 mt-3'>Password</span>
        <TextField
          className='mx-0.5 my-0.5 py-3 w-96'
          container='my-0.5'
          type='password'
          onChange={(text) => {
            setPassword(text)
          }}
          value={password}
        />

        <Button
          className='w-96'
          label='Sign in'
          onClick={() => {
            onLogin()
          }}
        />
      </div>
      <div className='flex flex-col flex-1'>

        <img
          className=''
          src={img_login}
        />

      </div>


    </div>
  )

}


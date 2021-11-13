import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { createStaffApi } from '../apis/staffApi';

export default function CreateStaff(props) {

    const [staffName, setStaffName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [staffDescription, setStaffDescription] = useState('')
    const [staffEmail, setStaffEmail] = useState('')
    const [staffPhoneNumber, setStaffPhoneNumber] = useState('')
    const [salonId, setSalonId] = useState('')
    const [staffType, setStaffType] = useState('')

    useEffect(() => {
        console.log(123456789, staffName)
    }, [staffName])

    const onSubmit = async () => {
        let res = await createStaffApi({
            "FullName": staffName,
            "Password": password,
            "ConfirmPassword": confirmPassword,
            "Description": staffDescription,
            "Email": staffEmail,
            "PhoneNumber": staffPhoneNumber,
            "SalonId": salonId,
            "StaffType": staffType
        })
        if(res){
            props.history.push({
                pathname:`/staffs`
            })
        }
    }

    const onCancel = async () =>{
        props.history.push({
            pathname:`/staffs`
        })
    }
    return (
        <div>
            <div className='card' style={{height: '52em'}}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    height: '38em'
                }}>  
                    <TextField
                      required
                      id="outlined-basic"
                      label="Staff Name"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={staffName}
                      onChange={(event) => {
                          setStaffName(event.target.value)
                      }}
                    />
                    <TextField
                      required
                      id="outlined-basic"
                      label="Password"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={password}
                      onChange={(event) => {
                          setPassword(event.target.value)
                      }}
                    />
                    <TextField
                      required
                      id="outlined-basic"
                      label="Confirm Password"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={confirmPassword}
                      onChange={(event) => {
                          setConfirmPassword(event.target.value)
                      }}
                    />
                    <TextField
                      required
                      id="outlined-basic"
                      label="Description"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={staffDescription}
                      onChange={(event) => {
                          setStaffDescription(event.target.value)
                      }}
                    />
                    <TextField
                      required
                      id="outlined-basic"
                      label="Description"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={staffDescription}
                      onChange={(event) => {
                          setStaffDescription(event.target.value)
                      }}
                    />
                    <TextField
                      required
                      id="outlined-basic"
                      label="Staff Email"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={staffEmail}
                      onChange={(event) => {
                          setStaffEmail(event.target.value)
                      }}
                    />
                    <TextField
                      required
                      id="outlined-basic"
                      label="Phone Number"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={staffPhoneNumber}
                      onChange={(event) => {
                          setStaffPhoneNumber(event.target.value)
                      }}
                    />
                    <TextField
                      required
                      id="outlined-basic"
                      label="Salon"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={salonId}
                      onChange={(event) => {
                          setSalonId(event.target.value)
                      }}
                    />
                    <TextField
                      required
                      id="outlined-basic"
                      label="Role"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={staffType}
                      onChange={(event) => {
                          setStaffType(event.target.value)
                      }}
                    />
                    <div style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <div style={{ flex: 1}}/>
                        <LoadingButton  style ={{
                            marginRight: '1em'
                        }}variant="contained" color="success" onClick={() => onSubmit()}>
                            Submit
                        </LoadingButton>
                        <LoadingButton variant="contained" color="error" onClick={() => onCancel()}>
                            Cancel
                        </LoadingButton>
                    </div>
                </div> 
            </div>
        </div>
    );
}

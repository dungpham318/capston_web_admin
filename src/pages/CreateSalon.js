import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { createSalonApi } from '../apis/salonApi'

export default function CreateSalon(props) {

    const [salonName, setSalonName] = useState('')
    const [salonDescription, setSalonDescription] = useState('')
    const [salonAddress, setSalonAddress] = useState('')
    const [salonStatus, setSalonStatus] = useState('active')
    const [isGettingSalon, setIsGettingSalon] = useState(true)

    // useEffect(() => {
    //     if (props.location.state?.salonData){
    //         getSalonDetail(props.location.state?.salonData?.id)
    //     }else{
    //         setIsGettingSalon(false)
    //     }
    // }, [])

    useEffect(() => {
        console.log(123456789, salonName)
    }, [salonName])

    const onSubmit = async () => {
        let res = await createSalonApi({
            "name": salonName,
            "description": salonDescription,
            "address": salonAddress
        })

        if(res) {
            props.history.push({
                pathname: `/salon`
            })
        }
    }

    const onCancel = async () =>{
        props.history.push({
            pathname:`/salon`
        })
    }

    return (
        <div>
            <div className='card' style={{height: '25em'}}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    height: '38em'
                }}>  
                    <TextField
                      required
                      id="outlined-basic"
                      label="Salon Name"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={salonName}
                      onChange={(event) => {
                          setSalonName(event.target.value)
                      }}
                    />
                    <TextField
                      required
                      id="outlined-basic"
                      label="Desription"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={salonDescription}
                      onChange={(event) => {
                          setSalonDescription(event.target.value)
                      }}
                    />
                    <TextField
                      required
                      disabled
                      id="outlined-basic"
                      label="Status"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={salonStatus}
                      onChange={(event) => {
                          setSalonStatus(event.target.value)
                      }}
                    />
                    <TextField
                      required
                      id="outlined-basic"
                      label="Address"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={salonAddress}
                      onChange={(event) => {
                          setSalonAddress(event.target.value)
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

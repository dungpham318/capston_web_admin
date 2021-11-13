import React, { useState, useEffect } from 'react'
import { getServiceDetail, createService } from '../apis/serviceApi'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

export default function CreateService(props) {

    const [serviceName, setServiceName] = useState('')
    const [serviceDescription, setServiceDescription] = useState('')
    const [servicValue, setServiceValue] = useState('')
    const [isGettingService, setIsGettingService] = useState(true)

    useEffect(() => {
        if (props.location.state?.serviceData){
            getServiceDetail(props.location.state?.serviceData?.id)
        }else{
            setIsGettingService(false)
        }
    }, [])

    useEffect(() => {
        console.log(123456789, serviceName)
    }, [serviceName])

    const onSubmit = async () => {
        let formData = new FormData()

        formData.append('name', serviceName)
        formData.append('description', serviceDescription)
        formData.append('value', servicValue)

        let res = await createService(formData)

        if(res) {
            props.history.push({
                pathname: `/services`
            })
        }
    }

    return (
        <div>
            <div className='card' style={{height: '20em'}}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    height: '38em'
                }}>
                    <TextField
                      required
                      id="outlined-basic"
                      label="name"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={serviceName}
                      onChange={(event) => {
                          setServiceName(event.target.value)
                      }}
                    />
                    <TextField
                      required
                      id="outlined-basic"
                      label="name"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={serviceDescription}
                      onChange={(event) => {
                          setServiceDescription(event.target.value)
                      }}
                    />
                    <TextField
                      required
                      id="outlined-basic"
                      label="name"
                      variant="outlined"
                      style={{
                          width: '100%',
                          marginTop: '1em',
                          marginBottom: '1em'
                      }}
                      value={setServiceValue}
                      onChange={(event) => {
                          setServiceValue(event.target.value)
                      }}
                    />
                </div>
                <div style={{display: 'flex', flex: 'row',}}>
                    <Button variant="outlined" onClick={() => onSubmit()}>
                        Submit
                    </Button>
                </div>   
            </div>
        </div>
    );
}

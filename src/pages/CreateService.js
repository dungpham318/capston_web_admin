import React, { useState, useEffect } from 'react';
import { getServiceDetail, createServiceApi } from '../apis/serviceApi';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { convertMoney } from '../function';

export default function CreateService(props) {

    const [loading, setLoading] = useState(false)
    const [serviceName, setServiceName] = useState('')
    const [serviceDescription, setServiceDescription] = useState('')
    const [servicePrice, setServicePrice] = useState('')
    const [serviceStatus, setServiceStatus] = useState('active')
    const [isGettingService, setIsGettingService] = useState(true)

    useEffect(() => {
        if (props.location.state?.serviceData) {
            getDetail(props.location.state?.serviceData?.id)
        } else {
            setIsGettingService(false)
        }
    }, [])

    const onSubmit = async () => {
        setLoading(true)
        let res = await createServiceApi({
            "name": serviceName,
            "description": serviceDescription,
            "status": serviceStatus,
            "price": servicePrice.split('.').join('')
        })
        setLoading(false)

        if (res) {
            props.history.push({
                pathname: `/services`
            })
        }
    }

    const onCancel = async () => {
        props.history.push({
            pathname: `/services`
        })
    }

    const getDetail = async (id) => {
        let res = await getServiceDetail({
            id: id
        })
        console.log(res)
        if (res) {
            setServiceName(res?.data?.name)
            setServiceDescription(res?.data?.description)
            setServiceStatus(res?.data?.status)
            setServicePrice(res?.data?.price)
        }
    }

    return (
        <div>
            <div className='card' style={{ height: '25em' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    height: '38em'
                }}>
                    <TextField
                        required
                        id="outlined-basic"
                        label="Service Name"
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
                        label="Desription"
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
                        disabled
                        id="outlined-basic"
                        label="Status"
                        variant="outlined"
                        style={{
                            width: '100%',
                            marginTop: '1em',
                            marginBottom: '1em'
                        }}
                        value={serviceStatus}
                        onChange={(event) => {
                            setServiceStatus(event.target.value)
                        }}
                    />
                    <TextField
                        required
                        id="outlined-basic"
                        label="Price"
                        variant="outlined"
                        style={{
                            width: '100%',
                            marginTop: '1em',
                            marginBottom: '1em'
                        }}
                        value={servicePrice}
                        onChange={(event) => {
                            setServicePrice(convertMoney(event.target.value))
                        }}
                    />
                    <div style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                        <div style={{ flex: 1 }} />
                        <LoadingButton
                            style={{
                                marginRight: '1em'
                            }}
                            variant="contained"
                            color="success"
                            onClick={() => onSubmit()}
                            loading={loading}
                        >
                            Submit
                        </LoadingButton>

                        <LoadingButton variant="contained" color="error" onClick={() => onCancel()} loading={loading}>
                            Cancel
                        </LoadingButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

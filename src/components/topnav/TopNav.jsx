/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import './topnav.css'
import { Link, useHistory } from 'react-router-dom'
import Dropdown from '../dropdown/Dropdown'
import notifications from '../../assets/JsonData/notification.json'
import user_menu from '../../assets/JsonData/user_menus.json'
import { render } from '@testing-library/react'
import { getNotificationListApi, updateNotificationStatus } from '../../apis/notificationApi'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';



const curr_user = {
    display_name: localStorage.getItem('fullName'),
    // image: user_image
}

const renderNotificationItem = (item, index) => (
    <a href='' onClick={() => {
        updateNotificationStatus({
            id: item.id
        })
        item.onClick()
    }}>
        <div className="notification-item" key={index} style={{
            backgroundColor: item?.status === 'seen' ? '#ffffff' : '#e6f8ff'
        }}>
            <div>
                <p style={{
                    fontWeight: 'bold',
                    paddingBottom: '1em'
                }}>{item.title}</p>
                <p>{item.detail}</p>
            </div>
        </div>
        <Divider />
    </a>
)

const renderUserToggle = (user) => (
    <div className="topnav__right-user">
        {/* <div className="topnav__right-user__image">
            <img src={user.image} alt="" />
        </div> */}
        <div className="topnav__right-user__name">
            {user.display_name}
        </div>
    </div>
)

const renderUserMenu = (item, index) => {
    if (item?.content === 'Logout') {
        return <Link onClick={() => {
            localStorage.clear();
        }} to='/login' key={index}>
            <div className="notification-item">
                <i className={item.icon}></i>
                <span>{item.content}</span>
            </div>
        </Link>
    } else {
        return <Link onClick={() => {
        }} to='/' key={index}>
            <div className="notification-item">
                <i className={item.icon}></i>
                <span>{item.content}</span>
            </div>
        </Link>
    }
}

const Topnav = (props) => {
    const [notificationList, setNotificationList] = useState([])
    const [currentUser, setCurrentUser] = useState({
        display_name: localStorage.getItem('fullName'),
    })
    const history = useHistory()
    useEffect(() => {
        getNotification()
        setCurrentUser({
            display_name: localStorage.getItem('fullName'),
        })
        curr_user.display_name = localStorage.getItem('fullName')
    }, [])

    const getNotification = async () => {
        let res = await getNotificationListApi({
            "pageNumber": 1,
            "pageSize": 50,
            "filterByIds": [
            ],
            "filterByAppointmentId": [
            ],
            "statuses": [
            ],
            "minLastUpdate": "",
            "maxLastUpdate": "",
            "minCreatedDate": "",
            "maxCreatedDate": "",
            "sortBy": "createddate_desc"
        })
        if (res?.data?.items) {
            for (const item of res?.data?.items) {
                item.onClick = () => {
                    history.push({
                        pathname: `/transactions`,
                        state: {
                            appointmentId: item?.appointmentId,
                        }
                    })
                    getNotification()
                }
            }
            setNotificationList(res?.data?.items)
        }
    }

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 500 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <p style={{
                paddingLeft: '1em',
                paddingTop: '1em',
                fontSize: '1.2em',
                fontWeight: 'bold'
            }}>Notification</p>
            {
                notificationList.map((item, index) => renderNotificationItem(item, index))
            }
        </Box>
    );

    return (
        <div className='topnav'>
            <div className="topnav__search">
            </div>
            <div className="topnav__right">
                <div className="topnav__right-item">
                    <Dropdown
                        customToggle={() => renderUserToggle(currentUser)}
                        contentData={user_menu}
                        renderItems={(item, index) => renderUserMenu(item, index)}
                    />
                </div>
                <div className="topnav__right-item" onClick={() => {
                }}>
                    <React.Fragment>
                        <button className="dropdown__toggle" onClick={toggleDrawer('right', true)}> <i className={'bx bx-bell'}></i></button>
                        <Drawer
                            anchor={'right'}
                            open={state['right']}
                            onClose={toggleDrawer('right', false)}
                        >
                            {list('right')}
                        </Drawer>
                    </React.Fragment>
                </div>

            </div>

        </div>
    )
}

export default Topnav

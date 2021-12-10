import React, { useEffect, useState } from 'react'

import './topnav.css'

import { Link } from 'react-router-dom'

import Dropdown from '../dropdown/Dropdown'

//import ThemeMenu from '../thememenu/ThemeMenu'

import notifications from '../../assets/JsonData/notification.json'

// import user_image from '../../assets/images/tuat.png'

import user_menu from '../../assets/JsonData/user_menus.json'
import { render } from '@testing-library/react'
import { getNotificationListApi } from '../../apis/notificationApi'

const curr_user = {
    display_name: localStorage.getItem('fullName'),
    // image: user_image
}

const renderNotificationItem = (item, index) => (
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
            localStorage.removeItem('token')
            localStorage.removeItem('email')
            localStorage.removeItem('avatar')
            localStorage.removeItem('role')
        }} to='/login' key={index}>
            <div className="notification-item">
                <i className={item.icon}></i>
                <span>{item.content}</span>
            </div>
        </Link>
    } else {
        return <Link onClick={() => {
            console.log(item)
        }} to='/' key={index}>
            <div className="notification-item">
                <i className={item.icon}></i>
                <span>{item.content}</span>
            </div>
        </Link>
    }
}

const Topnav = () => {
    const [notificationList, setNotificationList] = useState([])

    useEffect(() => {
        async function getNotification() {
            let res = await getNotificationListApi({
                "pageNumber": 1,
                "pageSize": 5,
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
                console.log(res?.data?.items)
                setNotificationList(res?.data?.items)
            }
        }
        getNotification()
    }, [])

    return (
        <div className='topnav'>
            <div className="topnav__search">
                {/* <input type="text" placeholder='Search here...' />
                <i className='bx bx-search'></i> */}
            </div>
            <div className="topnav__right">
                <div className="topnav__right-item">
                    {/* dropdown here */}
                    <Dropdown
                        customToggle={() => renderUserToggle(curr_user)}
                        contentData={user_menu}
                        renderItems={(item, index) => renderUserMenu(item, index)}
                    />
                </div>
                <div className="topnav__right-item" onClick={() => {
                }}>
                    <Dropdown
                        icon='bx bx-bell'
                        // badge='12'
                        contentData={notificationList}
                        renderItems={(item, index) => renderNotificationItem(item, index)}
                        renderFooter={() => <Link to='/notification'>View All</Link>}
                    />
                    {/* dropdown here */}
                </div>
                {/* <div className="topnav__right-item">
                    <ThemeMenu/>
                </div> */}
            </div>
        </div>
    )
}

export default Topnav

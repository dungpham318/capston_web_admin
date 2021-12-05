import React from 'react'

import { Link } from 'react-router-dom'

import './sidebar.css'

import logo from '../../assets/images/logo.jpg'

import sidebar_items from '../../assets/JsonData/sidebar_routes.json'

const SidebarItem = props => {

    const active = props.active ? 'active' : ''

    return (
        <div className="sidebar__item">
            <div className={`sidebar__item-inner ${active}`}>
                <i className={props.icon}></i>
                <span>
                    {props.title}
                </span>
            </div>
        </div>
    )
}

const Sidebar = props => {

    let activeItem = sidebar_items.findIndex(item => item.route === props.location.pathname)

    return (
        <div className='sidebar'>
            <div className="sidebar__logo">
                <img style={{
                    width: '5em',
                    height: '5em'
                }} src={logo} alt="company logo" />
            </div>
            {
                sidebar_items.map((item, index) => {
                    if ((props.location.pathname === '/' && item?.route === '/') || (props.location.pathname === '/dashboard' && item?.route === '/dashboard')) {
                        activeItem = true
                    } else if (props.location.pathname.includes(item?.route) && item?.route.length > 2) {
                        activeItem = true
                    } else {
                        activeItem = false
                    }
                    return (
                        <Link to={item.route} key={index}>
                            <SidebarItem
                                title={item.display_name}
                                icon={item.icon}
                                active={activeItem}
                            />
                        </Link>
                    )
                })
            }
        </div>
    )
}

export default Sidebar

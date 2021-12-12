import React, { useEffect } from 'react'

import './layout.css'

import Sidebar from '../sidebar/Sidebar'
import TopNav from '../topnav/TopNav'
import Routes, { UnAuthRoute } from '../Routes'

import { BrowserRouter, Route } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import ThemeAction from '../../redux/actions/ThemeAction'

const Layout = () => {

    const themeReducer = useSelector(state => state.ThemeReducer)

    const dispatch = useDispatch()

    useEffect(() => {
        const themeClass = localStorage.getItem('themeMode', 'theme-mode-light')

        const colorClass = localStorage.getItem('colorMode', 'theme-mode-light')

        dispatch(ThemeAction.setMode(themeClass))

        dispatch(ThemeAction.setColor(colorClass))
    }, [dispatch])
    return (

        <BrowserRouter basename='/test'>
            <Route render={(props) => {
                let user = localStorage.getItem('token')
                if (user && props?.location?.pathname !== '/verify_email') {
                    return (
                        <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                            <Sidebar {...props} />
                            <div className="layout__content">
                                <TopNav />
                                <div className="layout__content-main">
                                    <Routes />
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                            <Routes />
                        </div>
                    )
                }

            }} />
        </BrowserRouter>

    )
}

export const UnAuthLayout = () => {

    const themeReducer = useSelector(state => state.ThemeReducer)

    const dispatch = useDispatch()

    useEffect(() => {
        const themeClass = localStorage.getItem('themeMode', 'theme-mode-light')

        const colorClass = localStorage.getItem('colorMode', 'theme-mode-light')

        dispatch(ThemeAction.setMode(themeClass))

        dispatch(ThemeAction.setColor(colorClass))
    }, [dispatch])

    return (
        <BrowserRouter>
            <Route render={(props) => (
                <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                    <UnAuthRoute />
                </div>
            )} />
        </BrowserRouter>
    )
}

export default Layout

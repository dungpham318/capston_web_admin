import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Customers'
import Services from '../pages/Services'
import Combo from '../pages/Combo'
import Transactions from '../pages/Transactions'
import Analysics from '../pages/Analysics'
import Promotions from '../pages/Promotions'
import Salon from '../pages/Salon'
import Staffs from '../pages/Staffs'
import Article from '../pages/Article'
import CreateArticle from '../pages/CreateArticle'
import Login from '../pages/Login'
import CreateService from '../pages/CreateService'
import UpdateService from '../pages/UpdateService'
import CreateSalon from '../pages/CreateSalon'
import CreateStaff from '../pages/CreateStaff'
import Schedule from '../pages/Schedule'

const Routes = () => {

    let user = localStorage.getItem('token')

    console.log(user)
    return (
        <Switch>
            {
                !user ?
                    <Route path='/login' exact component={Login} /> :
                    <>
                        <Route path='/' exact component={Dashboard} />
                        <Route path='/dashboard' component={Dashboard} />
                        <Route path='/customers' component={Customers} />
                        <Route exact path='/services' component={Services} />
                        <Route path='/services/create' component={CreateService} />
                        {/* <Route path='/services/update' component={UpdateService}/> */}
                        <Route path='/combo' component={Combo} />
                        <Route path='/transactions' component={Transactions} />
                        <Route path='/analysics' component={Analysics} />
                        <Route path='/promotions' component={Promotions} />
                        <Route exact path='/salon' component={Salon} />
                        <Route path='/salon/create' component={CreateSalon} />
                        <Route exact path='/staffs' component={Staffs} />
                        <Route path='/staffs/create' component={CreateStaff} />
                        <Route exact path='/article' component={Article} />
                        <Route path='/article/create' component={CreateArticle} />
                        <Route path='/schedule' component={Schedule} />



                    </>
            }

        </Switch>
    )
}
export default Routes

export const UnAuthRoute = () => {

    let user = localStorage.getItem('token')

    console.log(user)
    return (
        <Switch>
            <Route path='/login' exact component={Login} />
            <Route path='' exact component={Login} />
        </Switch>
    )
}


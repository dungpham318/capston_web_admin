import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals'

import { createStore } from 'redux'

import { Provider } from 'react-redux'

import rootReducer from './redux/reducers'

import './assets/boxicons-2.0.7/css/boxicons.min.css'
import './assets/css/grid.css'
import './assets/css/theme.css'
import './assets/css/index.css'

import Layout, { UnAuthLayout } from './components/layout/Layout'
import Notification from './components/notification/Notification';
import { onMessageListener } from './firebase'
const store = createStore(
  rootReducer
)

document.title = "Man's HairCut Service"


let App = () => {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" });
  onMessageListener()
    .then((payload) => {
      setShow(true);
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      console.log(payload);
    })
    .catch((err) => console.log("failed: ", err));

  let user = localStorage.getItem('token')
  console.log(user)
  return (
    <Provider store={store}>
      <React.StrictMode>
        <Layout />
        <Notification
          title={notification.title}
          body={notification.body}
        />
      </React.StrictMode>
    </Provider>
  )
}
// {
//   user ?
//     <Layout /> :
//     <UnAuthLayout />
// }
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

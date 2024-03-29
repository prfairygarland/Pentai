import React, { Component, Suspense } from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import BoardManagement from './views/pages/communityManagement/BoardManagement'
import { SnackbarProvider } from 'notistack'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const LiveConsole = React.lazy(() => import('./views/pages/LiveManagement/Component/LiveConsole'))
const SixMonthPasswordChange = React.lazy(() => import('./views/pages/login/SixMonthPasswordChange'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const AuthLayout = React.lazy(() => import('./layout/AuthLayout'))

const getToken = localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('sessionToken')
class App extends Component {
  render() {
    return (
      <BrowserRouter >
      <SnackbarProvider
      autoHideDuration={2000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      />
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/LiveManagement/liveConsole" name="Login Page" element={<LiveConsole />} />
            <Route exact path="/SixMonthPasswordChange" name="Password Change" element={<SixMonthPasswordChange />} />
            {/* <Route exact path="/register" name="Register Page" element={<Register />} /> */}
            <Route exact path='/auth' name="auth" element={<AuthLayout/>}/>
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route path="*" name="Home" element={<DefaultLayout token={getToken} />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    )
  }
}

export default App

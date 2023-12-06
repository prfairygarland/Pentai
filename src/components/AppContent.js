import React, { Suspense,useEffect, useState } from 'react'
import { Navigate, Route, Routes,useNavigate } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'

const AppContent = () => {

  const getToken = localStorage.getItem('token')

  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />
                  }
                />
              )
            )
          })}
          <Route path="/" element={getToken != undefined ? <Navigate to="dashboard" replace /> : <Navigate to="Login" replace/>} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)

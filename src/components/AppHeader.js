import React, { useState } from 'react'
import { NavLink,useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CDropdownToggle,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CModal,
  CModalBody,
  CModalContent,
  CModalDialog,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,


} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'
import { setSidebar } from './../state/SideBar/sideBarAction'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sideBarState.sidebarShow)
  const [visible, setVisible] = useState(false)

  const navigate = useNavigate();


  const logOut = async () => {
    if (sessionStorage.getItem('sessionToken') == null) {
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('userdata')
        localStorage.removeItem('roleWisePermission')
        navigate('/Login')
      } catch (error) {
        console.log('error =>', error);
      }
    } else {
      try {
        sessionStorage.removeItem('sessionToken')
        sessionStorage.removeItem('sessionUserdata')
        sessionStorage.removeItem('roleWisePermission')
        navigate('/Login')
      } catch (error) {
        console.log('error else =>', error);
      }
    }
  }

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch(setSidebar(!sidebarShow ))}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          {/* <CIcon icon={logo} height={48} alt="Logo" /> */}
        </CHeaderBrand>
        <CHeaderNav className="ms-3">
          <CNavItem>
            <CNavLink to='/changepassword' component={NavLink}>
              <p>Change Password</p>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink role="button" onClick={() => setVisible(!visible)}>
              <p>Logout</p>
            </CNavLink>
            <CModal
              backdrop="static"
              visible={visible}
              onClose={() => setVisible(false)}
              aria-labelledby="StaticBackdropExampleLabel"
            >
              <CModalHeader>
                <CModalTitle id="StaticBackdropExampleLabel">Logout</CModalTitle>
              </CModalHeader>
              <CModalBody>Are you sure! you want to logout </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                  Cancel
                </CButton>
                <CButton onClick={() => logOut()} color="primary">Logout</CButton>
              </CModalFooter>
            </CModal>

          </CNavItem>
          <CDropdown component="li" className="ms-3" variant="nav-item">
            <CDropdownToggle>English</CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href="#">Koren</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          {/* <AppHeaderDropdown /> */}
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader

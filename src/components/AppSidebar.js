import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import logo from '../assets/images/ptk-whiteLogo.png'

// sidebar nav config
import navigation from '../_nav'
import {
  setSidebarUnfolded,
  setSidebar
} from "../state/SideBar/sideBarAction"
import { useTranslation } from 'react-i18next'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sideBarState.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sideBarState.sidebarShow)
  const [getNavitems, setNavitems] = useState()

  useEffect(() => {
    setNavitems(localStorage.getItem('roleWisePermission') ? JSON.parse(localStorage.getItem('roleWisePermission')) : JSON.parse(sessionStorage.getItem('roleWisePermission')))
  }, [])

  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.Sidebar



  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(setSidebar(visible))
      }}
    >
      <CSidebarBrand className="d-none d-md-flex">
        {/* <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} /> */}
        {/* <h4 className="sidebar-brand-full ">PTK APP Admin</h4>
        <h4 className="sidebar-brand-narrow">PTK APP Admin</h4> */}
        <img src={logo}/>
        {/* <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} /> */}
      </CSidebarBrand>
      <h4 className="sidebar-brand-cat mt-3 px-3">{multiLang?.Category_Menu}</h4>
      <CSidebarNav>
        {/* <h4 className="sidebar-brand-narrow">PTK APP Admin</h4> */}
        <SimpleBar>

          <AppSidebarNav items={getNavitems} />

        </SimpleBar>
      </CSidebarNav>
      {/* <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch(setSidebarUnfolded(!unfoldable ))}
      /> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

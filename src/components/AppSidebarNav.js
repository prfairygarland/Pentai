import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import { CBadge } from '@coreui/react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCursor } from '@coreui/icons'


export const AppSidebarNav = ({ items }) => {
  const location = useLocation()
  const navLink = (name, icon, badge, url) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index) => {

    if (item.submenuId) {
      const { submenuName, badge, icon, submenuId, isSubMenuPermission, ...rest } = item
      const Component = CNavItem
      return (
        <Component
          {...(rest.submenuUrl && !rest.items &&
          {
            component: NavLink,
          })
          }
          key={index}
          to={rest.submenuUrl}
        >
          {navLink(submenuName, icon, badge, rest.submenuUrl)}
        </Component>
      )
    } else {
      const { menuName, badge, menuId, isSubMenuPermission, ...rest } = item
      const Component = CNavItem
      return (
        <Component
          {...(rest.menuUrl && !rest.items &&
          {
            component: NavLink,
          })
          }
          key={index}
          to={rest.menuUrl}
        >
          {navLink(menuName, <CIcon icon={cilCursor} customClassName="nav-icon" />, badge, rest.menuUrl)}
        </Component>
      )
    }


  }
  const navGroup = (item, index) => {
    const { menuUrl, menuName, icon, ...rest } = item
    const Component = CNavGroup

    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(menuName, <CIcon icon={cilCursor} customClassName="nav-icon" />, menuUrl)}
        visible={location.pathname.startsWith(menuUrl)}
        {...rest}

      >
        {item.subMenu?.map((item, index) =>
          item.subMenu ? navGroup(item, index) : navItem(item, index),
        )}
      </Component>
    )
  }

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) => (item.subMenu.length > 0 ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}

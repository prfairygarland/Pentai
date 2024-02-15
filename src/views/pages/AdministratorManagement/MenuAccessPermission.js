import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem, CButton, CCol, CFormCheck, CFormInput, CFormSwitch } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Loader from 'src/components/common/Loader'
import { getApi, putApi } from 'src/utils/Api'
import { API_ENDPOINT } from 'src/utils/config'

const MenuAccessPermission = () => {

  const mainAccess = {

    administratorManagement: {
      administratorMenuId: null,
      isAdminToggleOn: false,
      administratorList: false,
      administratorListSubMenuId: null,
      menuAccessPermission: false,
      menuAccessPermissionSubMenuId: null
    },

    userManagement: {
      userMenuId: null,
      isUserToggleOn: false,
      user: false,
      userSubMenu: null,
      userInformation: false,
      userInformationSubMenu: null
    },

    oprationManagement: {
      oprationMenuId: null,
      isOperationToggleOn: false,
      greetingMessage: false,
      greetingMessageSubMenuId: null,
      banner: false,
      bannerSubMenuId: null,
      homeContent: false,
      homeContentSubMenuId: null,
      pushNotification: false,
      pushNotificationSubMenuId: null,

    },

    reservationManagement: {
      reservationMenuId: null,
      isReservationToggleOn: false,
      meetingRoom: false,
      meetingRoomSubMenuId: null,
      suppliesRental: false,
      suppliesRentalSubMenuId: null,
      bookRental: false,
      bookRentalSubMenuId: null,

    },

    communityManagement: {
      communityMenuId: null,
      isCommunityToggleOn: false,
      boardManagement: false,
      boardSubMenuId: null,
      bulletinBoard: false,
      bulletinBoardSubMenuId: null,
      clubManagement: false,
      clubSubMenuId: null,
      welfareManagement: false,
      welfareSubMenuId: null,

    },

    liveManagement: {
      liveMenuId: null,
      isLiveToggleOn: false,
      allMenu: false,
      allMenuSubMenuId: null,
    },

    rewardManagement: {
      rewardMenuId: null,
      isRewardToggleOn: false,
      roulette: false,
      rouletteSubMenuId: null,
      luckyDraw: false,
      luckyDrawSubMenuId: null,
      ranking: false,
      rankingSubMenuId: null,
      point: false,
      pointSubMenuId: null,
    },

    supportManagement: {
      supportMenuId: null,
      isSupportToggleOn: false,
      faq: false,
      faqSubMenuId: null,
      support: false,
      supportSubMenuId: null,
    }

  }

  const { t, i18n } = useTranslation();
  const translationObject = i18n.getDataByLanguage(i18n.language);
  const multiLang = translationObject?.translation?.MenuAccessPermission
  const [toggleState, setToggleState] = useState(false);
  const [initialMainAccess, setIntialMainAccess] = useState(mainAccess)
  const [searchData, setSearchData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [idRole, setIdRole] = useState(null)
  const [idGroup, setIdGroup] = useState(null)
  const [superAdmin, setSuperAdmin] = useState(false)
  const [subAdmin, setSubAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    handleAdminSearchData()
  }, []);

  const handleSearchChange = (event) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)
    console.log('teue =>', term)
    const filtered = searchData?.filter((item) =>
      Object.values(item.departMentName).some(
        (value) => value.toLowerCase().includes(term),
      ),
    )
    console.log('filtered =>', filtered);
    setFilteredData(filtered)
  }

  const handleAdminSearchData = async () => {
    try {
      const res = await getApi(API_ENDPOINT.menuAcessPermision)
      if (res.status == 200) {
        const putValue = [];
        for (let obj in res.data) {
          console.log('deos d=>', obj);
          putValue.push({
            departMentName: obj,
            superAdmin: res.data[obj].superAdmin,
            subAdmin: res.data[obj].subAdmin
          })
          console.log('putValue =>', putValue);
        }
        setSearchData(putValue)
        setFilteredData(putValue)

      }
    } catch (error) {
      console.log('handlePostDelete error =>', error)
    }
  }

  const handleSearchFocus = () => {
    setFilteredData(searchData)
  }

  const handleToggleChange = async (mode, val, menuId) => {
    // console.log('mode =>', mode);
    // console.log('val =>', val);
    // console.log('menuId =>', menuId);

    const current = { ...initialMainAccess }
    if (mode === 'AdministratorManagement') {
      if (menuId !== undefined) {
        current.administratorManagement.administratorMenuId = menuId
      }
      current.administratorManagement.isAdminToggleOn = val
    } else if (mode === 'userManagement') {
      if (menuId !== undefined) {
        current.userManagement.userMenuId = menuId
      }
      current.userManagement.isUserToggleOn = val
    } else if (mode === 'OperationManagement') {
      if (menuId !== undefined) {
        current.oprationManagement.oprationMenuId = menuId
      }
      current.oprationManagement.isOperationToggleOn = val
    } else if (mode === 'MeetingRoomReservationManagement') {
      if (menuId !== undefined) {
        current.reservationManagement.reservationMenuId = menuId
      }
      current.reservationManagement.isReservationToggleOn = val
    } else if (mode === 'CommunityManagement') {
      if (menuId !== undefined) {
        current.communityManagement.communityMenuId = menuId
      }
      current.communityManagement.isCommunityToggleOn = val
    } else if (mode === 'LiveManagement') {
      if (menuId !== undefined) {
        current.liveManagement.liveMenuId = menuId
      }
      current.liveManagement.isLiveToggleOn = val
    } else if (mode === 'RewardManagement') {
      if (menuId !== undefined) {
        current.rewardManagement.rewardMenuId = menuId
      }
      current.rewardManagement.isRewardToggleOn = val
    } else if (mode === 'support') {
      if (menuId !== undefined) {
        current.supportManagement.supportMenuId = menuId
      }
      current.supportManagement.isSupportToggleOn = val
    }
    setIntialMainAccess(current)
  };

  const handleCheckboxChange = async (mode, val, subMenuId) => {
    console.log('subMenuId =>', subMenuId);

    const current = { ...initialMainAccess }

    if (mode === 'AdministratorList') {
      if (subMenuId !== undefined) {
        current.administratorManagement.administratorListSubMenuId = subMenuId
      }
      current.administratorManagement.administratorList = val
    } else if (mode === 'MenuAcessPermission') {
      if (subMenuId !== undefined) {
        current.administratorManagement.menuAccessPermissionSubMenuId = subMenuId
      }
      current.administratorManagement.menuAccessPermission = val
    } else if (mode === 'User') {
      if (subMenuId !== undefined) {
        current.userManagement.userSubMenu = subMenuId
      }
      current.userManagement.user = val
    } else if (mode === 'UserInformationSettings') {
      if (subMenuId !== undefined) {
        current.userManagement.userInformationSubMenu = subMenuId
      }
      current.userManagement.userInformation = val
    } else if (mode === 'GreetingMessageManagement') {
      if (subMenuId !== undefined) {
        current.oprationManagement.greetingMessageSubMenuId = subMenuId
      }
      current.oprationManagement.greetingMessage = val
    } else if (mode === 'BannerManagement') {
      if (subMenuId !== undefined) {
        current.oprationManagement.bannerSubMenuId = subMenuId
      }
      current.oprationManagement.banner = val
    } else if (mode === 'HomeContentManagement') {
      if (subMenuId !== undefined) {
        current.oprationManagement.homeContentSubMenuId = subMenuId
      }
      current.oprationManagement.homeContent = val
    } else if (mode === 'PushNotificationManagement') {
      if (subMenuId !== undefined) {
        current.oprationManagement.pushNotificationSubMenuId = subMenuId
      }
      current.oprationManagement.pushNotification = val
    } else if (mode === 'meetingRoom') { // remain
      if (subMenuId !== undefined) {
        current.reservationManagement.meetingRoomSubMenuId = subMenuId
      }
      current.reservationManagement.meetingRoom = val
    } else if (mode === 'suppliesRental') { // remain
      if (subMenuId !== undefined) {
        current.reservationManagement.suppliesRentalSubMenuId = subMenuId
      }
      current.reservationManagement.suppliesRental = val
    } else if (mode === 'bookRental') { // remain
      if (subMenuId !== undefined) {
        current.reservationManagement.bookRentalSubMenuId = subMenuId
      }
      current.reservationManagement.bookRental = val
    } else if (mode === 'BoardManagement') {
      if (subMenuId !== undefined) {
        current.communityManagement.boardSubMenuId = subMenuId
      }
      current.communityManagement.boardManagement = val
    } else if (mode === 'BulletinBoard') {
      if (subMenuId !== undefined) {
        current.communityManagement.bulletinBoardSubMenuId = subMenuId
      }
      current.communityManagement.bulletinBoard = val
    } else if (mode === 'ClubBoard') {
      if (subMenuId !== undefined) {
        current.communityManagement.clubSubMenuId = subMenuId
      }
      current.communityManagement.clubManagement = val
    } else if (mode === 'WelfareBoard') {
      if (subMenuId !== undefined) {
        current.communityManagement.welfareSubMenuId = subMenuId
      }
      current.communityManagement.welfareManagement = val
    } else if (mode === 'LiveManagement') {
      if (subMenuId !== undefined) {
        current.liveManagement.allMenuSubMenuId = subMenuId
      }
      current.liveManagement.allMenu = val
    } else if (mode === 'RouletteEventManagement') {
      if (subMenuId !== undefined) {
        current.rewardManagement.rouletteSubMenuId = subMenuId
      }
      current.rewardManagement.roulette = val
    } else if (mode === 'LuckyDrawEventManagement') {
      if (subMenuId !== undefined) {
        current.rewardManagement.luckyDrawSubMenuId = subMenuId
      }
      current.rewardManagement.luckyDraw = val
    } else if (mode === 'RankingEventManagement') {
      if (subMenuId !== undefined) {
        current.rewardManagement.rankingSubMenuId = subMenuId
      }
      current.rewardManagement.ranking = val
    } else if (mode === 'PointManagement') {
      if (subMenuId !== undefined) {
        current.rewardManagement.pointSubMenuId = subMenuId
      }
      current.rewardManagement.point = val
    } else if (mode === 'faq') {
      if (subMenuId !== undefined) {
        current.supportManagement.faqSubMenuId = subMenuId
      }
      current.supportManagement.faq = val
    } else if (mode === 'support') {
      if (subMenuId !== undefined) {
        current.supportManagement.supportSubMenuId = subMenuId
      }
      current.supportManagement.support = val
    }

    setIntialMainAccess(current)
  }

  const handleAccess = async (roleId, groupId) => {
    try {
      setIdRole(roleId)
      setIdGroup(groupId)
      let url = API_ENDPOINT.menuAcessPermisionConfiguration + `?roleId=${roleId}&groupId=${groupId}`

      const response = await getApi(url)
      console.log('res =>', response);

      setSuperAdmin(response?.data?.superConfiguration !== undefined ? true : false)
      setSubAdmin(response?.data?.generalConfiguration !== undefined ? true : false)

      if (response.status == 200) {
        if (response?.data?.superConfiguration) {
          for (let data in response?.data?.superConfiguration) {
            let val = response?.data?.superConfiguration[data].isMenuPermission === 'no' ? false : true
            handleToggleChange(response?.data?.superConfiguration[data].menuUrl.split('/').join(""), val, response?.data?.superConfiguration[data].menuId)

            for (let item in response?.data?.superConfiguration[data]?.subMenu) {
              let val = response?.data?.superConfiguration[data]?.subMenu[item].isSubMenuPermission === 'no' ? false : true
              handleCheckboxChange(response?.data?.superConfiguration[data]?.subMenu[item].submenuUrl.split('/').join(""), val, response?.data?.superConfiguration[data]?.subMenu[item].submenuId)
            }
          }
        }

        for (let data in response?.data?.generalConfiguration) {
          let val = response?.data?.generalConfiguration[data].isMenuPermission === 'no' ? false : true
          handleToggleChange(response?.data?.generalConfiguration[data].menuUrl.split('/').join(""), val, response?.data?.generalConfiguration[data].menuId)

          for (let item in response?.data?.generalConfiguration[data]?.subMenu) {
            let val = response?.data?.generalConfiguration[data]?.subMenu[item].isSubMenuPermission === 'no' ? false : true
            handleCheckboxChange(response?.data?.generalConfiguration[data]?.subMenu[item].submenuUrl.split('/').join(""), val, response?.data?.generalConfiguration[data]?.subMenu[item].submenuId)
          }
        }
      }
    } catch (error) {
    }

  }


  const saveAdminAccess = async () => {
    setIsLoading(true)
    console.log('roleId check =>', idRole);
    console.log('groupId check =>', idGroup);

    const data = {
      roleId: idRole,
      groupId: idGroup,
      UserManagement: {
        menu: {
          menuId: initialMainAccess.userManagement.userMenuId,
          isPermission: initialMainAccess.userManagement.isUserToggleOn === true ? 1 : 0
        },
        submenu: [
          {
            submenuId: initialMainAccess.userManagement.userSubMenu,
            isPermission: initialMainAccess.userManagement.user === true ? 1 : 0
          },
          {
            submenuId: initialMainAccess.userManagement.userInformationSubMenu,
            isPermission: initialMainAccess.userManagement.userInformation === true ? 1 : 0
          }
        ]
      },
      OperationManagement: {
        menu: {
          menuId: initialMainAccess.oprationManagement.oprationMenuId,
          isPermission: initialMainAccess.oprationManagement.isOperationToggleOn
        },
        submenu: [
          {
            submenuId: initialMainAccess.oprationManagement.greetingMessageSubMenuId,
            isPermission: initialMainAccess.oprationManagement.greetingMessage
          },
          {
            submenuId: initialMainAccess.oprationManagement.bannerSubMenuId,
            isPermission: initialMainAccess.oprationManagement.banner
          },
          {
            submenuId: initialMainAccess.oprationManagement.homeContentSubMenuId,
            isPermission: initialMainAccess.oprationManagement.homeContent
          },
          {
            submenuId: initialMainAccess.oprationManagement.pushNotificationSubMenuId,
            isPermission: initialMainAccess.oprationManagement.greetingMessage
          },
        ]
      },
      ReservationManagement: {
        menu: {
          menuId: initialMainAccess.reservationManagement.reservationMenuId,
          isPermission: initialMainAccess.reservationManagement.isReservationToggleOn === true ? 1 : 0
        },
        submenu: [
          {
            submenuId: initialMainAccess.reservationManagement.meetingRoomSubMenuId,
            isPermission: initialMainAccess.reservationManagement.meetingRoom === true ? 1 : 0
          },
          {
            submenuId: initialMainAccess.reservationManagement.suppliesRentalSubMenuId,
            isPermission: initialMainAccess.reservationManagement.suppliesRental === true ? 1 : 0
          },
          {
            submenuId: initialMainAccess.reservationManagement.bookRentalSubMenuId,
            isPermission: initialMainAccess.reservationManagement.bookRental === true ? 1 : 0
          }
        ]
      },
      CommunityManagement: {
        menu: {
          menuId: initialMainAccess.communityManagement.communityMenuId,
          isPermission: initialMainAccess.communityManagement.isCommunityToggleOn === true ? 1 : 0
        },
        submenu: [
          {
            submenuId: initialMainAccess.communityManagement.boardSubMenuId,
            isPermission: initialMainAccess.communityManagement.boardManagement === true ? 1 : 0
          },
          {
            submenuId: initialMainAccess.communityManagement.bulletinBoardSubMenuId,
            isPermission: initialMainAccess.communityManagement.bulletinBoard === true ? 1 : 0
          },
          {
            submenuId: initialMainAccess.communityManagement.clubSubMenuId,
            isPermission: initialMainAccess.communityManagement.clubManagement === true ? 1 : 0
          },
          {
            submenuId: initialMainAccess.communityManagement.welfareSubMenuId,
            isPermission: initialMainAccess.communityManagement.welfareManagement === true ? 1 : 0
          }
        ]
      },
      LiveManagement: {
        menu: {
          menuId: initialMainAccess.liveManagement.liveMenuId,
          isPermission: initialMainAccess.liveManagement.isLiveToggleOn === true ? 1 : 0
        },
        submenu: [
          {
            submenuId: initialMainAccess.liveManagement.allMenuSubMenuId,
            isPermission: initialMainAccess.liveManagement.allMenu === true ? 1 : 0
          }
        ]
      },
      RewardManagement: {
        menu: {
          menuId: initialMainAccess.rewardManagement.rewardMenuId,
          isPermission: initialMainAccess.rewardManagement.isRewardToggleOn === true ? 1 : 0
        },
        submenu: [
          {
            submenuId: initialMainAccess.rewardManagement.rouletteSubMenuId,
            isPermission: initialMainAccess.rewardManagement.roulette === true ? 1 : 0
          },
          {
            submenuId: initialMainAccess.rewardManagement.luckyDrawSubMenuId,
            isPermission: initialMainAccess.rewardManagement.luckyDraw === true ? 1 : 0
          },
          {
            submenuId: initialMainAccess.rewardManagement.rankingSubMenuId,
            isPermission: initialMainAccess.rewardManagement.ranking === true ? 1 : 0
          },
          {
            submenuId: initialMainAccess.rewardManagement.pointSubMenuId,
            isPermission: initialMainAccess.rewardManagement.point === true ? 1 : 0
          }
        ]
      },
      SupportManagement: {
        menu: {
          menuId: initialMainAccess.supportManagement.supportMenuId,
          isPermission: initialMainAccess.supportManagement.isSupportToggleOn === true ? 1 : 0
        },
        submenu: [
          {
            submenuId: initialMainAccess.supportManagement.faqSubMenuId,
            isPermission: initialMainAccess.supportManagement.faq === true ? 1 : 0
          },
          {
            submenuId: initialMainAccess.supportManagement.supportSubMenuId,
            isPermission: initialMainAccess.supportManagement.support === true ? 1 : 0
          }
        ]
      }
    }

    if (superAdmin === true) {
      data['AdministratorManagement'] = {
        menu: {
          menuId: initialMainAccess.administratorManagement.administratorMenuId,
          isPermission: initialMainAccess.administratorManagement.isAdminToggleOn === true ? 1 : 0
        },
        submenu: [
          {
            submenuId: initialMainAccess.administratorManagement.administratorListSubMenuId,
            isPermission: initialMainAccess.administratorManagement.administratorList === true ? 1 : 0
          },
          {
            submenuId: initialMainAccess.administratorManagement.menuAccessPermissionSubMenuId,
            isPermission: initialMainAccess.administratorManagement.menuAccessPermission === true ? 1 : 0
          }
        ]
      }
    }

    console.log('test =>', data);

    const res = await putApi(API_ENDPOINT.updateAcessPermisionConfiguration, data)

    console.log('test new=>', res);
    if (res.status === 200) {
      setSubAdmin(false)
      setSuperAdmin(false)
      setIntialMainAccess(mainAccess)
      handleAdminSearchData()
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }



  }

  return (
    <div>
      {isLoading && <Loader />}

      <div>
        <div className='heading d-flex mb-4'>
          <h4>{multiLang?.MenuAccessPermission}</h4>
        </div>
        <div className='d-flex w-100'>
          <div className="col-md-4">
            <div className="d-flex justify-content-center gap-2 mt-3">
              <CCol className="w-100" >
                <CFormInput
                  type="text"
                  id="inputPassword2"
                  placeholder={multiLang?.search}
                  onFocus={handleSearchFocus}
                  onChange={handleSearchChange}
                />

              </CCol>
            </div>
            {searchData.length > 0 && (
              <ul className="p-2 sidebarMenuLink">
                <CAccordion activeItemKey={1}>
                  {filteredData.map((item) => (
                    <CAccordionItem key={item.id}>
                      <CAccordionHeader>{item.departMentName}</CAccordionHeader>
                      <CAccordionBody>
                        {item.superAdmin.length > 0 &&
                          <CAccordion>
                            <CAccordionItem>
                              <CAccordionHeader>{multiLang?.superAdmin}</CAccordionHeader>
                              <CAccordionBody>
                                {item.superAdmin.map((data) => (
                                  <p key={data.id} onClick={() => handleAccess(data.roleId, data.groupId)}>{data.username}</p>
                                ))}
                              </CAccordionBody>
                            </CAccordionItem>
                          </CAccordion>
                        }

                        {item.subAdmin.length > 0 &&
                          <CAccordion>
                            <CAccordionItem>
                              <CAccordionHeader>{multiLang?.subAdmin}</CAccordionHeader>
                              <CAccordionBody>
                                {item.subAdmin.map((data) => (
                                  <p key={data.id} onClick={() => handleAccess(data.roleId, data.groupId)} >{data.username}</p>
                                ))}
                              </CAccordionBody>
                            </CAccordionItem>
                          </CAccordion>
                        }


                      </CAccordionBody>
                    </CAccordionItem>


                  ))}
                </CAccordion>

              </ul>
            )}
          </div>


          <div className="col-md-8">
            {/* <h4>Super Admin Configuration</h4> */}
            <div className="p-3">
              {superAdmin === true &&
                <div className="card-body">
                  <div className="formWraper">
                    <div className="form-outline form-white d-flex">
                      <div className="formWrpLabel" style={{ minWidth: '170px' }}>
                        <label className="fw-bolder ">{multiLang?.administratorManagement}</label>
                        <CFormSwitch
                          className="mx-1 me-2 mt-1"
                          color="success"
                          shape="pill"
                          variant="opposite"
                          checked={initialMainAccess.administratorManagement.isAdminToggleOn}
                          onChange={() => handleToggleChange('AdministratorManagement', !initialMainAccess.administratorManagement.isAdminToggleOn)}
                        />
                      </div>
                      <div className={initialMainAccess.administratorManagement.isAdminToggleOn ? "formWrpInpt" : "disabled formWrpInpt"}>
                        <div className="d-flex formradiogroup gap-3 flex-wrap">
                          <CFormCheck
                            value={initialMainAccess.administratorManagement.administratorList}
                            defaultChecked={initialMainAccess.administratorManagement.administratorList}
                            onClick={(e) => handleCheckboxChange('AdministratorList', e.target.checked)}
                            id="administratorList"
                            label={multiLang?.administratorList}
                          />

                          <CFormCheck
                            value={initialMainAccess.administratorManagement.menuAccessPermission}
                            defaultChecked={initialMainAccess.administratorManagement.menuAccessPermission}
                            onClick={(e) => handleCheckboxChange('MenuAcessPermission', e.target.checked)}
                            id="menuAccessPermission"
                            label={multiLang?.MenuAccessPermission} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }

              {subAdmin === true &&
                <div>
                  <div className='mt-2 mb-2'>
                    <h5>{multiLang?.generalConfiguration}</h5>
                  </div>

                  <div className="card-body">
                    <div className="formWraper">
                      <div className="form-outline form-white d-flex">
                        <div className="formWrpLabel" style={{ minWidth: '170px' }}>
                          <label className="fw-bolder ">{multiLang?.userManagement}</label>
                          <CFormSwitch
                            className="mx-1 me-2 mt-1"
                            color="success"
                            shape="pill"
                            variant="opposite"
                            checked={initialMainAccess.userManagement.isUserToggleOn}
                            onChange={() => handleToggleChange('userManagement', !initialMainAccess.userManagement.isUserToggleOn)}
                          />
                        </div>
                        <div className={initialMainAccess.userManagement.isUserToggleOn ? "formWrpInpt" : "disabled formWrpInpt"}>
                          <div className="d-flex formradiogroup  gap-3">
                            <CFormCheck
                              value={initialMainAccess.userManagement.user}
                              defaultChecked={initialMainAccess.userManagement.user}
                              onClick={(e) => handleCheckboxChange('User', e.target.checked)}
                              id="user" label={multiLang?.user} />
                            <CFormCheck
                              value={initialMainAccess.userManagement.userInformation}
                              defaultChecked={initialMainAccess.userManagement.userInformation}
                              onClick={(e) => handleCheckboxChange('UserInformationSettings', e.target.checked)}
                              id="userInformation" label={multiLang?.userInformation} />
                          </div>
                        </div>
                      </div>

                      <div className="form-outline form-white d-flex">
                        <div className="formWrpLabel" style={{ minWidth: '170px' }}>
                          <label className="fw-bolder ">{multiLang?.operationManagement}</label>
                          <CFormSwitch
                            className="mx-1 me-2 mt-1"
                            color="success"
                            shape="pill"
                            variant="opposite"
                            checked={initialMainAccess.oprationManagement.isOperationToggleOn}
                            onChange={() => handleToggleChange('OperationManagement', !initialMainAccess.oprationManagement.isOperationToggleOn)}
                          />
                        </div>
                        <div className={initialMainAccess.oprationManagement.isOperationToggleOn ? "formWrpInpt" : "disabled formWrpInpt"} >
                          <div className="d-flex formradiogroup flex-wrap  ">
                            <CFormCheck className='w-50 pe-1 mt-2' id="greetingMessage"
                              value={initialMainAccess.oprationManagement.greetingMessage}
                              defaultChecked={initialMainAccess.oprationManagement.greetingMessage}
                              onClick={(e) => handleCheckboxChange('GreetingMessageManagement', e.target.checked)}
                              label={multiLang?.greetingMessage} />

                            <CFormCheck className='w-50 pe-1 mt-2' id="banner"
                              value={initialMainAccess.oprationManagement.banner}
                              defaultChecked={initialMainAccess.oprationManagement.banner}
                              onClick={(e) => handleCheckboxChange('BannerManagement', e.target.checked)}
                              label={multiLang?.banner} />

                            <CFormCheck className='w-50 pe-1 mt-2' id="homeContent"
                              value={initialMainAccess.oprationManagement.homeContent}
                              defaultChecked={initialMainAccess.oprationManagement.homeContent}
                              onClick={(e) => handleCheckboxChange('HomeContentManagement', e.target.checked)}
                              label={multiLang?.homeContent} />

                            <CFormCheck className='w-50 pe-1 mt-2' id="pushNotification"
                              value={initialMainAccess.oprationManagement.pushNotification}
                              defaultChecked={initialMainAccess.oprationManagement.pushNotification}
                              onClick={(e) => handleCheckboxChange('PushNotificationManagement', e.target.checked)}
                              label={multiLang?.pushNotification} />
                          </div>
                        </div>
                      </div>

                      <div className="form-outline form-white d-flex">
                        <div className="formWrpLabel" style={{ minWidth: '170px' }}>
                          <label className="fw-bolder ">{multiLang?.reservationManagement}</label>
                          <CFormSwitch
                            className="mx-1 me-2 mt-1"
                            color="success"
                            shape="pill"
                            variant="opposite"
                            checked={initialMainAccess.reservationManagement.isReservationToggleOn}
                            onChange={() => handleToggleChange('MeetingRoomReservationManagement', !initialMainAccess.reservationManagement.isReservationToggleOn)}
                          />
                        </div>
                        <div className={initialMainAccess.reservationManagement.isReservationToggleOn ? "formWrpInpt" : "disabled formWrpInpt"} >
                          <div className="d-flex formradiogroup flex-wrap">
                            <CFormCheck className='w-25 pe-1 mt-2' id="meetingRoom"
                              value={initialMainAccess.reservationManagement.meetingRoom}
                              defaultChecked={initialMainAccess.reservationManagement.meetingRoom}
                              onClick={(e) => handleCheckboxChange('meetingRoom', e.target.checked)}
                              label={multiLang?.meetingRoom} />

                            <CFormCheck className='w-25 pe-1 mt-2' id="suppliesRental"
                              value={initialMainAccess.reservationManagement.suppliesRental}
                              defaultChecked={initialMainAccess.reservationManagement.suppliesRental}
                              onClick={(e) => handleCheckboxChange('suppliesRental', e.target.checked)}
                              label={multiLang?.suppliesRental} />

                            <CFormCheck className='w-25 pe-1 mt-2' id="bookRental"
                              value={initialMainAccess.reservationManagement.bookRental}
                              defaultChecked={initialMainAccess.reservationManagement.bookRental}
                              onClick={(e) => handleCheckboxChange('bookRental', e.target.checked)}
                              label={multiLang?.bookRental} />
                          </div>
                        </div>
                      </div>

                      <div className="form-outline form-white d-flex">
                        <div className="formWrpLabel" style={{ minWidth: '170px' }}>
                          <label className="fw-bolder ">{multiLang?.communityManagement}</label>
                          <CFormSwitch
                            className="mx-1 me-2 mt-1"
                            color="success"
                            shape="pill"
                            variant="opposite"
                            checked={initialMainAccess.communityManagement.isCommunityToggleOn}
                            onChange={() => handleToggleChange('CommunityManagement', !initialMainAccess.communityManagement.isCommunityToggleOn)}
                          />
                        </div>
                        <div className={initialMainAccess.communityManagement.isCommunityToggleOn ? "formWrpInpt" : "disabled formWrpInpt"} >
                          <div className="d-flex formradiogroup flex-wrap">
                            <CFormCheck className='w-50 pe-1 mt-2' id="boardManagement"
                              value={initialMainAccess.communityManagement.boardManagement}
                              defaultChecked={initialMainAccess.communityManagement.boardManagement}
                              onClick={(e) => handleCheckboxChange('BoardManagement', e.target.checked)}
                              label={multiLang?.boardManagement} />

                            <CFormCheck className='w-50 pe-1 mt-2' id="bulletinBoard"
                              value={initialMainAccess.communityManagement.bulletinBoard}
                              defaultChecked={initialMainAccess.communityManagement.bulletinBoard}
                              onClick={(e) => handleCheckboxChange('BulletinBoard', e.target.checked)}
                              label={multiLang?.bulletinBoard} />

                            <CFormCheck className='w-50 pe-1 mt-2' id="clubManagement"
                              value={initialMainAccess.communityManagement.clubManagement}
                              defaultChecked={initialMainAccess.communityManagement.clubManagement}
                              onClick={(e) => handleCheckboxChange('ClubBoard', e.target.checked)}
                              label={multiLang?.clubManagement} />

                            <CFormCheck className='w-50 pe-1 mt-2' id="welfareManagement"
                              value={initialMainAccess.communityManagement.welfareManagement}
                              defaultChecked={initialMainAccess.communityManagement.welfareManagement}
                              onClick={(e) => handleCheckboxChange('WelfareBoard', e.target.checked)}
                              label={multiLang?.welfareManagement} />
                          </div>
                        </div>
                      </div>

                      <div className="form-outline form-white d-flex">
                        <div className="formWrpLabel" style={{ minWidth: '170px' }}>
                          <label className="fw-bolder ">{multiLang?.liveManagement}</label>
                          <CFormSwitch
                            className="mx-1 me-2 mt-1"
                            color="success"
                            shape="pill"
                            variant="opposite"
                            checked={initialMainAccess.liveManagement.isLiveToggleOn}
                            onChange={() => handleToggleChange('LiveManagement', !initialMainAccess.liveManagement.isLiveToggleOn)}
                          />
                        </div>
                        <div className={initialMainAccess.liveManagement.isLiveToggleOn ? "formWrpInpt" : "disabled formWrpInpt"} >
                          <div className="d-flex formradiogroup  gap-3">
                            <CFormCheck id="allMenu"
                              value={initialMainAccess.liveManagement.allMenu}
                              defaultChecked={initialMainAccess.liveManagement.allMenu}
                              onClick={(e) => handleCheckboxChange('LiveManagement', e.target.checked)}
                              label={multiLang?.allMenu} />
                          </div>
                        </div>
                      </div>

                      <div className="form-outline form-white d-flex">
                        <div className="formWrpLabel" style={{ minWidth: '170px' }}>
                          <label className="fw-bolder ">{multiLang?.rewardManagement}</label>
                          <CFormSwitch
                            className="mx-1 me-2 mt-1"
                            color="success"
                            shape="pill"
                            variant="opposite"
                            checked={initialMainAccess.rewardManagement.isRewardToggleOn}
                            onChange={() => handleToggleChange('RewardManagement', !initialMainAccess.rewardManagement.isRewardToggleOn)}
                          />
                        </div>
                        <div className={initialMainAccess.rewardManagement.isRewardToggleOn ? "formWrpInpt" : "disabled formWrpInpt"}>
                          <div className="d-flex formradiogroup flex-wrap">
                            <CFormCheck className='w-50 pe-1 mt-2' id="roulette"
                              value={initialMainAccess.rewardManagement.roulette}
                              defaultChecked={initialMainAccess.rewardManagement.roulette}
                              onClick={(e) => handleCheckboxChange('RouletteEventManagement', e.target.checked)}
                              label={multiLang?.roulette} />

                            <CFormCheck className='w-50 pe-1 mt-2' id="luckyDraw"
                              value={initialMainAccess.rewardManagement.luckyDraw}
                              defaultChecked={initialMainAccess.rewardManagement.luckyDraw}
                              onClick={(e) => handleCheckboxChange('LuckyDrawEventManagement', e.target.checked)}
                              label={multiLang?.luckyDraw} />

                            <CFormCheck className='w-50 pe-1 mt-2' id="ranking"
                              value={initialMainAccess.rewardManagement.ranking}
                              defaultChecked={initialMainAccess.rewardManagement.ranking}
                              onClick={(e) => handleCheckboxChange('RankingEventManagement', e.target.checked)}
                              label={multiLang?.ranking} />

                            <CFormCheck className='w-50 pe-1 mt-2' id="point"
                              value={initialMainAccess.rewardManagement.point}
                              defaultChecked={initialMainAccess.rewardManagement.point}
                              onClick={(e) => handleCheckboxChange('PointManagement', e.target.checked)}
                              label={multiLang?.point} />
                          </div>
                        </div>
                      </div>

                      <div className="form-outline form-white d-flex">
                        <div className="formWrpLabel" style={{ minWidth: '170px' }}>
                          <label className="fw-bolder ">{multiLang?.supportManagement}</label>
                          <CFormSwitch
                            className="mx-1 me-2 mt-1"
                            color="success"
                            shape="pill"
                            variant="opposite"
                            checked={initialMainAccess.supportManagement.isSupportToggleOn}
                            onChange={() => handleToggleChange('support', !initialMainAccess.supportManagement.isSupportToggleOn)}
                          />
                        </div>
                        <div className={initialMainAccess.supportManagement.isSupportToggleOn ? "formWrpInpt" : "disabled formWrpInpt"} >
                          <div className="d-flex formradiogroup  gap-3">
                            <CFormCheck id="faq"
                              value={initialMainAccess.supportManagement.faq}
                              defaultChecked={initialMainAccess.supportManagement.faq}
                              onClick={(e) => handleCheckboxChange('faq', e.target.checked)}
                              label={multiLang?.faq} />

                            <CFormCheck id="support"
                              value={initialMainAccess.supportManagement.support}
                              defaultChecked={initialMainAccess.supportManagement.support}
                              onClick={(e) => handleCheckboxChange('support', e.target.checked)}
                              label={multiLang?.support} />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className='d-flex align-items-center gap-3 my-3'>
                    <CButton onClick={() => saveAdminAccess()}>{multiLang?.save}</CButton>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuAccessPermission

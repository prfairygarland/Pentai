import React from 'react'
import Changepass from './views/pages/login/ChangePassword'
import UserList from './views/pages/userManagement/userList'
import BoardManagement from './views/pages/communityManagement/BoardManagement'
import CreatePost from './views/pages/communityManagement/CreatePost'
import UserInformationSettings from './views/pages/userManagement/userInformationSettings'
import UserDetails from './views/pages/userManagement/userDetails'
import BulletinBoardPostDetails from './views/pages/communityManagement/BulletinBoardPostDetails'
import ClubBoardPostDetails from './views/pages/communityManagement/ClubBoardPostDetails'
import BoardPostListing from './views/pages/communityManagement/BoardPostListing'
import WelfareBoardPostListing from './views/pages/communityManagement/WelfareBoardPostListing'
import ClubBoardListing from './views/pages/communityManagement/ClubBoardListing'
import ClubDetails from './views/pages/communityManagement/ClubDetails'
import CommunityReportHistory from './views/pages/communityManagement/CommunityReportHistory'
import BookRentalStatus from './views/pages/BookRentalManagement/BookRentalStatus'
import AllBook from './views/pages/BookRentalManagement/AllBook'
import BookCuration from './views/pages/BookRentalManagement/BookCuration'
import BookRentalBanner from './views/pages/BookRentalManagement/BookRentalBanner'
import SupplyRentalStatus from './views/pages/supplyRentalManagement/supplyRentalStatus'
import AllSupplies from './views/pages/supplyRentalManagement/allSupplies'
import LiveManagement from './views/pages/LiveManagement/LiveManagement'
import LiveRegistration from './views/pages/LiveManagement/Component/LiveRegistration'
import MeetingRoomsReservationStatus from './views/pages/MeetingRoomsResMgmt/MeetingRoomsReservationStatus'
import AllMeetingRooms from './views/pages/MeetingRoomsResMgmt/AllMeetingRooms'
import RouletteeventManagementListing from './views/pages/RewardManagement/RouletteeventManagementListing'
import DataImport from './views/pages/BookRentalManagement/DataImport'
import GreetingMessageManagement from './views/pages/operationManagement/GreetingMessageManagement'
import BannerManagement from './views/pages/operationManagement/BannerManagement'
import HomeContentManagement from './views/pages/operationManagement/HomeContentManagement'
import PushNotificationManagement from './views/pages/operationManagement/PushNotificationManagement'
import CreatePushNotificationRegistration from './views/pages/operationManagement/Component/CreatePushNotificationRegistration'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  // Login Module
  { path: '/changepassword', name: 'Change Password', element: Changepass },

  // User Management Module
  { path: '/User', name: 'User List', element: UserList },
  { path: '/UserInformation', name: 'User Information Settings', element: UserInformationSettings },
  { path: '/User/UserDetails', name: 'User Details', element: UserDetails },

  //{ community management}
  { path: '/BoardManagement', name: 'Board Management', element: BoardManagement },
  { path: '/BulletinBoard', name: 'Bulletin Board Management', element: BoardPostListing },
  { path: '/BulletinBoardPostDetails/:id/:boardId', name: 'Bulletin post details ', element: BulletinBoardPostDetails },
  { path: '/BulletinBoard/createPost', name: 'Create A Post', element: CreatePost },
  { path: '/BulletinBoard/CommunityReportHistory', name: 'Community Report History', element: CommunityReportHistory },

  { path: '/BulletinBoard/updatePost', name: 'Update A Post', element: CreatePost },
  { path: '/WelfareBoard', name: 'Welfare Board Management', element: WelfareBoardPostListing },
  { path: '/WelfareBoard/createPost', name: 'Create A Post', element: CreatePost },
  { path: '/WelfareBoard/updatePost', name: 'Update A Post', element: CreatePost },
  { path: '/WelfareBoard/CommunityReportHistory', name: 'Community Report History', element: CommunityReportHistory },
  { path: '/ClubBoard', name: 'Club Board Management', element: ClubBoardListing },
  { path: '/ClubBoard/ClubDetails', name: 'Clud Details', element: ClubDetails },
  { path: '/ClubBoard/CommunityReportHistory', name: 'Community Report History', element: CommunityReportHistory },
  { path: '/ClubBoard/ClubBoardPostDetails', name: 'Club post details ', element: ClubBoardPostDetails },

  //{ Book Rental Management}
  { path: '/BookRentalStatus', name: 'Book Rental Status', element: BookRentalStatus },
  { path: '/AllBooks', name: 'All Books', element: AllBook },
  { path: '/BookCuration', name: 'Book Curation', element: BookCuration },
  { path: '/BookBanner', name: 'Book Rental Banner', element: BookRentalBanner },
  { path: '/DataImport', name: 'Data Import', element: DataImport },

  // { Supply Rental Management}
  { path: '/SupplyRentalStatus', name: 'Supply Rental Status', element: SupplyRentalStatus },
  { path: '/AllSupplies', name: 'All Supplies', element: AllSupplies },


  //{ Live Management}
  { path: '/LiveManagement', name: 'Live Management', element: LiveManagement },
  { path: '/LiveManagement/LiveRegistration', name: 'Live Registration', element: LiveRegistration },


  //Meeting Rooms Reservation Management
  { path: '/AllMeetingRooms', name: 'All Meeting Rooms', element: AllMeetingRooms },
  { path: '/MeetingRoomReservationStatus', name: 'Meeting Room Reservation Status', element: MeetingRoomsReservationStatus },


  //{ Reward Management}
  { path: '/RouletteEventManagement', name: 'Roulette event Management', element: RouletteeventManagementListing },


  // Operation Management
  { path: '/GreetingMessageManagement', name: 'Greeting Message Management', element: GreetingMessageManagement },
  { path: '/BannerManagement', name: 'Banner Management', element: BannerManagement },
  { path: '/HomeContentManagement', name: 'Home Content Management', element: HomeContentManagement },
  { path: '/PushNotificationManagement', name: 'Push Notification Management', element: PushNotificationManagement },
  { path: '/PushNotificationManagement/createPushNotificationRegistration', name: 'Push Notification Registration', element: CreatePushNotificationRegistration }

]

export default routes;

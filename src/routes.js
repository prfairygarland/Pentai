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
  { path: '/ClubBoard/ClubBoardPostDetails', name: 'Bulletin post details ', element: ClubBoardPostDetails },

  //{ Book Rental Management}
  { path: '/BookRentalStatus', name: 'Book Rental Status', element: BookRentalStatus },
]

export default routes;

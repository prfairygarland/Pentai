import React from 'react'
import Changepass from './views/pages/login/ChangePassword'
import UserList from './views/pages/userManagement/userList'
import BoardManagement from './views/pages/communityManagement/BoardManagement'
import CreatePost from './views/pages/communityManagement/CreatePost'
import UserInformationSettings from './views/pages/userManagement/userInformationSettings'
import UserDetails from './views/pages/userManagement/userDetails'
import BulletinBoardPostDetails from './views/pages/communityManagement/BulletinBoardPostDetails'
import BoardPostListing from './views/pages/communityManagement/BoardPostListing'
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

    //{ Book Rental Management}
    { path: '/BookRentalStatus', name: 'Book Rental Status', element: BookRentalStatus },
]

export default routes;

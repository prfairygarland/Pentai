export let ALL_CONSTANTS = {

  IS_PRODUCTION: false,
  BASE_URL: "https://ptkapi.experiencecommerce.com",       // API URL staging
  API_URL: "https://ptkapi.experiencecommerce.com",    // API URL staging
  // API_URL: "http://192.168.10.46:3000/",    // API URL staging

  // IS_PRODUCTION: true,
  // BASE_URL: "",       // API URL Live
  // API_URL: "",    // API URL Live

  // IS_PRODUCTION: false,
  // BASE_URL: "http://192.168.9.175:3000",       // Local
  // API_URL: "http://192.168.9.175:3000",    // Local
}


export let API_ENDPOINT = {
  login_api: ALL_CONSTANTS.API_URL + "/api/adminPanel/adminLogin",
  change_password_api: ALL_CONSTANTS.API_URL + "/api/adminPanel/adminChangePassword",
  getcompanies_api: ALL_CONSTANTS.API_URL + "/api/adminPanel/getCompanies",
  getdivision_api: ALL_CONSTANTS.API_URL + "/api/adminPanel/getDivision",
  getgroup_api: ALL_CONSTANTS.API_URL + "/api/adminPanel/getGroup",
  getteam_api: ALL_CONSTANTS.API_URL + "/api/adminPanel/getTeam",
  userlist_api: ALL_CONSTANTS.API_URL + "/api/adminPanel/userList",
  userlistexport: ALL_CONSTANTS.API_URL + "/api/adminPanel/userListExport",
  userdetails: ALL_CONSTANTS.API_URL + "/api/adminPanel/userDetails",
  // {Community Mangagement} //
  get_board_usage_setting: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getUsageStatus",
  get_prohabited_words: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getProhibitedWords",
  get_boards: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/boardList",
  get_categories: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/categoryList",
  get_bulletinboard_posts: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/bulletinBoardManagement",
  get_welfare_board_posts: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/welfareBoardManagement",
  get_club_board: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/clubBoardSearch",
  get_club_posts: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/clubPostSearch",
  get_boarddata_byID: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getBoardId",
  get_categorydata_byID: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getCategoryId",
  get_postuserdetail : ALL_CONSTANTS.API_URL + "/api/adminPanel/community/userDetailsBulletin",
  create_post_bulletin: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/createPostBulletin",
  create_post_welfare: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/createPostWelfare",
  
  update_post_bulletin: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/updateBulletin",
  update_post_welfare: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/updateWelfare",


  bulletin_board_details: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/postDetailsBulletin",
  welfare_board_details: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/postDetailsWelfare",


  bulletin_post_like_list: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/postlikeList",
  bulletin_post_comment_details: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/commentDetails",
  bulletin_post_report_history: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/reportHistoryComments",
  bulletin_post_delete_reasons: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/deleteReason",
  bulletin_post_delete: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/deletePost",
  bulletin_post_add_comment: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/addComments",
  bulletin_post_cancel: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/adminReportComments",
  bulletin_post_poll_participant: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/pollsParticipants",
  bulletin_post_poll_participant_option: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getPollOptions",
  bulletin_post_poll_participant_option_data: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getPollOptionsData",
  bulletin_post_recurit_participant: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/postRecuritmentParticipants",
  bulletin_post_recurit_draw_winners: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/drawWinners",
  bulletin_post_recurit_delete_participant: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/deleteParticipants",
  bulletin_post_recurit_cancel: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/cancelRecruitments",
  bulletin_post_confirm_participant: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/confirmParticipants",
  bulletin_post_winnerList: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/winnerList",
  bulletin_post_comment_edit: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/editComments",
  bulletin_board_post_history: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/postReportList",
  bulletin_board_post_comment_history: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/postCommentsList",
  bulletin_board_post_adminPostCancel: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/adminPostCancel",
  bulletin_search: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/searchBulletinBoards",
  add_bulletin_board: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/addBoards",
  update_bulletin_board: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/updateBoardDetails",
  delete_bulletin_board: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/deleteBoards",

  welfare_search: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/searchWelfareBoards",
  add_welfare_board: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/addWelfare",
  update_welfare_board: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/updateWelfareDetails",
  delete_welfare_board: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/deleteWelfare",

  hide_show_club_change: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/clubDisplay",
  delete_selected_clubs: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/deleteClub",
  get_club_history: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/clubHistory",
  get_club_details: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/clubDetails",  
  get_club_post_details: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/postDetailsClub",
  club_post_delete: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/deletePostClub",





  //{ BookRental Management}
  get_book_list: ALL_CONSTANTS.API_URL + "/admin/bookRental/list",
  get_genre_list: ALL_CONSTANTS.API_URL + "/admin/bookRental/genre/list",
  get_userdetails: ALL_CONSTANTS.API_URL + "/admin/bookRental/userDetail",
  get_rentaldetails: ALL_CONSTANTS.API_URL + "/admin/bookRental/rentalDetail",
  get_rentalhistory: ALL_CONSTANTS.API_URL + "/admin/bookRental/rentalHistory",
  get_all_book: ALL_CONSTANTS.API_URL + "/admin/bookRental/allBook",
  delete_book: ALL_CONSTANTS.API_URL + "/admin/bookRental/deleteBook",
  book_listexport: ALL_CONSTANTS.API_URL + "/admin/bookRental/export",
  searchGoogleBook: ALL_CONSTANTS.API_URL + "/admin/bookRental/searchGoogleBook",












}

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
  update_board_usage_setting: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/UpdateUsageStatus",
  get_prohabited_words: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getProhibitedWords",
  add_prohabited_words: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/addProhibitedWords",
  delete_all_prohabited_words: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/deleteProhibitedWords",

  get_club_registration_periods: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getClubRegistrationPeriods",
  get_search_club_registration_periods: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/searchClubRegistrationPeriod",
  get_club_activity_list: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getClubActivitiesByRegistrationPeriod",
  create_club_registration_period: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/createClubRegistrationPeriod",
  update_club_registration_period: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/updateClubRegistrationPeriod",

  create_club_banner: ALL_CONSTANTS.API_URL + "/admin/community/club/createBanner",
  get_club_banners: ALL_CONSTANTS.API_URL + "/admin/community/club/bannerList",
  


  get_boards: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/boardList",
  get_categories: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/categoryList",
  get_bulletinboard_posts: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/bulletinBoardManagement",
  get_welfare_board_posts: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/welfareBoardManagement",
  get_club_board: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/clubBoardSearch",
  get_club_posts: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/clubPostSearch",
  get_boarddata_byID: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getBoardId",
  get_categorydata_byID: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getCategoryId",
  get_postuserdetail: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/userDetailsBulletin",
  create_post_bulletin: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/createPostBulletin",
  create_post_welfare: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/createPostWelfare",

  update_post_bulletin: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/updateBulletin",
  update_post_welfare: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/updateWelfare",


  bulletin_board_details: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/postDetailsBulletin",
  welfare_board_details: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/postDetailsWelfare",


  bulletin_post_like_list: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/postlikeList",
  get_points_settings: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getPointSettings",
  update_points_settings: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/updatePointSettings",

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





  //{ Supply Rental Management}

  get_supply_list: ALL_CONSTANTS.API_URL + "/admin/supplies/list",
  get_supply_category_list: ALL_CONSTANTS.API_URL + "/admin/supplies/mainCategoryList",
  get_supply_userdetails: ALL_CONSTANTS.API_URL + "/admin/bookRental/userDetail",
  get_supply_rentaldetails: ALL_CONSTANTS.API_URL + "/admin/supplies/rentalDetail",
  get_supply_rental_history: ALL_CONSTANTS.API_URL + "/admin/supplies/rentalHistory",
  get_supply_confirm: ALL_CONSTANTS.API_URL + "/admin/supplies/rental/requestConfirm",
  get_supply_export: ALL_CONSTANTS.API_URL + "/admin/supplies/listExport",
  get_supply_rental_history_export: ALL_CONSTANTS.API_URL + "/admin/supplies/historyExport",
  get_main_category_list: ALL_CONSTANTS.API_URL + "/admin/supplies/mainCategoryList",
  get_category_list: ALL_CONSTANTS.API_URL + "/admin/supplies/categoryList",
  get_sub_category_list: ALL_CONSTANTS.API_URL + "/admin/supplies/subCategoryList",
  get_model_list: ALL_CONSTANTS.API_URL + "/admin/supplies/modelList",
  get_item_list: ALL_CONSTANTS.API_URL + "/admin/supplies/supplyItemList",
  get_all_supplies: ALL_CONSTANTS.API_URL + "/admin/supplies/allSupplies",
  get_all_supplies_export: ALL_CONSTANTS.API_URL + "/admin/supplies/allSupplyExport",
  del_supply_type: ALL_CONSTANTS.API_URL + "/admin/supplies/deleteSupplyType",
  add_supply_type: ALL_CONSTANTS.API_URL + "/admin/supplies/createSupplyType",
  get_supply_type_details: ALL_CONSTANTS.API_URL + "/admin/supplies/mainCategoryDetail",
  update_supply_type: ALL_CONSTANTS.API_URL + "/admin/supplies/updateSupplyType",
  delete_supply_type: ALL_CONSTANTS.API_URL + "/admin/supplies/deleteSupplyType",
  add_categoriy: ALL_CONSTANTS.API_URL + "/admin/supplies/createCategory",
  update_categoriy: ALL_CONSTANTS.API_URL + "/admin/supplies/updateCategory",
  get_category_details: ALL_CONSTANTS.API_URL + "/admin/supplies/categoryDetail",
  delete_category: ALL_CONSTANTS.API_URL + "/admin/supplies/deleteCategory",
  add_sub_category: ALL_CONSTANTS.API_URL + "/admin/supplies/createSubCategory",
  get_sub_category_details: ALL_CONSTANTS.API_URL + "/admin/supplies/subCategoryDetail",
  update_sub_categoriy: ALL_CONSTANTS.API_URL + "/admin/supplies/updateSubCategory",
  delete_sub_category: ALL_CONSTANTS.API_URL + "/admin/supplies/deleteSubCategory",
  add_modal: ALL_CONSTANTS.API_URL + "/admin/supplies/createSupplyModel",
  update_modal: ALL_CONSTANTS.API_URL + "/admin/supplies/modelUpdate",
  get_modal_details: ALL_CONSTANTS.API_URL + "/admin/supplies/modelDetail",
  delete_modal: ALL_CONSTANTS.API_URL + "/admin/supplies/deleteModel",
  add_item: ALL_CONSTANTS.API_URL + "/admin/supplies/createSupplyItem",
  get_item_details: ALL_CONSTANTS.API_URL + "/admin/supplies/supplyItemDetail",
  update_item: ALL_CONSTANTS.API_URL + "/admin/supplies/updateSupplyItem",
  upload_image: ALL_CONSTANTS.API_URL + "/admin/bookRental/imageUpload",
  delete_item: ALL_CONSTANTS.API_URL + "/admin/supplies/deleteSupplyItem",



























}

export let ALL_CONSTANTS = {

  IS_PRODUCTION: false,
  BASE_URL: "https://ptkapi.experiencecommerce.com",       // API URL staging
  API_URL: "https://ptkapi.experiencecommerce.com",    // API URL staging

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
  update_club_banner: ALL_CONSTANTS.API_URL + "/admin/community/club/updateBanner",
  delete_club_banner: ALL_CONSTANTS.API_URL + "/admin/community/club/deleteBanner",
  get_club_banner_details: ALL_CONSTANTS.API_URL + "/admin/community/club/bannerDetail",
  get_boards: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/boardList",
  get_categories: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/categoryList",
  get_bulletinboard_posts: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/bulletinBoardManagement",
  get_welfare_board_posts: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/welfareBoardManagement",
  get_club_board: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/clubBoardSearch",
  get_club_posts: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/clubPostSearch",
  get_boarddata_byID: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getBoardId",
  get_categorydata_byID: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getCategoryId",
  get_postuserdetail: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/userDetailsBulletin",
  get_board_list: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/boardList",
  create_post_bulletin: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/createPostBulletin",

  create_post_welfare: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/createPostWelfare",

  update_post_bulletin: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/updateBulletin",
  update_post_welfare: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/updateWelfare",

  // create_post_bulletin: "http://192.168.9.175:3000/api/adminPanel/community/createPostBulletin",
  // update_post_bulletin: "http://192.168.9.175:3000/api/adminPanel/community/updateBulletin",

  bulletin_board_details: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/postDetailsBulletin",
  welfare_board_details: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/postDetailsWelfare",
  // bulletin_board_details: "http://192.168.9.175:3000/api/adminPanel/community/postDetailsBulletin",


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
  categoryList: ALL_CONSTANTS.API_URL + "/admin/bookRental/categoryList",
  subCategoryList: ALL_CONSTANTS.API_URL + "/admin/bookRental/subCategoryList",
  createBook: ALL_CONSTANTS.API_URL + "/admin/bookRental/createBook",
  uploadImages: ALL_CONSTANTS.API_URL + "/admin/bookRental/imageUpload",
  create_genre: ALL_CONSTANTS.API_URL + "/admin/bookRental/genreCreate",
  All_Bookexport: ALL_CONSTANTS.API_URL + "/admin/bookRental/allBookExport",
  bookexport_RentalHistory: ALL_CONSTANTS.API_URL + "/admin/bookRental/historyExport",
  get_GenreDetails: ALL_CONSTANTS.API_URL + "/admin/bookRental/getGenreDetail",
  update_Genre: ALL_CONSTANTS.API_URL + "/admin/bookRental/updateGenre",
  getAll_genreList: ALL_CONSTANTS.API_URL + "/admin/bookRental/genre/list",
  get_bookListByGenre: ALL_CONSTANTS.API_URL + "/admin/bookRental/getBookList",
  get_ALLBooksDetails: ALL_CONSTANTS.API_URL + "/admin/bookRental/allBookDetail",
  get_bookListItem: ALL_CONSTANTS.API_URL + "/admin/bookRental/bookItemList",
  get_bookDetailItem: ALL_CONSTANTS.API_URL + "/admin/bookRental/bookItemDetail",
  update_bookListItem: ALL_CONSTANTS.API_URL + "/admin/bookRental/updateBookItem",
  create_bookListItem: ALL_CONSTANTS.API_URL + "/admin/bookRental/createBookItem",
  delete_bookItem: ALL_CONSTANTS.API_URL + "/admin/bookRental/deleteBookItem",
  Edit_book: ALL_CONSTANTS.API_URL + "/admin/bookRental/updateBook",
  VisibilityHide: ALL_CONSTANTS.API_URL + "/admin/bookRental/visibilityHideShow",
  delete_genre: ALL_CONSTANTS.API_URL + "/admin/bookRental/deleteGenre",
  create_categories: ALL_CONSTANTS.API_URL + "/admin/bookRental/createCategories",
  delete_category: ALL_CONSTANTS.API_URL + "/admin/bookRental/deleteCategory",
  get_libraryList: ALL_CONSTANTS.API_URL + "/admin/bookRental/libraryList",
  get_libraryDetails: ALL_CONSTANTS.API_URL + "/admin/bookRental/libraryDetail",
  update_libraries: ALL_CONSTANTS.API_URL + "/admin/bookRental/updateLibraries",
  getbook_bySubCategory: ALL_CONSTANTS.API_URL + "/admin/bookRental/bookListByCategory",
  create_subCategories: ALL_CONSTANTS.API_URL + "/admin/bookRental/createSubCategories",
  delete_subCategories: ALL_CONSTANTS.API_URL + "/admin/bookRental/deleteSubCategory",
  get_subCategoryDetails: ALL_CONSTANTS.API_URL + "/admin/bookRental/subCategoryDetail",
  update_Subcategory: ALL_CONSTANTS.API_URL + "/admin/bookRental/updateSubCategory",
  get_categoryDetails: ALL_CONSTANTS.API_URL + "/admin/bookRental/categoryDetail",
  update_category: ALL_CONSTANTS.API_URL + "/admin/bookRental/updateCategory",
  get_bannerList: ALL_CONSTANTS.API_URL + "/admin/bookRental/bannerList",
  get_bannerDetails: ALL_CONSTANTS.API_URL + "/admin/bookRental/bannerDetail",
  get_banner_CategoryDetail: ALL_CONSTANTS.API_URL + "/admin/bookRental/bannerCategoryDetail",
  delete_banner: ALL_CONSTANTS.API_URL + "/admin/bookRental/deleteBanner",
  create_banner: ALL_CONSTANTS.API_URL + "/admin/bookRental/createBanner",
  update_bannerDetails: ALL_CONSTANTS.API_URL + "/admin/bookRental/updateBanner",
  update_bannerCategory: ALL_CONSTANTS.API_URL + "/admin/bookRental/updateBannerCategory",



  //{ Meeting Room Management}

  meeting_lists: ALL_CONSTANTS.API_URL + "/admin/meeting/allReservations",
  building_lists: ALL_CONSTANTS.API_URL + "/admin/meeting/building/list",
  floor_lists: ALL_CONSTANTS.API_URL + "/admin/meeting/floor/list",
  room_lists: ALL_CONSTANTS.API_URL + "/admin/meeting/roomList",
  meeting_details: ALL_CONSTANTS.API_URL + "/admin/meeting/meetingDetail",
  user_details: ALL_CONSTANTS.API_URL + "/admin/meeting/userDetail",
  reservation_details: ALL_CONSTANTS.API_URL + "/admin/meeting/reservationDetail",
  get_all_meeting_rooms: ALL_CONSTANTS.API_URL + "/admin/meeting/roomList",
  get_all_meeting_rooms_records: ALL_CONSTANTS.API_URL + "/admin/meeting/allMeetingRoom",
  get_all_meeting_rooms_export: ALL_CONSTANTS.API_URL + "/admin/meeting/allExport",

  create_meeting_building: ALL_CONSTANTS.API_URL + "/admin/meeting/building/create",
  get_meeting_building_details: ALL_CONSTANTS.API_URL + "/admin/meeting/buildingDetail",
  update_meeting_building: ALL_CONSTANTS.API_URL + "/admin/meeting/buildingUpdate",
  delete_meeting_building: ALL_CONSTANTS.API_URL + "/admin/meeting/deleteBuilding",

  create_meeting_floor: ALL_CONSTANTS.API_URL + "/admin/meeting/floor/create",
  get_meeting_floor_details: ALL_CONSTANTS.API_URL + "/admin/meeting/floorDetail",
  update_meeting_floor: ALL_CONSTANTS.API_URL + "/admin/meeting/floorUpdate",
  delete_meeting_floor: ALL_CONSTANTS.API_URL + "/admin/meeting/deleteFloor",

  create_meeting_room: ALL_CONSTANTS.API_URL + "/admin/meeting/room/create",
  update_meeting_room: ALL_CONSTANTS.API_URL + "/admin/meeting/roomUpdate",
  get_meeting_room_details: ALL_CONSTANTS.API_URL + "/admin/meeting/roomDetail",
  get_equipments_from_building_id: ALL_CONSTANTS.API_URL + "/admin/meeting/getEquipmentsFromBuildingId",
  delete_meeting_room: ALL_CONSTANTS.API_URL + "/admin/meeting/deleteRoom",

  get_all_equipments: ALL_CONSTANTS.API_URL + "/admin/meeting/equipment/list",
  add_new_equipment: ALL_CONSTANTS.API_URL + "/admin/meeting/equipment/create",



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
  supply_delete_category: ALL_CONSTANTS.API_URL + "/admin/supplies/deleteCategory",
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



  // Live Management

  getLiveStreams: ALL_CONSTANTS.API_URL + "/api/admin/lounge/getLiveStreams",
  createLiveStream: ALL_CONSTANTS.API_URL + "/api/admin/lounge/createLiveStream",
  getStreamDetails: ALL_CONSTANTS.API_URL + "/api/admin/lounge/getStreamDetails",
  addQuizQuestion: ALL_CONSTANTS.API_URL + "/api/admin/lounge/quizQuestion/add",
  updateQuizInfo: ALL_CONSTANTS.API_URL + "/api/admin/lounge/updateQuizInfo",
  startQuizQuestion: ALL_CONSTANTS.API_URL + "/api/admin/lounge/quizQuestion/start",
  endQuizQuestion: ALL_CONSTANTS.API_URL + "/api/admin/lounge/quizQuestion/end",
  sendAdminChatText: ALL_CONSTANTS.API_URL + "/api/lounge/sendMessages",
  uploadImageChoiceImage : ALL_CONSTANTS.API_URL + "api/uploadImage",
  getChatToken: ALL_CONSTANTS.API_URL + "/api/lounge/createChatToken",
  editLiveStream: ALL_CONSTANTS.API_URL + "/api/admin/lounge/updateLiveStream",
  editQuizQuestion: ALL_CONSTANTS.API_URL + "/api/admin/lounge/quizQuestion/edit",
  deleteQuizQuestion : ALL_CONSTANTS.API_URL + "/api/admin/lounge/quizQuestion/delete",
  startLiveStream: ALL_CONSTANTS.API_URL + "/api/admin/lounge/startStream",
  endLiveStream: ALL_CONSTANTS.API_URL + "/api/admin/lounge/endStream",


  //Operation Management
  get_GreetingMessages: ALL_CONSTANTS.API_URL + "/api/admin/Operation/greetingMessage",
  create_GreetingMessages: ALL_CONSTANTS.API_URL + "/api/admin/Operation/addGreeting",
  delete_GreetingMessages: ALL_CONSTANTS.API_URL + "/api/admin/Operation/deleteGreeting",
  get_OperationMangementBannerLis : ALL_CONSTANTS.API_URL + "/api/admin/Operation/getBannerList",
  get_OperationMangementAutoSlide: ALL_CONSTANTS.API_URL + "/api/admin/Operation/autoSlideBanner",
  update_OperationManagementAutoSlide: ALL_CONSTANTS.API_URL + "/api/admin/Operation/updateAutoSlide",
  delete_OperationManagementBanner: ALL_CONSTANTS.API_URL + "/api/admin/Operation/deleteBanner",
  create_OperationManagementBanner: ALL_CONSTANTS.API_URL + "/api/admin/Operation/createBanner",
  update_OperationManagementBanner: ALL_CONSTANTS.API_URL + "/api/admin/Operation/updateBanner"












}

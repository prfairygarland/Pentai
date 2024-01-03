export let ALL_CONSTANTS = {

  // IS_PRODUCTION: false,
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
  get_prohabited_words: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getProhibitedWords",
  get_boards: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/boardList",
  get_bulletinboard_posts: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/bulletinBoardManagement",
  get_boarddata_byID: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/getBoardId",
  get_postuserdetail : ALL_CONSTANTS.API_URL + "/api/adminPanel/community/userDetailsBulletin",
  get_board_list: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/boardList",
  create_post_bulletin: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/createPostBulletin",
  bulletin_board_details: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/postDetailsBulletin",
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















}

export let ALL_CONSTANTS = {

  IS_PRODUCTION: false,
  BASE_URL: "https://ptkapi.experiencecommerce.com",       // API URL staging
  API_URL: "https://ptkapi.experiencecommerce.com",    // API URL staging

  // IS_PRODUCTION: true,
  // BASE_URL: "",       // API URL Live
  // API_URL: "",    // API URL Live
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
  get_board_list: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/boardList",
  create_post_bulletin: ALL_CONSTANTS.API_URL + "/api/adminPanel/community/createPostBulletin",





}

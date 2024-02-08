const initialState = {
  sidebarShow: true
  }
  
 export const sideBarState = (state = initialState, { type, payload }) => {
    switch (type) {
      case 'setsidebar':
        return { ...state, sidebarShow: payload }
        case 'setsidebarunfolded':
          return { ...state, sidebarUnfoldable : payload }
      default:
        return state
    }
  }
const setSidebar = (payload) => {
    return {
        type: 'setsidebar',
        payload : payload
    }
}

const setSidebarUnfolded = (payload) => {
    return {
        type: 'setsidebarunfolded',
        payload : payload
    }
}

export {
    setSidebar,
    setSidebarUnfolded
}
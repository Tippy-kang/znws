const app = {
  state: {
    userInfo:{},
    visitedViews: [
      {
        name: "首页",
        path: "/index",
      }
    ],//标签
    menuStatus: false,//右键
    maxTableHeight: window.innerHeight,
    maxTableWidth:window.innerWidth
  },
  // 计算属性
  getters: {},
  // 声明函数
  mutations: {
    SET_USER_INFO: (state, status) => {
      state.userInfo = status
    },
    // ==========标签========
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return;
      state.visitedViews.push({
        name: view.name,
        path: view.path,
      })

      sessionStorage.setItem('tagsViews',JSON.stringify(state.visitedViews))
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1);
          break
        }
      }

      sessionStorage.setItem('tagsViews',JSON.stringify(state.visitedViews))
    },
    CLOSE_ALL_VISITED: (state, view) => {
      state.visitedViews.splice(view + 1, state.visitedViews.length);
      state.visitedViews.splice(1, view-1);
      sessionStorage.setItem('tagsViews',JSON.stringify(state.visitedViews))
    },
    CLOSE_LEFT_VISITED: (state, view) => {
      state.visitedViews.splice(1, view-1);
      sessionStorage.setItem('tagsViews',JSON.stringify(state.visitedViews))
    },
    CLOSE_RIGHT_VISITED: (state, view) => {
      state.visitedViews.splice(view + 1, state.visitedViews.length);
      sessionStorage.setItem('tagsViews',JSON.stringify(state.visitedViews))
    },
    //================右键==================
    CLOSE_MENU: (state) => {
      state.menuStatus = false;
    },
    OPEN_MENU: (state) => {
      state.menuStatus = true;
    },
    //页面高度计算
    HEIGHT_CAL(state, view) {
      state.maxTableHeight = view
    },
  },
  // 代理执行
  actions: {
    setUserInfo({commit}, view){
      commit('SET_USER_INFO', view);
    },
    // ==========标签========
    addVisitedViews({commit}, view) {
      commit('ADD_VISITED_VIEWS', view);
    },
    delVisitedViews({commit, state}, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view);
        resolve([...state.visitedViews])
      })
    },
    //==========页面高度计算========
     height_cal(state, view) {
      commit('HEIGHT_CAL', view);
    },
    // 右键关闭标签
    closeALLVisited({commit}, view) {
      commit('CLOSE_ALL_VISITED', view);
    },
    closeLeftVisited({commit}, view) {
      commit('CLOSE_LEFT_VISITED', view);
    },
    closeRightVisited({commit}, view) {
      commit('CLOSE_RIGHT_VISITED', view);
    },
    // ================右键=================
    closeMenu({commit}) {
      commit('CLOSE_MENU');
    },
    openMenu({commit}) {
      commit('OPEN_MENU');
    },
  }
};
export default app

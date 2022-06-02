// Application Data
const ASYNC_STATES = {
  LOADING: 0,
  DATA: 1,
  ERROR: 2,
};

const globalState = {
  userList: {
    loading: false,
    data: null,
    error: null,
  },
  selectedUser: null,
  commentList: {
    loading: false,
    data: null,
    error: null,
  },
  commentSubmit: {
    loading: false,
    data: null,
    error: null,
  },
};
const getStateUpdaterByStateType = (stateType) => (action) => {
  const { type, payload } = action;
  switch (type) {
    // Consider removing the Loading state, it's not used after all.
    case ASYNC_STATES.LOADING:
      globalState[stateType].loading = true;
      break;
    case ASYNC_STATES.DATA:
      globalState[stateType].data = payload;
      globalState[stateType].error = null;
      break;
    case ASYNC_STATES.ERROR:
      globalState[stateType].data = null;
      globalState[stateType].error = payload;
  }
};

export { ASYNC_STATES, globalState, getStateUpdaterByStateType };

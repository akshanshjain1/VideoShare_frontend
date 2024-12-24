import { combineReducers } from "redux";

import togglereducer from "./toggleSlice.jsx";
import userreducer from "./userSlice.jsx";
import authenticationreducer from "./authenticationSlice.jsx";

const rootReducer = combineReducers({
  toggle: togglereducer,
  user: userreducer,
  authentication: authenticationreducer,
});

export default rootReducer;

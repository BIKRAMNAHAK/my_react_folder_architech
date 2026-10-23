import { combineReducers } from "redux";
import addReducer from "./AddReduces";
import productReducer from "./productReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  addvotisement: addReducer,
  products: productReducer,
  user: userReducer
});

export default rootReducer;
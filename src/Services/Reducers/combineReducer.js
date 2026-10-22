import { combineReducers } from "redux";
import addReducer from "./AddReduces";
import productReducer from "./productReducer";

const rootReducer = combineReducers({
    addvotisement : addReducer,
    products : productReducer,
})

export default rootReducer
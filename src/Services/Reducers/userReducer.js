const savedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem('eshop_user')) || null;
  } catch (e) {
    return null;
  }
})();

const savedAdmin = (() => {
  try {
    return JSON.parse(localStorage.getItem('eshop_admin')) || null;
  } catch (e) {
    return null;
  }
})();

const initialState = {
  user: savedUser,
  addresses: [],
  orders: [],
  allOrders: [],
  admin: savedAdmin,
  loading: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_USER_PROFILE_SUCCESS':
    case 'USER_LOGIN_SUCCESS': {
      const userData = action.payload.data;
      if (userData) {
        try {
          localStorage.setItem('eshop_user', JSON.stringify(userData));
        } catch (e) {}
        return {
          ...state,
          user: userData
        };
      }
      return state;
    }

    case 'USER_LOGOUT':
      try {
        localStorage.removeItem('eshop_user');
      } catch (e) {}
      return {
        ...state,
        user: null,
        addresses: []
      };

    case 'GET_ADDRESSES_SUCCESS':
      return {
        ...state,
        addresses: action.payload.data || []
      };

    case 'ADD_ADDRESS_SUCCESS':
      if (action.payload && action.payload.data) {
        return {
          ...state,
          addresses: [action.payload.data, ...state.addresses]
        };
      }
      return state;

    case 'GET_ALL_ORDERS_SUCCESS':
      return {
        ...state,
        allOrders: action.payload.data || []
      };

    case 'ADMIN_LOGIN_SUCCESS': {
      const adminData = action.payload.data;
      if (adminData) {
        try {
          localStorage.setItem('eshop_admin', JSON.stringify(adminData));
        } catch (e) {}
        return {
          ...state,
          admin: adminData
        };
      }
      return state;
    }

    case 'ADMIN_LOGOUT':
      try {
        localStorage.removeItem('eshop_admin');
      } catch (e) {}
      return {
        ...state,
        admin: null
      };

    default:
      return state;
  }
};

export default userReducer;

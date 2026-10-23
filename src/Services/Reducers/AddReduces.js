const initialState = {
  advertisements: [],
  currentAd: null,
  stats: {
    total_categories: 0,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0,
    total_ad_clicks: 0,
    total_ad_enquiries: 0
  },
  loading: false
};

const addReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ADVERTISEMENTS_SUCCESS':
      return {
        ...state,
        advertisements: action.payload.data || []
      };

    case 'GET_AD_BY_ID_SUCCESS':
      return {
        ...state,
        currentAd: action.payload.data || null
      };

    case 'CREATE_ADVERTISEMENT_SUCCESS':
      if (action.payload && action.payload.data) {
        return {
          ...state,
          advertisements: [action.payload.data, ...state.advertisements]
        };
      }
      return state;

    case 'ADMIN_STATS_SUCCESS':
      return {
        ...state,
        stats: action.payload.data || state.stats
      };

    default:
      return state;
  }
};

export default addReducer;
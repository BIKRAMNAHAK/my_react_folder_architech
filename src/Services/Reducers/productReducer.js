const savedCart = (() => {
  try {
    return JSON.parse(localStorage.getItem('eshop_cart')) || [];
  } catch (e) {
    return [];
  }
})();

const initialState = {
  categories: [],
  products: [],
  categoryProducts: [],
  currentProduct: null,
  cart: savedCart,
  loading: false,
  error: null
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_CATEGORIES_SUCCESS':
      return {
        ...state,
        categories: action.payload.data || []
      };

    case 'ADD_CATEGORY_SUCCESS':
      if (action.payload && action.payload.data) {
        return {
          ...state,
          categories: [...state.categories, action.payload.data]
        };
      }
      return state;

    case 'GET_PRODUCTS_SUCCESS':
      return {
        ...state,
        products: action.payload.data || []
      };

    case 'ADD_PRODUCT_SUCCESS':
      if (action.payload && action.payload.data) {
        return {
          ...state,
          products: [action.payload.data, ...state.products]
        };
      }
      return state;

    case 'GET_CATEGORY_PRODUCTS_SUCCESS':
      return {
        ...state,
        categoryProducts: action.payload.data || []
      };

    case 'GET_PRODUCT_DETAIL_SUCCESS':
      return {
        ...state,
        currentProduct: action.payload.data || null
      };

    case 'ADD_TO_CART': {
      const product = action.payload;
      const existingIndex = state.cart.findIndex((item) => item.product_id === product.product_id);
      let updatedCart;
      if (existingIndex > -1) {
        updatedCart = state.cart.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
        );
      } else {
        updatedCart = [...state.cart, { ...product, quantity: product.quantity || 1 }];
      }
      try {
        localStorage.setItem('eshop_cart', JSON.stringify(updatedCart));
      } catch (e) {}
      return {
        ...state,
        cart: updatedCart
      };
    }

    case 'UPDATE_CART_QTY': {
      const { product_id, quantity } = action.payload;
      const updatedCart = quantity <= 0
        ? state.cart.filter((item) => item.product_id !== product_id)
        : state.cart.map((item) => (item.product_id === product_id ? { ...item, quantity } : item));
      try {
        localStorage.setItem('eshop_cart', JSON.stringify(updatedCart));
      } catch (e) {}
      return {
        ...state,
        cart: updatedCart
      };
    }

    case 'CLEAR_CART':
      try {
        localStorage.removeItem('eshop_cart');
      } catch (e) {}
      return {
        ...state,
        cart: []
      };

    default:
      return state;
  }
};

export default productReducer;
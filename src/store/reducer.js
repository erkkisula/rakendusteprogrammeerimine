/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import {
    ITEMS_SUCCESS, ITEM_REMOVED, ITEM_ADDED, USER_SUCCESS, USER_UPDATE, TOKEN_UPDATE,
} from "./actions";

const initialState = {
    token: null,
    user: null,
    items: []
}

export const UserPropTypes = {
    email: PropTypes.string.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    cart: PropTypes.arrayOf(PropTypes.string).isRequired
};



export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case TOKEN_UPDATE:
            return {
                ...state,
                token: action.payload,
            }
        case USER_UPDATE:
            return {
                ...state,
                user: action.payload,
            }
        case USER_SUCCESS: {
            return {
                ...state,
                ...action.payload,
            }
        }
        case ITEMS_SUCCESS: {
            return {
                ...state,
                items: action.payload,
            };
        }
        case ITEM_ADDED: {
            return {
                ...state,
                user: addItemToUserCart(state.user, action.payload)
            };
        }
        case ITEM_REMOVED: {
            return {
                ...state,
                user: removeItemFromCart(state.user, action.payload)
            };
        }
        default: {
            return state;
        }
    }
};

const addItemToUserCart = (user, itemId) => {
    return {
        ...user,
        cart: user.cart.concat([itemId])
    }
}

const removeItemFromCart = (user, itemId) => {
    const foundItemIndex = user.cart.findIndex(cartId => cartId === itemId);
    if (foundItemIndex === -1) return user;
    const cartCopy = user.cart.slice();
    cartCopy.splice(foundItemIndex, 1);
    return {
        ...user,
        cart: cartCopy
    };
};

const removeItemById = (items, _id) => {
    const index = items.findIndex(item => item._id === _id);
    if (index === -1) return items;
    const copy = items.slice();
    copy.splice(index, 1);
    return copy;
};
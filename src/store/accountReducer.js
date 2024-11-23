import { ACCOUNT_INITIALISE } from './actions';

const accountReducer = (state, action) => {
    switch (action.type) {
        case ACCOUNT_INITIALISE: {
            const { menuItem } = action.payload;
            return {
                ...state,
                isInitialised: true,
                menuItem,
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;

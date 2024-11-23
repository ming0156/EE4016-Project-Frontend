import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { createContext, useEffect, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loader from '../component/Loader/Loader';
import accountReducer from '../store/accountReducer';
import { ACCOUNT_INITIALISE, LOGIN, LOGOUT, SNACKBAR_ERROR } from '../store/actions';
import API from '../api';
import { useTranslation } from 'react-i18next';

const initialState = {
    //isLoggedIn: false,
    isInitialised: false,
    //user: null,
};

// const verifyToken = (serviceToken) => {
//     if (!serviceToken) {
//         return false;
//     }

//     const decoded = jwtDecode(serviceToken);
//     return decoded.exp > Date.now() / 1000;
// };

const setSession = (serviceToken, refreshToken, preferLang) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        localStorage.setItem('refreshToken', refreshToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('serviceToken');
        localStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

const JWTContext = createContext({
    ...initialState,
    // login: () => Promise.resolve(),
    // logout: () => { },
});


export const JWTProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);
    const dispatchSB = useDispatch();
    const { t, i18n } = useTranslation();

    // const login = async (name, password) => {
    //     const response = await API.Staff.login(name, password);
    //     const { token, refreshToken, data } = response.data;
    //     setSession(token, refreshToken);
    //     const user = data
    //     const menuResponse = await API.MenuItem.get_all();
    //     const menuItem = menuResponse.data;
    //     dispatch({
    //         type: LOGIN,
    //         payload: {
    //             user,
    //             menuItem
    //         },
    //     });
    // };

    // const tokenExpired = () => {
    //     const refreshToken = window.localStorage.getItem('refreshToken');
    //     if (refreshToken) API.Staff.revoke_token(refreshToken);
    //     dispatch({
    //         type: ACCOUNT_INITIALISE,
    //         payload: {
    //             isLoggedIn: false,
    //             user: null,
    //             menuItem: null
    //         },
    //     });
    // };

    // const logout = () => {
    //     const refreshToken = window.localStorage.getItem('refreshToken');
    //     API.Staff.revoke_token(refreshToken);
    //     setSession(null);
    //     dispatch({ type: LOGOUT });
    // };

    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = window.localStorage.getItem('serviceToken');
                const refreshToken = window.localStorage.getItem('refreshToken');
                const preferLang = window.localStorage.getItem('preferLang');

                if (preferLang) {
                    i18n.changeLanguage(preferLang);
                } else {
                    localStorage.setItem('preferLang', "en");
                }

                setSession(serviceToken, refreshToken);
                const menuResponse = await API.MenuItem.get_all();
                const menuItem = menuResponse.data;

                dispatch({
                    type: ACCOUNT_INITIALISE,
                    payload: {
                        menuItem
                    },
                });
            } catch (err) {
                //tokenExpired();
            }

            // axios.interceptors.response.use(
            //     response => response,
            //     error => {
            //         if (error.response) {
            //             if (error.response.config.url.split('/').splice(-1)[0] === 'login') {
            //                 dispatchSB({ ...SNACKBAR_ERROR, message: t('Snackbar.InvalidLogin') });
            //                 return error.response;
            //             } else if (error.response.status === 401 || error.response.data.error === 'jwt expired') {
            //                 dispatchSB({ ...SNACKBAR_ERROR, message: t('Snackbar.SessionExpired') });
            //                 tokenExpired();
            //                 return error.response;
            //             }
            //         }

            //         throw error;
            //     }
            // );
        };

        init();
    }, []);

    if (!state.isInitialised) {
        return <Loader />;
    }

    // return <JWTContext.Provider value={{ ...state, login, logout }}>{children}</JWTContext.Provider>;
    return <JWTContext.Provider value={{ ...state }}>{children}</JWTContext.Provider>;
};

export default JWTContext;

import axios from "axios";
import {showNotification} from "@mantine/notifications";
import {IconX} from "@tabler/icons-react";
import React from "react";

// Secondary Axios instance
const Api = axios.create({

    baseURL: import.meta.env.VITE_BASE_URL_V1,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
})

Api.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

Api.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if( error.response && [401, 403].includes(error.response.status))
            console.error("UnA")
        if( error.response && [500].includes(error.response.status))
            showNotification({
                title: 'Error',
                message: error.response.data.MESSAGE,
                color: 'red',
                // icon: <IconX />,
            })
        if( error.response && [400].includes(error.response.status))
            // showNotification({
            //     title: 'Client Error',
            //     message: error.response.data.MESSAGE,
            //     color: 'red',
            //     // icon: <IconX />,
            // })
            console.log("Client Error", error.response.data.MESSAGE)
        if (!window.navigator.onLine && !error.response && error.message === 'Network Error') {
            showNotification({
                title: 'Connection Failed',
                message: "No Internet Connection. Please try again later.",
                color: 'yellow',
            })
        }
        return Promise.reject(error.response?.data.MESSAGE || error.response?.data || "Something Went Wrong");

    }
);


export default Api;
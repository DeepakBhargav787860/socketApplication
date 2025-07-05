import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {Provider} from 'react-redux'
import store from './context/store'
import '../src/assets/styles/mrq.css';
import '../src/assets/styles/common.css';
import App from './App'
import {CookiesProvider} from "react-cookie";
import disableDevtool from "disable-devtool";
import { disableReactDevTools } from '@fvilers/disable-react-devtools';


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: 0,
        },

    },

})

 const logout = () => async () => {


     localStorage.setItem('Though of the day','सफलता भी उसी की तरफ़दार होती है मेहनतें जिसकी वफादार होती है।')
        window.location.href = '/4o4😉😉😉😉😉😉😉😉😉😉4o4😉😉😉😉😉😉😉😉😉😉';


}


//Disable Browser Tool
disableDevtool(
    {url: import.meta.env.VITE_BASE_URL_V2,
        disableSelect: false,
        ondevtoolopen:logout(),
        ignore: () => {return import.meta.env.DEV; //PROD
    }});


//Disable React Dev tool
if (import.meta.env.MODE === 'production') {
    disableReactDevTools(); //development or production
}


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <CookiesProvider >
                <App/>
            </CookiesProvider>
        </Provider>
    </QueryClientProvider>

    // </React.StrictMode>
)

import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider,responsiveFontSizes } from '@mui/material/styles';
import { getInitialTheme } from './utils/theme';
import ExportsContextProvider from './components/ExportsContext';
import App from './App.jsx';
import './index.css';
import {lightTheme, darkTheme} from './themes';
import 'mapbox-gl/dist/mapbox-gl.css';
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import '@fontsource/source-sans-pro/300.css';
import '@fontsource/source-sans-pro/400.css';
import '@fontsource/source-sans-pro/600.css';
import '@fontsource/source-sans-pro/700.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";


let currentTheme = getInitialTheme() === 'dark' ? darkTheme : lightTheme;
currentTheme = responsiveFontSizes(currentTheme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={currentTheme}>
      <ToastContainer 
        theme={currentTheme.palette.mode}
        closeButton={true}
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
        <ExportsContextProvider>
            <App />
        </ExportsContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

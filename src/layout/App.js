import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import jssPreset from '@mui/styles/jssPreset';
import StylesProvider from '@mui/styles/StylesProvider';
import { create } from 'jss';
import rtl from 'jss-rtl';
import React from 'react';
import { useSelector } from 'react-redux';
import Snackbar from '../component/Snackbar';
import { GlobalProvider } from '../contexts/GlobalContext';
import { JWTProvider } from '../contexts/JWTContext';
import Routes from '../Routes';
import theme from './../themes';
import NavigationScroll from './NavigationScroll';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <React.Fragment>
        <NavigationScroll>
          <StylesProvider jss={jss}>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={theme(customization)}>
                <CssBaseline />
                <JWTProvider>
                  <GlobalProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Routes />
                      <Snackbar />
                    </LocalizationProvider>
                  </GlobalProvider>
                </JWTProvider>
              </ThemeProvider>
            </StyledEngineProvider>
          </StylesProvider>
        </NavigationScroll>
    </React.Fragment>
  );
};

export default App;

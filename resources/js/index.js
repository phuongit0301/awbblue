import { AppContainer } from 'react-hot-loader';
import React from "react";
import ReactDOM from "react-dom";
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

import App from './src/components/App';
import { persistor, store } from './src/store';
import { getAwb } from './src/actions/UploadAction';


const onBeforeLift = () => {
  // take some action before the gate lifts
  console.log('Before On Lift');
}

store.dispatch(getAwb());

const render = Component =>
    ReactDOM.render(
    	<Provider store={store}>
	    	<PersistGate
	        loading={<CircularProgress />}
	        onBeforeLift={onBeforeLift}
	        persistor={persistor}>
		        <AppContainer>
		            <Component />
		        </AppContainer>
	        </PersistGate>
        </Provider>,
        document.getElementById('app')
    );

render(App);

// Webpack Hot Module Replacement API
if (module.hot) module.hot.accept('./src/components/App', () => render(App));
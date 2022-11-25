import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from './modules/reducers';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

function createStore(initialState = {}) {
    const composeEnhancers =
        (process.env.NODE_ENV !== 'production' &&
            typeof window === 'object' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
        compose;

    const store = _createStore(reducers, initialState, composeEnhancers(applyMiddleware(thunk)));

    if (module.hot) {
        module.hot.accept('./modules/reducers', () => {
            store.replaceReducer(require('./modules/reducers'));
        });
    }

    return store;
}

export default createStore();

import React, { FC } from 'react';
import { Switch } from 'react-router';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'redux/store';

/* import { YMInitializer } from 'react-yandex-metrika'; */

import AppContainer from 'containers/App';

import 'static/styles/common.scss';

const App: FC = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route path='/' render={(props: any) => <AppContainer {...props} />} />
                </Switch>
                {/* <YMInitializer accounts={[52970623]} /> */}
            </BrowserRouter>
        </Provider>
    );
};

export default App;

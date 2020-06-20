// Node modules
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// Local modules
import Home from './pages/Home';
import Register from './pages/Register';
import Profile from './pages/Profile';

import CreateBook from './pages/CreateBook';
import UpdateBook from './pages/UpdateBook';
import UpdateProfile from './pages/UpdateProfile';

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route component={ Home } path='/' exact />
                <Route component={ Register } path='/register' />
                <Route component={ Profile } path='/profile' exact />

                <Route component={ CreateBook } path='/books/new' />
                <Route component={ UpdateBook } path='/books/edit' />
                <Route component={ UpdateProfile } path='/profile/edit' />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;
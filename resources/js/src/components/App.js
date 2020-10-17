import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './Home';
import NoMatch from './NoMatch';
import './App.scss';
import SuccessSnackbar from './SuccessSnackbar';

const App = (props) => {    
    return (
        <Router>
            <div className="fullHeight">
                <SuccessSnackbar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route component={NoMatch} />
                </Switch>
            </div>
        </Router>
    );
};

export default App;
import React, { Component } from 'react';
import {HashRouter as Router, Route, Switch, Link, hashHistory} from 'react-router-dom';
import NavCom from './components/nav/index';
import RouteList from './routes';

class App extends Component {
    render() {
        return (
            <Router hashHistory={hashHistory}>
                <div className="container">
                    
                    <NavCom />
                    
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <Switch>
                                {
                                    RouteList.map((e, i) => {
                                        return (
                                            <Route key={i} path={e.path} exact={e.exact} component={e.com} />
                                        )
                                    })
                                }
                            </Switch>
                        </div>
                    </div>
                    
                </div>
            </Router>
        );
    }
}

export default App;
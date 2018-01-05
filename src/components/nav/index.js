import React, { Component } from 'react';
import {Route, Link} from 'react-router-dom';
import RouteList from '../../routes';


class Nav extends Component {
    render() {
        return (
            <div className="navbar navbar-inverse">
                <ul className="nav navbar-nav">
                    {
                        RouteList.map((e, i) => {
                            let result = null;
                            if(e.showMenu){
                                result = <Route key={i} path={e.path} exact={e.exact} children= {({match}) => {
                                            let active = match ? 'active' : '';
                                            return (
                                                <li className={`link-menu ${active}`}>
                                                    <Link to={e.path}>{e.label}</Link>
                                                </li>
                                            )
                                        }}
                                    />
                            }
                            return result
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default Nav;
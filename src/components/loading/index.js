import React, { Component } from 'react';

class Loading extends Component {
    render() {
        return (
            <div className="loading"><span className="glyphicon glyphicon-refresh icon-spin"></span></div>
        );
    }
}

export default Loading;
import React, { Component } from 'react';

class ToolTip extends Component {
    render() {
        let className = this.props.type == 'finish' ? 'alert alert-success' : 'alert alert-danger';
        return (
            <div className={`form-alert ${className}`}>{this.props.txt}</div>
        );
    }
}

export default ToolTip;
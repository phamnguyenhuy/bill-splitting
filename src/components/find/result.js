import React, { Component, Fragment } from 'react';

class Result extends Component {
    render() {
        let list = this.props.result;
        return (
            <Fragment>
                <hr />
                <div className="form-group">
                    <label>Totals</label>
                    <div className="input-group">
                        <div className="input-group-addon">$</div>
                        <input type="number" name="total" className="form-control" placeholder="Total" defaultValue={list[0].total} disabled/>
                        <div className="input-group-addon">.00</div>
                    </div>
                </div>
                <div className="form-group">
                    <label>Persons</label>
                </div>
                <div className="form-group">
                    <ul className="list-group">
                        {
                            list[0].persons.map((e, i) => {
                                return (
                                    <li key={i} className="list-group-item">
                                        <p><strong>{e.name}</strong>&nbsp;&nbsp;<span className="badge">{e.price}</span></p>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <p>{list[0].description}</p>
                </div>
            </Fragment>
        );
    }
}

export default Result;
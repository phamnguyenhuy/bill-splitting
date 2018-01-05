import React, { Component } from 'react';
import axios from 'axios';
import * as CONSTANT from '../../constant/index';
import ResultCom from './result';
import LoadingCom from '../loading/index';


class FindBill extends Component {
    state={
        key: '',
        result: new Array(),
        load: false
    }
    handleChange = (e) => {
        let name = e.target.name,
            value = e.target.value;

        this.setState({
            [name]: value
        })
    }
    findBill = () => {
        let {key} = this.state;
        this.setState({
            load: true
        })
        if(key !== ''){
            axios.get(`${CONSTANT.apiUrl}`)
            .then(res => {
                let list = res.data,
                    arr = new Array();
                list.forEach((e, i) => {
                    if(e.billId == key){
                        arr.push(e);
                    }
                })
                this.setState({
                    result: arr,
                    load: false
                })
            })
            .catch(err => {
                console.log(err.toString() + '');
                this.setState({
                    load: false
                })
            })
        }
    }
    render() {
        return (
            <div className="bill-detail">
                {this.state.load ? <LoadingCom /> : ''}
                <div className="panel panel-warning">
                    <div className="panel-heading">
                        <h3 className="panel-title">Find a Bill</h3>
                    </div>
                    <div className="panel-body">
                        <p>Example: <strong>wBtr8</strong> , <strong>jMZRi</strong>, <strong>pmtC5</strong> ...</p>
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Search for..." name="key" value={this.state.key} onChange={this.handleChange}/>
                            <span className="input-group-btn">
                                <button className="btn btn-default" type="button" onClick={this.findBill}>Find</button>
                            </span>
                        </div>
                        {
                            this.state.result.length > 0 ? <ResultCom result={this.state.result} /> : <div><br/><p>No Result</p></div>
                        }
                    </div>
                </div>
            </div>
            
        );
    }
}

export default FindBill;
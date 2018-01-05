import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import * as CONSTANT from '../../constant/index';
import LoadingCom from '../loading/index';

class ListBill extends Component {
    state = {
        list: new Array(),
        listSearch : new Array(),
        load: true,
        keySearch : ''
    }
    componentDidMount(){
        axios.get(`${CONSTANT.apiUrl}`)
            .then(res => {
                this.setState({
                    list: res.data,
                    load: false
                })
            })
            .catch(err => {
                this.setState({
                    load: false
                })
            })
    }
    handleRemove = (id) => {
        this.setState({
            load: true
        })
        axios.delete(`${CONSTANT.apiUrl}/${id}`)
            .then(res => {
                let arr = this.state.list.filter((e, i) => e.id !== id);
                this.setState({
                    list: arr,
                    load: false
                })
            })
            .catch(err => {
                this.setState({
                    load: false
                })
            })
    }
    handleChange = (e) => {
        let target = e.target,
            name = target.name,
            value= target.value;
        this.setState({
            [name] : value
        })
    }
    handleSearch = () => {
        let txt = this.state.keySearch;
        if(txt.length > 3){
            let arr = this.state.list,
                result = [];
            arr.forEach((e, i) => {
                let temp = 0;
                e.persons.forEach((item, index) => {
                    let patt = new RegExp(txt, 'i'),
                        res = patt.test(item.name);
                    if(res && temp === 0){
                        temp++;
                        result.push(e);
                    }
                })
            })
            this.setState({
                listSearch: result
            })
        }
    }
    removeSearchResult = () => {
        this.setState({
            keySearch: '',
            listSearch : new Array()
        })
    }
    render() {
        let content = this.state.listSearch.length > 0 ? this.state.listSearch : this.state.list;
        return (
            <Fragment>
                {this.state.load ? <LoadingCom /> : ''}
                <div className="text-center"><h1>List Bills</h1></div>
                <hr />
                
                <div className="row">
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <div className="form-inline content-form-search">
                            <div className="form-group">
                                <div className="input-group form-search">
                                    <input type="text" className="form-control" placeholder="Search a persons ..." name="keySearch" onChange={this.handleChange} value={this.state.keySearch} />
                                    <span className="input-group-btn">
                                        <button type="button" className="btn btn-primary" onClick={this.handleSearch}><span className="glyphicon glyphicon-search"></span>&nbsp;Search</button>
                                    </span>
                                </div>
                            </div>
                            <button type="button" className="btn btn-warning" onClick={this.removeSearchResult}><span className="glyphicon glyphicon-remove"></span>&nbsp;Clear</button>
                        </div>
                        <br />
                        
                    </div>
                </div>
                
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Person(s)</th>
                            <th>Total</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            content.map((e, i) => {
                                return( 
                                    <tr key={i}>
                                        <td>{i+1}</td>
                                        <td>
                                            {
                                                e.persons.map((person, index) => {
                                                    return <span className="item-person" key={index}>
                                                            <strong>{person.name}</strong>
                                                            {index < e.persons.length - 1 ? ', ' : ''}
                                                        </span>
                                                })
                                            }
                                        </td>
                                        <td><strong>${e.total}</strong></td>
                                        <td>{e.description}</td>
                                        <td>
                                            <Link to={`/bill/${e.id}`} className="btn btn-success mr-20">
                                                <span className="glyphicon glyphicon-edit"></span>&nbsp;
                                                Edit
                                            </Link>
                                       
                                            <button type="button" className="btn btn-danger" onClick={()=> this.handleRemove(e.id)}>
                                                <span className="glyphicon glyphicon-remove"></span>&nbsp;
                                                Remove
                                            </button>
                                            
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </Fragment>
        );
    }
}

export default ListBill;
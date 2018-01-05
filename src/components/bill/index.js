import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import * as CONSTANT from '../../constant/index';
import LoadingCom from '../loading/index';
import TooltipCom from '../tooltip/index';

class BillDetail extends Component {
    state = {
        id: null,
        total: '',
        description: '',
        namePerson: '',
        persons: new Array(),
        tooltip: false,
        load: false,
        tooltipTxt : '',
        tooltipType : '',
        autoSplitting: false
    }
    componentDidMount(){
        let {match} = this.props;
        if(match){
            this.setState({
                id: match.params.id
            })
            axios.get(`${CONSTANT.apiUrl}/${match.params.id}`).then(res => {
                let {id, total, description, persons} = res.data
                this.setState({
                    id,
                    total,
                    description, 
                    persons
                })
            }).catch(err => {
                console.log(err.toString() + '');
            })
        }
    }
    addPerson = () => {
        if(this.state.namePerson !== ''){
            let {persons, autoSplitting, total} = this.state,
                price = 0;
            if(autoSplitting){
                price = this.countPrice(this.state.total, this.state.persons.length + 1);
                if(persons.length > 0){
                    persons.forEach((e, i) => {
                        e.price = price;
                    })
                }
            }else{
                if(persons.length > 0){
                    persons.forEach((e, i) => {
                        if(e.payAll) {
                            e.price = total;
                            price = 0;
                        }
                    })
                }
            }
            
            persons.push({
                name: this.state.namePerson,
                price,
                payAll: false
            });
            this.setState({
                persons,
                namePerson:''
            })
        }
    }
    countPrice = (price, no) => {
        let res = 0;
        if(price !== '') res = (price / no).toFixed(2);
        if(no === 0) res = price;
        return res;
    }
    removePerson = (id) => {
        let list = this.state.persons.filter((e, i) => i !== id);

        if(list.length > 0){
            if(this.state.autoSplitting){
                let price = this.countPrice(this.state.total, this.state.persons.length - 1);
                list.forEach((e, i) => {
                    e.price = price;
                    e.payAll = false;
                })
            }else{
                list.forEach((e, i) => {
                    if(e.payAll){
                        e.price = this.state.total;
                    }
                })
            }
        }
            
        this.setState({
            persons: list
        })
    }
    checkPayAll = (e) => {
        let {persons, total} = this.state,
            value = e.target.value;
        persons.forEach((person, index) => {
            if(index === parseInt(value)) {
                person.price = total ;
                person.payAll = true;
            }
            else {
                person.price = 0;
                person.payAll = false;
            }
        })
           
        this.setState({persons})
        
    }
    changePricePerson = (e, i) => {
        let value = e.target.value,
            {persons} = this.state;  
        persons.forEach((person , index) => {
            person.payAll = false;
            if(index === i){
                person.price = value;
            }
        })
        this.setState({
            persons
        })
    }
    changeSplitting = (e) => {
        let value = e.target.checked,
            price = 0,
            {persons, total} = this.state;
        if(value){
            price = this.countPrice(total, persons.length);
            persons.forEach((e, i) => {
                e.price = price;
                e.payAll = false;
            });
        }else{

        }
        this.setState({
            autoSplitting: value,
            persons
        })
    }
    handleChange = (e) => {
        let target = e.target,
            name = target.name,
            value= target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name] : value
        })
        if(target.name == 'total' && value != ''){
            let total = parseInt(value),
                {persons} = this.state,
                lengthPersons = persons.length,
                price = this.countPrice(total, lengthPersons);
            persons.forEach((e, i) => {
                e.price = price
            });
            this.setState({
                persons
            })
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let {total, description, persons} = this.state;
        let totalTemp = this.getTotal(this.state.persons);
        if(totalTemp != this.state.total){
            this.setState({
                tooltip: true,
                tooltipTxt : 'Please check money again',
                tooltipType : 'error',
                load: false
            })
            return;
        }
        this.setState({
            load: true
        })
        if(this.props.match){
            axios.put(`${CONSTANT.apiUrl}/${this.state.id}`, {
                total,description,persons
            }).then(res => {
                if(res.status === 200){
                    this.setState({
                        load: false,
                        tooltip: true,
                        tooltipTxt : 'Updated bill',
                        tooltipType : 'finish'
                    })
                }
            }).catch(err => {
                this.setState({
                    tooltip: true,
                    tooltipTxt: 'Cant upadte a bill . Please input required\'s field',
                    tooltipType: 'error',
                    load: false
                })
            })
        }else{
            if(this.state.persons.length > 0){
                axios.post(CONSTANT.apiUrl, {
                    total,description,persons,
                    billId : this.makeId()
                }).then(res => {
                    if(res.status === 201){
                       let {history} = this.props;
                       history.push('/list-bills');
                    }
                }).catch(err => {
                    this.setState({
                        tooltip: true,
                        tooltipTxt: 'Cant add a bill . Please input required\'s field',
                        tooltipType: 'error',
                        load: false
                    })
                })
            }else{
                this.setState({
                    tooltip: true,
                    tooltipTxt : 'Please add a person',
                    tooltipType : 'error',
                    load: false
                })
            }
        }
    }
    getTotal = (persons) => {
        let temp = 0;
        persons.forEach((person, index) => temp += parseFloat(person.price));
        return temp;
    }
    makeId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
    
        return text;
    }
    render() {
        return (
           <div className="bill-detail">
                {this.state.load ? <LoadingCom /> : ''}
                <Link to="/list-bills" className="btn btn-primary btn-back"><span className="glyphicon glyphicon-chevron-left"></span>&nbsp; Back to List</Link>
                <div className="panel panel-info">
                    <div className="panel-heading">
                            <h3 className="panel-title">{this.props.match ? 'Bill Detail' : 'Add a Bill'}</h3>
                    </div>
                    <div className="panel-body">
                        <form action="" method="POST" role="form" onSubmit={this.handleSubmit}>                            
                            <div className="form-group">
                                <label>Totals</label>
                                <div className="input-group">
                                    <div className="input-group-addon">$</div>
                                    <input type="number" name="total" className="form-control" placeholder="Total" onChange={this.handleChange} value={this.state.total} required/>
                                    <div className="input-group-addon">.00</div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Persons</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Name" name="namePerson" onChange={this.handleChange} value={this.state.namePerson}/>
                                    <span className="input-group-btn">
                                        <button className="btn btn-default" type="button" onClick={this.addPerson}>Add</button>
                                    </span>
                                </div>
                            </div>
                            <div className="form-group">
                                <ul className="list-group">
                                    {
                                        this.state.persons.map((e, i) => {
                                            return (
                                                <li key={i} className="list-group-item">
                                                    <p><strong>{e.name}</strong></p>
                                                    <div className="form-inline">
                                                        <div className="form-group mr-20">
                                                            {
                                                                this.state.autoSplitting ? 
                                                                    <span className="badge">{e.price}</span> : 
                                                                    <input type="number" placeholder="Money..." name={`price-${i}`} className="form-control" value={e.price} onChange={(e) => this.changePricePerson(e, i)}/>
                                                            }
                                                        </div>
                                                        {
                                                            this.state.autoSplitting ? 
                                                            '' : 
                                                            <div className="form-group">
                                                                <div className="radio">
                                                                    <label>
                                                                        <input type="radio" name="checkPayAll" checked={e.payAll} value={i} onChange={this.checkPayAll}/>&nbsp;&nbsp;&nbsp;Pay all
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                    <a onClick={() => this.removePerson(i)}><span className="glyphicon glyphicon-remove-sign"></span></a>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea name="description" id="description" className="form-control" rows="3" onChange={this.handleChange} value={this.state.description}></textarea>
                                
                            </div>
                            
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" checked={this.state.autoSplitting} name="autoSplitting" onChange={this.changeSplitting}/>
                                    Auto Splitting
                                </label>
                            </div>
                            
                            
                            
                            <button type="submit" className="btn btn-primary">
                                {this.props.match ? 'Update' : 'Add a Bill'}
                            </button>
                            &nbsp;&nbsp;
                            <Link to="/list-bills" className="btn btn-warning">Cancel</Link>
                            

                            {this.state.tooltip ? <TooltipCom type={this.state.tooltipType} txt={this.state.tooltipTxt}/> : ''}
                        </form>
                            
                    </div>
                </div>
           </div>
        );
    }
}

export default BillDetail;
import React from 'react';
import HomeCom from './components/homepage/index';
import ListBillCom from './components/list/index';
import BillDetailCom from './components/bill/index';
import FindBillCom from './components/find/index';


const routes =  [
    {
        label: 'Home',
        path: '/',
        exact: true,
        showMenu: true,
        com : () => <HomeCom />
    },
    {
        label: 'List Bills',
        path: '/list-bills',
        exact: false,
        showMenu: true,
        com : () => <ListBillCom />
    },
    {
        label: 'Bill Detail',
        path: '/bill/:id',
        exact: false,
        showMenu: false,
        com: ({match, history}) => <BillDetailCom history={history} match={match}/>
    },
    {
        label: 'Add a Bill',
        path: '/add-bill',
        exact: false,
        showMenu: true,
        com: ({history}) => <BillDetailCom history={history}/>
    },
    {
        label: 'Find a Bill',
        path: '/find',
        exact: false,
        showMenu: true,
        com: ({history}) => <FindBillCom history={history}/>
    }
];

export default routes;

import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import 'assets/scss/dashboard-generator.scss?v1.5.0';
import 'bootstrap/dist/css/bootstrap.css';

import AdminLayout from 'layouts/Admin.js';
import { RecoilRoot } from 'recoil';

ReactDOM.render(
    <RecoilRoot>
        <BrowserRouter>
            <Switch>
                <Route path='/admin' render={(props) => <AdminLayout {...props} />} />
                <Redirect to='/admin/dashboard' />
            </Switch>
        </BrowserRouter>
    </RecoilRoot>,
    document.getElementById('root')
);

import './App.css';
import { HashRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router';
import HomePage from './home/HomePage';
import CreateQueuePage from './createQueue/CreateQueuePage';
import API, { ApiContext } from './util/api';
import Dashboard from './dashboard/Dashboard';
import UserPage from './user/UserPage';

const url = 'https://virtualqueuebackend.herokuapp.com';

function App() {
  const api = new API(url);
  return (
    <ApiContext.Provider value={api}>
      <HashRouter>
        <Switch>
          <Route path='/queue/:qid'>
            <UserPage/>
          </Route>
          <Route path='/admin/dashboard/:qid'>
            <Dashboard/>
          </Route>
          <Route path='/admin/create'>
            <CreateQueuePage/>
          </Route>
          <Route path='/'>
            <HomePage/>
          </Route>
        </Switch>
      </HashRouter>
    </ApiContext.Provider>
  );
}

export default App;

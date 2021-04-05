import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import SettingsComponent from './components/preferences/preferences';
import Login from './components/login/login';
import SplashScreen from './components/login/splashScreen';
import Stats from './components/stats/stats';

const App2 = () => (
  <HashRouter>
    <div className="App">
      <Switch>
        <Route exact path="/" component={SplashScreen} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/stats" component={Stats} />
        <Route exact path="/preferences" component={SettingsComponent} />
      </Switch>
    </div>
  </HashRouter>
);

ReactDOM.render(<App2 />, document.getElementById('root'));

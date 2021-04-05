import React, { useState, useEffect } from 'react';
import { remote, ipcRenderer, shell } from 'electron';
import TimeCampAPI from '../../services/TimeCampAPI';
import { useHistory } from "react-router-dom";

const appName = remote.app.getName();

function Login() {
  const [apiToken, setApiToken] = useState('');

  const history = useHistory();

  function handleClick(e: any) {
    e.preventDefault();

    if (apiToken === '') {
      // eslint-disable-next-line no-alert
      alert('Please provide TimeCamp API Token. You can find it in your TimeCamp profile settings.');
      return;
    }

    const timecampAPI = new TimeCampAPI(apiToken);

    const fetchUserEmail = async () => {
      const response = await timecampAPI.checkAPIToken();
      if (response) {
        ipcRenderer.send('apiToken-changed', apiToken);
        history.push('/stats');
      } else {
        alert('Provided token is not valid. You can find your TimeCamp API token in profile settings.');
      }
    };
    fetchUserEmail();
  }

  function handleChange(event: any) {
    setApiToken(event.target.value);
  }

  return (
    <div>
      <div className="dragabble" />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-9 text-center">
            <div className="welcome login">
              <h1 className="text-center">Connect to TimeCamp</h1>
              <h5>
                {appName} uses TimeCamp to get the data about work hours.
              </h5>
              <div className="input-group mb-3">
                <input type="text" value={apiToken} onChange={handleChange} className="form-control" placeholder="Paste TimeCamp API Token" autoFocus={true} aria-describedby="button-addon2" />
                <button className="btn btn-primary" onClick={handleClick} type="button" id="button-addon2">Login</button>
              </div>
              <small>Find your API token in <a href="javascript:void(0);" onClick={() => shell.openExternal("https://app.timecamp.com/app#/settings/users/me?utm_source=screenTime&utm_medium=app&utm_campaign=screenTime")}>TimeCamp users settings</a></small>
              <small>Do not an have account? <a href="javascript:void(0);" onClick={() => shell.openExternal("https://app.timecamp.com/auth/register/free?utm_source=screenTime&utm_medium=app&utm_campaign=screenTime")}>Create free account</a></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { remote, ipcRenderer } from 'electron';
import '../scss/app.scss';

const appVersion = remote.app.getVersion();
const appName = remote.app.getName();

function SettingsComponent() {
  const [checkedOne, setCheckedOne] = useState(false);
  const updateOne = function () {
    const checked = !checkedOne;
    ipcRenderer.send('change-autostart', checked);
    setCheckedOne(checked);
  };

  function handleClick(e: any) {
    e.preventDefault();
    ipcRenderer.send('anything-asynchronous', 'ping');
  }

  useEffect(() => {
    ipcRenderer.send('settings-loaded', true);
    ipcRenderer.on('autostart-state', (event, isEnabled) => {
      setCheckedOne(isEnabled);
    });

    return function cleanup() {
      ipcRenderer.removeAllListeners('autostart-state');
    };
  }, []);

  return (
    <div className="container">
      <br />
      <div className="row">
        <div className="col-sm-12">
          <h2>Preferences</h2>
          <ul className="list-group">
            <li className="list-group-item">
              <h6>Launch</h6>
              <div className="form-check">
                <input className="form-check-input" checked={checkedOne} onChange={updateOne} type="checkbox" id="flexCheckChecked" />
                <label className="form-check-label" htmlFor="flexCheckChecked">Launch {appName} on login</label>
              </div>
            </li>
            <li className="list-group-item">
              <h6>Logout</h6>
              <a href="#" className="" onClick={handleClick}>Logout</a>
            </li>
            <li className="list-group-item">
              <h6>Help</h6>
              <a href="mailto:kamil.rudnicki+screen-time@gmail.com">Send an email</a>
            </li>
            <li className="list-group-item">
              <h6>Info</h6>
              Version: {appVersion}
              <br />
              Copyright (c) 2021 TimeCamp Inc.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SettingsComponent;

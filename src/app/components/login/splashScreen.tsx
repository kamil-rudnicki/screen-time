import React, { useState, useEffect } from 'react';
import { remote, ipcRenderer } from 'electron';
import { Link, useHistory } from 'react-router-dom';
import Store from 'electron-store';

const appName = remote.app.getName();

function SplashScreen() {
  const history = useHistory();
  const [show, setShow] = useState(false);

  useEffect(() => {
    ipcRenderer.send('splash-screen-loaded', true);

    const store = new Store({ encryptionKey: 'jf2n3Kr3h' });
    if (store.get('apiToken') !== '' && store.get('apiToken') !== undefined) {
      history.push('/stats');
    } else {
      setShow(true);
    }
  }, []);

  const renderAuthButton = () => {
    if (show) {
      return (
        <div>
          <div className="dragabble" />
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-9 text-center">
                <div className="welcome splash_screen">
                  <h1 className="text-center">
                    Welcome to
                    {appName}
                  </h1>
                  <h5>
                    People love flexible working hours, when working remotely.
                    But it gives anxiety about work time duration.
                    With
                    {' '}
                    {appName}
                    {' '}
                    no more.
                  </h5>
                  <Link to="/login">
                    <button type="button" className="btn btn-primary">Next</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div> . </div>;
  };

  return (
    <div>
      {renderAuthButton()}
    </div>
  );
}

export default SplashScreen;

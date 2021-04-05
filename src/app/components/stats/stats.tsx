import React, { useState, useEffect } from 'react';
import { remote, ipcRenderer } from 'electron';

const appName = remote.app.getName();

const Stats = () => (
  <div>
    <div className="dragabble" />
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="">
            <h1 className="">{appName} Stats</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Stats;

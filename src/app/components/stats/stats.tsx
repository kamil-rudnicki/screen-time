/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import { remote, ipcRenderer, Notification } from 'electron';
import { Bar, defaults } from 'react-chartjs-2';
import dayjs from 'dayjs';
import Store from 'electron-store';
import useKeypress from '../../hooks/useKeypress';
import TimeCampAPI from '../../services/TimeCampAPI';
// import { Bar } from '@reactchartjs/react-chart.js'

const appName = remote.app.getName();

const data2 = {
  labels: ['17', '18', '19', '20', '21', '22', '23', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', 'NOW'],
  datasets: [{
    label: 'Last 24 hours',
    // backgroundColor: '00bf71',
    borderColor: '00bf71',
    data: [8, 10, 3, 2, 7, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 4, 5, 2, 2, 7, 10, 2, 0, 3],
    backgroundColor: [
      'f7b801',
      'f7b801',
      '00bf71',
      '00bf71',
      '00bf71',
      '00bf71',
      '00bf71',
      '00bf71',
      '00bf71',
      '00bf71',
      '00bf71',
      '00bf71',
      '00bf71',
      '00bf71',
      '00bf71',
      '00bf71',
      'f7b801',
      '00bf71',
      '00bf71',
      '00bf71',
      '00bf71',
      'f7b801',
      'f7b801',
      '00bf71',
      '00bf71',
      'bbbbbb',
    ],
  }],
};

const options = {
  scales: {
    xAxes: [{
      gridLines: {
        display: false,
      },
      ticks: {
        // Include a dollar sign in the ticks
        callback(value: any, index: any, values: any) {
          return `${value}`;
        },
      },
    }],
    yAxes: [{
      gridLines: {
        display: false,
      },
    }],
  },
};

function Stats() {
  const [date, setDate] = useState('');
  const [screenTime, setScreenTime] = useState('');
  const [clockIn, setClockIn] = useState('');
  const [duration, setDuration] = useState('');

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [note, setNote] = useState('');

  // useGlobalDOMEvents({
  //   keyup(ev: KeyboardEvent) {
  //     if (ev.key === "Escape") {
  //       alert(`You clicked ${to} times`);
  //     }
  //   },
  // });

  useKeypress('Escape', () => {
    remote.getCurrentWindow().close();
  });

  useEffect(() => {
    setDate('Apr 5');
    setScreenTime('3:45h');
    setClockIn('7:45am');
    setDuration('5:55h');

    setTo(dayjs().format('HH:mm'));
    setFrom(dayjs().format('HH:mm'));

    ipcRenderer.on('stats-updated', (event, data) => {
    });

    return function cleanup() {
      ipcRenderer.removeAllListeners('stats-updated');
    };
  }, []);

  useKeypress('Enter', async () => {
    const store = new Store({ encryptionKey: 'jf2n3Kr3h' });
    if (store.get('apiToken') !== '' && store.get('apiToken') !== undefined) {
      const timecampAPI = new TimeCampAPI(store.get('apiToken') as string);
      await timecampAPI.createTimeEntry(dayjs().format('YYYY-MM-DD'), `${from}:00`, `${to}:00`, `${note}`);
      remote.getCurrentWindow().close();
    } else {
      alert('You are not logged in.');
    }
  });

  return (
  <div>
    <div className="dragabble" />
    <div className="container stats">
      <h2>Create Quick Time Entry</h2>
      <div className="row">
        <div className="col-12">
          <input className="form-control" placeholder="Time entry details..." onChange={event => setNote(event.target.value)} type="text" autoFocus />
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-3">
          <label className="form-label">From</label>
          <input className="form-control" defaultValue={from} onChange={event => setFrom(event.target.value)} type="text" />
        </div>
        <div className="col-3">
          <label className="form-label">To</label>
          <input className="form-control" defaultValue={to} onChange={event => setTo(event.target.value)} type="text" />
        </div>
      </div>
      <br />
      <small>
        <i>ESC - close, Enter - create time entry</i>
        <br />
        <br />
        <b>Latest time entries:</b>
        <br />
        14:30 - 14:44 Testing new task<br />
        14:30 - 14:44 Testing new task
        <br />
        <br />
        <b>Suggested:</b>
        <br />
        14:30 - 14:44 Testing new task<br />
        14:30 - 14:44 Testing new task
      </small>


      <br />
      <br />
      <div className="row justify-content-center d-none">
        <div className="col-12">
          <h1 className="">
            Today - {date}
          </h1>

          <div className="row">
            <div className="col-4">
              <div className="stat">
                <h3>Screen Time</h3>
                <h2>{screenTime}</h2>
              </div>
            </div>
            <div className="col-4">
              <div className="stat">
                <h3>Clocked In</h3>
                <h2>{clockIn}</h2>
              </div>
            </div>
            <div className="col-4">
              <div className="stat">
                <h3>Duration</h3>
                <h2>{duration}</h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="stat">
                <h3>Deep Work</h3>
                <Bar data={data2} options={options} />
                <small>This data show current deep work indicator, when you work on computer. It is based how many times per hour you open e-mail or social media.</small>
              </div>
            </div>
          </div>

          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  </div>
  );
}

export default Stats;

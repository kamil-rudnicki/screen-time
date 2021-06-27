/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-alert */
import React, { useState } from 'react';
import { remote } from 'electron';
import dayjs from 'dayjs';
import Store from 'electron-store';
import useKeypress from '../../hooks/useKeypress';
import TimeCampAPI from '../../services/TimeCampAPI';

function Stats(): JSX.Element {
  const [note, setNote] = useState('');

  useKeypress('Escape', () => {
    remote.getCurrentWindow().close();
  });

  useKeypress('Enter', async () => {
    const store = new Store({ encryptionKey: 'jf2n3Kr3h' });
    if (store.get('apiToken') !== '' && store.get('apiToken') !== undefined) {
      if (note !== '') {
        const Sherlock = require('sherlockjs');
        // Sherlock._setNow(dayjs().startOf('day').toDate());
        const sherlocked = Sherlock.parse(note);

        let startDate = sherlocked.startDate ?? Date.now();
        let endDate = sherlocked.endDate ?? Date.now();

        if (endDate < startDate) {
          const tempDate = endDate;
          endDate = startDate;
          startDate = tempDate;
        }

        let taskId = 0;
        let tagId = 0;
        const lowerCaseTitle = sherlocked.eventTitle.toLowerCase();

        if (lowerCaseTitle.includes('DSV'.toLowerCase())) {
          taskId = 77105145;
          tagId = 36;
        }

        const timecampAPI = new TimeCampAPI(store.get('apiToken') as string);
        await timecampAPI.createTimeEntry(
          dayjs().format('YYYY-MM-DD'),
          dayjs(startDate).format('HH:mm:ss'),
          dayjs(endDate).format('HH:mm:ss'),
          sherlocked.eventTitle,
          taskId,
          tagId,
        );

        alert(`${sherlocked.eventTitle} \nfrom: ${dayjs(startDate).format('HH:mm:ss')} \nto: ${dayjs(endDate).format('HH:mm:ss')}`);

        remote.getCurrentWindow().close();
      }
    } else {
      alert('You are not logged in.');
    }
  });

  return (
    <div className="timeEntryNote">
      <div className="dragabble" />
      <input className="form-control" placeholder="Create Quick Time Entry ⌚" onChange={(event) => setNote(event.target.value)} type="text" autoFocus />
    </div>
  );
}

export default Stats;

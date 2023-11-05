// model/schema.js
import {appSchema, tableSchema} from '@nozbe/watermelondb';
import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import Passwords from './Password';

const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'passwords',
      columns: [
        {name: 'email', type: 'string'},
        {name: 'username', type: 'string'},
        {name: 'password', type: 'string'},
        {name: 'title', type: 'string'},
        {name: 'website', type: 'string'},
        {name: 'notes', type: 'string'},
      ],
    }),
  ],
});

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({schema});

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [Passwords],
});

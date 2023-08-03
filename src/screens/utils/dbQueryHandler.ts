import {
  ResultSet,
  SQLiteDatabase,
  enablePromise,
  openDatabase,
} from 'react-native-sqlite-storage';
import {Password} from './types';

// To use promise API in sqlite library
enablePromise(true);

const tableName: string = 'PasswordList';

export const getDBConnection = async () => {
  return openDatabase({name: 'password-manager.db', location: 'default'});
};

export const createTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(_id INTEGER PRIMARY KEY NOT NULL, email VARCHAR(30),username VARCHAR(30), title VARCHAR(30), password VARCHAR(30), website VARCHAR(30), note VARCHAR(30))`;

  await db.executeSql(query);
};

export const getAllPasswords = async (db: SQLiteDatabase) => {
  const result = [];
  const query = `SELECT * FROM ${tableName}`;
  const [response]: [ResultSet] = await db.executeSql(query);
  for (let i = 0; i < response.rows.length; ++i) {
    result.push(response.rows.item(i));
  }
  return result;
};
export const getPassword = async (db: SQLiteDatabase, id: number) => {
  const result = [];
  const query = `SELECT * FROM ${tableName} WHERE _id = ${id}`;
  const [response]: [ResultSet] = await db.executeSql(query);
  for (let i = 0; i < response.rows.length; ++i) {
    result.push(response.rows.item(i));
  }
  return result;
};
export const addNewPassword = async (data: Password, db: SQLiteDatabase) => {
  const {email, password, title, website, note, username} = data;
  const query = `INSERT INTO ${tableName} (email, title, password, website, note, username ) VALUES(?,?,?,?,?,?)`;
  return db.executeSql(query, [
    email,
    title,
    password,
    website,
    note,
    username,
  ]);
};

export const deletePassword = async (db: SQLiteDatabase, id: number) => {
  const query = `DELETE FROM ${tableName} where _id = ${id}`;
  return db.executeSql(query);
};

export const updatePassword = async (data: Password, db: SQLiteDatabase) => {
  console.log(data);
  const {email, password, title, website, note, username, _id} = data;
  const query = `UPDATE ${tableName} SET email=?, password=?, title=?, website=?, note=?, username=? WHERE _id = ?`;
  const values = [email, password, title, website, note, username, _id];

  return db.executeSql(query, values);
};

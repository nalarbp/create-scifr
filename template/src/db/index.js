import { openDB } from 'idb';

const DB_NAME = 'scifr-db';
const DB_VERSION = 1;

let _db = null;

export async function getDb() {
  if (_db) return _db;
  _db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore('projects', { keyPath: 'id' });
      store.createIndex('updatedAt', 'updatedAt');
    },
  });
  return _db;
}

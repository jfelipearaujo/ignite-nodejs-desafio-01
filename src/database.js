import fs from 'node:fs/promises'

const dbPath = new URL('db.json', import.meta.url)

export class Database {
  // # -> means database is a private property
  #database = {}

  constructor() {
    fs.readFile(dbPath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(dbPath, JSON.stringify(this.#database))
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data;
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex === -1) {
      return false;
    }

    this.#database[table].splice(rowIndex, 1);

    this.#persist();

    return true;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex === -1) {
      return false;
    }

    const currentData = this.#database[table][rowIndex]

    this.#database[table][rowIndex] = { id, ...currentData, ...data }

    this.#persist();

    return true;
  }
}
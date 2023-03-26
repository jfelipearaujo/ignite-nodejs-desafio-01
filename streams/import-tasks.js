import { parse } from 'csv-parse';
import fs from 'node:fs';

const endpoint = 'http://localhost:3333/tasks'

const csvPath = new URL('./tasks.csv', import.meta.url)

const readStream = fs.createReadStream(csvPath)

const csvConfig = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
})

async function importCsv() {
  const lines = readStream.pipe(csvConfig)

  for await (const line of lines) {
    const [title, description] = line

    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description
      })
    })
  }
}

importCsv()
import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();
const taskTable = 'tasks';

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = database.insert(taskTable, {
        id: randomUUID(),
        title,
        description,
        created_at: new Date(),
        updated_at: null,
        completed_at: null,
      })

      return res
        .writeHead(201)
        .end(JSON.stringify(task))
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select(taskTable, search ? {
        title: search,
        description: search
      } : null)

      const json = JSON.stringify(tasks)

      return res.end(json)
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      let newTaskContent = {}

      if (title && description) {
        newTaskContent = {
          title,
          description,
          updated_at: new Date()
        }
      } else if (title && !description) {
        newTaskContent = {
          title,
          updated_at: new Date()
        }
      } else if (!title && description) {
        newTaskContent = {
          description,
          updated_at: new Date()
        }
      } else {
        return res
          .writeHead(400)
          .end(JSON.stringify({ error: "You must provide a title or a description" }))
      }

      const result = database.update(taskTable, id, newTaskContent)

      if (result) {
        return res
          .writeHead(204)
          .end()
      }

      return res
        .writeHead(404)
        .end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const result = database.delete(taskTable, id)

      if (result) {
        return res
          .writeHead(204)
          .end()
      }

      return res
        .writeHead(404)
        .end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select(taskTable, { id })

      if (task) {
        const isCompleted = task.completed_at ? true : false

        const completed_at = isCompleted ? null : new Date()

        database.update(taskTable, id, { completed_at })

        return res
          .writeHead(204)
          .end()
      }

      return res
        .writeHead(404)
        .end();
    }
  }
]
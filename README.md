# Challenge NodeJS 01

## CRUD API to handle Tasks

To see the detailed routes, please follow the [server.rest](./src//server.rest) file.

This API provides the following routes:

- Create a new task
  ```javascript
  POST /tasks

  {
    "title": "Task title",
    "description": "Task description"
  }

  // Returns 201 - Task created successfully
  ```

- List all tasks
  ```javascript
    GET /tasks

  // Returns 200 - Listing all tasks
  ```
  Query parameters:
    - search: You could provide a title or description to filter the results

- Update task
  ```javascript
  PUT /tasks/{taskId}

  {
    "title": "Task title",
    "description": "Task description"
  }

  // Returns 204 - Task updated successfully
  // Returns 400 - Invalid body request
  // Returns 404 - Task not found
  ```
  Body parameters:
    - You must provide the title or the description to be updated

- Delete task
  ```javascript
  DELETE /tasks/{taskId}

  // Returns 204 - Task deleted successfully
  // Returns 404 - Task not found
  ```
- Complete task
  ```javascript
  PATCH /tasks/{taskId}/complete

  // Returns 204 - Task completed/uncompleted successfully
  // Returns 404 - Task not found
  ```
  Behavior:
  - If the task has already been completed, it will be restored and the 'completed' datetime will be removed
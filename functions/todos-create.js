/* code from functions/todos-create.js */
import faunadb from 'faunadb' /* Import faunaDB sdk */

/* configure faunaDB Client with our secret */
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

/* export our lambda function as named "handler" export */
exports.handler = (event, context, callback) => {
  /* parse the string body into a useable JS object */
  const data = JSON.parse(event.body)
  console.log("Function `todo-create` invoked", data)
  const todoItem = {
    data: data
  }
  /* construct the fauna query */
  return client.query(q.Create(q.Ref("classes/todos"), todoItem))
  .then((response) => {
    console.log("success", response)
    /* Success! return the response with statusCode 200 */
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(response)
    })
  }).catch((error) => {
    console.log("error", error)
    /* Error! return the error with statusCode 400 */
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify(error)
    })
  })
}

function createTodo(data) {
  return fetch('/.netlify/functions/todos-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

// Todo data
const myTodo = {
  title: 'My todo title',
  completed: false,
}

// create it!
createTodo(myTodo).then((response) => {
  console.log('API response', response)
  // set app state
}).catch((error) => {
  console.log('API error', error)
}) 
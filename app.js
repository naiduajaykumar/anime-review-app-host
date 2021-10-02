const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dpPath = path.join(__dirname, "todoApplication.db");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dpPath,
      driver: sqlite3.Database,
    });
    app.listen(PORT, () =>
      console.log(`Server Running at http://localhost:${PORT}`)
    );
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const hasPriorityAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};

app.get("/ratings/", async (request, response) => {
  let data = null;

  getTodosQuery = `
      SELECT
        *
      FROM
        todo;`;

  data = await db.all(getTodosQuery);
  response.send(data);
});

/**API-2 */
app.post("/ratings/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const postTodoQuery = `
  INSERT INTO
    todo (id, todo, priority, status)
  VALUES
    (${id}, '${todo}', '${priority}', '${status}');`;
  await db.run(postTodoQuery);
  response.send("Todo Successfully Added");
});

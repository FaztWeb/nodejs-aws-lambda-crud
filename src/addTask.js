const { v4 } = require("uuid");
const AWS = require("aws-sdk");

const middy = require("@middy/core");
const httpJSONBodyParser = require("@middy/http-json-body-parser");

const addTask = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const { title, description } = event.body;
  const createdAt = new Date();
  const id = v4();

  console.log("created id: ", id);

  const newTask = {
    id,
    title,
    description,
    createdAt,
    done: false,
  };

  await dynamodb
    .put({
      TableName: "TaskTable",
      Item: newTask,
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify(newTask),
  };
};

module.exports = {
  addTask: middy(addTask).use(httpJSONBodyParser()),
};

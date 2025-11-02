// const calculator = require("./calculator");

// console.log("Calculator Module Loaded");
// console.log(calculator);

// const addResult = calculator.add(20, 10);
// const subtractResult = calculator.subtract(20, 10);
// const multiplyResult = calculator.multiply(20, 10);
// const divideResult = calculator.divide(20, 10);

// console.log(`Addition Result: ${addResult}`);
// console.log(`Subtraction Result: ${subtractResult}`);
// console.log(`Multiplication Result: ${multiplyResult}`);
// console.log(`Division Result: ${divideResult}`);

const express = require("express");
const config = require("./src/configs/config");
const db = require("./src/configs/db");
const app = express();


app.use(express.json());

db.connect();

const authRoutes = require("./src/routes/authRoutes");

app.use("/api/auth/V1", authRoutes);

const port = config.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

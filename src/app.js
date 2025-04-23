const express = require("express");
const app = express();

// app.use("/", () => {
//     console.log("Hello from India");
// });

app.use("/hello", () => {
    console.log("Hello from Hellopage");
});

app.use("/test", () => {
    console.log("Hello from testpage");
});

app.listen(7777, () => {
    console.log("Server is successfully runs on the PORT 7777");
})
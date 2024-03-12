const app = require("./src/app");

const PORT = process.env.PORT || 2201;

const server = app.listen(PORT, () => {
  console.log(`App start with port: ${PORT}`);
});

// process.on("SIGINT", () => {
//   server.close(() => {
//     console.log("Exit Server Express");
//   });
// });

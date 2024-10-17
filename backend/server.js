// const express = require("express");
// const { main } = require("./models/index");
// const productRoute = require("./router/product");
// const storeRoute = require("./router/store");
// const purchaseRoute = require("./router/purchase");
// const salesRoute = require("./router/sales");
// const cors = require("cors");
// const User = require("./models/users");
// const Product = require("./models/Product");

// const app = express();
// const PORT = 4000;
// main();

// // CORS middleware
// // app.use(cors({
// //   origin: "https://ims-api-beige.vercel.app/", // Allow the specific origin
// //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// //   credentials: true, // Allow sending credentials such as cookies
// //   allowedHeaders: ["Content-Type", "Authorization"] // Allow specific headers
// // }));
// app.use(cors());
// // Automatically handle preflight `OPTIONS` requests
// app.options("*", cors());

// // Express JSON middleware
// app.use(express.json());

// // Test route
// app.get('/', (req, res) => {
//   res.json('Hello');
// });

// // Store API
// app.use("/api/store", storeRoute);

// // Products API
// app.use("/api/product", productRoute);

// // Purchase API
// app.use("/api/purchase", purchaseRoute);

// // Sales API
// app.use("/api/sales", salesRoute);

// // ------------- Signin --------------
// let userAuthCheck;

// app.post("/api/login", async (req, res) => {
//   console.log(req.body);
//   try {
//     const user = await User.findOne({
//       email: req.body.email,
//       password: req.body.password,
//     });
//     console.log("USER: ", user);
//     if (user) {
//       res.send(user);
//       userAuthCheck = user;
//     } else {
//       res.status(401).send("Invalid Credentials");
//       userAuthCheck = null;
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Server Error");
//   }
// });

// // Getting User Details of login user
// app.get("/api/login", (req, res) => {
//   if (userAuthCheck) {
//     res.send(userAuthCheck);
//   } else {
//     res.status(401).send("User not authenticated");
//   }
// });

// // ------------------------------------

// // Registration API
// app.post("/api/register", (req, res) => {
//   let registerUser = new User({
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     password: req.body.password,
//     phoneNumber: req.body.phoneNumber,
//     imageUrl: req.body.imageUrl,
//   });

//   registerUser
//     .save()
//     .then((result) => {
//       res.status(200).send(result);
//     })
//     .catch((err) => {
//       console.log("Signup: ", err);
//       res.status(500).send("Signup failed");
//     });
//   console.log("request: ", req.body);
// });

// // Test Product Route
// app.get("/testget", async (req, res) => {
//   const result = await Product.findOne({ _id: '6429979b2e5434138eda1564' });
//   res.json(result);
// });

// // Here we are listening to the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3001;


const server = http.createServer(app);
server.listen(port,()=>{console.log('this app is running on '+port)});
// app.js

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}


const express = require('express');
const app = express();
const cors = require("cors");

const connection = require("./db");
const path = require('path');
const passport = require("passport");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const axios = require("axios");


app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(bodyParser.json());
app.enable('trust proxy');

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
  });


app.use(passport.initialize());
app.use(passport.session());
const passportSetup = require("./passport");



// app.use(cors({
//   origin: ['http://localhost:3000', 'https://my-plant-store.netlify.app'],
//   credentials: true
// }));

app.use(cors({
  origin: ['http://localhost:3000', 'https://my-plant-store.netlify.app'],

  credentials: true,
}));


const authRoute = require("./routes/auth");

// Import route files
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth1");
const mainCategoryRoutes = require("./routes/MainCategories");
const categoryRoutes = require("./routes/Category/Categories");
const subCategoryRoutes = require("./routes/Category/subCategories");
const plantcareRoutes = require("./routes/Plantcare/Plantcare");
const featureTagRoutes=require("./routes/featureTag/featureTag");
const addProductRouter=require("./routes/AddProduct/AddProduct")
const addPotRouter=require("./routes/Pot/Pot")
const productcarelistRouter=require("./routes/Plantcare/selectedPlantcare");
const blogsRoute = require('./routes/blogs/blog')

const couponsRouter=require('./routes/Coupons/Coupons')
const plantLengthRouter=require("./routes/PlantLength/Length")

const productstockRouter=require("./routes/Stock/Stock")

const CustomerNormalRouter=require("./routes/CustomerNormal/user");
const CNauthRouter=require("./routes/CustomerNormal/auth")

const selectedlengthRouter=require("./routes/PlantLength/SelectedLength")

const cartRouter=require("./routes/Cart/Cart")
const reviewRouter = require("./routes/Review")

const paymentRouter=require("./routes/Payment")
const FlashSalesRouter=require("./routes/FlashSales/FlashSales")
const newsletterRouter=require("./routes/NewsLetter/newsletter")
const potLengthRouter=require("./routes/Pot/potLength")

const BannerRouter=require("./routes/AddBanners/addBanner")
const dimensionRoute=require('./routes/Dimension/dimension')

const locationRouter = require('./routes/Locations/Locations')

const dashboardrouter=require('./routes/Dashboard/Dashboard')

const addnewproducts=require('./routes/AddProduct/AddNewProducts')
// Database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/auth", authRoute);
// Mount route handlers
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/", mainCategoryRoutes);
app.use("/", categoryRoutes);
app.use("/", subCategoryRoutes);
app.use("/", plantcareRoutes);
app.use("/",featureTagRoutes);
app.use("/",addProductRouter);
app.use("/",addPotRouter);
app.use("/",productcarelistRouter);
app.use("/",plantLengthRouter);
app.use("/",productstockRouter);
app.use("/",selectedlengthRouter);
app.use('/',cartRouter);
app.use("/" ,reviewRouter);
app.use("/api/customer", CustomerNormalRouter);
app.use("/api/Customerauth", CNauthRouter);
app.use("/blogs",blogsRoute)
app.use("/",paymentRouter);
app.use("/",FlashSalesRouter);
app.use("/",potLengthRouter);
app.use("/",BannerRouter)
app.use("/",couponsRouter)
app.use("/",locationRouter)
app.use("/",newsletterRouter)
app.use("/",dimensionRoute);

app.use("/",dashboardrouter)

app.use("/",addnewproducts)
// Serve static images
app.use('/Image', express.static(path.join(__dirname, 'Image')));
app.use('/Icon', express.static(path.join(__dirname, 'Icon')));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

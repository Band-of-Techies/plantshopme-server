// app.js

//if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();



const express = require('express');
const app = express();
const cors = require("cors");

app.use(cors());
const helmet = require('helmet');
const connection = require("./db");
const path = require('path');
const passport = require("passport");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const axios = require("axios");

// const _dirname = path.dirname(__filename); // Use __filename instead of an empty string
// const buildPath = path.join(_dirname, "../Frontend/build");

// app.use(express.static(buildPath));
app.set('trust proxy', 1);

app.use(express.static(path.resolve(__dirname, '../Frontend/build')));
app.use(express.json());



app.use(
  cookieSession({
    name: 'session',
    keys: ['lama'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production', // Set to true in production if using HTTPS
  })
);


app.use(bodyParser.json());
app.enable('trust proxy');


app.use((req, res, next) => {
    // console.log('Incoming request:', req.url);
    res.header('Access-Control-Allow-Origin', ['http://5000','http://localhost:5000','https://admin.myplantstotre.me','https://myplantstore.me','http://admin.myplantstore.me','http://52.66.241.94:5000']);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
  
app.use(passport.initialize());
app.use(passport.session());
const passportSetup = require("./passport");

// app.use(cors({
//   origin: ['http://localhost:5000', 'https://my-plant-store.netlify.app'],
//   credentials: true
// }));

app.use(cors({
  origin: ['http://localhost:5000', 'https://my-plant-store.netlify.app','*','http://52.66.241.94/'],

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

const coinsRouter = require('./routes/Coins/coinsAndCoupons')

const getCustomerDataRoute = require('./routes/getCustomerData/getCustomer')

const RoleRouter=require('./routes/RoleManagement/role')

// Database connection
const phonemsgRouter=require('./routes/phoneMessage');
const MailAttachRouter=require('./sendMailwithAttach')
const invoiceRouter=require('./routes/Invoice/invoice')
const notification=require('./routes/Notification/Notification')
connection();

// Middlewares
app.use(express.json());
app.use(cors());

app.use("/api",MailAttachRouter);
app.use("/auth", authRoute);
app.use("/api",invoiceRouter);
// Mount route handlers
app.use("/api",phonemsgRouter)
app.use("/api",RoleRouter)
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", mainCategoryRoutes);
app.use("/api", categoryRoutes);
app.use("/api", subCategoryRoutes);
app.use("/api", plantcareRoutes);
app.use("/api",featureTagRoutes);
app.use("/api",addProductRouter);
app.use("/api",addPotRouter);
app.use("/api",productcarelistRouter);
app.use("/api",plantLengthRouter);
app.use("/api",productstockRouter);
app.use("/api",selectedlengthRouter);
app.use('/api',cartRouter);
app.use("/api" ,reviewRouter);
app.use("/api/customer", CustomerNormalRouter);
app.use("/api/Customerauth", CNauthRouter);
app.use("/api",blogsRoute)
app.use("/api",paymentRouter);
app.use("/api",FlashSalesRouter);
app.use("/api",potLengthRouter);
app.use("/api",BannerRouter)
app.use("/api",couponsRouter)
app.use("/api",locationRouter)
app.use("/api",newsletterRouter)
app.use("/api",dimensionRoute);
app.use("/api",coinsRouter)
app.use("/api",dashboardrouter)
app.use("/api",getCustomerDataRoute)
app.use("/api",notification);

app.use("/api",addnewproducts)
// Serve static images
app.use('/Image', express.static(path.join(__dirname, 'Image')));
app.use('/InvoiceFolder', express.static(path.join(__dirname, 'InvoiceFolder')));

app.use('/Icon', express.static(path.join(__dirname, 'Icon')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../Frontend/build', 'index.html'));
});




const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
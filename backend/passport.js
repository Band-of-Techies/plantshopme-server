// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const GithubStrategy = require("passport-github2").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
// const passport = require("passport");
// const mongoose = require("mongoose");

// const GOOGLE_CLIENT_ID ="949358302044-6tbrf6utf4lqfcd58f4o84qc1p57d0cm.apps.googleusercontent.com";
// const GOOGLE_CLIENT_SECRET = "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";

// // Define your GitHub OAuth credentials
// const GITHUB_CLIENT_ID = "your-github-client-id";
// const GITHUB_CLIENT_SECRET = "your-github-client-secret";

// // Define your Facebook OAuth credentials
// const FACEBOOK_APP_ID = "your-facebook-app-id";
// const FACEBOOK_APP_SECRET = "your-facebook-app-secret";

// mongoose.connect('mongodb+srv://myplantstore11:CBhv18MmYmhbXwOv@myplantstore.1f9wpmy.mongodb.net/My_PlantStore-DB?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const userSchema = new mongoose.Schema({
//   googleId: String,
//   githubId: String,
//   facebookId: String,
//   name: String, // Add a field to store the user's name
//   photos: [{ value: String }], // Add a field to store an array of user photos
//   // Add other fields as needed
// });

// // Create a User model based on the schema
// const User = mongoose.model("Cutomer", userSchema);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//     },
//     // http://localhost:5000/api/auth/google/callback
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Check if the user already exists in the database
//         const existingUser = await User.findOne({ googleId: profile.id });

//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         // If the user doesn't exist, create a new user in the database
//         const newUser = new User({
//           googleId: profile.id,
//           name: profile.displayName, // Store the user's name
//           photos: profile.photos, // Store the user's photos
//           // Add other fields as needed
//         });

//         await newUser.save();
//         done(null, newUser);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );

// // Repeat the same pattern for other passport strategies (GitHub, Facebook, etc.)

// passport.use(
//   new GithubStrategy(
//     {
//       clientID: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       callbackURL: "/auth/github/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: FACEBOOK_APP_ID,
//       clientSecret: FACEBOOK_APP_SECRET,
//       callbackURL: "/auth/facebook/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       done(null, profile);
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// module.exports = { User };



// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const GithubStrategy = require("passport-github2").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
// const passport = require("passport");
// const mongoose = require("mongoose");

// const GOOGLE_CLIENT_ID = "949358302044-6tbrf6utf4lqfcd58f4o84qc1p57d0cm.apps.googleusercontent.com";
// const GOOGLE_CLIENT_SECRET = "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";

// // Define your GitHub OAuth credentials
// const GITHUB_CLIENT_ID = "your-github-client-id";
// const GITHUB_CLIENT_SECRET = "your-github-client-secret";

// // Define your Facebook OAuth credentials
// const FACEBOOK_APP_ID = "854883092512013";
// const FACEBOOK_APP_SECRET = "6d40f1c31a2d78b9d8faefedb0cf4090";

// mongoose.connect('mongodb+srv://myplantstore11:CBhv18MmYmhbXwOv@myplantstore.1f9wpmy.mongodb.net/My_PlantStore-DB?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const userSchema = new mongoose.Schema({
//   googleId: String,
//   githubId: String,
//   facebookId: String,
//   name: String,
//   photos: [{ value: String }],
  
//   // Add other fields as needed
// });

// // Create a User model based on the schema
// const User = mongoose.model("Customer", userSchema);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ googleId: profile.id });

//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         const newUser = new User({
//           googleId: profile.id,
//           name: profile.displayName,
//           photos: profile.photos,
//         });

//         await newUser.save();
//         done(null, newUser);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );

// passport.use(
//   new GithubStrategy(
//     {
//       clientID: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       callbackURL: "/auth/github/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       done(null, profile);
//     }
//   )
// );

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: FACEBOOK_APP_ID,
//       clientSecret: FACEBOOK_APP_SECRET,
//       callbackURL: "/auth/facebook/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       done(null, profile);
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// module.exports = { User };





// const express = require("express");
// const session = require("express-session");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const GithubStrategy = require("passport-github2").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
// const mongoose = require("mongoose");

// const app = express();

// const session = require('express-session');

// app.use(
//   session({
//     secret: "your-secret-key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       sameSite: "Strict", // or "Lax" if not using HTTPS
//       secure: false, // set to false if not using HTTPS
//     },
//   })
// );


// app.use(passport.initialize());
// app.use(passport.session());

// const GOOGLE_CLIENT_ID = "949358302044-6tbrf6utf4lqfcd58f4o84qc1p57d0cm.apps.googleusercontent.com";
// const GOOGLE_CLIENT_SECRET = "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";

// const GITHUB_CLIENT_ID = "your-github-client-id";
// const GITHUB_CLIENT_SECRET = "your-github-client-secret";

// const FACEBOOK_APP_ID = "854883092512013";
// const FACEBOOK_APP_SECRET = "6d40f1c31a2d78b9d8faefedb0cf4090";

// mongoose.connect('mongodb+srv://myplantstore11:CBhv18MmYmhbXwOv@myplantstore.1f9wpmy.mongodb.net/My_PlantStore-DB?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const userSchema = new mongoose.Schema({
//   googleId: String,
//   githubId: String,
//   facebookId: String,
//   name: String,
//   photos: [{ value: String }],
//   // Add other fields as needed
// });

// const User = mongoose.model("Customer", userSchema);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://my-plant-store.onrender.com/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ googleId: profile.id });

//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         const newUser = new User({
//           googleId: profile.id,
//           name: profile.displayName,
//           photos: profile.photos,
//         });

//         await newUser.save();
//         done(null, newUser);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );

// passport.use(
//   new GithubStrategy(
//     {
//       clientID: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       callbackURL: "https://yourdomain.com/auth/github/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       done(null, profile);
//     }
//   )
// );

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: FACEBOOK_APP_ID,
//       clientSecret: FACEBOOK_APP_SECRET,
//       callbackURL: "https://yourdomain.com/auth/facebook/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       done(null, profile);
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });


// module.exports = { User };


const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");

const app = express();


const { faTruckMedical } = require("@fortawesome/free-solid-svg-icons");

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "None", // or "Lax" if not using HTTPS
      secure: faTruckMedical, // set to false if not using HTTPS
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());

const GOOGLE_CLIENT_ID = "949358302044-6tbrf6utf4lqfcd58f4o84qc1p57d0cm.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const GITHUB_CLIENT_ID = "your-github-client-id";
const GITHUB_CLIENT_SECRET = "your-github-client-secret";

const FACEBOOK_APP_ID = "854883092512013";
const FACEBOOK_APP_SECRET = "6d40f1c31a2d78b9d8faefedb0cf4090";

mongoose.connect('mongodb+srv://myplantstore11:CBhv18MmYmhbXwOv@myplantstore.1f9wpmy.mongodb.net/My_PlantStore-DB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const coinTransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  lastAddedAt: { type: Date, default: Date.now },
});

const couponTransactionSchema = new mongoose.Schema({
  couponId: { type: String, required: true },
  redeemedAt: { type: Date, default: Date.now },
});


const userSchema = new mongoose.Schema({
  googleId: String,
  githubId: String,
  facebookId: String,
  name: String,
  photos: [{ value: String }],
  coins: [coinTransactionSchema],
	redeemCoupon: [couponTransactionSchema],
  // Add other fields as needed
});

const User = mongoose.model("Customer", userSchema);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://my-plant-store.onrender.com/auth/google/callback",
      // callbackURL: "http://localhost:5000/api/auth/google/callback",

    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          photos: profile.photos,
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "https://yourdomain.com/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "https://yourdomain.com/auth/facebook/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = { GoogleUser: User };
module.exports = { User };

// const express = require("express");
// const session = require("express-session");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const GithubStrategy = require("passport-github2").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
// const mongoose = require("mongoose");
// const url = require('url');

// const app = express();

// app.use(
//   session({
//     secret: "your-secret-key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       sameSite: "None", // or "Lax" if not using HTTPS
//       secure: true, // set to false if not using HTTPS
//     },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// const GOOGLE_CLIENT_ID = "949358302044-6tbrf6utf4lqfcd58f4o84qc1p57d0cm.apps.googleusercontent.com";
// const GOOGLE_CLIENT_SECRET = "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";

// const GITHUB_CLIENT_ID = "your-github-client-id";
// const GITHUB_CLIENT_SECRET = "your-github-client-secret";

// const FACEBOOK_APP_ID = "854883092512013";
// const FACEBOOK_APP_SECRET = "6d40f1c31a2d78b9d8faefedb0cf4090";

// mongoose.connect('mongodb+srv://myplantstore11:CBhv18MmYmhbXwOv@myplantstore.1f9wpmy.mongodb.net/My_PlantStore-DB?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const userSchema = new mongoose.Schema({
//   googleId: String,
//   githubId: String,
//   facebookId: String,
//   name: String,
//   photos: [{ value: String }],
//   // Add other fields as needed
// });

// const User = mongoose.model("Customer", userSchema);

// app.get(
//   '/auth/google',
//   passport.authenticate('google', {
//     scope: ['profile', 'email'],
//   })
// );

// // Google OAuth callback route
// app.get(
//   '/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     // Successful authentication, redirect home or any desired route.
//     res.redirect('/');
//   }
// );

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://my-plant-store.onrender.com/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ googleId: profile.id });

//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         const newUser = new User({
//           googleId: profile.id,
//           name: profile.displayName,
//           photos: profile.photos,
//         });

//         await newUser.save();
//         done(null, newUser);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );

// // ... (other code for GitHub and Facebook strategies)

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// module.exports = { User };

// // ... (other code, start the server, etc.)

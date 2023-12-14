const router = require("express").Router();
const passport = require("passport");

const CLIENT_URL = "https://my-plant-store.netlify.app";


// router.get("/login/success", (req, res) => {
//   if (req.user) {
//     res.header('Access-Control-Allow-Origin', 'https://my-plant-store.netlify.app');
//  // Replace with your actual frontend URL

//     res.status(200).json({
//       success: true,
//       message: "successfull",
//       user: req.user,
//       //   cookies: req.cookies
//     });
//   }
// });


router.get("/login/success", (req, res) => {
  if (req.user) {
    res.header('Access-Control-Allow-Origin', 'https://my-plant-store.netlify.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "unauthorized"
    });
  }
});




router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});


// router.get("/logout", (req, res) => {
  
//   req.logout();
//   // Redirect after 3 seconds
//   setTimeout(function() {
//     res.redirect('https://my-plant-store.netlify.app/');
//   }, 1000);
// });


// router.get('/logout', (req, res) => {
//   req.logout();
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   // res.redirect('http://localhost:3000/');
// });
router.get('/logout', (req, res) => {

  req.session = null;
  req.logout();

  res.header('Access-Control-Allow-Origin', 'https://my-plant-store.netlify.app');
  res.redirect('https://my-plant-store.netlify.app/');

// router.get("/logout", (req, res) => {
//   req.logout();
//   // Redirect after 3 seconds
//   setTimeout(function() {
//     res.redirect(CLIENT_URL);
//   }, 1000);

});


router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);


router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

module.exports = router
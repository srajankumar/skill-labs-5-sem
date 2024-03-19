const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const speakeasy = require("speakeasy");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Google OAuth 2.0 Configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Store user data in session or database as needed
      const user = { id: profile.id, email: profile.emails[0].value };
      users.push(user); // Add the user to the dummy database
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  // Serialize user data to store in the session
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  // Deserialize user data from the session
  done(null, obj);
});

// Google OAuth Login Route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful login redirect or further processing
    res.redirect("/login-success");
  }
);

// Route for successful login
app.get("/login-success", (req, res) => {
  // res.send("Google login successful!");
  res.send("Google login successful! <a href='/logout'>Logout</a>");
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.redirect("/");
  });
});

// Email configuration for Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Dummy user database (replace this with a real database)
const users = [];

// Send OTP via email
const sendOtpEmail = (email, otpToken) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Login",
    html: `<p>Your OTP is: <strong>${otpToken}</strong></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending OTP via email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

// Route for user login
app.get("/login", (req, res) => {
  res.send(`
    <form action="/send-otp" method="post">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>
      <button type="submit">Send OTP</button>
    </form>
  `);
});

let otpToken;

// Route to handle sending OTP via email
app.post("/send-otp", (req, res) => {
  const { email } = req.body;

  // Dummy user lookup (replace this with a real user lookup)
  const user = users.find((u) => u.email === email);

  if (user) {
    // Generate and send OTP to the user's email
    const secret = speakeasy.generateSecret({ length: 20 });
    otpToken = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
    });

    // Store the user's OTP secret in the session or database
    req.session.otpSecret = secret.base32;
    req.session.user = user;

    // Send OTP via email
    sendOtpEmail(email, otpToken);

    res.redirect("/enter-otp");
  } else {
    res.send("User not found.");
  }
});

// OTP entry page
app.get("/enter-otp", (req, res) => {
  res.send(`
    <form action="/verify-otp" method="post">
      <label for="otp">Enter OTP:</label>
      <input type="text" id="otp" name="otp" required>
      <button type="submit">Verify OTP</button>
    </form>
  `);
});

// Route to handle OTP verification
// Route to handle OTP verification
app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;
  const user = req.session.user;

  if (user) {
    console.log("OTP entered:", otp);
    console.log("OTP secret:", req.session.otpSecret);

    //   const verified = speakeasy.totp.verify({
    //     secret: req.session.otpSecret,
    //     encoding: "base32",
    //     token: otp,
    //   });

    if (otpToken == otp) {
      // OTP verification successful
      res.send(`OTP verification successful. Welcome, ${user.email}!`);
    } else {
      // OTP verification failed
      res.send("OTP verification failed. Please try again.");
    }
  } else {
    // User not found
    res.send("User not found.");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

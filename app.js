const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const cors = require("cors");

var app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Passport config
require("./config/passport")(passport);

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/users", require("./routes/users"));
app.use("/project", require("./routes/project"));
app.use("/suggest", require("./routes/suggest"));
app.use("/project-user", require("./routes/project-user"));
app.use("/skill", require("./routes/skill"));

app.listen(PORT, console.log(`listening at ${PORT}`));

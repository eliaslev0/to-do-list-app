const express = require("express");
const path = require("path");
const http = require("http");
//encrypt passwords
const bcrypt = require("bcryptjs");
//encrypt cookie
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const app = express();

app.set("view engine", "ejs");

// set static folders and content type
app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    type: "text/javascript",
  })
);

app.use(
  "/protected",
  express.static(path.join(__dirname, "protected"), {
    type: "text/javascript",
  })
);

// setting up bodyParser to help read body's of HTTP requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect("mongodb://127.0.0.1/app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// connecting to database
db.on("error", console.error.bind(console, "MongoDB connection error: "));
db.once("open", () => {
  console.log("MongoDB connected");
});

// object representing the schema we will use for holding our lists in MongoDB
//TODO: delete
const listSchema = new Schema({
  name: String,
  user: {
    type: Schema.Types.ObjectId,
    //refrencing User line 62
    ref: "User",
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

const taskSchema = new Schema({
  id: Schema.Types.ObjectId,
  description: String,
  completed: Boolean,
  dateValue: String,
  repeat: String,
  color: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const userSchema = new Schema({
  id: Schema.Types.ObjectId,
  password: String,
  email: String,
  list: {
    type: Schema.Types.ObjectId,
    ref: "List",
  },
});
//list is refrencing user
const User = mongoose.model("User", userSchema);
//list to user = 1 to 1
const List = mongoose.model("List", listSchema);
//task to list is one to many
const Task = mongoose.model("Task", taskSchema);

//get
app.get("/", async (req, res) => {
  const user = await User.findById(req.cookies.userID).exec();
  console.log(user);
  if (user) {
    res.sendFile(path.join(__dirname, "/protected/index.html"));
  } else {
    res.redirect("/public/login.html");
  }
});


//signup
app.post("/signup", async (req, res) => {
  let data = req.body;
  //encrypt the password
  let encryptedPassword = await bcrypt.hash(data.password, 10);
  //assign encrypted password to user for security purposes
  const user = new User({
    email: data.email,
    password: encryptedPassword,
  });

  const savedUser = await user.save();
  console.log(savedUser);
  // console.log(req);
  return res.send(savedUser);
});

app.post("/login", async (req, res) => {
  const data = req.body;
  console.log(data);
  console.log(data.email);
  const foundUser = await User.findOne({ email: data.email }).exec();
  if (!foundUser) {
    return res.status(404).send({ error: "User not found.." });
  }
  console.log(foundUser);
  //true if passwords match
  const compare = await bcrypt.compare(data.password, foundUser.password);
  if (compare) {
    return res.status(200).send(foundUser);
  } else {
    return res.send({ error: "Incorrect password.." });
  }
  // console.log("compare: " + compare);
  return data;
});

// REST route for creating a new list in the database
app.post("/list", (req, res) => {
  const { name, user, tasks } = req.body;

  const taskList = new List({
    name,
    user,
    tasks,
  });

  taskList.save().then((savedList) => {
    res.status(201).json(taskList)
  });
});

//get all tasks based on associated user id
app.get('/tasks', async (req, res) => {
  //tasks for all users
  //tasks find for THIS user
  //
  //645ea5352b0dc49528dc8149
  const tasks = await Task
  // .find({'user': req.cookies.userID})
  // .populate('user')
  .find()
  .exec()
  .then(result => {
    res.status(200).json(result);
  }).catch(err => {
    res.status(500)
  })
})

//TODO: possibly delete
app.get('/task/:taskId', async (req, res) => {
  const id = req.params.taskId;
  const task = await Task.findOne({_id: req.body.id})
  .exec()
  .then();
})

// REST route for creating a new task
app.post("/task", (req, res) => {
  const task = new Task(req.body);

  task.save().then((savedTask) => {
    res.status(201).json(savedTask)
  });
});

app.put("/task/:taskId", (req, res) => {
  const {description, completed, dateValue, repeat, color} = req.body;
  const id = req.params.taskId;

  Task.updateOne({_id: id}, {$set: {description, completed, dateValue, repeat, color}})
  .exec()
  .then(result => {
    res.status(200).json(result);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: "an error occurred"});
  });
})

//TODO: hit delete endpoint to delete items
app.delete("/task/:taskId", (req, res) => {
  const id = req.params.taskId;
  //TODO: add callbacks to 'then' and 'catch' for handling delete
  Task.deleteOne({_id: id}).exec()
  .then()
  .catch();
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

// description: String,
// completed: Boolean,
// dateValue: String,
// repeat: String,
// color: String,
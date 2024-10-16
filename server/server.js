const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const auth = require("./middleware/auth");
const fs = require("fs");
const app = express();
const port = 5056;
app.use(cors());
app.use(express.json());
//Connect DATABASE
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "LoginJWTDB",
});
db.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + db.threadId);
});
//END Connect DATABASE
// Register
app.post("/register", async (req, res) => {
  const { ID, Password } = req.body;
  const user = { ID, Password };
  console.log(ID, Password);
  if (!ID || !Password) {
    return res.send("All input required");
  }
  try {
    const encryptedPassword = await bcrypt.hash(Password, 10);
    db.query("SELECT * FROM users WHERE ID = ? ", [ID], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result.length > 0) {
        return res.send("id already exits");
      }
      db.query(
        "INSERT INTO users (ID,Password) VALUES (?,?)",
        [ID, encryptedPassword],
        (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          return res.send("Create Success");
        },
      );
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Login
app.post("/login", async (req, res) => {
  const { ID, Password } = req.body;
  //เช็คค่าinput
  if (!ID || !Password) {
    res.send("All input required");
  }
  try {
    await db.query(
      "SELECT * FROM users WHERE ID = ? ",
      [ID],
      async (err, result) => {
        if (err) {
          res.send(err);
        }
        //เช็คID ใน DATABASE
        if (result.length === 0) {
          return res.status(400).send("ID not found");
        }
        const user = result[0];
        //เช็คpassword bcrypt ตรงไหม
        const PasswordMatch = await bcrypt.compare(Password, user.password);
        if (!PasswordMatch) {
          res.send("not correct");
        }
        //สร้างpayload
        const payload = { user_id: user.user_id, ID: user.ID };
        //สร้างtoken
        const token = jwt.sign(payload, "selectToken", {
          expiresIn: "1h",
        });
        //ท่าตรงส่งข้อมูลuser และ token
        return res.json({
          token,
          user: { user_id: user.user_id, ID: user.ID },
        });
      },
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

// END Login
app.post("/welcome", auth, (req, res) => {
  res.status(200).send("welcome");
});
fs.readdirSync("./routes").map((route) =>
  app.use(require(`./routes/${route}`)),
);
app.listen(port, () => console.log(`server running on port ${port}`));

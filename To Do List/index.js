import express from "express"
import bodyParser from "body-parser"
import pg from "pg"

const app = express();
const port = 3000;

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'ToDoList',
    password: 'console.log()',
    port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    let result = await db.query("Select * from todos");
    res.render("index.ejs", {length: result.rows.length, tasks: result.rows});
});

app.post("/submit", async (req, res) => {
    let task = req.body.Task;
    let id = req.body.id;
    let result = await db.query("insert into todos (task) values($1);", [task])
    res.redirect("/");
});

app.post("/delete", async (req, res) => {
    let id = req.body.id;
    let result = await db.query("delete from todos where id = $1", [id]);
    res.redirect("/");
});

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
});
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
const axios = require('axios')

app.set("view engine", "ejs");
app.set("views", "./public/views");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public/"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Show welcome page
app.get("/", (req, res) => {
	res.render("welcome.ejs", { headTitle: "Welcome!" });
});

//Read aka show data
app.get("/user", async (req, res) => {
	const response = await axios.get("http://localhost:3000/api/user")
	res.render("main.ejs", { users: response.data.data, headTitle: "User List", bodyTitle: "User List" });
});

//Create new entry
app.get("/user/new", (req, res) => {
	res.render("new.ejs", { headTitle: "Add New User", bodyTitle: "Add New User" });
});

app.post("/user", async (req, res) => {
	const { name, email, password } = req.body;
	const hashedPass = await bcrypt.hash(password, 10);
	const newUser = { name, email, password: hashedPass };

	const response = await axios.post("http://localhost:3000/api/user", newUser)
	if(response.status === 201){
		res.redirect("/user");
	}else {
		res.redirect("/user/new")
	}
	
});

//Update or edit data
app.get("/user/:id/edit", async (req, res) => {
	const { id } = req.params
	const response = await axios.get(`http://localhost:3000/api/user/${id}`)
	if(response.data.status==="succsess"){
		res.render("edit.ejs", { user: response.data.data, headTitle: "Edit User", bodyTitle: "Edit User" });
	}	
});

app.put("/user/:id", async (req, res) => {
	const { id } = req.params
	const { name, email, password } = req.body
	const hashedPass = await bcrypt.hash(password, 10)
	const getData = await axios.get(`http://localhost:3000/api/user/${id}`)
	const editedUser = { name, email, password: req.body.password == "" ? getData.data.data.password : hashedPass }
	const response = await axios.put(`http://localhost:3000/api/user/${id}`, editedUser)
	
	if(response.data.status==="succsess"){
		res.redirect("/user");
	}	
});

//Delete Data
app.post("/user/:id/delete", async (req, res) => {
	const { id } = req.params;
	const response = await axios.delete(`http://localhost:3000/api/user/${id}`)
	if(response.data.status==="succsess"){
		res.redirect("/user");
	}
});

//Port
const PORT = 5000;
app.listen(PORT, () => {
	console.log(`Server is running at port ${PORT}`);
});

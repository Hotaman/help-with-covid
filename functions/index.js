require("dotenv").config();
const functions = require("firebase-functions");
const express = require("express"); // call express
const cors = require("cors");
const app = express(); // define our app using express
const bodyParser = require("body-parser");
const neighborhood = require("./helpers/neighborhood");
const task = require("./helpers/onfleet/task");
const team = require("./helpers/onfleet/team");
const firebase = require("./helpers/firebase");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true }));

/*
address: {
	unit: "apt 122",
	number: "123",
	street: "wentz st",
	city: "Springfield",
	state: "illinois",
	postalCode: "65521"
}

person: {
	name: "joe bill",
	phone: "+14133333333"
}

*/

app.get("/", async function(req, res) {
    res.json({ message: "hooray! welcome to our api!" });
});

app.get("/task/:id", async function(req, res) {
    const result = await task.getTask(req.param.id);
    res.json(result);
});

app.post("/task", async function(req, res) {
    const address = req.body.address;
    const neighborhoodName = await neighborhood.getNeighborhood({
        streetAddress: address.number + " " + address.street,
        unit: address.apartment,
        city: address.city,
        state: address.state,
        zipcode: address.postalCode
    });
    console.log(neighborhoodName);
    const results = await task.createTask(
        req.body.address,
        req.body.person,
        req.body.notes
    );
    res.json(results);
});

app.patch("/task/:id", async function(req, res) {
    const results = await task.updateTask(req.params.id, req.query.body);
    res.json(results);
});

app.delete("/task/:id", async function(req, res) {
    const results = task.deleteTask(req.param.id);
    res.json(results);
});

app.post("/team", async function(req, res) {
    const address = req.body.address;
    const neighborhoodData = await neighborhood.getNeighborhood({
        streetAddress: address.number + " " + address.street,
        unit: address.apartment,
        city: address.city,
        state: address.state,
        zipcode: address.postalCode
    });

    team.createTeam(neighborhoodData)
        .then(results => {
            firebase.writeNewTeam(
                results.name,
                results.onFleetID,
                results.neighborhoodID
            );
            res.status(200).json(results);
        })
        .catch(error => {
            res.status(509).send(
                "Team already exists or other error\n" + error
            );
        });
});

app.get("/team/:id", async function(req, res) {
    const team = await firebase.getTeam(req.params.id);
    if (team.data()) {
        res.status(200).json(team.data());
    } else {
        res.status(400).send("Team doesn't exist");
    }
});

// more routes for our API will happen here
exports.widgets = functions.https.onRequest(app);

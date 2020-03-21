const Onfleet = require("@onfleet/node-onfleet");
const onfleet = new Onfleet(process.env.ONFLEET_KEY);

const createTask = async (address, person, notes, team) => {
    //console.log(address);
    //console.log(person);
    console.log(team);
    return onfleet.tasks.create({
        destination: { address: address },
        recipients: [person],
        notes: notes,
        autoAssign: {
            mode: "distance",
            team: team
        },
        container: {
            type: "TEAM",
            team: team
        }
    });
};

const deleteTask = async id => {
    return onfleet.tasks.deleteOne(id);
};

const getTask = async id => {
    return onfleet.tasks.get(id);
};

const updateTask = async (id, body) => {
    return onfleet.tasks.update(id, body);
};

module.exports = {
    createTask,
    deleteTask,
    getTask,
    updateTask
};

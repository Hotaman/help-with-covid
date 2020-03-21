const Onfleet = require("@onfleet/node-onfleet");
const onfleet = new Onfleet(process.env.ONFLEET_KEY);

const createTeam = async neighborhoodData => {
    const name = neighborhoodData.short_name.replace("/", "-");
    const neighborhoodID = neighborhoodData.id;
    return onfleet.teams
        .create({
            name: neighborhoodID
        })
        .then(function(response) {
            const id = response.id;
            const results = {
                onFleetID: id,
                name: name,
                neighborhoodID: neighborhoodID
            };
            return results;
        });
};

module.exports = {
    createTeam
};

const mongoose = require('mongoose');
//const userController = require('./src/controllers/user.controller');
const Discord = require('discord.js');

const requireAll = require('require-all');

const fs = require('fs');

// Get sensitive configurations
const {bot_token} = require('./config.json');

//module.exports = {voice_settings};
// Authenticate wit
/*const wit_client = new Wit({
    accessToken: wit_token,
    logger: new log.Logger(log.DEBUG)
}); */

// Start discord client
const client = new Discord.Client();
client.login(bot_token)
    .then((r, error) => {
        if (error)
            throw error;
    })
    .catch(console.error);


// Create command handler and cooldown handler
client.commands = new Discord.Collection();
//const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

// Set commands
for (const file of commandFiles) {
    const command = require('./src/commands/' + file);
    client.commands.set(command.name, command);
}
const files = requireAll({                   // Require all the files within your
    dirname: `${__dirname}/src/events`,            // event directory which have a name
    filter: /^(?!-)(.+)\.js$/                  // ending in '.js' NOT starting
});                                          // with '-' (a way to disable files).

client.removeAllListeners();                 // Prevent duplicate listeners on reload.
                                             // CAUTION: THIS REMOVES LISTENERS
                                             // ATTACHED BY DISCORD.JS!

for (const name in files) {                  // Iterate through the files object
    const event = files[name];                 // and attach listeners to each
                                               // event, passing 'client' as the
    client.on(name, event.bind(null, client)); // first parameter, and the rest
                                               // of the expected parameters
    console.log(`Event loaded: ${name}`);      // afterwards. Then, log the
}


client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

});


mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("successfully connected to database.");
});
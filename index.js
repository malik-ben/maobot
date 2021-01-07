require('dotenv').config();
const axios = require('axios')
const { createBotChannel, makeAuth} = require('./logic/functions')
const { newGame } = require('./logic/newGame')
const Discord = require('discord.js');
const client = new Discord.Client();
const cronJob = require('cron').CronJob;
const fs = require('fs');
client.commands = new Discord.Collection();
console.log(process.env.NODE_ENV)
//////////////////////////////////////////////////////////////////////////////////////
const prefix = "!"
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
///////////////////////////////Constants////////////////////////////////////////////////
let botchannel
//////////////////////////////express server///////////////////////////////////////////
const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/auth/twitch/callback', (req, res) => {
    console.log("called back")
    res.redirect('/')
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
///////////////////////////////////////Event listening//////////////////////////////////
client.on('ready', async () => {
    //create channel for Bot if it doesnt exist already
    botchannel = await createBotChannel(client).then(res => { return res })

    const newLocal = '/games';
    const job = new cronJob({
        cronTime: '0 */23 * * *',
        onTick: async () => { newGame(botchannel) },
        runOnInit: true,
        start: true
    });
});

client.on('message', async message => {
    if (message.content === 'ping') {
        //msg.reply('Pong!');
        botchannel.send("Pong")
    }
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    if (command == "more") {
        client.commands.get(command).execute(message, args, newGame);
    } else if (command == "genre") {
/*let part = message.content.slice(prefix.length).split(" ")
    let title = part[part.length - 1]
    let genre = part[0]*/
    }
});
client.login(process.env.DISCORD_BOT_TOKEN);
require('dotenv').config();
const axios = require('axios')
const { createBotChannel, makeAuth} = require('./logic/functions')
const { newGame } = require('./logic/newGame')
const Discord = require('discord.js');
const client = new Discord.Client();
const cronJob = require('cron').CronJob;
const fs = require('fs');
var path = require('path')
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
const { pathToFileURL } = require('url');
const app = express();
const port = process.env.port || 3000;
app.use(express.static('assets'))
app.get('/', (req, res) => {
    res.sendFile('index.html', {root:path.join(__dirname, './html')})
});
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
console.log(`listening to ${process.env.DISCORD_BOT_TOKEN}`)
client.login(process.env.DISCORD_BOT_TOKEN);
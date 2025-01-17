require('dotenv').config();
const express = require('express');
const { createBotChannel, makeAuth } = require('./logic/functions')
const { newGame } = require('./logic/newGame')
const Discord = require('discord.js');
const client = new Discord.Client();
const cronJob = require('cron').CronJob;
const fs = require('fs');
var path = require('path')
const { addChannel, verifyChannel, deleteById } = require('./dynamo')
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
let botchannel, guildID
//////////////////////////////////seesion + passport///////////////////////////////////////
const app = express();
const port = process.env.port || 3000;
app.use(express.static('assets'))
////////////////////////////////////express server//////////////////////////////////////////////////////
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, './html') })
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
///////////////////////////////////////Event listening////////////////////////////////////////////////
client.on('ready', async () => {});
client.on('message', async message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (command == "mao") {
        client.commands.get(command).execute(message, args, newGame);
    } else if (command == "genre") {
        /*let part = message.content.slice(prefix.length).split(" ")
            let title = part[part.length - 1]
            let genre = part[0]*/
    }
});
client.on("channelDelete", function(channel){
    console.log(`channelDelete: ${channel}`);
});
client.on("guildCreate", async function(guild){
    console.log(`added to guild ${guild.id}`)
    botchannel = await createBotChannel(guild).then(res => { return res })
    const job = new cronJob({
        cronTime: '20 16 * * *',
        onTick: async () => { newGame(botchannel,guild) },
        runOnInit: true,
        start: true
    });
});
client.login(process.env.DISCORD_BOT_TOKEN);
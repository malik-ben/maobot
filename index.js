require('dotenv').config();
const express = require('express');
const { createBotChannel, makeAuth } = require('./logic/functions')
const { newGame } = require('./logic/newGame')
const Discord = require('discord.js');
const client = new Discord.Client();
const cronJob = require('cron').CronJob;
const fs = require('fs');
var path = require('path')
const { addChannel, verifyChannel } = require('./dynamo')
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
app.get('/verify/:gid', async (req, res) => {
    let gid = parseInt(req.params.gid)
    let ifany = await verifyChannel(gid).then(async data => {
        if (typeof data == "undefined") {
            console.log("wait a second...")
            let user = await makeAuth()
            console.log(`auth ${user.access_token} and ttl ${user.expires_in}`)
            let added = addChannel(gid, user.access_token, user.expires_in)
            res.send( user)
        } else {
            //Channel found in DB
            res.send(data)
        }
    })

})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);

});
///////////////////////////////////////Event listening////////////////////////////////////////////////
client.on('ready', async () => {
    ////////////Connect to igdb if not in session already//////////////////////////////////////////
    //create channel for Bot if it doesnt exist already
    botchannel = await createBotChannel(client).then(res => { return res })

    
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
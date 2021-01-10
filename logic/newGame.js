const { apiCall, createBaseCall, createBotChannel } = require('./functions')
const { FIELDS, FILTERS } = require('./../queries/query')
const fetch = require('node-fetch');
const port = process.env.port || 3000;

const newGame = async (botchannel, client, type = "ch") => {
    //if(type == "") await createBotChannel(client).then(res => { return res })
    let gid = type == "ch" ? botchannel.guild.id : botchannel.guild.id
    let channelMsg = type == "ch" ? botchannel : botchannel.channel
    let token = await fetch(`http://localhost:${port}/verify/${gid}`)
        .then(res => res.json())
        .then(res => {
            console.log(`the token is received cocrrectly: ${res.access_token}`);
            return res.access_token
        })
    let data = `fields ${FIELDS}; 
                limit 30;sort first_release_date desc; 
                where  ${FILTERS};`
    const newLocal = '/games';
    let igdb = createBaseCall(token)
    let response = await apiCall(newLocal, data, igdb)
        .then(async res => {
            let games = [];
            let sent = false
            let name, url = false;
            let list = []
            res.data.map(game => {
                let sorted = Object.entries(game.rating).sort(function (a, b) { return a - b })
                game.external_games.map(cat => {
                    if (cat.category == 1 || cat.category == 5)
                        games.push({ "name": game.name, "url": cat.url })
                });
            })
            await channelMsg.messages.fetch({ limit: 25 })
                .then(reponse => {
                    if (new Map(reponse).size > 0) {
                        reponse.map(message => {
                            if (message.author.bot) {
                                let part = message.content.split("| ")
                                let title = part[part.length - 1]
                                list.push({ name: title })
                            }
                        })
                        let c = games.filter((jeu) => {
                            return !list.find((titre) => {
                                return jeu.name === titre.name
                            })
                        })
                        if (c[0] === undefined) c = games
                        channelMsg.send(`${c[0].url} | ${c[0].name}`)
                        return
                    } else {
                        channelMsg.send(`${games[0].url} | ${games[0].name}`)
                        return
                    }
                })
        })
        .catch(e => console.log("Probably made a bad request", e));
}
module.exports = { newGame }
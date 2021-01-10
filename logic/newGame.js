const { apiCall, createBaseCall, createBotChannel, verify } = require('./functions')
const { FIELDS, FILTERS } = require('./../queries/query')
const fetch = require('node-fetch');
const port = process.env.port || 3000;

const newGame = async (botchannel, guild, type = "ch") => {
    await createBotChannel(guild).then(res => { return res })
    let gid = guild.id
    let channelMsg = type == "ch" ? botchannel : botchannel.channel
    let token = verify(gid)
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
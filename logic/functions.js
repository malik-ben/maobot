const axios = require('axios')
const DAY = 1000 * 60 * 60 * 24
const WEEK = DAY * 7
const NOW = new Date().getTime();
const START = new Date(NOW - WEEK).getTime()
console.log(START, NOW)
const createBotChannel = async (client) => {
    let channelExists = false
    let channelID
    try {
        let guildID = client.guilds.cache.array()[0].id
        let guild = await client.guilds.fetch(guildID).then(g => { return g })
        let channels = client.channels.cache.array()
        let botchannel
        for (const channel of channels) {
            if (channel.name.includes("tell-me-mao")) {
                channelExists = true
                channelID = channel.id
                botchannel = await client.channels.fetch(channel.id).then(g => { return g })
                //console.log(`channel name is ${channel.name} with id ${channel.id}`);
            }
        }
        if (!channelExists) {
            console.log("channel does not exist, let's create one...")
            botchannel = await guild.channels.create('Tell-Me-Mao', { reason: 'Discover new games here' })
                .then(async (data) => {
                        console.log(data.id);
                        let bc = await client.channels.fetch(data.id).then(g => { return g; });
                        return bc;
                    })
                .catch(console.error)
        }
        return botchannel
    } catch (err) {
        console.log('array error')
        //client.channel.send('An error occoured while getting the channels.')
        console.log(err)
    }
}
const makeAuth = async () => {
    let clientid = process.env.CLIENTID
    let secret = process.env.SECRET
    await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${clientid}&client_secret=${secret}&grant_type=client_credentials`)
        .then(res => {console.log(res.data); return res.data})
        .catch(console.error)
}
const createBaseCall = () => {
    let base = axios.create({
        baseURL: "https://api.igdb.com/v4",
        headers: {
            'Accept': 'application/json',
            'Client-ID': `${process.env.CLIENTID}`,
            'Authorization': 'Bearer zfvj7otj83g1rw3rxhgixxtvkz3zbo'
        }
    })
    return base
}
let igdb = createBaseCall()
const apiCall = async (url, data, igdb) => {
    let resp = await igdb({
        url: url,
        method: 'POST',
        data: data
    })
    return resp
}
module.exports = { createBotChannel, makeAuth, createBaseCall, apiCall }
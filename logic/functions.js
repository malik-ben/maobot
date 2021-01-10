const axios = require('axios')
const { verifyChannel, addChannel } = require('./../dynamo')
const DAY = 1000 * 60 * 60 * 24
const WEEK = DAY * 7
const NOW = new Date().getTime();
const START = new Date(NOW - WEEK).getTime()

const createBotChannel = async (guild) => {
    let channelExists = false
    try {
        let guildID = guild.id//guild.client.guilds.cache.array()[0].id
        let channels = guild.channels.cache.array()
        let botchannel
        for (const channel of channels) {
            if (channel.name.includes("tell-me-mao")) {
                channelExists = true
                botchannel = channel
            }
        }
        if (!channelExists) {
            console.log("channel does not exist, let's create one...")
            botchannel = await guild.channels.create('tell-me-mao', { reason: 'Discover new games here' })
                .then((guildChannel) => guildChannel)
                .catch(console.error)
        }
        return botchannel
    } catch (err) {
        console.log('array error')
        console.log(err)
    }
}
const makeAuth = async () => {
    let clientid = process.env.CLIENTID
    let secret = process.env.SECRET
    let data = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${clientid}&client_secret=${secret}&grant_type=client_credentials`)
        .then(res => {
            return res.data
        })
        .catch(console.error)
    return data
}
const createBaseCall = (token) => {
    let base = axios.create({
        baseURL: "https://api.igdb.com/v4",
        headers: {
            'Accept': 'application/json',
            'Client-ID': `${process.env.CLIENTID}`,
            'Authorization': `Bearer ${token}`
        }
    })
    return base
}
const apiCall = async (url, data, igdb) => {
    let resp = await igdb({
        url: url,
        method: 'POST',
        data: data
    })
    return resp
}
let verify = async (gid) => {
    let guild_id = parseInt(gid)
    let ifany = await verifyChannel(guild_id).then(async data => {
        if (typeof data == "undefined") {
            console.log("wait a second...")
            let user = await makeAuth()
            console.log(`auth ${user.access_token} and ttl ${user.expires_in}`)
            let added = addChannel(guild_id, user.access_token, user.expires_in)
            return user.access_token
        } else {
            //Channel found in DB
            return data.access_token
        }
    })
    return ifany
}
module.exports = { createBotChannel, makeAuth, createBaseCall, apiCall, verify }
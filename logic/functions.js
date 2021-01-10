const axios = require('axios')
const {verifyChannel, addChannel} = require('./../dynamo')
const DAY = 1000 * 60 * 60 * 24
const WEEK = DAY * 7
const NOW = new Date().getTime();
const START = new Date(NOW - WEEK).getTime()

const createBotChannel = async (guild) => {
    let channelExists = false
    let channelID
    try {
        let guildID = guild.id//guild.client.guilds.cache.array()[0].id
        //let guild = await client.guilds.fetch(guildID).then(g => { return g })
        let channels = guild.channels.cache.array()
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
                        let bc = await guild.channels.fetch(data.id).then(g => { return g; });
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
    let data = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${clientid}&client_secret=${secret}&grant_type=client_credentials`)
        .then(res => {
            //console.log(`Auth data response:${res.data.access_token}`);
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
            return user
        } else {
            //Channel found in DB
            return data
        }
    })

}


module.exports = { createBotChannel, makeAuth, createBaseCall, apiCall, verify }
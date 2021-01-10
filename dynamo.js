var AWS = require("aws-sdk");
const aws_conf = { region: "eu-west-1" }
AWS.config.update(aws_conf);
var docClient = new AWS.DynamoDB.DocumentClient();


const addChannel = (gid, token, ttl) => {

    var expires_in = Math.floor(Date.now() / 1000) + ttl - 300
    var table = "maobot";
    var params = {
        TableName: table,
        Item: {
            "guild_id": gid,
            "access_token": token,
            "ttl": expires_in
        }
    };
    console.log("Adding a new item...");
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
            return JSON.stringify(data, null, 2)
        }
    });
}
const verifyChannel = async (guild_id) => {
    let ssion = await docClient
        .get({
            TableName: "maobot",
            Key: {
                guild_id: guild_id, // id is the Partition Key, '123' is the value of it
            },
        })
        .promise()
        .then(data => { console.log(data.Item); return data.Item })
        .catch(console.error)
    return ssion
}

module.exports = { addChannel, verifyChannel }
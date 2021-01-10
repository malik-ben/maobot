a = [{ name: "ma", age: 1 }, { name: "yo", age: "3" }, { name: "qw", age: "31" }]

b = [{ name: "yo", age: "3" }]

c = a.filter((formA) => {
return !b.find((formB)=>{
    return formA.name === formB.name
})
})
console.log(Math.floor(Date.now() / 1000))


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
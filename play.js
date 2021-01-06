a = [{ name: "ma", age: 1 }, { name: "yo", age: "3" }, { name: "qw", age: "31" }]

b = [{ name: "yo", age: "3" }]

c = a.filter((formA) => {
return !b.find((formB)=>{
    return formA.name === formB.name
})
})
console.log(c)

const getGames = async () => {
    await igdb({
        url: `/games`,
        method: 'POST',
        data: `fields name, version_title, aggregated_rating, first_release_date, platforms, total_rating_count, summary, release_dates.y ; limit 10; where  first_release_date > ${START} & rating > 70 & total_rating_count > 5 & themes != (42) & platforms=(6); sort first_release_date desc;`
    })
        .then(res => {
            res.data.map(game => {
                console.log(game)
            })
        })
        .catch(err => { console.error(err) })
}

const getByRelease = async () => {
    await igdb({
        url: `/release_dates`,
        method: 'POST',
        data: `fields date, human, y, game.name, game.rating;where game.platforms=(6) & y >= 2020  & game.rating > 60 & game.total_rating_count > 50; sort rating asc;`
    })
        .then(res => {
            res.data.map(game => {
                console.log(game)
            })
        })
        .catch(err => console.log("400 probably..."))

}






        /* games.map(game => {
                 
                             reponse.map(message => {

                                 if (message.author.bot) {

                                     let part = message.content.split("| ")
                                     let title = part[part.length - 1]
                                     //console.log(title)
                                     if (title === game.name) {
                                         console.log(`${game.name} = ${title}`)
                                         name, url = false
                                         return false
                                         //botchannel.send(`${game.url} | ${game.name}`)
                                         //sent = true
                                     } else {
                                         console.log(`${game.name} has not been sent`)
                                         url = game.url
                                         name = game.name
                                         

                                     }
                                 }
                             })
                         })
                         console.log("sent from this one")
                         botchannel.send(`${url} | ${name}`)
                     } else {
                         console.log("sent from here")
                         botchannel.send(`${res.data[0].external_games[0].url} | ${res.data[0].name}`)
                     }*/
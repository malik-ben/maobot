///////////////////////////////Constants////////////////////////////////////////////////
const DAY = 1000 * 60 * 60 * 24
const WEEK = DAY * 7
const NOW = new Date().getTime();
const START = new Date(NOW - WEEK).getTime()
////////////////////////////Make Queries///////////////////////////////////////////////
const FIELDS = `name, 
                rating,
                version_title, 
                aggregated_rating, 
                first_release_date, 
                platforms, 
                total_rating_count, 
                summary,    
                release_dates.y,
                release_dates.date,
                release_dates.region,
                external_games.*
`
const FILTERS = `rating >= 60 & 
                 total_rating_count > 1 & 
                 themes != (42) & 
                 platforms=(6)  & 
                 category=(0) & 
                 external_games.url != null & 
                 first_release_date != null &
                 external_games.category=(1) &
                 first_release_date < ${START}
                 `

module.exports = { FIELDS, FILTERS}
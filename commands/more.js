module.exports = {
	name: 'more',
	description: 'More!',
	execute(message, args, newGame, client) {
		//message.channel.send('Mooooore!!!');
		newGame(message, client, "ms")
	},
};
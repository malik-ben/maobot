module.exports = {
	name: 'more',
	description: 'More!',
	execute(message, args, newGame) {
		//message.channel.send('Mooooore!!!');
		newGame(message.channel)
	},
};
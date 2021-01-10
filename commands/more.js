module.exports = {
	name: 'mao',
	description: 'Mao!',
	execute(message, args, newGame, client) {
		newGame(message, client, "ms")
	},
};
module.exports = {
	name: 'mao',
	description: 'Mao!',
	execute(message, args, newGame) {
		newGame(message, message.guild, "ms")
	},
};
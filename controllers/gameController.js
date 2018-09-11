var games = require("../models/game"),
    express = require("express"),
    SlackBot = require('slackbots');

const bot = new SlackBot({
    token: "xoxb-433184420918-431115080656-2QXNfwtoakG3TnQlznvkA7Hl",
    name: "overseer"
});
exports.createGame = async function (req, res) {

    const channel_id = req.body.channel_id;
    const channel_name = req.body.channel_name;
    await games.create({ channel_id });
    bot.getChannel(channel_name)
        .then(
            channel => {
                channel.members.array.forEach(element => {
                    games.add({ channel: channel_id, newAssassin: element, newTarget: "null" })
                });
            }
        )
    console.log("slack");
    res.send(200);

}
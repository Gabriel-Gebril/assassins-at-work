var games = require("../models/game"),
    express = require("express"),
    SlackBot = require('slackbots');

const bot = new SlackBot({
    token: "xoxb-433184420918-431115080656-2QXNfwtoakG3TnQlznvkA7Hl",
    name: "overseer"
});
exports.createGame = async function (req, res) {

    console.log(req.body);
    const channel_id = req.body.channel_id;
    console.log(channel_id);
    const channel_name = req.body.channel_name;
    await games.create({ channel: channel_id });
    // bot.getChannel(channel_name)
    //     .then(
    //         channel => {
    //             channel.members.array.forEach(element => {
    //                 games.add({ channel: channel_id, newAssassin: element, newTarget: "null" })
    //             });
    //         }
    //     )
    console.log("slack");
    res.sendStatus(200);

}
var games = require("../models/game"),
    express = require("express"),
    SlackBot = require('slackbots'),
    Slack = require('slack');



const bot = new SlackBot({
    token: "xoxb-433184420918-431115080656-2QXNfwtoakG3TnQlznvkA7Hl",
    name: "overseer"
});

//This slackbot is here to extend the normal bot
const exBot = new Slack({ token: "xoxp-433184420918-431721615043-431722118451-6fc88091b918e2a560bbaace8a91ddfd" });


/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

exports.createGame = async function (req, res) {

    // console.log(req.body);
    const channel_id = req.body.channel_id;
    console.log(channel_id);
    const channel_name = req.body.channel_name;
    await games.create({ channel: channel_id });
    let assassins = await exBot.channels.info({ channel: channel_id });
    assassins = assassins.channel.members;
    for (let i = 0; i < assassins.length; i++) {
        const userE = assassins[i];
        let info = await exBot.users.info({ user: userE });
        assassins[i] = { id: info.user.id, name: info.user.name, is_bot: info.user.is_bot };
    }
    assassins.filter(e => {
        console.log(!e.is_bot);
        return !e.is_bot;
    });
    console.log(assassins);
    assassins = shuffle(assassins);
    let targets = [];
    for (let i = 0; i < assassins.length; i++) {
        if (i < assassins.length - 1) {
            targets[i] = assassins[i + 1];
        } else {
            targets[i] = assassins[0];
        }
    }
    games.add({
        channel: channel_id,
        assassins: assassins,
        targets: targets
    });

    // for (let i = 0; i < assassins.length; i++) {
    //     bot.postMessage(assassins[i], `your `)
    // }

    res.sendStatus(200);

}
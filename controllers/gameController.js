var games = require("../models/game"),
    SlackBot = require('slackbots'),
    Slack = require('slack'),
    keys = require('../config/keys.js'),
    tokens = require("../models/tokens");


// const bot = new SlackBot({
//     token: keys.slack.bot,
//     name: "overseeer"
// })

// //This slackbot is here to extend the normal bot
// const exBot = new Slack({ token: keys.slack.access });


// /**
//  * Shuffles array in place.
//  * @param {Array} a items An array containing the items.
//  */
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

    res.send({ "response_type": "in_channel" });
    console.log(req.body)
    const team_id = req.body.team_id;
    console.log(team_id);
    let token = await tokens.findByTokenID({ tokenID: team_id.toUpperCase() });
    token = token.rows[0];
    console.log(token);
    const bot = new SlackBot({
        token: token.bottoken,
        name: "overseeer"
    })

    //This slackbot is here to extend the normal bot
    const exBot = new Slack({ token: token.accesstoken });


    exBot.channel.invite()

    // console.log(req.body);
    const channel_id = req.body.channel_id;

    console.log(channel_id);
    // const channel_name = req.body.channel_name;
    await games.create({ team: team_id }).catch(err => res.send("A game is already going on in your workspace."));
    let assassins = await exBot.channels.info({ channel: channel_id });
    assassins = assassins.channel.members;
    for (let i = 0; i < assassins.length; i++) {
        const userE = assassins[i];
        let info = await exBot.users.info({ user: userE });
        assassins[i] = { id: info.user.id, name: info.user.real_name, is_bot: info.user.is_bot };
    }
    assassins = assassins.filter(e => {
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
        team: team_id,
        assassins: assassins,
        targets: targets
    }).then(res => {
        for (let i = 0; i < assassins.length; i++) {
            // bot.postMessage(assassins[i].id, `your target is ${targets[i].name}`)
            exBot.chat.postMessage({ token: token.bottoken, channel: assassins[i].id, as_user: true, username: 'overseer', text: `your target is ${targets[i].name}` })
        }

    }).catch(err => console.log(err));





}
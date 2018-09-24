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

    // res.send({ "response_type": "in_channel" });

    //console.log(req.body);

    const team_id = req.body.team_id;
    //console.log(team_id);
    let token = await tokens.findByTokenID({ tokenID: team_id.toUpperCase() });
    token = token.rows[0];
    //console.log(token);
    const bot = new SlackBot({
        token: token.bottoken,
        name: "overseeer"
    })

    //This slackbot is here to extend the normal bot
    const exBot = new Slack({ token: token.accesstoken });
    const channel_id = req.body.channel_id;
    let inC = true;
    await exBot.chat.postMessage({ token: token.bottoken, channel: channel_id, as_user: true, username: 'overseer', text: `Creating game...` }).catch(err =>
        inC = false
    );
    if (inC) {
        res.send('');
    } else {
        res.send("Please invite @overseer to channel!")
    }



    // console.log(req.body);


    //console.log(channel_id);
    // const channel_name = req.body.channel_name;
    if (inC) {
        await games.create({ team: team_id }).catch(err => res.send("A game is already going on in your workspace."));
        let assassins = await exBot.channels.info({ channel: channel_id });
        assassins = assassins.channel.members;
        for (let i = 0; i < assassins.length; i++) {
            const userE = assassins[i];
            let info = await exBot.users.info({ user: userE });
            assassins[i] = { id: info.user.id, name: info.user.real_name, is_bot: info.user.is_bot };
        }
        assassins = assassins.filter(e => {
            //console.log(!e.is_bot);
            return !e.is_bot;
        });
        //console.log(assassins);
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
            targets: targets,
            ogc: channel_id
        }).then(res => {
            for (let i = 0; i < assassins.length; i++) {
                // bot.postMessage(assassins[i].id, `your target is ${targets[i].name}`)
                exBot.chat.postMessage({ token: token.bottoken, channel: assassins[i].id, as_user: true, username: 'overseer', text: `Your target is ${targets[i].name}` })
            }

            exBot.chat.postMessage({ token: token.bottoken, channel: channel_id, as_user: true, username: 'overseer', text: `Game Created` })
        }).catch(err => exBot.chat.postMessage({ token: token.bottoken, channel: channel_id, as_user: true, username: 'overseer', text: `A game is already taking place in your workspace` }));


    }




}

getGameState = async function (team) {
    let state = await games.get({ team });
    state = state.rows;

    return state;
}

exports.updateGameState = async function (req, res) {


    let team = req.body.team_id;

    let token = await tokens.findByTokenID({ tokenID: team.toUpperCase() });
    token = token.rows[0];
    const exBot = new Slack({ token: token.accesstoken });
    let valid = true;

    // console.log(req.body);
    let userInfo = await games.find({ team: team, atr: 'assassinid', value: req.body.user_id }).catch(err => valid = false);
    userInfo = userInfo.rows[0]
    // console.log(userInfo)
    let targetInfo = await games.find({ team: team, atr: 'assassinid', value: userInfo.targetid }).catch(err => valid = false);
    targetInfo = targetInfo.rows[0]
    let assailantInfo = await games.find({ team: team, atr: 'assassinid', value: userInfo.assailantid }).catch(err => valid = false);
    assailantInfo = assailantInfo.rows[0]

    if (valid) {
        if (req.body.command === "/dead") {
            if (!userInfo.dead && !userInfo.killed) {
                res.send("You've been marked!")
                games.update({ team: team, atr: 'dead', value: 'TRUE', identifier: "assassinid", identity: userInfo.assassinid })
                exBot.chat.postMessage({ token: token.bottoken, channel: assailantInfo.assassinid, as_user: true, username: 'overseer', text: `Your target has marked themselves as dead! Please type in /killed to confirm you killed them!` })
            } else if (userInfo.dead) {
                res.send("You've already marked yourself! The person who eliminated you should type in /killed to confirm your elimination!")
            } else if (userInfo.killed) {
                res.send("You're dead!")
                games.removeByA({ team: team, assassin: userInfo.assassinid });
                let state = await getGameState(team);
                // console.log(state.length);
                if (state.length === 1) {
                    exBot.chat.postMessage({ token: token.bottoken, channel: userInfo.ogc, as_user: true, username: 'overseer', text: `The winner is ${state[0].assassinname}!` });
                    games.drop({ team });
                } else {
                    games.update({ team, atr: 'targetid', value: userInfo.targetid, identifier: 'assassinid', identity: assailantInfo.assassinid });
                    games.update({ team, atr: 'targetname', value: userInfo.targetname, identifier: 'assassinid', identity: assailantInfo.assassinid });
                    exBot.chat.postMessage({ token: token.bottoken, channel: assailantInfo.assassinid, as_user: true, username: 'overseer', text: `Your next target is ${userInfo.targetname}!` })
                }
            }
        } else if (req.body.command === "/killed") {
            if (!targetInfo.killed && !targetInfo.dead) {
                res.send("You've marked your target!")
                games.update({ team: team, atr: 'killed', value: 'TRUE', identifier: "assassinid", identity: targetInfo.assassinid })
                exBot.chat.postMessage({ token: token.bottoken, channel: userInfo.targetid, as_user: true, username: 'overseer', text: `Your assailant has marked you as dead! Please type /dead to confirm!` })
            } else if (targetInfo.killed) {
                res.send("You've already marked yourself! The person who eliminated you should type in /killed to confirm your elimination!")
            } else if (targetInfo.dead) {
                res.send("Target eliminated!")
                games.removeByA({ team: team, assassin: targetInfo.assassinid }).catch(err => console.log(err));
                let state = await getGameState(team);
                // console.log(state.length);
                if (state.length === 1) {
                    exBot.chat.postMessage({ token: token.bottoken, channel: userInfo.ogc, as_user: true, username: 'overseer', text: `The winner is ${state[0].assassinname}!` });
                    games.drop({ team });
                } else {
                    games.update({ team, atr: 'targetid', value: targetInfo.targetid, identifier: 'assassinid', identity: userInfo.assassinid });
                    games.update({ team, atr: 'targetname', value: targetInfo.targetname, identifier: 'assassinid', identity: userInfo.assassinid });
                    exBot.chat.postMessage({ token: token.bottoken, channel: userInfo.assassinid, as_user: true, username: 'overseer', text: `The your next target is ${targetInfo.targetname}!` })
                }
            }
        }


    } else {
        console.log("f");
        res.send("No game is going on. Consider making one with /creategame!")
    }



}

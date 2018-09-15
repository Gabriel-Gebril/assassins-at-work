var tokens = require("../models/tokens"),
    SlackBot = require('slackbots'),
    Slack = require('slack'),
    keys = require('../config/keys.js'),
    request = require('request-promise');

exports.auth = function (code) {
    const oauthURL = 'https://slack.com/api/oauth.access?' +
        'client_id=' + keys.slack.clientID + '&' +
        'client_secret=' + keys.slack.clientSecret + '&' +
        'code=' + code;

    console.log(oauthURL);
    const options = {
        url: oauthURL,
        json: true
    }

    return (request(options))
        .then(res => {
            tokens.add(res).then(resp => console.log(resp));
            const exBot = new Slack({ token: res });
            exBot.auth.test({ res });
        });
}
var SlackBot = require('slackbots');
var axios = require('axios');


const bot = new SlackBot({
    token: "xoxb-433184420918-431115080656-2QXNfwtoakG3TnQlznvkA7Hl",
    name: "overseer"
});

bot.on('start', () => {
    const params = {
        icon_emoji: ":thinking_face:"
    }

    bot.postMessageToChannel('general', "thinking", params);
})

// Message Handler 

bot.on("message", data => {
    if (data.type !== "message") {
        return
    }
    console.log("after");
    handleMessage(data.text);
    // console.log(data);
});

function handleMessage(message) {
    if (message.includes('overseer') && (message.includes("make a game"))) {
        bot.getChannel('general')
            .then(channel => {
                console.log(channel.members);
            });
        bot.postMessageToChannel("")
    }
}

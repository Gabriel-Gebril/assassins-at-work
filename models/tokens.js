var db = require('../helpers/db');

create = async function () {
    var sql = `CREATE TABLE IF NOT EXISTS tokens(
        tokenID VARCHAR(255) NOT NULL,
        botToken VARCHAR(255) NOT NULL,
        accessToken VARCHAR(255) NOT NULL,
        UNIQUE(tokenID)
    )`;

    await db.query(sql);
}

create();

exports.add = async function (obj) {
    sql = `INSERT INTO tokens(tokenID,botToken,accessToken) VALUES(
        '${obj.team_id}','${obj.bot.bot_access_token}','${obj.access_token}'
    )`

    return await db.query(sql);
}

exports.findByTokenID = async function (obj) {
    sql = `SELECT * FROM tokens WHERE tokenID='${obj.tokenID}'`;
    return await db.query(sql);
}

var db = require('../helpers/db');

exports.create = async function (obj) {
    var sql = `CREATE TABLE ${obj.channel}(
        assassin VARCHAR(128) NOT NULL,
        target VARCHAR(128) NOT NULL,
        marked BOOLEAN DEFAULT FALSE,
        UNIQUE(assassin)
    )`
    return (await db.query(sql));
}

exports.add = async function (obj) {
    var sql = `INSERT INTO ${obj.channel}(assassin,target)
    VALUES('${obj.newAssassin}','${obj.newTarget}')`;
    return (await db.query(sql));
}

exports.update = async function (obj) {
    var sql = `UPDATE ${obj.channel} SET ${obj.atr}='${obj.value}`;
    return (await db.query(sql));
}

exports.find = async function (obj) {
    var sql = `SELECT * FROM ${obj.channel} WHERE ${obj.atr} = '${obj.value}'`
}

exports.removeByA = async function (obj) {
    var sql = `DELETE FROM ${obj.channel} WHERE assassin='${obj.assassin}'`;
    return (await db.query(sql));
}

exports.removeByT = async function (obj) {
    var sql = `DELETE FROM ${obj.channel} WHERE target='${obj.target}'`;
    return (await db.query(sql));
}
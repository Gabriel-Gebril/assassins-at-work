var db = require('../helpers/db');

exports.create = async function (obj) {
    var sql = `CREATE TABLE IF NOT EXISTS ${obj.team}(
        assassinID VARCHAR(128) NOT NULL,
        targetID VARCHAR(128) NOT NULL,
        assassinName VARCHAR(128) NOT NULL,
        targetName VARCHAR(128) NOT NULL,
        marked BOOLEAN DEFAULT FALSE,
        UNIQUE(assassinID)
    )`
    return (await db.query(sql));
}

exports.add = async function (obj) {
    var assassins = obj.assassins;
    var targets = obj.targets;

    let values = ``;

    for (let i = 0; i < assassins.length; i++) {
        if (i < assassins.length - 1) {
            values += `('${assassins[i].id}','${targets[i].id}','${assassins[i].name}','${targets.name}'),`
        } else {
            values += `('${assassins[i].id}','${targets[i].id}','${assassins[i].name}','${targets.name}')`
        }

    }

    var sql = `INSERT INTO ${obj.team}(assassinID,targetID,assassinName,targetName)
    VALUES${values}`;
    return (await db.query(sql));
}

exports.update = async function (obj) {
    var sql = `UPDATE ${obj.channel} SET ${obj.atr}='${obj.value}`;
    return (await db.query(sql));
}

exports.find = async function (obj) {
    var sql = `SELECT * FROM ${obj.team} WHERE ${obj.atr} = '${obj.value}'`
}

exports.removeByA = async function (obj) {
    var sql = `DELETE FROM ${obj.team} WHERE assassin='${obj.assassin}'`;
    return (await db.query(sql));
}

exports.removeByT = async function (obj) {
    var sql = `DELETE FROM ${obj.team} WHERE target='${obj.target}'`;
    return (await db.query(sql));
}
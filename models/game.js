var db = require('../helpers/db');

exports.create = async function (obj) {
    var sql = `CREATE TABLE IF NOT EXISTS ${obj.team}(
        assassinID VARCHAR(128) NOT NULL,
        targetID VARCHAR(128) NOT NULL,
        assailantID VARCHAR(128) NOT NULL,
        assassinName VARCHAR(128) NOT NULL,
        targetName VARCHAR(128) NOT NULL,
        assailantName VARCHAR(128) NOT NULL,
        dead BOOLEAN DEFAULT FALSE,
        killed BOOLEAN DEFAULT FALSE,
        ogc VARCHAR(128) NOT NULL,
        UNIQUE(assassinID)
    )`
    return (await db.query(sql));
}

exports.add = async function (obj) {
    var assassins = obj.assassins;
    var targets = obj.targets;
    var assailants = [];

    for (let i = 0; i < targets.length; i++) {
        if (i < assassins.length - 1) {
            assailants[i] = targets[i + 1];
        } else {
            assailants[i] = targets[0];
        }
    }

    let values = ``;

    for (let i = 0; i < assassins.length; i++) {
        if (i < assassins.length - 1) {
            values += `('${assassins[i].id}','${targets[i].id}','${assailants[i].id}','${assassins[i].name}','${targets[i].name}','${assailants[i].name}','${obj.ogc}'),`
        } else {
            values += `('${assassins[i].id}','${targets[i].id}','${assailants[i].id}','${assassins[i].name}','${targets[i].name}','${assailants[i].name}','${obj.ogc}')`
        }

    }

    var sql = `INSERT INTO ${obj.team}(assassinID,targetID,assailantID,assassinName,targetName,assailantName,ogc)
    VALUES${values}`;
    return (await db.query(sql));
}

exports.update = async function (obj) {
    var sql = `UPDATE ${obj.team} SET ${obj.atr}='${obj.value}' WHERE ${obj.identifier}='${obj.identity}'`;
    return (await db.query(sql));
}

exports.find = async function (obj) {
    var sql = `SELECT * FROM ${obj.team} WHERE ${obj.atr} = '${obj.value}'`
    return (await db.query(sql));
}

exports.get = async function (obj) {
    var sql = `SELECT * FROM ${obj.team}`
    return (await db.query(sql));
}

exports.removeByA = async function (obj) {
    var sql = `DELETE FROM ${obj.team} WHERE assassinid = '${obj.assassin}'`;
    return (await db.query(sql));
}

exports.drop = async function (obj) {
    var sql = `DROP TABLE ${obj.team}`;
    return (await db.query(sql));
}
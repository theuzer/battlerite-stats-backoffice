const iniparser = require('iniparser');

const gameplay = require('../static/assets/gameplay.json');

const english = iniparser.parseSync('./static/assets/English.ini');

exports.getChampionName = championCode => english[gameplay.characters.filter(x => x.typeID === championCode)[0].name];

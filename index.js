#! /usr/bin/env node
const fs = require('fs-extra');
const xml2js  = require('xml2js');
const parser = new xml2js.Parser();
const json2csv = require('json2csv');
const gfmt = require('gfmt');
const chalk = require('chalk');

const argv = require('minimist')(process.argv.slice(2));
const path = argv._[0];

const props = [
  'label',
  'fullName',
  'type',
  'required',
  // 'externalId',
  // 'caseSensitive',
  // 'length',
  // 'trackTrending',
  // 'unique',
];
const dataList = [];

if (!path) {
  console.log(chalk.red('ERROR: You must specify a path to .object file.'));
  process.exit(1);
}

fs.readFile(path, (err, data) => {
  parser.parseString(data, (err, result) => {
    if (err || !(result.CustomObject && result.CustomObject.fields)) {
      console.log(chalk.red('ERROR: Invalid XML format.'));
      process.exit(1);
    }
    for (const field of result.CustomObject.fields) {
      const data = {};
      for (const property of props) {
        data[property] = field[property] ? field[property][0] : null;
      }
      dataList.push(data);
    }
  });

  const csv = json2csv({ data: dataList, fields: props });
  console.log(csv);

  const table = gfmt(dataList);
  console.log(table);
});

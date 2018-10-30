'use strict';

const fs = require('fs');
const path = require('path');
const source = `${__dirname}/../../out/doc/api`;
const data = require(path.join(source, 'all.json'));

const whitelist = ['classes', 'methods', 'modules', 'properties'];

const writeStream = fs.createWriteStream('./result.md', { falgs: 'a' });

writeStream.write('| API | Stability |\n');
writeStream.write('| --- | --------- | \n');


function checkForStability(data) {
  whitelist.forEach((key) => {
    if (data[key]) {
      data[key].forEach((api) => {
        if (api.name && api.stability) {
          // console.log(`${api.name} ---> (${api.stability}) ${api.stabilityText}`);
          writeStream.write(`| ${api.name} |  (${api.stability}) ${api.stabilityText} | \n`);
        } else {
          // console.log(`${api.name} --->  (NA)`);
          // writeStream.write(`${api.name} --->  (NA)\n`);
        }

        checkForStability(api);
      });
    }
  });
}

checkForStability(data);

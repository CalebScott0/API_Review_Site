const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { parse } = require('csv-parse');

const prisma = new PrismaClient({
  log: ['info'],
});

/* TODO:
 * - WRITE BACK IN BASE ATTRIBUTES SEED SCRIPT!
 * - INCLUDE ALL BUSINESS IDS (if no records in base attributes file)
 *  - seed with just id - will be needed for other attribute tables
 */

let count = 0;
const records = [];
async function processCSV() {
  // file will not be in  github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream(
      '/Users/cbs062/Desktop/Review_Site_CSV_Files/business_attributes.csv'
    )
    .pipe(parse({ from_line: 2 }));

  for await (const record of parser) {
    console.log(record);
    break;
  }
}

processCSV()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });

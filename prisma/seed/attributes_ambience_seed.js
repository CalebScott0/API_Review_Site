const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { parse } = require('csv-parse');

const prisma = new PrismaClient({
  log: ['info'],
});

let count = 0;
const records = [];
async function processAmbienceCSV() {
  // file will not be in  github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream(
      '/Users/cbs062/Desktop/Review_Site_CSV_Files/attributes_ambience.csv'
    )
    .pipe(parse({ from_line: 2 }));

  for await (const record of parser) {
    // for businesses that have ambience attribute values
    if (record[1].length) {
      const business_attribute_id = record[0];
      // split json structured ambience field and remove surrounded brackets
      const ambience_arr = record[1].slice(1, record[1].length - 1).split(', ');
      // for each item in the business' ambience str, create a object in records with it's business id
      ambience_arr.forEach((item) => {
        // index of ":" to separate enum type and value from record
        const slice_idx = item.indexOf(':');
        // remove single quotes from json structure
        const key = item.slice(1, slice_idx - 1);
        // remove white space created in json structure
        // to upper case for boolean type in db
        const value = item.slice(slice_idx + 1).trim();

        if (key.length) {
          records.push({
            business_attribute_id,
            // to upper case as enums in db are capitalized
            type: key.toUpperCase(),
            value: value === 'True' ? true : false,
          });
        }
      });
    }
  }
  const total = records.length;
  const BATCH_SIZE = 500;
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const create_batch = records.slice(i, i + BATCH_SIZE);
    try {
      await prisma.attribute_ambience.createMany({
        data: create_batch,
        skipDuplicates: true,
      });
      count += create_batch.length;
      console.log(
        `\n${count} records created / ${total} records \n${(
          (count / total) *
          100
        ).toFixed(2)}%`
      );
    } catch (error) {
      console.log(create_batch);
      console.log(error);
      return;
    }
  }
  console.log('ambience attribute records seeded');
}

processAmbienceCSV()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });

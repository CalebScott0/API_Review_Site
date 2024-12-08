const { PrismaClient, day_of_week } = require('@prisma/client');
const fs = require('fs');
const { parse } = require('csv-parse');

const prisma = new PrismaClient({
  log: ['info'],
});

let count = 0;
const records = [];
async function processCSV() {
  // file will not be in  github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream(
      '/Users/cbs062/Desktop/Review_Site_CSV_Files/hair_speciality.csv'
    )
    .pipe(parse({ from_line: 2 }));

  for await (const record of parser) {
    if (record[1].length) {
      const business_attribute_id = record[0];
      // array of json values for hair types for 1 business
      const hair_type_array = record[1]
        .slice(1, record[1].length - 1)
        .split(', ');

      // slice out type and value for db records
      hair_type_array.forEach((val) => {
        const slice_idx = val.indexOf(':');

        let type = val
          .slice(1, slice_idx - 1)
          .trim()
          .toUpperCase();
        // Adjust for db enum values
        if (type === 'AFRICANAMERICAN') type = 'AFRICAN_AMERICAN';
        if (type === 'STRAIGHTPERMS') type = 'STRAIGHT_PERMS';

        const value = val.slice(slice_idx + 1).trim();

        if (type.length) {
          records.push({
            business_attribute_id,
            type,
            value: value === 'True' ? true : false,
          });
        }
      });
    }
  }
  const BATCH_SIZE = 100;
  const total = records.length;

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const create_batch = records.slice(i, i + BATCH_SIZE);
    try {
      await prisma.attribute_hair_speciality.createMany({
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
  console.log('\nhair speciality attribute records seeded');
}

processCSV()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });
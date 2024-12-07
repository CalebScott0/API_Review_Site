const { PrismaClient, day_of_week } = require('@prisma/client');
const fs = require('fs');
const { parse } = require('csv-parse');

const prisma = new PrismaClient({
  log: ['info'],
});

let count = 0;
const records = [];
async function processBestNightsCSV() {
  // file will not be in  github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream(
      '/Users/cbs062/Desktop/Review_Site_CSV_Files/best_nights.csv'
    )
    .pipe(parse({ from_line: 2 }));

  for await (const record of parser) {
    if (record[1].length) {
      const business_attribute_id = record[0];
      // record[1] = {day_of_week: bool, ....} -- slice out {} from start/end of value
      const days_array = record[1].slice(1, record[1].length - 1).split(', ');

      days_array.forEach((day) => {
        // index to slice is colon separating day and bool value
        const slice_idx = day.indexOf(':');
        // extract day of week and capitalize to match db enums - slice out quotes
        const day_of_week = day
          .slice(1, slice_idx - 1)
          .trim()
          .toUpperCase();
        // extract bool value for each day
        const value = day.slice(slice_idx + 1).trim();
        if (day_of_week.length) {
          records.push({
            business_attribute_id,
            day_of_week,
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
      await prisma.attribute_best_nights.createMany({
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
  console.log('best nights attribute records seeded');
}

processBestNightsCSV()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });

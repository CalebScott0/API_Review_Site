const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { parse } = require('csv-parse');

const prisma = new PrismaClient({
  log: ['info'],
});

/*
 * FIXME:
 * - MAKE SCRIPT MORE EFFICIENT
 */

async function processCSV() {
  let records = [];
  let record_count = 0;
  const BATCH_SIZE = 1000;
  const total = 24000000;
  // file will not be in github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream(
      '/Users/cbs062/Desktop/Review_Site_CSV_Files/user_compliment.csv'
    )
    .pipe(parse({ from_line: 2 }));

  for await (const record of parser) {
    record_count++;
    // compliments have been cleaned to match db fields
    // records are arrays -> need to be objects to insert into prisma
    const [id, user_id, type, count] = [...record];

    records.push({ id, user_id, type, count: +count });

    if (records.length === BATCH_SIZE) {
      try {
        await prisma.user_compliments.createMany({
          data: records,
          skipDuplicates: true,
        });

        const formatted_count = new Intl.NumberFormat().format(record_count);
        const formatted_total = new Intl.NumberFormat().format(total);

        console.log(
          `\n${formatted_count} records created / ~${formatted_total} records \n${(
            (record_count / total) *
            100
          ).toFixed(2)}%`
        );
        records.length = 0;
      } catch (error) {
        console.log(error);
      }
    }
  }
  // extra records after batch creates are done
  try {
    await prisma.user_compliments.createMany({
      data: records,
      skipDuplicates: true,
    });

    const formatted_count = new Intl.NumberFormat().format(record_count);

    console.log(`\n${formatted_count} user compliments seeded`);
  } catch (error) {
    console.log(error);
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

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv-parse");

const prisma = new PrismaClient({
  log: ["info"],
});
let count = 0;
let records = [];
async function processCSV() {
  // file will not be in github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream("/Users/cbs062/Desktop/Review_Site_CSV_Files/review.csv")
    .pipe(parse({ from_line: 2 }));

  const BATCH_SIZE = 10;
  for await (const record of parser) {
    records.push({
      id: record[0],
      author_id: record[1],
      business_id: record[2],
      stars: +record[3],
      review_text: record[4],
      useful: +record[5],
      funny: +record[6],
      cool: +record[7],
      created_at: new Date(record[9]),
      updated_at: new Date(record[10]),
    });

    if (records.length === BATCH_SIZE) {
      (async () => {
        try {
          await prisma.review.createMany({
            data: [...records.splice(0, records.length)],
            skipDuplicates: true,
          });
        } catch (error) {
          console.log(error);
        }
      })()
        .then(() => (count += BATCH_SIZE))
        .then(() => console.log(`${count} reviews created`));
    }
  }
  if (records.length > 0) {
    (async () => {
      try {
        await prisma.review.createMany({
          data: records,
          skipDuplicates: true,
        });
      } catch (error) {
        console.log(error);
      }
    })()
      .then(() => (count += records.length))
      .then(() => console.log(`${count} reviews created`));
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

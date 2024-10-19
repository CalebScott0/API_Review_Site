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
    .createReadStream("/Users/cbs062/Desktop/Review_Site_CSV_Files/tips.csv")
    .pipe(parse({ from_line: 2 }));
  console.log("Parsing records...");
  for await (const record of parser) {
    records.push({
      author_id: record[0],
      business_id: record[1],
      created_at: new Date(record[2]),
      tip_text: record[3],
    });
  }

  const total = records.length;
  console.log("Creating records..");
  while (records.length) {
    const batch = records.splice(0, 100);
    (async () => {
      try {
        await prisma.tips.createMany({
          data: batch,
          skipDuplicates: true,
        });
      } catch (error) {
        console.log(error);
      }
    })()
      .then(() => (count += batch.length))
      .then(() => console.log(`${count} tips created / ${total}`));
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

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv-parse");

const prisma = new PrismaClient({
  log: ["info"],
});

let parse_count = 0;
let records = [];
async function processCSV() {
  // file will not be in github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream("/Users/cbs062/Desktop/Review_Site_CSV_Files/review.csv")
    .pipe(parse({ from_line: 2 }));

  console.log("Parsing records...");
  let parse_count = 0;

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
    parse_count++;
    if (parse_count % 10000 === 0) console.log(parse_count);
  }

  const total = records.length;
  console.log("Creating records..");

  while (records.length) {
    const batch = records.splice(0, 100);
    (async () => {
      try {
        await prisma.review.createMany({
          data: batch,
          skipDuplicates: true,
        });
      } catch (error) {
        console.log(error);
      }
    })()
      .then(() => (parse_count += batch.length))
      .then(() =>
        console.log(`${parse_count} records attempted to create / ${total}`)
      );
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

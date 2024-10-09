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
    .createReadStream("/Users/cbs062/Desktop/Review_Site_CSV_Files/users.csv")
    .pipe(parse({ from_line: 2 }));
  console.log("Parsing records...");
  for await (const record of parser) {
    records.push({
      id: record[0],
      username: record[1],
      password: record[2],
      first_name: record[3],
      average_stars: parseFloat(record[6]),
      review_count: +record[7],
      user_since: new Date(record[9]),
      useful: +record[10],
      funny: +record[11],
      cool: +record[12],
      fans: +record[13],
    });
  }

  const total = records.length;
  console.log("Creating records..");
  while (records.length) {
    const batch = records.splice(0, 100);
    (async () => {
      try {
        await prisma.user.createMany({
          data: batch,
          skipDuplicates: true,
        });
      } catch (error) {
        console.log(error);
      }
    })()
      .then(() => (count += batch.length))
      .then(() =>
        console.log(`${count} records attempted to create / ${total}`)
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

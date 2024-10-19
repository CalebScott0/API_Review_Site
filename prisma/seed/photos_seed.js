const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv-parse");

const prisma = new PrismaClient({
  log: ["info"],
});

let records = [];
let count = 0;
async function processCSV() {
  const parser = fs
    .createReadStream(
      "/Users/cbs062/Desktop/Review_Site_CSV_Files/photos_business.csv"
    )
    .pipe(
      parse({
        from_line: 2,
      })
    );
  console.log("Parsing records");

  const BATCH_SIZE = 1000;
  for await (const record of parser) {
    records.push({
      id: record[0],
      business_id: record[1],
      caption: record[2],
      //   label is type enum with all cap values
      label: record[3].toUpperCase(),
    });
  }
  const total = records.length;
  while (records.length > 0) {
    try {
      await prisma.business_photos.createMany({
        data: [...records.splice(0, BATCH_SIZE)],
        skipDuplicates: true,
      });
      count += BATCH_SIZE;
      console.log(`${count} records created / ${total} total`);
    } catch (error) {
      console.log(error);
    }
  }
  console.log("Completed");
}

processCSV()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect();
  });

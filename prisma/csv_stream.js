const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv-parse");

const prisma = new PrismaClient({
  log: ["info"],
});

let tips = [];
async function processCSV() {
  // file will not be in github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream("/Users/cbs062/Desktop/Review_Site_CSV_Files/tips.csv")
    .pipe(parse({ from_line: 2 }));
  for await (const record of parser) {
    tips.push({
      author_id: record[0],
      business_id: record[1],
      created_at: new Date(record[2]),
      tip_text: record[3],
    });
  }
  const total = tips.length;
  let count = 0;
  console.log("Creating records...");
  while (tips.length) {
    count += 1000;
    try {
      await prisma.tip.createMany({
        data: [...tips.splice(0, 1000)],
      });
    } catch (error) {
      console.error(error);
    }
    console.log(`${count} records / ${total}`);
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

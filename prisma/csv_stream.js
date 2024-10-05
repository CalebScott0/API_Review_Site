const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv-parse");

const prisma = new PrismaClient({
  log: ["info"],
});

let categories_businesses = [];
async function processCSV() {
  // file will not be in github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream(
      "/Users/cbs062/Desktop/Review_Site_CSV_Files/CategoryToBusiness.csv"
    )
    .pipe(parse({ from_line: 2 }));
  for await (const record of parser) {
    categories_businesses.push({
      business_id: record[1],
      category_id: record[2],
    });
  }
  console.log("creating records");
  await prisma.category_business.createMany({
    data: categories_businesses,
  });
}
processCSV()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });

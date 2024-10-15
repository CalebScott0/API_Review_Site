const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const { parse } = require("csv-parse");

const prisma = new PrismaClient({
  log: ["info"],
});

let count = 0;
const records = [];
async function processAmbienceCSV() {
  // file will not be in github as it is part of yelp academic dataset
  const parser = fs
    .createReadStream(
      "/Users/cbs062/Desktop/Review_Site_CSV_Files/attributes_ambience.csv"
    )
    .pipe(parse({ from_line: 2 }));

  for await (const record of parser) {
    // for businesses that have ambience attribute values
    if (record[1].length) {
      const business_attribute_id = record[0];
      // split json structured ambience field and remove surrounded brackets
      const ambienceStr = record[1].slice(1, record[1].length - 1).split(", ");

      // for each item in the business' ambience str, create a object in records with it's business id
      ambienceStr.forEach((item) => {
        // index of ":" to seperate enum type and value from record
        const sliceIdx = item.indexOf(":");
        // remove single quotes from json structure
        const key = item.slice(1, sliceIdx - 1);
        // remove white space created in json structure
        // to upper case for boolean type in db
        const value = item.slice(sliceIdx + 1).trim();
        records.push({
          business_attribute_id,
          // to upper case as enums in db are capitalized
          type: key.toUpperCase(),
          value: value === "True" ? true : false,
        });
      });
    }
  }
  const total = records.length;
  const BATCH_SIZE = 100;
  for (let i = 0; i < total; i++) {
    // for (let i = 0; i < total; i += BATCH_SIZE) {
    // const create_batch = records.slice(i, i + BATCH_SIZE);
    try {
      await prisma.attribute_ambience.create({
        // await prisma.attribute_ambience.createMany({
        data: records[i],
        // data: create_batch,
        // skipDuplicates: true,
      });
      count++;
      // count += create_batch.length;
      console.log(`${count} records created / ${total} records`);
    } catch (error) {
      // console.log(error);
      // console.log(records[i]);
    }
  }
  ("ambience attribute records seeded");
}

// async function processBestNightsCSV() {
//   // file will not be in github as it is part of yelp academic dataset
//   const parser = fs
//     .createReadStream(
//       "/Users/cbs062/Desktop/Review_Site_CSV_Files/attributes_ambience.csv"
//     )
//     .pipe(parse({ from_line: 2 }));

//   for await (const record of parser) {
//     // for businesses that have ambience attribute values
//     if (record[1].length) {
//       const business_attribute_id = record[0];
//       // split json structured ambience field and remove surrounded brackets
//       const ambienceStr = record[1].slice(1, record[1].length - 1).split(", ");

//       // for each item in the business' ambience str, create a object in records with it's business id
//       ambienceStr.forEach((item) => {
//         // index of ":" to seperate enum type and value from record
//         const sliceIdx = item.indexOf(":");
//         // remove single quotes from json structure
//         const key = item.slice(1, sliceIdx - 1);
//         // remove white space created in json structure
//         // to upper case for boolean type in db
//         const value = item.slice(sliceIdx + 1).trim();
//         records.push({
//           business_attribute_id,
//           // to upper case as enums in db are capitalized
//           type: key.toUpperCase(),
//           value: value === "True" ? true : false,
//         });
//       });
//     }
//   }
//   const total = records.length;
//   const BATCH_SIZE = 1000;
//   for (let i = 0; i < total; i += BATCH_SIZE) {
//     const create_batch = records.slice(i, i + BATCH_SIZE);
//     try {
//       await prisma.attribute_ambience.createMany({
//         data: create_batch,
//         skipDuplicates: true,
//       });
//       count += create_batch.length;
//       console.log(`${count} records created / ${total} records`);
//     } catch (error) {
//       console.log(error);
//       console.log(records[i]);
//     }
//   }
// }

processAmbienceCSV()
  .then(() => {
    // processBestNightsCSV()
  })
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });

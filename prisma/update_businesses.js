// const { PrismaClient } = require("@prisma/client");

// const prisma = new PrismaClient({
//   log: ["info"],
// });

// const getRandomTime = (min_hour, max_hour) => {
//   let hour = Math.floor(Math.random() * (max_hour - min_hour + 1)) + min_hour;
//   hour = hour < 10 ? hour.toString().padStart(2, "0") : hour;
//   let minute = Math.random();
//   // random minute value based on random between 0 and 1
//   minute = minute > 0.5 ? "30" : minute > 0.25 ? "15" : "00";
//   return `${hour}:${minute}`;
// };
// (async function () {
//   // grab all businesses with no hours
//   const businesses_no_hours =
//     await prisma.$queryRaw`SELECT DISTINCT business_id FROM business_hours
//     WHERE open_time = '00:00:00'
//     AND close_time = '00:00:00';`;
//   console.log(businesses_no_hours.length);
//   return;
//   const day_of_week_set = new Set([
//     "MONDAY",
//     "TUESDAY",
//     "WEDNESDAY",
//     "THURSDAY",
//     "FRIDAY",
//     "SATURDAY",
//     "SUNDAY",
//   ]);
//   console.log("updating business hours records...");
//   for (let i = 0; i < businesses_no_hours.length; i++) {
//     const weekday_hours = {
//       open_time: getRandomTime(6, 10), //random week day opening between 6pm and 10pm
//       close_time: getRandomTime(17, 22), // closing time between 5pm and 10pm
//     };

//     const weekend_hours = {
//       open_time: getRandomTime(8, 11), //random weekend opening time between 8am and 11am
//       close_time: getRandomTime(16, 23), // closing time between 4pm and 11pm
//     };
//     // iterate through day of week set to update business hours records by day
//     day_of_week_set.forEach(async (day) => {
//       const hours =
//         day === "SATURDAY" || day === "SUNDAY" ? weekend_hours : weekday_hours;
//       // assign weekend hours
//       try {
//         await prisma.business_hours.upsert({
//           where: {
//             // where filter on unique identifier
//             business_id_day_of_week: {
//               business_id: businesses_no_hours[i].business_id,
//               day_of_week: day,
//             },
//           },
//           update: {
//             // create new date object by inputting time into base format
//             open_time: new Date(`1970-01-01T${hours.open_time}:00Z`),
//             close_time: new Date(`1970-01-01T${hours.close_time}:00Z`),
//           },
//           // create record if not exists
//           create: {
//             business_id: businesses_no_hours[i].business_id,
//             day_of_week: day,
//             open_time: new Date(`1970-01-01T${hours.open_time}:00Z`),
//             close_time: new Date(`1970-01-01T${hours.close_time}:00Z`),
//           },
//         });
//       } catch (error) {
//         console.log(error);
//         console.log(weekday_hours);
//         console.log(weekend_hours);
//       } finally {
//         console.log(((i / businesses_no_hours.length) * 100).toFixed(2) + "%");
//       }
//     });
//   }

//   // const businesses = await prisma.$queryRaw`SELECT * FROM businesses`;
//   // console.log(
//   //   `Updating ${businesses.length} businesses with review count and average stars...`
//   // );
//   // // group reviews by business_id average on stars and total count
//   // const business_stats = await prisma.reviews.groupBy({
//   //   by: ["business_id"],
//   //   _avg: {
//   //     stars: true, // Calculate the average stars
//   //   },
//   //   _count: {
//   //     stars: true, // Count the total number of reviews
//   //   },
//   // });
//   // const BATCH_SIZE = 100;
//   // for (let i = 0; i < business_stats.length; i += BATCH_SIZE) {
//   //   // create array of business promises
//   //   const update_batch = business_stats
//   //     .slice(i, i + BATCH_SIZE)
//   //     .map((business) =>
//   //       prisma.businesses.update({
//   //         where: {
//   //           id: business.business_id,
//   //         },
//   //         data: {
//   //           average_stars: +business._avg.stars.toFixed(2),
//   //           review_count: business._count.stars,
//   //         },
//   //       })
//   //     );
//   //   await Promise.all(update_batch);
//   //   console.log(
//   //     `Updated business # ${i} / ${business_stats.length} - ${(
//   //       (i / businesses.length) *
//   //       100
//   //     ).toFixed(2)}%...`
//   //   );
//   // }
//   // console.log("Business Update Complete");
// })()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.log(e);

//     await prisma.$disconnect();
//   });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  log: ["info"],
});

(async function () {
  const businesses = await prisma.businesses.findMany({
    select: {
      id: true,
    },
  });
  console.log(
    `Updating ${businesses.length} businesses with review count and average stars...`
  );
  // group reviews by business_id average on stars and total count
  const business_stats = await prisma.reviews.groupBy({
    by: ["business_id"],
    _avg: {
      stars: true, // Calculate the average stars
    },
    _count: {
      stars: true, // Count the total number of reviews
    },
  });
  const BATCH_SIZE = 100;

  for (let i = 0; i < business_stats.length; i += BATCH_SIZE) {
    // create array of business promises
    const update_batch = business_stats
      .slice(i, i + BATCH_SIZE)
      .map((business) =>
        prisma.businesses.update({
          where: {
            id: business.business_id,
          },
          data: {
            average_stars: +business._avg.stars.toFixed(2),
            review_count: business._count.stars,
          },
        })
      );
    await Promise.all(update_batch);
    console.log(
      `Updated business # ${i} / ${business_stats.length} - ${(
        (i / businesses.length) *
        100
      ).toFixed(2)}%...`
    );
  }
  console.log("Business Update Complete");
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);

    await prisma.$disconnect();
  });

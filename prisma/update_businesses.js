const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  log: ["info"],
});
const roundHalf = (num) => {
  return Math.round(num * 2) / 2;
};

(async function () {
  const businesses = await prisma.business.findMany({
    select: {
      id: true,
    },
  });
  console.log(
    `Updating ${businesses.length} businesses with review count and average stars...`
  );
  // group reviews by business_id average on stars and total count
  const business_stats = await prisma.review.groupBy({
    by: ["business_id"],
    _avg: {
      stars: true, // Calculate the average stars
    },
    _count: {
      stars: true, // Count the total number of reviews
    },
  });
  for (let i = 0; i < business_stats.length; i++) {
    // let average_stars = await averageBusinessStars(businesses[i].id);

    // let review_count = await countBusinessReviews(businesses[i].id);
    await prisma.business.update({
      where: {
        id: business_stats[i].business_id,
      },
      data: {
        average_stars: +business_stats[i]._avg.stars.toFixed(2),
        review_count: business_stats[i]._count.stars,
      },
    });
    // await prisma.business.update({
    //   where: { id: businesses[i].id },
    //   data: {
    //     average_stars,
    //     review_count,
    //   },
    // });

    i !== 0 &&
      console.log(
        `Updated business # ${i} / ${businesses.length} - ${(
          (i / businesses.length) *
          100
        ).toFixed(2)}%...`
      );
  }

  console.log("Businesses updated");
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);

    await prisma.$disconnect();
  });

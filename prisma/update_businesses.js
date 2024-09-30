const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["info"],
});

const roundHalf = (num) => {
  return Math.round(num * 2) / 2;
};

// total count of reviews for a business given an id
const countBusinessReviews = (id) => {
  return prisma.review.count({
    where: { business_id: id },
  });
};

// average all stars from reviews for a business given an id
const averageBusinessStars = async (id) => {
  // return from aggregate will look like: { _avg: { stars: 5 } }
  // return prisma.$queryRaw`SELECT AVG(stars) FROM "Review" WHERE "business_id"=${id};`;
  return roundHalf(
    (
      await prisma.review.aggregate({
        _avg: {
          stars: true,
        },
        where: { business_id: id },
      })
    )._avg.stars
  );
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
  // for each business, update with review count and average stars rounded to nearest 0.5
  for (let i = 0; i < businesses.length; i++) {
    const average_stars = averageBusinessStars(businesses[i].id);

    const review_count = countBusinessReviews(businesses[i].id);

    Promise.all([average_stars, review_count]).then((values) =>
      prisma.business.update({
        where: { id: businesses[i].id },
        data: {
          average_stars: values[0],
          review_count: values[1],
        },
      })
    );

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

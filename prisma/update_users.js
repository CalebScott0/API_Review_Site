// DONT ROUND TO HALF, LEAVE AS FULL AVERAGE FIXED TO 2 DECIMALS
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  log: ["info"],
});

(async function () {
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });
  console.log(
    `Updating ${users.length} users with review count and average stars...`
  );
  // group reviews by author_id average on stars and total count
  const user_stats = await prisma.review.groupBy({
    by: ["author_id"],
    _avg: {
      stars: true, // Calculate the average stars
    },
    _count: {
      stars: true, // Count the total number of reviews
    },
  });
  for (let i = 0; i < user_stats.length; i++) {
    await prisma.user.update({
      where: {
        id: user_stats[i].author_id,
      },
      data: {
        average_stars: +user_stats[i]._avg.stars.toFixed(2),
        review_count: user_stats[i]._count.stars,
      },
    });

    i !== 0 &&
      console.log(
        `Updated users # ${i} / ${users.length} - ${(
          (i / users.length) *
          100
        ).toFixed(2)}%...`
      );
  }

  console.log("Users updated");
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);

    await prisma.$disconnect();
  });

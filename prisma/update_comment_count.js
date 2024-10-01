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
  console.log(`Updating ${users.length} users with comment count...`);
  // group reviews by author_id average on stars and total count
  const user_stats = await prisma.comment.groupBy({
    by: ["author_id"],
    _count: {
      author_id: true, // Count the total number of reviews
    },
  });
  for (let i = 0; i < user_stats.length; i++) {
    await prisma.user.update({
      where: {
        id: user_stats[i].author_id,
      },
      data: {
        comment_count: user_stats[i]._count.author_id,
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

  const reviews = await prisma.review.findMany({
    select: {
      id: true,
    },
  });
  console.log(`Updating ${reviews.length} reviews with comment count...`);
  // group reviews by author_id average on stars and total count
  const review_stats = await prisma.comment.groupBy({
    by: ["review_id"],
    _count: {
      review_id: true, // Count the total number of reviews
    },
  });

  for (let i = 0; i < review_stats.length; i++) {
    await prisma.review.update({
      where: {
        id: review_stats[i].review_id,
      },
      data: {
        comment_count: review_stats[i]._count.review_id,
      },
    });

    i !== 0 &&
      console.log(
        `Updated review # ${i} / ${reviews.length} - ${(
          (i / reviews.length) *
          100
        ).toFixed(2)}%...`
      );
  }

  console.log("Reviews updated");
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);

    await prisma.$disconnect();
  });

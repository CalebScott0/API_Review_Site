const averageBusinessStars = (
  average_stars,
  review_count,
  stars_to_add,
  denominator_review_count
) => {
  return (
    Math.round(
      ((average_stars * review_count + stars_to_add) /
        denominator_review_count) *
        2
    ) / 2
  );
};

const averageUserStars = (
  average_stars,
  review_count,
  stars_to_add,
  denominator_review_count
) => {
  return parseFloat(
    (
      (average_stars * review_count + stars_to_add) /
      denominator_review_count
    ).toFixed(2)
  );
};

module.exports = { averageBusinessStars, averageUserStars };

const averageBusinessStars = (
  average_stars,
  review_count,
  stars_to_add,
  denominator_review_count
) => {
  // if number to divide by (updated review count) is 0
  if (denominator_review_count === 0) return 0;

  // parseback to float as toFixed returns string
  return parseFloat(
    (
      (average_stars * review_count + stars_to_add) /
      denominator_review_count
    ).toFixed(2)
  );
};

const averageUserStars = (
  average_stars,
  review_count,
  stars_to_add,
  denominator_review_count
) => {
  if (denominator_review_count === 0) return 0;

  // parseback to float as toFixed returns string
  return parseFloat(
    (
      (average_stars * review_count + stars_to_add) /
      denominator_review_count
    ).toFixed(2)
  );
};

const roundHalf = (num) => {
  return Math.round(num * 2) / 2;
};

const metersToMiles = (num) => {
  const miles = num / 1609;
  // handling for values within a very small radius
  if (miles < 0.1) return "0.1 miles";

  return miles.toFixed(1) + " miles";
};

module.exports = {
  averageBusinessStars,
  averageUserStars,
  metersToMiles,
  roundHalf,
};

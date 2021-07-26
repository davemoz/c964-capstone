const boroughs = {
  Brooklyn: "bk",
  Bronx: "bx",
  Manhattan: "mn",
  Queens: "qn",
  "Staten Island": "si",
};

const boroughColors = ["green", "blue", "red", "purple", "orange"];

const boroughColorsByCode = new Map(
  boroughColors.map((color, idx) => [idx + 1, color])
);

export { boroughs, boroughColorsByCode };

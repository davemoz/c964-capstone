const boroughColors = ["green", "blue", "red", "purple", "orange"];

let boroughColorsByCode = new Map(
  boroughColors.map((color, idx) => [idx + 1, color])
);

export { boroughColorsByCode };

export const SOSRedColorSet = [
  "#f00",
  "#f00",
  "#000",
  "#000", // 亮200、灭200、
  "#f00",
  "#f00",
  "#000",
  "#000", // 亮200、灭200、
  "#f00",
  "#f00",
  "#000",
  "#000",
  "#000",
  "#000",
  "#000", // 亮200、灭500
  "#f00",
  "#f00",
  "#f00",
  "#f00",
  "#000",
  "#000", // 亮400、灭200、
  "#f00",
  "#f00",
  "#f00",
  "#f00",
  "#000",
  "#000", // 亮400、灭200、
  "#f00",
  "#f00",
  "#f00",
  "#f00",
  "#000",
  "#000",
  "#000",
  "#000",
  "#000", // 亮400、灭500、
  "#f00",
  "#f00",
  "#000",
  "#000", // 亮200、灭200、
  "#f00",
  "#f00",
  "#000",
  "#000", // 亮200、灭200、
  "#f00",
  "#f00",
  "#000",
  "#000",
  "#000",
  "#000",
  "#000",
  "#000",
  "#000",
  "#000",
  "#000",
  "#000",
  "#000",
  "#000",
  "#000", // 亮200、灭1300
];

export const SOSBlueColorSet = SOSRedColorSet.map((item) => {
  return item === "#f00" ? "#00f" : item;
});

export const SOSGreenColorSet = SOSRedColorSet.map((item) => {
  return item === "#f00" ? "#0f0" : item;
});

export const SOSWhiteColorSet = SOSRedColorSet.map((item) => {
  return item === "#f00" ? "#fff" : item;
});

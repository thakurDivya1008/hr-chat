const getRandomDigitNumber = (num) => {
  let digitNumber = "";
  for (let i = 0; i < num; i++) {
    digitNumber += Math.floor(Math.random() * 10);
  }
  return digitNumber;
};

module.exports = {
  getRandomDigitNumber,
};

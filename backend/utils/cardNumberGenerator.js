const CardNUmberGenerator = () => {
  let num = "";
  for (var i = 0; i < 16; i++) {
    num = num + Math.floor(Math.random() * 10);
  }
  return num;
};



module.exports = CardNUmberGenerator;

const randomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

function truncateString(str, maxLength) {
  if (typeof str === "string" && str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
}

const capitalizeFirstLetter = (str) => {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
};
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export { randomColor, truncateString, capitalizeFirstLetter, validateEmail };

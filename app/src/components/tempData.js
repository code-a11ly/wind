// tempData.js

let tempData = {}; // Initialize an empty object to store temporary data

export const setTempData = (data) => {
  tempData = data;
};

export const getTempData = () => {
  return tempData;
};

import stringSimilatityLib from 'string-similarity';

const findBestMatch = (str, strArr) => {
  const lowerCaseArr = strArr.map((element) => element.toLowerCase()); //creating lower case array
  const match = stringSimilatityLib.findBestMatch(
    str.toLowerCase(),
    lowerCaseArr
  ).bestMatch; //trying to find bestMatch
  if (match.rating > 0) {
    const foundIndex = lowerCaseArr.findIndex((x) => x === match.target); //finding the index of found best case
    return strArr[foundIndex]; //returning initial value from array
  }
  return null;
};

export default findBestMatch;

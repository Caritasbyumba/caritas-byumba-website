import { isValidPhoneNumber } from "react-phone-number-input";
export const checkValidity = (value, rules) => {
  let isValid = true;
  if (rules.required) {
    isValid = value.trim() !== "" && isValid;
  }

  if (rules.notEmpty) {
    isValid = value.length !== 0 && isValid;
  }
  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
  }

  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
  }
  if (rules.isEmail) {
    const pattern =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = pattern.test(value) && isValid;
    if (value === "") {
      isValid = true;
    }
  }
  if (rules.isDate) {
    const pattern =
      /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$/;
    isValid = pattern.test(value) && isValid;
    if (value === "") {
      isValid = true;
    }
  }

  if (rules.olderThan10) {
    var dtDOB = new Date(value);
    var dtCurrent = new Date();
    isValid = dtCurrent.getFullYear() - dtDOB.getFullYear() > 10 && isValid;
  }
  if (rules.isNumeric) {
    const pattern = /^(\s*|\d+)$/;
    isValid = pattern.test(value) && isValid;
  }

  if (rules.equal) {
    isValid = value === rules.equivalence && isValid;
  }

  if (rules.isPhone) {
    isValid = isValidPhoneNumber(value) ? true : false && isValid;
  }
  if (rules.maximum) {
    isValid = value <= rules.maximum && isValid;
  }

  if (rules.minimum) {
    isValid = value >= rules.minimum && isValid;
  }
  return isValid;
};

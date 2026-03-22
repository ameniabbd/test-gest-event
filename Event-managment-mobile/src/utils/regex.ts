export const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordReg =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹/])[A-Za-z\d~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹/]{8,}$/;
export const pseudoReg=/^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/
export const sirenreg = /^\d{14}$/;
export const rppsreg = /^\d{11}$/;
export const phonereg = /^(?:06|07|\+336|\+337)(?:[ ]?[0-9]{2}){4}$/;
export const tvareg = /^FR\d{11}$/;
export const ribreg = /^CI\d{3}\s\d{5}\s\d{11}\s\d{2}$/;
export const ibanreg =
  /FR[a-zA-Z0-9]{2}\s?([0-9]{4}\s?){2}([0-9]{2})([a-zA-Z0-9]{2}\s?)([a-zA-Z0-9]{4}\s?){2}([a-zA-Z0-9]{1})([0-9]{2})\s?/;
export const amountReg = /^(0|[1-9]\d*)([.,]\d{1,2})?$/;

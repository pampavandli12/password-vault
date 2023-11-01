import CryptoJS from 'crypto-js';

export const generateString = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!&$@#*%()';
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const encryptPassword = (password: string, s_key: string): string => {
  return CryptoJS.AES.encrypt(password, s_key).toString();
};
export const decryptPassword = (
  encryptedPassword: string,
  s_key: string,
): string => {
  try {
    var bytes = CryptoJS.AES.decrypt(encryptedPassword, s_key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return ''; // Return an empty string or handle the error appropriately
  }
};

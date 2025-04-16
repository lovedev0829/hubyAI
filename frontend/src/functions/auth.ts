// interface TokenData {
//   token: string;
//   accessTokenExpire: number;
// }

export const isTokenExpired = (token: string): boolean => {
  const tokenDataJSON = localStorage.getItem(token);
  if (!tokenDataJSON) return true;
  return false;
  // const tokenData: TokenData = JSON.parse(tokenDataJSON);
  // const currentTime = new Date().getTime();
  // return currentTime > tokenData.accessTokenExpire;
};

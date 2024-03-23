import ms from "ms";

export const getExpirationTime = (): Date => {
  const expiresIn = ms(process.env.REFRESH_TOKEN_EXPIRES_IN as string);
  const expirationDate = new Date(Date.now() + expiresIn);
  const tokyoExpirationDate = expirationDate.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });
  const expirationTime = new Date(tokyoExpirationDate);
  return expirationTime;
};

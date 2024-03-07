export type TokenPayload = {
  sub: string;
  iat: number;
  jti: string;
};

export type RequestInfo = {
  ip: string;
  ua: string;
  endpoint: string;
};

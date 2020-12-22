function getHost() {
  const url = process.env.REACT_APP_SERVER_URL;
  const parts = url.split(":");
  parts.pop();
  const host = parts.join(":");
  //  console.log(host);
  return host;
}

export { getHost };

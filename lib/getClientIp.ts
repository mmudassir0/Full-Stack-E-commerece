// utils/getClientIp.ts
export function getClientIp(headersList: Headers): string {
  // Check various header possibilities for IP address
  const xForwardedFor = headersList
    .get("x-forwarded-for")
    ?.split(",")[0]
    .trim();
  const xRealIp = headersList.get("x-real-ip");
  const remoteAddr = headersList.get("remote-addr");

  let clientIp = xForwardedFor || xRealIp || remoteAddr || "127.0.0.1";

  // Handle IPv6 loopback
  if (clientIp === "::1") {
    clientIp = "127.0.0.1";
  }

  // Handle IPv6 format
  if (clientIp.includes(":")) {
    if (clientIp.includes("::ffff:")) {
      clientIp = clientIp.split("::ffff:")[1];
    }
  }

  return clientIp;
}

import { authApiUrl, serverApiBaseUrl } from "./config";
import { auth } from "@/auth";
async function refreshToken(refreshToken: string) {
  const res = await fetch(authApiUrl.refreshToken, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  });
  const data = await res.json();
  console.log({ data });

  return data.accessToken;
}

export async function AuthGetApi(url: string) {
  const session = await auth();

  let res = await fetch(serverApiBaseUrl + url, {
    method: "GET",
    headers: {
      Authorization: `bearer ${session?.user?.accessToken}`,
    },
  });

  if (res.status == 401) {
    if (session && session.user?.refreshToken) {
      const newAccessToken = await refreshToken(session.user.refreshToken);

      res = await fetch(serverApiBaseUrl + url, {
        method: "GET",
        headers: {
          Authorization: `bearer ${newAccessToken}`,
        },
      });
      return await res.json();
    }
  }

  return await res.json();
}

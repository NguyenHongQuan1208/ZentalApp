import { getUserData, refreshTokenFn } from "./auth";

export async function getUserDataWithRetry(
  token,
  refreshToken,
  authCtx,
  refreshCtx
) {
  // Kiểm tra xem token và refreshToken có hợp lệ không
  if (!token) {
    throw new Error("Token is missing");
  }
  if (!refreshToken) {
    throw new Error("Refresh token is missing");
  }

  const response = await getUserData(token);

  if (response.error) {
    if (response.message === "INVALID_ID_TOKEN") {
      console.log("Token is invalid or expired. Refreshing token...");

      try {
        const newTokens = await refreshTokenFn(refreshToken);
        authCtx.authenticate(newTokens.idToken);
        refreshCtx.setRefreshToken(newTokens.refreshToken);

        // Gọi lại API với token mới
        const newResponse = await getUserData(newTokens.idToken);
        if (newResponse) {
          console.log("Refresh Token Success");
        }
        return newResponse;
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        throw refreshError;
      }
    }

    // Nếu lỗi không phải INVALID_ID_TOKEN
    console.error("Error fetching user data:", response.message);
    throw new Error(response.message || "Unknown error");
  }

  return response; // Trả về dữ liệu nếu không có lỗi
}

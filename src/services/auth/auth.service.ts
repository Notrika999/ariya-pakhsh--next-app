import { apiClient } from "@/src/lib/http/client-http";
import {
  RegisterRequest,
  RegisterResponse,
  StartAuthRequest,
  StartAuthResponse,
  UserProfile,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/src/lib/types/auth/auth.type";

export const startPhoneAuth = async (
  data: StartAuthRequest,
): Promise<StartAuthResponse> => {
  const response = await apiClient.post("/CustomerAuth/phone/start", data);

  console.log("Auth start => ", response);
  return response.data.data;
};

export const verifyOtp = async (
  data: VerifyOtpRequest,
): Promise<VerifyOtpResponse> => {
  const response = await apiClient.post("/CustomerAuth/phone/verify", data);

  console.log("Auth Verify => ", response);
  return response.data.data;
};

export const register = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await apiClient.post("/CustomerAuth/register", data);
  console.log("Auth register => ", response);
  return response.data.data;
};

export const AuthService = {
  login: async (credentials: any) => {
    const res = await apiClient.post("/CustomerAuth/login", credentials, {
      withCredentials: true,
    });

    return res.status === 200;
  },

  refreshToken: async () => {
    const res = await apiClient.post(
      "/CustomerAuth/refresh-token",
      {},
      { withCredentials: true },
    );

    return res.data?.success === true || res.status === 200;
  },

  logout: async () => {
    try {
      await apiClient.post(
        "/CustomerAuth/logout",
        {},
        {
          withCredentials: true,
        },
      );
    } finally {
      window.location.href = "/auth/login";
    }
  },
};

export const getMe = async (): Promise<UserProfile> => {
  const res = await apiClient.get("/CustomerAuth/me");

  console.log("Auth me => ", res);
  return res.data.data;
};

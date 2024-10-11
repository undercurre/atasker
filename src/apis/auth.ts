import ApiService, { BackendResultConfig } from "@/service/http";

const backendConfig: BackendResultConfig = {
  codeKey: process.env.CODE_KEY as string,
  dataKey: process.env.DATA_KEY as string,
  msgKey: process.env.MSG_KEY as string,
  successCode: parseInt(process.env.SUCCESS_CODE as string, 10),
};

const authApiService = new ApiService(
  process.env.AUTH_API as string,
  backendConfig
);

export function login() {
  authApiService.post("/auth/login", );
}

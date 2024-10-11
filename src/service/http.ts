import Taro from "@tarojs/taro";
import { localStg } from "./local";

interface BackendResultConfig {
  codeKey: string;
  dataKey: string;
  msgKey: string;
  successCode: number;
}

class ApiService {
  private static instance: ApiService;

  backendConfig: BackendResultConfig;

  baseUrl: string;

  private constructor(
    baseUrl: string,
    backendConfig: {
      codeKey: string;
      dataKey: string;
      msgKey: string;
      successCode: number;
    }
  ) {
    this.backendConfig = backendConfig;
    this.baseUrl = baseUrl;
    this.setupInterceptors();
  }

  public static getInstance(base: string): ApiService {
    if (!ApiService.instance) {
      const baseUrl = base;
      const backendConfig: BackendResultConfig = {
        codeKey: process.env.CODE_KEY as string,
        dataKey: process.env.DATA_KEY as string,
        msgKey: process.env.MSG_KEY as string,
        successCode: parseInt(process.env.SUCCESS_CODE as string, 10),
      };
      ApiService.instance = new ApiService(baseUrl, backendConfig);
    }
    return ApiService.instance;
  }

  private setupInterceptors(): void {
    Taro.addInterceptor(this.requestInterceptor);
    Taro.addInterceptor(this.responseInterceptor);
  }

  private requestInterceptor(chain: Taro.Chain) {
    const requestParams = chain.requestParams;
    // 可以在这里添加公共的请求头，token 等
    requestParams.header = {
      ...requestParams.header,
      Authorization: `Bearer ${localStg.get("token")}`,
    };
    return chain.proceed(requestParams);
  }

  private responseInterceptor(chain: Taro.Chain) {
    return chain.proceed(chain.requestParams).then((response) => {
      const backend = response.data;
      const { codeKey, dataKey, msgKey } = this.backendConfig;
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return backend[dataKey];
      } else {
        if (backend[codeKey] === 401) {
          // 跳到login页面
        }
        Taro.showToast({ title: backend[msgKey] || "操作失败", icon: "none" });
        throw new Error(backend[msgKey] || "请求失败");
      }
    });
  }

  // 通用请求方法
  private async request(
    method: keyof Taro.request.Method,
    url: string,
    data: any = {},
    options?: Taro.request.Option
  ): Promise<any> {
    try {
      const response = await Taro.request({
        url,
        method,
        data,
        ...options,
      });

      return response;
    } catch (error) {
      Taro.showToast({ title: error.message || "网络错误", icon: "none" });
      throw error;
    }
  }

  public get(
    url: string,
    data?: any,
    options?: Taro.request.Option
  ): Promise<any> {
    return this.request("GET", url, data, options);
  }

  public post(
    url: string,
    data?: any,
    options?: Taro.request.Option
  ): Promise<any> {
    return this.request("POST", url, data, options);
  }

  // 其他请求方法如 PUT, DELETE 等可以根据需要添加
}

export default ApiService;

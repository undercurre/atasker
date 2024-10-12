import Taro from "@tarojs/taro";
import { localStg } from "../storage/local";

class ApiService {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    Taro.addInterceptor(this.requestInterceptor);
    Taro.addInterceptor(this.responseInterceptor);
  }

  private async requestInterceptor(chain: Taro.Chain) {
    const requestParams = chain.requestParams;
    const access_token = await localStg.get("token");
    // 可以在这里添加公共的请求头，token 等
    requestParams.header = {
      ...requestParams.header,
    };
    if (access_token) {
      requestParams.header.Authorization = `Bearer ${access_token}`;
    }
    return chain.proceed(requestParams);
  }

  private responseInterceptor(chain: Taro.Chain) {
    return chain.proceed(chain.requestParams).then((response) => {
      const backend = response.data;
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return backend["data"];
      } else {
        if (backend["code"] === 401) {
          // 跳到login页面
          Taro.redirectTo({
            url: "/pages/login/index", // 替换为你的登录页面路径
          });
        }
        Taro.showToast({ title: backend["msg"] || "操作失败", icon: "none" });
        throw new Error(backend["msg"] || "请求失败");
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
        url: this.baseUrl + url,
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

  public get<T>(
    url: string,
    data?: any,
    options?: Taro.request.Option
  ): Promise<T> {
    return this.request("GET", url, data, options);
  }

  public post<T>(
    url: string,
    data?: any,
    options?: Taro.request.Option
  ): Promise<T> {
    return this.request("POST", url, data, options);
  }

  // 其他请求方法如 PUT, DELETE 等可以根据需要添加
}

export default ApiService;

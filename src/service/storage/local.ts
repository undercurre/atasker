import Taro from "@tarojs/taro";

function createLocalStorage() {
  function set(key: string, value: any) {
    const storageData = JSON.stringify(value);
    setItem(key, storageData);
  }

  async function get(key: string) {
    const json = await getItem(key);
    if (json) {
      let storageData: string | null = json;
      let sourceData: any;
      try {
        if (storageData) sourceData = JSON.parse(storageData);
      } catch {
        // 防止解析失败
      }
      if (sourceData) {
        return sourceData;
      }
      return null;
    }
    return null;
  }

  function remove(key: string) {
    removeItem(key);
  }
  function clear() {
    clearItems();
  }

  return {
    set,
    get,
    remove,
    clear,
  };
}

export const localStg = createLocalStorage();

function setItem(key: string, data: any) {
  return new Promise((resolve, reject) => {
    Taro.setStorage({
      key: key,
      data: data,
      success: resolve,
      fail: reject,
    });
  });
}

function getItem(key: string): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    try {
      Taro.getStorage({
        key: key,
        success: (res) => {
          resolve(res.data);
        },
        fail: () => resolve(null), // 捕获错误并返回 null
      });
    } catch (e) {
      resolve(null);
    }
  });
}

function removeItem(key: string) {
  return new Promise((resolve, reject) => {
    Taro.removeStorage({
      key: key,
      success: resolve,
      fail: reject,
    });
  });
}

function clearItems() {
  return new Promise((resolve, reject) => {
    Taro.clearStorage({
      success: resolve,
      fail: reject,
    });
  });
}

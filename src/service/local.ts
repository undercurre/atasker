function createLocalStorage() {
  function set(key: string, value: any) {
    const storageData = JSON.stringify(value);
    window.localStorage.setItem(key, storageData);
  }

  function get(key: string) {
    const json = window.localStorage.getItem(key);
    if (json) {
      let storageData: string | null = null;
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
    window.localStorage.removeItem(key);
  }
  function clear() {
    window.localStorage.clear();
  }

  return {
    set,
    get,
    remove,
    clear,
  };
}

export const localStg = createLocalStorage();

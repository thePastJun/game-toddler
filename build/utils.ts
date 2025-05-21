import path from "path";

export function isDevFn(mode: string): boolean {
  return mode === "development";
}
export function isTestFn(mode: string): boolean {
  return mode === "test";
}
export function isProdFn(mode: string): boolean {
  return mode === "production";
}

/**
 * 是否生成包预览
 */
export function isReportMode(): boolean {
  return process.env.REPORT === "true";
}

// 将所有环境变量配置文件读取到process. env
export function wrapperEnv(envConf: Record<string, any>) {
  const ret: any = {};

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    realName = realName === "true" ? true : realName === "false" ? false : realName;
    if (envName === "VITE_PORT") {
      realName = Number(realName);
    }
    if (envName === "VITE_PROXY") {
      try {
        realName = JSON.parse(realName);
      } catch (error) {
        // 将字符串按照逗号分割成一维数组
        const realList = realName.split(",");
        // 使用 reduce 来构建二维数组
        const realListTwo = realList.reduce((accumulator: any[], current: string, index: number) => {
          // 每两个元素合并成一个子数组
          if (index % 2 === 0) {
            accumulator.push([current]); // 创建新的子数组
          } else {
            accumulator[accumulator.length - 1].push(current); // 推入当前元素
          }
          return accumulator;
        }, []);
        realName = realListTwo;
      }
    }
    ret[envName] = realName;
    process.env[envName] = realName;
  }
  return ret;
}

/**
 * 获取用户根目录
 * @param dir file path
 */
export function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir);
}

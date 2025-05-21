import { UserConfig, ConfigEnv, loadEnv, defineConfig } from "vite";
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { createProxy } from './build/proxy';
import { wrapperEnv } from "./build/utils";
import { resolve } from "path";
import { viteMockServe } from "vite-plugin-mock";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
/** @ 符号指向 src 目录 */
const pathSrc = resolve(__dirname, "src");

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  const viteEnv = wrapperEnv(env);
  const {
    VITE_PORT,
    VITE_PROXY,
    VITE_PUBLIC_PATH,
    VITE_USE_MOCK,
    VITE_DROP_CONSOLE
  } = viteEnv;
  console.log(createProxy(VITE_PROXY), '代理')
  return {
        /** 打包时根据实际情况修改 base */
        base: VITE_PUBLIC_PATH,
        resolve: {
          alias: {
            "@": pathSrc
          },
        },
        define: {__INTLIFY_PROD_DEVTOOLS__: false},
        server: {
          host: true,
          port: Number(VITE_PORT),
          proxy: createProxy(VITE_PROXY),
        },
        // css: {
        //   // CSS 预处理器
        //   preprocessorOptions: {
        //     // 定义全局 SCSS 变量
        //     scss: {
        //       additionalData: `
        //         @use "@/styles/variables.scss" as *;
        //       `,
        //     },
        //   },
        // },
        build: {
          /** 单个 chunk 文件的大小超过 2048KB 时发出警告 */
          chunkSizeWarningLimit: 2048,
          /** 禁用 gzip 压缩大小报告 */
          reportCompressedSize: false,
          /** 打包后静态资源目录 */
          assetsDir: "static",
          rollupOptions: {
            output: {
              /**
               * 分块策略
               * 1. 注意这些包名必须存在，否则打包会报错
               * 2. 如果你不想自定义 chunk 分割策略，可以直接移除这段配置
               */
              manualChunks: {
                vue: ["vue", "vue-router", "pinia"],
              },
              // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
              entryFileNames: "static/js/[name].[hash].js",
              // 用于命名代码拆分时创建的共享块的输出命名
              chunkFileNames: "static/js/[name].[hash].js",
              // 用于输出静态资源的命名，[ext]表示文件扩展名
              assetFileNames: (assetInfo: any) => {
                const info = assetInfo.name.split(".");
                let extType = info[info.length - 1];
                // console.log('文件信息', assetInfo.name)
                if (
                  /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)
                ) {
                  extType = "media";
                } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
                  extType = "img";
                } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
                  extType = "fonts";
                }
                return `${extType}/[name].[hash].[ext]`;
              },
            }
          }
        },
          /** 混淆器 */
        esbuild: {
          /** 打包时移除 console.log */
          pure: VITE_DROP_CONSOLE ? ["console.log"] : [],
          /** 打包时移除 debugger */
          drop: ["debugger"],
          /** 打包时移除所有注释 */
          legalComments: "none"
        },
      plugins: [
        vue(),
        UnoCSS(),
        nodePolyfills(),
        viteMockServe({
          ignore: /^\_/,
          mockPath: "mock",
          enable: mode === "development" && VITE_USE_MOCK,
        }),
      ]
  }
})


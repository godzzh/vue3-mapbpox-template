import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import viteCompression from 'vite-plugin-compression';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

const proxyUrl = 'http://192.168.0.86';

const remixIconTreeShake = () => ({
    name: 'remixicon-vue-tree-shake',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
        if (!id.replace(/\\/g, '/').includes('/@remixicon/vue/index.mjs')) return;

        // @remixicon/vue 将所有组件放在同一条 const 声明中，Rolldown 无法逐项消除。
        // 拆成独立声明后，仍可使用官方命名导入，同时仅保留实际使用的 SVG 组件。
        const declaration = code.indexOf('const ');
        const exports = code.lastIndexOf('export{');
        if (declaration === -1 || exports === -1) return;

        return `${code.slice(0, declaration)}${code
            .slice(declaration, exports)
            .replace(/,([A-Za-z_$][\w$]*)=e\(\{/g, ';const $1=/*#__PURE__*/e({')
            .replace('const a=e({', 'const a=/*#__PURE__*/e({')}${code.slice(exports)}`;
    },
});

export default defineConfig(() => {

    return {
        build: {
            outDir: 'dist',
            assetsDir: 'static',
            target: ['chrome78'],
            chunkSizeWarningLimit: 1000,
            sourcemap: false,
            cssCodeSplit: true,
            minify: true,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (!id.includes('node_modules')) return;

                        // Vue 核心生态
                        if (/node_modules\/(@vue|vue|vue-router|pinia|vue-i18n)\//.test(id)) {
                            return 'vue-vendor';
                        }
                        // Naive UI 组件库
                        if (/node_modules\/naive-ui\//.test(id)) {
                            return 'naive-ui';
                        }
                        // ECharts 图表库
                        if (/node_modules\/echarts\//.test(id)) {
                            return 'echarts';
                        }
                        // AntV L7 会携带自身的 Mapbox 适配依赖，必须与主 vendor 隔离，
                        // 仅在预警详情动态加载，避免 Operation 列表页刷新时干扰全局地图脚本。
                        if (/node_modules\/(?:\.pnpm\/)?@antv\+l7|node_modules\/@antv\/l7/.test(id)) {
                            return 'warning-radar';
                        }
                        // Remix Icon 的 Vue 包是单文件导出桶，强制放入 vendor 会让
                        // Rolldown 保留全部图标；交给打包器按实际导入执行 tree shaking。
                        if (/node_modules\/@remixicon\/vue\//.test(id)) {
                            return;
                        }
                        // 其余三方库合并为一个 vendor，
                        // 避免逐包拆分产生大量小 chunk（HTTP 请求数反而劣化）
                        return 'vendor';
                    },
                },
            },
            reportCompressedSize: false,
        },
        optimizeDeps: {
            include: ['naive-ui', 'vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core'],
        },
        base: './',
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                },
            },
        },
        plugins: [
            remixIconTreeShake(),
            vue(),
            vueJsx(),
            // 模板中 n-xxx 组件自动按需引入（配合移除 main.ts 的全量 app.use(naive)）
            Components({
                resolvers: [NaiveUiResolver()],
            }),
            viteCompression(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: {
            port: 3031,
            host: '0.0.0.0',
            open: true,
            hmr: {
                overlay: true,
            },
            proxy: {
                '/smw': {
                    target: proxyUrl,
                    changeOrigin: true,
                },
                '/common': {
                    target: proxyUrl,
                    changeOrigin: true,
                },
                '/api': {
                    target: proxyUrl,
                    changeOrigin: true,
                },
            },
        },
    };
});

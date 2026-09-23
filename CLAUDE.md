# CLAUDE.md

本文件用于约束后续 AI Agent 和开发者在 `vue3-mapbpox-template` 中的开发方式。项目定位是可二次开发、可定制交付的公安地图大屏基础工程，优先保证公共能力可复用、业务边界清晰和地图运行稳定。

## 项目技术栈

- Vue 3.5 + TypeScript（严格类型）+ Vite 7
- Vue Router（Hash 路由）、Pinia
- Naive UI、Tailwind CSS、Less
- ECharts 6（统一通过 `@/common/VEcharts/index.vue` 使用）
- Mapbox 固定脚本由 `index.html` 从 `/static/mapbox` 加载，使用 `window.mapboxgl`，不得重复安装 npm `mapbox-gl`
- Turf 7 用于业务空间计算；AntV L7 / L7 Maps 用于叠加在现有 Mapbox 实例上的动态可视化
- umi-request、mitt、dayjs、Remix Icon、vfonts

## 常用命令

```bash
pnpm dev
pnpm typecheck
pnpm lint
pnpm build
```

提交前必须依次通过 `typecheck`、`lint`、`build`。不要对全项目执行会产生无关差异的自动修复或格式化。

## 目录职责

```text
src/
├─ common/                 # 与具体业务无关的通用组件
├─ components/dashboard/   # 地图大屏业务模块
├─ components/map/         # 地图和图层控制
├─ components/screen/      # 大屏框架、标题、菜单、侧边面板
├─ config/                 # 菜单、图层和演示数据配置
├─ services/               # API 与响应类型
├─ stores/                 # Pinia 状态
├─ types/                  # 公共类型与全局声明
└─ views/                  # 页面级编排
```

页面组件只负责路由状态、数据获取和子组件编排；可复用视觉区块放到语义明确的子组件中。开发期 Mock 数据必须放在 `src/config` 或独立 Mock 文件，不得直接堆在大型页面组件中。

## 当前路由

- `/home`：首页，仅左侧面板
- `/situation`：态势感知，左右面板
- `/operation`：风险作战；左侧预警查询/详情切换，选中预警后右侧展示相关干系人和周边物联网设备，并联动地图范围圈与雷达扫描
- `/dispatch`：资源调度；当前仅保留路由和地图页面占位，业务面板与调度流程尚未实现
- `/login`：登录页

底部菜单必须使用 Vue Router 导航。菜单激活状态以当前路由 `meta.menuId` 为唯一数据源，不在 Pinia 重复维护。

地图业务路由采用嵌套视图结构：`views/MapScreen/index.vue` 只负责公共地图大屏外壳，通过 `<RouterView />` 承载 `views/Home`、`views/Situation`、`views/Operation`、`views/Dispatch`。各业务页面自行编排左右侧面板及业务内容，不得在公共外壳中通过 `menuId` 或路径条件判断具体业务组件是否展示。

## 公共组件约定

### `CheckGroup`

通用全选复选框组。使用 `v-model`（`modelValue`）管理值；选项值支持 `string | number`。组件不直接修改父级数组，始终派发新数组。

### `Loading`

- `Loading/index.vue`：声明式加载遮罩。
- `Loading/index.ts`：命令式 `createLoading()`。
- 支持 `tip`、`background`、`size`、`absolute`。

业务优先使用 Naive UI 的 `n-spin`；仅在需要覆盖任意 DOM 容器或命令式加载时使用该组件。

### `Observer`

基于 `useIntersectionObserver` 的延迟渲染容器。支持一次性加载、持续显隐、占位插槽和最小高度配置。适合长列表中的重型图表或详情模块。

### `VImage`

基于 `n-image` 的统一图片组件。默认兜底资源：

```text
/static/images/common/noImg.png
```

宽高和 `object-fit` 等属性通过 `$attrs` 透传。

### `VModal`

基于 `n-modal` 的通用弹窗框架：

- Props：`show`、`title`、`loading`、`width`、`contentMaxHeight`
- Events：`update:show`、`close`
- Slots：`default`、`footer`

具体表单校验、接口请求和保存逻辑属于业务子组件，不得塞入公共弹窗。

### `VEcharts`

所有业务图表必须通过 `@/common/VEcharts/index.vue` 渲染，不在业务组件中直接调用 `echarts.init()`：

```vue
<div class="h-[240px]">
    <VEcharts :options="chartOptions" @item-click="handleChartClick" />
</div>
```

- Props：`options: EChartsCoreOption`、`autoPlay?: boolean`
- Event：`itemClick`
- 自动监听容器尺寸并 `resize`
- 自动清理实例和轮播定时器
- 业务组件负责 options 和数据；公共组件负责生命周期
- 新增图表类型时，在 `VEcharts` 中按需注册，不允许改成 ECharts 全量引入
- 大屏两侧面板中的图表文本不得小于 `12px`

### 公共路由视图

`common/views` 提供 ErrorPage、Redirect、RouterView。使用前应在路由配置中显式接入，不要让未使用组件影响现有路由行为。

## 地图规则

- 地图配置通过 `GetConfigByCategoryNo('MapConfig')` 获取。
- 使用全局 `window.mapboxgl` 和 `window.mapViewer`。
- 地图初始化、样式加载、实例清理集中在 `MapView.vue`。
- 不在业务看板组件中直接创建第二个地图实例。
- 图层显示状态由 `stores/screen.ts` 管理，并通过 mitt 派发变化。
- 地图样式加载后由 `MapView.vue` 派发 `map:ready`；依赖地图实例的业务覆盖物应同时支持事件触发和挂载时检查 `window.mapViewer`，避免异步组件错过就绪事件。
- 当前定制增强版 Mapbox 在可操作后 `isStyleLoaded()` 仍可能返回 `false`，业务覆盖物不得把它作为唯一初始化条件。
- L7 必须通过 `new Mapbox({ mapInstance: window.mapViewer })` 复用主地图，禁止创建第二个独立 Mapbox 地图。
- `WarningRadarLayer.vue` 必须在进入预警详情后异步加载；Vite 将 L7 相关依赖拆到 `warning-radar` chunk，避免 `/operation` 列表页刷新时提前加载地图适配代码。
- Turf 用于范围圆和距离计算；业务临时 source/layer 必须使用唯一 ID，并在详情关闭或组件卸载时移除监听、图层和数据源。
- L7 Mapbox 适配器接管既有 `mapInstance` 后，不得直接调用会连带移除主地图的 `scene.destroy()`；只清理该业务创建的 L7 图层和 Mapbox 临时图层。

## 样式开发规范

- 项目样式优先使用 Tailwind CSS 工具类；新增或修改页面时，布局、尺寸、间距、排版、颜色、边框、状态和响应式规则应尽量直接写在模板的 `class` 中。
- 不为可由现有 Tailwind 工具类清晰表达的样式新增 scoped CSS/Less，也不使用行内 `style` 重复实现已有工具类能力。
- 重复出现且具有稳定语义的类组合，可抽取为组件，或在确有必要时通过 `@apply` 封装；不要为了缩短模板把一次性工具类组合包装成无语义类名。
- 以下场景允许保留 scoped CSS/Less：伪元素、复杂渐变或动画、第三方组件和 Mapbox 内部 DOM 覆盖、运行时动态值、Tailwind 难以清晰表达的选择器关系，以及为规避 Mapbox Canvas 合成问题而拆分的视觉层。
- 修改存量组件时遵循最小改动原则：本次涉及的简单样式优先迁移为 Tailwind，不要求仅为统一形式批量重写未触及的历史 CSS。
- 动态类名必须确保能被 Tailwind 构建扫描到；不得通过字符串拼接生成无法静态识别的工具类，条件样式使用完整类名映射。

## 大屏视觉规则

- 面板保持深蓝透明玻璃效果；背景填色层和 `backdrop-filter` 层必须分离，避免 Mapbox Canvas 合成异常。
- SVG 异形边框不与背景色耦合。
- 左右面板内容文字不得小于 `12px`。
- 模块标题统一使用 `PanelSection`，右侧操作放到 `actions` 插槽。
- 页面刷新和菜单切换的面板动画需左右同步，并尊重 `prefers-reduced-motion`。
- 不擅自修改用户已确认的面板角标、边框和折叠资源。
- `/operation` 预警详情标题右上角使用关闭按钮；关闭后返回预警列表、隐藏右侧详情并卸载地图临时覆盖物，不在详情顶部重复提供“返回列表”按钮。
- 周边物联网设备的范围选择使用紧凑 Tabs 视觉，但保留原生 radio、`fieldset`、键盘焦点和 `radiogroup` 语义；范围固定为 `100m / 300m / 500m / 1000m`，默认 `300m`。

## 输入框与值规范化

- 普通单行文本输入框（账号、名称、标题、关键字、手机号、业务编码等）统一使用 `src/utils/options.ts` 导出的 `noSideSpace`，Naive UI `n-input` 写法为 `:allow-input="noSideSpace"`，避免录入首尾空白字符。
- 搜索和提交时仍需对最终值调用 `trim()`，前端输入限制不能替代提交边界的规范化与校验。
- 密码、密钥、验证码、多行正文、备注、Markdown、代码、详细地址和富文本不得套用 `noSideSpace`，这些字段必须保留原始输入或按明确接口契约处理。
- 日期选择器、数字选择器、下拉框、单选框等非文本输入组件不使用 `noSideSpace`。
- 新增或修改普通文本输入框时，应在代码评审中检查是否已配置 `allow-input`，不要在各组件内重复定义同类过滤函数。
- 新增/编辑表单中，后端接口文档规定了字符串最大长度时，输入框必须同步配置 `maxlength` 和 `show-count`，使前端限制与接口契约保持一致，例如：

```vue
<n-input maxlength="30" show-count clearable />
```

- `maxlength` 必须使用接口文档规定的实际长度，不得统一写死为示例中的 `30`；提交前仍需执行对应的表单校验，不能只依赖输入组件截断。

## 表格与分页规范

- 所有业务表格统一使用 Naive UI 的 `n-data-table`，不得自行使用原生 `<table>` 重复实现排序、选择、加载、空状态和分页等能力。
- 表格存在操作栏时，操作列必须固定在表格右侧。列定义应配置 `fixed: 'right'`，同时设置明确的 `width`；表格横向滚动时操作入口必须始终可见。
- 表格列内容为文字时默认只展示一行，超出列宽后显示省略号，并在鼠标移入时通过 Tooltip 展示完整内容。普通文字列统一配置：

```ts
ellipsis: {
    'line-clamp': 1,
},
```

- 自定义 `render` 的文字列也必须保持单行省略和完整内容 Tooltip，不能因自定义渲染绕过该规则；状态标签、按钮、图标等非普通文字内容按实际交互处理。
- 所有业务列表、表格、树、搜索结果和选择结果在空数据时统一使用 Naive UI 的 `n-empty`，通过 `description` 提供符合当前场景的文案；不得用普通 `<div>`、`<p>`、图标加文字自行模拟空状态。加载失败不属于空数据，应提供错误提示和重试入口。
- 业务界面中的数字、日期时间、手机号、坐标、统计值以及各类编号/编码统一添加 `font-vfonts`；混合文本中仅数字或编号部分需要使用该字体，普通中文描述保持原有正文样式。代码块、开发文档示例以及按钮图标不受此规则约束。
- 业务内容区域需要滚动时应优先使用 Naive UI 的 `n-scrollbar`，并通过容器高度或 `max-height` 明确滚动边界；不要直接给普通容器添加 `overflow-auto`、`overflow-y-auto` 或自行绘制滚动条。横向表格滚动使用 `n-data-table` 自身的 `scroll-x`，页面根节点、Mapbox 内部容器、第三方组件内部滚动，以及确需保留浏览器原生触控惯性和紧凑布局的移动端横向导航不强制改用 `n-scrollbar`。
- 使用 `n-scrollbar` 后应检查键盘、鼠标滚轮、触控板、内容动态更新和组件卸载场景；需要在追加内容后定位时使用组件实例提供的滚动 API，不直接操作其内部 DOM。
- 所有分页列表的分页器必须支持切换每页条数，选项固定为 `10 / 30 / 50 / 100` 条/页，默认 `10` 条/页。Naive UI 分页配置应至少包含：

```ts
const pagination = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 30, 50, 100],
});
```

- 切换每页条数时应重置到第一页，并使用最新的 `pageSize` 重新查询列表；服务端分页场景还必须同步更新总数、加载状态和请求竞态处理。

## API 与鉴权

- 请求集中在 `src/services`，使用 umi-request。
- Token 使用 `Authorization: Basic <Token>`。
- 登录态和用户信息由 `stores/user.ts` 管理。
- 路由守卫负责 Token、用户信息和登录重定向。
- 页面层不得重复实现请求拦截、Token 拼接或 401 跳转。
- 时间处理统一使用 dayjs。

## 二次开发规范

- 公共组件必须定义明确的 Props、Events 和 Slots；避免读取隐式全局状态。
- 组件不得直接修改 Props，不使用无约束 `any`。
- 关键注释解释“为什么这样做”和扩展边界，不逐行复述代码。
- 与业务接口相关的数据转换放在 service/composable，不放入纯展示组件。
- 新增模块优先复用 `SidePanel`、`PanelSection`、`VEcharts`、`VImage`、`VModal`。
- 修改公共组件前检查所有调用方；保持默认值向后兼容。
- 静态资源放入 `public/static` 的语义目录，引用统一以 `/static/...` 开头。
- 不复制模板项目中与当前项目无关的动态路由、i18n、patch-package 或缺失 Store 假设。

## 已知构建提示

Mapbox 的非模块脚本和 public CSS 在 Vite 构建时会提示运行时解析警告，这是固定脚本接入方式造成的已知提示。只要 `typecheck`、`lint`、`build` 成功且资源路径存在，不应将脚本改成 npm `mapbox-gl`。

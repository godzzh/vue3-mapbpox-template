# vue3-mapbpox-template

Vue 3 + TypeScript + Mapbox GL 地图大屏基础项目。目录名按需求保留为 `mapbpox`，包名与目录一致。

## 当前能力

- Vue Router Hash 模式的嵌套地图业务路由：`/home`、`/situation`、`/operation`、`/dispatch`
- 登录页、Token 持久化、用户信息加载和路由鉴权
- Mapbox 固定版本全局脚本、接口驱动的底图配置和本地深色降级样式
- 大屏标题、左右可折叠面板、底部业务菜单、地图指北针和测量/绘制工具
- API 驱动的右侧快捷菜单、资源图层和图层控制，以及管理员/非管理员权限过滤
- 风险作战预警查询、详情、相关干系人、周边物联网设备和地图雷达扫描
- Turf 空间范围与距离计算，AntV L7 动态雷达覆盖物
- Pinia 状态管理、严格 TypeScript、ESLint 和生产构建校验

> `/dispatch` 当前仅保留资源调度路由和地图页面占位，尚未实现调度业务面板与任务闭环。

## 开发

环境要求：Node.js `>=20.19.0`、pnpm `>=9.0.0`。项目声明使用 pnpm `10.20.0`。

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

`.env.local` 当前可配置：

```dotenv
# 开发环境留空时使用 Vite 的 /smw、/common、/api 代理
VITE_API_BASE_URL=
```

平台标题当前由 `src/config.ts` 的 `appConfig.platform.title` 维护；`.env.example` 中的 `VITE_PLATFORM_TITLE` 仅为预留项，现有代码尚未读取它。

地图固定脚本和样式已放在 `public/static/mapbox`，由 `index.html` 加载；地图中心点、缩放级别、坐标系和底图样式由登录后请求的 `MapConfig` 接口返回，不通过环境变量配置 Mapbox Token 或 Style。

## 登录与接口

开发环境的 `/smw`、`/common`、`/api` 请求代理到 `http://192.168.0.86`。

- `CPLogin`: `POST /smw/UAC/CPLogin`
- `GetUserInfo`: `GET /smw/UAC/GetUserInfo`
- `LoginOut`: `POST /smw/UAC/LoginOut`

登录密码沿用参考项目规则：`md5(userCode + md5(password))`；Token 保存在 `localStorage.Token`，后续请求通过 `Authorization: Basic <Token>` 发送。

路由守卫支持从 URL 查询参数中的 `token`、`Token` 或 `TOKEN` 接收登录凭证。非公开页面会先检查本地 Token，再加载用户信息、功能菜单、资源图层、图层控制和地图配置；鉴权失败时清理会话并重定向至 `/login`。

## 路由与页面职责

地图业务采用嵌套路由，公共壳位于 `src/views/MapScreen/index.vue`：

| 路由 | 页面职责 |
| --- | --- |
| `/home` | 首页概览，仅编排左侧面板 |
| `/situation` | 态势感知，编排左右两侧业务面板 |
| `/operation` | 风险作战，预警查询、详情、周边设备与地图覆盖物 |
| `/dispatch` | 资源调度占位页，当前尚未实现业务面板 |
| `/login` | 城市坐标中枢风格登录页 |

`MapScreen` 只负责共享地图、标题、右侧快捷工具、资源图层、图层控制和底部菜单。业务页面通过其 `<RouterView />` 渲染，禁止把具体路由业务条件写回公共壳。

## 风险作战预警详情

`/operation` 当前使用 `src/config/operation.ts` 中的吉安区域演示数据，尚未接入预警详情业务接口。页面流程如下：

1. 左侧显示预警时间、关键词和状态筛选，以及预警事件列表；
2. 点击预警后，左侧切换为预警详情，右侧展开相关干系人和周边物联网设备；
3. 地图飞行到预警经纬度，并以至少 15 级缩放展示范围面、范围线、周边设备点和雷达扫描；
4. 点击预警详情标题右上角关闭按钮后返回列表，同时隐藏右侧面板并清理临时地图内容。

周边设备范围固定为：

```text
100m | 300m | 500m | 1000m
```

默认范围为 `300m`。距离 Tabs 保留原生 radio 和键盘操作语义。设备与预警点之间的距离通过 Turf `distance()` 实时计算，列表和地图点位随范围同步更新。

主要文件：

```text
src/views/Operation/index.vue
src/components/dashboard/OperationWarningQuery.vue
src/components/dashboard/OperationWarningDetail.vue
src/components/dashboard/OperationWarningContext.vue
src/components/map/WarningRadarLayer.vue
src/config/operation.ts
```

## 地图覆盖物与 L7 使用约束

- 主地图只由 `MapView.vue` 创建，并暴露为 `window.mapViewer`；业务组件不得创建第二个 Mapbox 地图实例。
- `MapView.vue` 在地图样式可用后通过 mitt 派发 `map:ready`。
- 当前定制增强版 Mapbox 即使已可操作，`isStyleLoaded()` 仍可能返回 `false`，业务覆盖物不能只依赖该返回值判断是否初始化。
- `WarningRadarLayer.vue` 通过 `@turf/turf` 生成范围圆和计算设备距离。
- L7 使用 `new Mapbox({ mapInstance: window.mapViewer })` 附着到已有地图，并通过 `PointLayer().shape('radar')` 绘制扫描动画。
- 雷达组件仅在选中预警后异步加载；Vite 将 L7 依赖拆分到 `warning-radar` chunk，避免刷新 `/operation` 列表页时提前执行地图适配代码。
- 关闭详情时会移除缩放监听、雷达层、范围/设备图层和 GeoJSON Source。
- 不直接调用 L7 `scene.destroy()`，因为当前 Mapbox 适配器会连带移除传入的主地图实例。

## 地图右侧菜单配置

地图右侧快捷菜单由系统管理中的应用与功能定义统一维护，不在前端静态维护菜单权限编码。

### 1. 新增应用

进入：

```text
系统管理 → 应用管理
```

新增“地图右侧菜单控制”应用，应用编号必须配置为：

```text
qzq-map-tools
```

前端通过以下接口读取该应用下的完整功能定义：

```http
GET /smw/Function/QueryByAppNo?appNo=qzq-map-tools
```

应用编号集中配置在 `src/config.ts`：

```ts
export const appConfig = {
    platform: {
        title: '城市时空态势平台',
    },
    functionMenus: {
        mapTools: {
            appNo: 'qzq-map-tools', // 地图右侧菜单控制应用编号
        },
        mapLayer: {
            appNo: 'qzq-map-layer', // 资源图层应用编号
            mapLayerControl: 'qzq-map-control', // 图层控制应用编号
        },
    },
} as const;
```

### 2. 新增功能定义

在“地图右侧菜单控制”应用的功能定义中新增以下一级菜单：

| 顺序 | 功能名称 | 用途 |
| --- | --- | --- |
| 1 | 资源搜索 | 打开地图资源搜索面板 |
| 2 | 资源图层 | 打开资源图层控制面板 |
| 3 | 图层控制 | 控制行政区划、铁路线路和铁路里程标显隐 |
| 4 | 地图工具 | 打开测量及绘制工具面板 |
| 5 | 一键清除 | 清除地图临时绘制并恢复默认图层状态 |

配置要求：

- 五个功能均配置为一级菜单，`parentHierarchyCode` 为空；
- 功能名称必须与上表一致，前端当前根据 `functionName` 关联本地交互行为；
- 使用 `orderCode` / `orderHierarchyCode` 控制右侧菜单显示顺序；
- 需要显示的功能应保持启用，`isDisabled: true` 的功能不会显示；
- `functionCode` 由系统管理维护，前端不硬编码权限编码；
- `functionIcon` 和 `functionUrl` 当前可以为空，菜单图标和本地交互由前端注册表提供。

“资源图层”下如需配置子菜单，可继续新增“基础图层”“重点场所”“兴趣点”等二级功能，并将它们的父级设置为“资源图层”。右侧快捷栏只展示一级菜单，二级功能数据用于资源图层面板。

### 3. 用户权限

管理员用户（`GetUserInfo.result.isAdmin === true`）显示该应用下全部未禁用的一级菜单。

非管理员用户根据以下两份数据的 `functionCode` 交集决定菜单显隐：

1. `GET /smw/Function/QueryByAppNo?appNo=qzq-map-tools` 返回的功能定义；
2. `GET /smw/UAC/GetUserInfo` 返回的 `result.permissionList`。

因此，非管理员还需要在系统管理中分配对应功能权限。未分配的右侧菜单不会显示。菜单定义接口请求失败时，右侧菜单按安全策略保持隐藏，但不会清除当前登录状态。

## 资源图层配置与获取逻辑

资源图层定义由系统管理中的独立应用维护，应用编号配置在：

```ts
appConfig.functionMenus.mapLayer.appNo // qzq-map-layer
```

用户信息获取成功后，前端调用：

```http
GET /smw/Function/QueryByAppNo?appNo=qzq-map-layer
```

接口返回平铺功能列表，前端按以下规则格式化为两级树：

- `functionLevel === 1` 且 `parentHierarchyCode` 为空：作为图层分类；
- `functionLevel === 2` 且 `parentHierarchyCode === 一级节点.hierarchyCode`：作为该分类下的图层；
- 分类和图层均根据 `orderHierarchyCode` 排序；
- `isDisabled: true` 的节点不展示；
- 管理员显示全部未禁用图层；
- 非管理员仅显示 `functionCode` 存在于 `GetUserInfo.result.permissionList` 中的二级图层。

二级图层的 `comments` 必须是 JSON 字符串，例如：

```json
{
  "id": 1957,
  "layerId": "sxt",
  "iconName": "300103"
}
```

字段用途：

- `id`：用于获取资源图标；
- `layerId`：需要控制显隐的 Mapbox 图层 ID；
- `iconName`：图标业务编码，当前作为扩展字段保留。

图标服务基础地址来自：

```http
GET /smw/ConfigOptions/GetConfigByCategoryNo?categoryNo=MapConfig
```

读取返回结果中的 `layerService`，最终图标地址为：

```text
{layerService}/citmsmap/sprite/queryIcon/{id}
```

资源图层默认全部隐藏。点击二级图层项时，前端根据备注中的 `layerId` 调用 Mapbox `setLayoutProperty` 切换 `visibility`：

```ts
map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
```

再次点击会关闭图层；点击“一键清除”会隐藏所有已开启的资源图层。地图样式中不存在对应 `layerId` 时会安全跳过。备注为空、JSON 无效或缺少有效 `id`、`layerId` 时，不会中断其他资源图层的展示。

## 图层控制配置与获取逻辑

图层控制定义由另一个独立应用维护，应用编号配置在：

```ts
appConfig.functionMenus.mapLayer.mapLayerControl // qzq-map-control
```

用户信息获取成功后，前端调用：

```http
GET /smw/Function/QueryByAppNo?appNo=qzq-map-control
```

权限规则与资源图层一致：

- 管理员显示接口返回的全部未禁用有效配置；
- 非管理员只显示 `functionCode` 存在于 `GetUserInfo.result.permissionList` 中的配置；
- `isDisabled: true` 的配置不展示；
- 前端不维护静态图层控制列表，也不提供静态兜底；
- 接口返回空数组、请求失败或没有有效备注时，图层控制面板展示 `n-empty`，并隐藏“恢复默认图层”按钮。

### 图层控制备注填写示例

在 `qzq-map-control` 应用的功能定义中，每个图层控制功能都需要在“备注”字段填写合法的 JSON 字符串。

以“铁路里程标”为例，备注内容为：

```json
{
  "name": "铁路里程标",
  "description": "铁路沿线里程标点位",
  "layerIds": ["railway-kilometer-mark-points"],
  "color": "#62f5b5",
  "visible": false
}
```

在系统管理的备注输入框中也可以直接填写为单行：

```text
{"name":"铁路里程标","description":"铁路沿线里程标点位","layerIds":["railway-kilometer-mark-points"],"color":"#62f5b5","visible":false}
```

`QueryByAppNo` 接口返回时，该 JSON 字符串位于功能项的 `comments` 字段，例如：

```json
{
  "functionCode": "图层控制功能编码",
  "functionName": "铁路里程标",
  "comments": "{\"name\":\"铁路里程标\",\"description\":\"铁路沿线里程标点位\",\"layerIds\":[\"railway-kilometer-mark-points\"],\"color\":\"#62f5b5\",\"visible\":false}"
}
```

字段用途：

- `name`：图层控制项名称；
- `description`：图层说明；
- `layerIds`：该开关同时控制的一个或多个 Mapbox 图层 ID；
- `color`：控制项左侧颜色标识；
- `visible`：图层默认显隐状态。

只有备注同时满足以下条件时才会生成图层控制项：`name`、`description`、`color` 为字符串，`layerIds` 为字符串数组，`visible` 为布尔值。单条备注无效时只忽略该项，不影响其他控制项。

点击图层开关后，前端依次控制 `layerIds` 中所有存在于当前地图样式的图层。点击“恢复默认图层”时，恢复接口备注中配置的 `visible` 状态，而不是使用前端固定值。

## 项目结构摘要

```text
src/
├─ common/                 通用组件与公共视图
├─ components/dashboard/   首页、态势、风险作战业务组件
├─ components/map/         主地图、工具、图层面板和业务地图覆盖物
├─ components/screen/      大屏标题、菜单、侧边面板和模块标题
├─ config/                 应用配置、菜单配置与开发期演示数据
├─ services/               鉴权、功能定义和地图配置 API
├─ stores/                 用户会话及地图大屏状态
├─ types/                  Mapbox 全局声明和公共类型
└─ views/                  登录页、地图公共壳及各业务路由编排
```

开发期 Mock 数据必须放在 `src/config` 或独立 Mock 文件，不要直接写进页面组件。业务页面负责状态编排，展示区块应拆分到 `components/dashboard`，地图覆盖物应放在 `components/map`。

## 校验

提交前依次执行：

```bash
pnpm typecheck
pnpm lint
pnpm build
```

构建时 Mapbox 非模块脚本和 `public` CSS 会出现运行时解析提示，这是当前固定脚本接入方式产生的已知提示。不要为消除提示改装 npm `mapbox-gl`。L7/Turf 会增加异步地图可视化分块体积，但不会在未进入预警详情时加载雷达模块。

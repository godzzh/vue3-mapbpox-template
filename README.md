# vue3-mapbpox-template

Vue 3 + TypeScript + Mapbox GL 地图大屏基础项目。目录名按需求保留为 `mapbpox`，包名与目录一致。

## 已初始化能力

- Mapbox GL 地图容器，支持 Token/Style 环境变量
- 大屏顶部标题与实时状态
- 左右两侧可折叠容器
- 图层控制面板及图层开关状态
- 底部业务菜单
- Pinia 状态管理、Vue Router、严格 TypeScript 与 ESLint
- 无 Token 时自动降级为本地演示底图，不阻塞界面开发

## 开发

首次运行先复制株洲项目的大屏框架静态资源：

```powershell
pnpm assets:copy
```

该命令会复制 `bg_header.png`、`menu_bg.png`、`menu_bg_active.png`、`bg_left.png`、`bg_right.png` 和 `arrow.png`。

然后安装依赖并启动：

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

在 `.env.local` 中填写 `VITE_MAPBOX_ACCESS_TOKEN` 后，可使用 `mapbox://` 样式；也可把 `VITE_MAPBOX_STYLE` 配置成公开 style JSON URL。

## 登录与接口

开发环境的 `/smw`、`/common`、`/api` 请求代理到 `http://192.168.0.86`。

- `CPLogin`: `POST /smw/UAC/CPLogin`
- `GetUserInfo`: `GET /smw/UAC/GetUserInfo`
- `LoginOut`: `POST /smw/UAC/LoginOut`

登录密码沿用参考项目规则：`md5(userCode + md5(password))`；Token 保存在 `localStorage.Token`，后续请求通过 `Authorization: Basic <Token>` 发送。

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

## 校验

```bash
pnpm typecheck
pnpm lint
pnpm build
```

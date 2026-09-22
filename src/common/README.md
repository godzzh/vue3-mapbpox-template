# Common Components

`src/common` 只存放与具体公安业务无关、可跨页面复用的基础组件。业务数据请求、字段映射和权限判断应由页面、Store、service 或 composable 负责。

## CheckGroup

```vue
<CheckGroup v-model="checkedIds" :options="options" />
```

- `modelValue`: `(string | number)[]`
- `options`: `{ label, value, disabled? }[]`
- `text`: 全选项文案
- `size`: `small | medium | large`
- `vertical`: 纵向排列

禁用且已选中的值在取消全选时会被保留。

## Loading

声明式：

```vue
<div class="relative"><Loading :loading="loading" tip="加载中" /></div>
```

命令式：

```ts
const instance = createLoading({ loading: true }, target);
instance.setTip('正在加载');
instance.close();
```

## Observer

```vue
<Observer min-height="240px" @show="handleVisible">
    <HeavyContent />
    <template #placeholder>...</template>
</Observer>
```

默认首次进入视口后持续渲染；设置 `:once="false"` 可跟随视口显隐。

## VImage

```vue
<VImage src="/static/example.png" :width="160" :height="100" />
```

默认失败图为 `/static/images/common/noImg.png`。

## VModal

```vue
<VModal v-model:show="visible" title="详情" :loading="loading">
    <DetailContent />
    <template #footer>...</template>
</VModal>
```

业务组件负责表单、校验和请求；VModal 只负责通用弹窗框架。

## VEcharts

```vue
<div class="h-[240px]"><VEcharts :options="options" /></div>
```

容器必须具有明确高度。组件统一负责实例初始化、ResizeObserver 自适应、配置更新和销毁。业务层不得重复调用 `echarts.init()`。

## Common Views

- `views/ErrorPage/index.vue`: 页面不存在或无权限
- `views/ErrorPage/err.vue`: 路由组件配置异常
- `views/Redirect/index.vue`: 保留 query 的中转重定向
- `views/RouterView/index.vue`: 嵌套路由占位

这些视图不会自动注册；需要时在路由配置中显式引用。

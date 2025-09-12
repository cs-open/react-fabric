### 用法:
<img width="1770" height="1478" alt="img_v3_02h1_4c0d27e2-f335-4e98-8f46-dd8c504f319g" src="https://github.com/user-attachments/assets/02ff8152-bad3-4e99-82db-13eefc5413b0" />

```jsx
pnpm add @cs-open/react-fabric
```

## 插件

### 触摸手势插件 (Pinch)

如果需要支持触摸屏手势（如双指缩放），请安装 `hammerjs` 依赖：

```bash
npm install hammerjs
# 或
yarn add hammerjs
# 或
pnpm add hammerjs
```

然后在你的组件中使用 `PluginPinch` 插件：

```jsx
import { ReactFabric, PluginPinch } from '@cs-open/react-fabric'
;<ReactFabric>
  <PluginPinch />
  {/* 其他组件 */}
</ReactFabric>
```

[![Edit vaynevayne/react-fabric/draft/competent-ioana](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/github/vaynevayne/react-fabric/draft/competent-ioana?embed=1&file=%2Fexamples%2Fastro%2Fsrc%2Fcomponents%2FCounter.tsx)

组件:

- ReactFabric
- Rect
- Path
- BackgroundImage
- Group
- Text

- 受控模式

```jsx
import { ReactFabric, Rect, Path, BackgroundImage, Objects } from '@cs-open/react-fabric'
;<ReactFabric defaultCentered defaultSelection={false}>
  <BackgroundImage scaleToFit src={imgBaseURL + currentSrc} />
  <Rect width={100} height={100} left={100} top={100} />
  <Path path="M 0 0 L 100 100" />
  <Objects objects={[]} />
</ReactFabric>
```

组件:

- ReactFabric
- defaultSelection:修改fabric默认值; 接受 Fabric Canvas 类的所有 props, 但建议使用非受控模式,目前仅支持一个非受控属性 `defaultSelection={false}`,受控用法暂未测试
- defaultCentered: 背景图是否居中显示

- BackgroundImage
  scaleToFit 缩放背景图以适应屏幕
  scaleToCover 缩放背景图以适应屏幕,另一张模式
  其他 FabricImage 的 props

- Rect 矩形

  - 接受 Fabric Rect 类的所有 props, 提供工具函数 `getRectProps` 生成矩形属性

- Path 路径

  - 接受 Fabric Path 类的所有 props

- Group 组

  - 接受 Fabric Group 类的所有 props, 用于整体拖动场景

- Text 文本

  - 接受 Fabric Text 类的所有 props

- Objects
  objects 数组类型,用于从数据动态生成所有图形, 需要 type 字段

- Control
- dom 控件,用于实现tooltip效果
  - closeOnOutsideClick 是否在点击外部时关闭,默认true
  - Content 内容
  - placement 位置 参考 floating-ui 文档
  - open 是否打开
  - onOpenChange 打开状态改变时触发
    支持 Control 嵌套,理论上无限嵌套

事件:

- 所有组件均支持所有内部事件,规则为前面加on, 小驼峰, 比如 canvas `mouse:down` -> `onMouseDown`, 有类型提示

### 状态管理

`ReactFabricProvider` + `useReactFabric`

```jsx
const Toolbar = () => {
  const { setMinManualZoom, setMaxManualZoom, reset, setDefaultSelection, canvas } = useReactFabric()
  return <div>Toolbar</div>
}

const Main = () => {
  return (
    <ReactFabricProvider>
      <ReactFabric>
        <BackgroundImage scaleToFit src={imgBaseURL + currentSrc} />
      </ReactFabric>
      <Toolbar />
    </ReactFabricProvider>
  )
}
```

- 受控模式
  支持所有属性和事件, 因此天然支持了受控模式

```jsx

const [rect, setRect] = useState({
  points: '100,100,200,200,300,300,400,400',
})

<ReactFabric>
  <Rect
    left={getRectProps(rect?.points, 5)?.left}
    top={getRectProps(rect?.points, 5)?.top}
    width={getRectProps(rect?.points, 5)?.width}
    height={getRectProps(rect?.points, 5)?.height}
    onModified={({ target }) => {
      const rect = target as FabricRect
      setRect({
        points: rect.getCoords().reduce<number[]>((acc, { x, y }) => [...acc, Math.round(x), Math.round(y)], [])
          .join(','),
      })
    }}
  />
   <Control
                                className="z-10"
                                closeOnOutsideClick={false}
                                open={open}
                                onOpenChange={(nextOpen)=>setOpen(nextOpen)}
                                Content={
                                <button>删除</button>
                                }
                                placement="bottom"
                              >
</ReactFabric>
```

- 非受控模式

图形在 Group 中渲染时,由于 Group 矩阵会导致内部图形身上的坐标系发生变化, 因此受控模式无法很好的支持到各种矩阵计算
场景: 结合 Group 使用, 注意事项 在Group身上使用onModified等方式修改坐标, 而不是修改内部基础图形

```jsx
<ReactFabric>
  <Group key={groupKey} onModified={({ target }) => {
    const group = target as FabricGroup
    const objects = group.getObjects()
   const nextShapes =  objects.map(object=> object
                                  .getCoords()
                                  .reduce<number[]>((acc, { x, y }) => [...acc, Math.round(x), Math.round(y)], [])
                                  .join(','))



  }}>
    <Rect
      defaultLeft={getRectProps(rect?.points, 5)?.left}
      defaultTop={getRectProps(rect?.points, 5)?.top}
      defaultWidth={getRectProps(rect?.points, 5)?.width}
      defaultHeight={getRectProps(rect?.points, 5)?.height}
    />
  </Group>
</ReactFabric>

// 受控模式在 通过 api 更新画布
  const { canvas } = useReactFabric()
 // 向上-向下+偏移
  const onTranslateY = (px: number) => {
    if (!canvas) {
      console.warn('canvas is null')
      return
    }

    const group = canvas.item(0) as FabricGroup
    group.top = group.top + px
    group.setCoords()

    canvas.requestRenderAll()
    // 不会触发onModified,因此需要手动set
    const objects = group.getObjects()
    // 不会触发onModified,因此需要手动set

    const nextShapes = formList[sideType - 1]?.shapes?.map(shape => {
      const fabricObject = objects.find((obj: any) => obj.id === shape.id)
      if (!fabricObject) return shape

      // Convert fabric object coordinates to points string
      const points = fabricObject
        .getCoords()
        .reduce<number[]>((acc, { x, y }) => [...acc, Math.round(x), Math.round(y)], [])
        .join(',')

      return {
        ...shape,
        points,
      }
    })

    setPageStore({
      formList: produce(formList, draft => {
        set(draft, [sideType - 1, 'shapes'], nextShapes)
      }),
    })
  }
```

### 工具函数

- getRectProps 根据points 生成矩形属性

```jsx
const result = {
  left: Number(x1),
  top: Number(y1),
  width: Math.abs(x2 - x1) - strokeWidth,
  height: Math.abs(y3 - y1) - strokeWidth,
  strokeWidth,
}
```

### 插件

绘制矩形

支持rect的所有props

```jsx
<PluginFreeRect
  strokeWidth={5}
  onComplete={async (nextRect, { canvas }) => {
    let pointsArray = nextRect.pointsArray
    console.log(pointsArray)
  }}
/>
```

网格线

```jsx
<PluginGrid></PluginGrid>
```

### 发布到 npm 步骤:

pnpm run changeset // 修改 changeset.md
全选 changed & unchanged enter
不选 enter major
不选 enter minor
Summary 随便写
desired changeset ? true
pnpm run version-packages // 修改 package.json 的 version
pnpm install // 修改 lock 文件
git add .
git commit -m 'chore(core): version bump'
git push
提交pr到main
通过 github action 自动发布到 npm

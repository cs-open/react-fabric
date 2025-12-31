import { useState, useEffect, useMemo } from 'react'
import {
  ReactFabric,
  BackgroundImage,
  Rect,
  type RectProps,
  useReactFabric,
  ReactFabricProvider,
  Control,
  Path,
  Line,
  PluginFreeRect,
  // WavyLine,
  Group,
  Text,
  PluginGrid,
  WavyLine,
  PluginFreeDraw,
  type PathProps,
} from '@cs-open/react-fabric'

import './Canvas.css'
import Tooltip from './Tooltip'

export const getRectProps = (points: string | number[] | undefined, strokeWidth = 1) => {
  if (!points) {
    console.warn('getRectProps: points is required')
    return null
  }

  const coordinates = Array.isArray(points) ? points : points.split(',').map(Number)

  if (coordinates.length === 0) {
    console.warn('getRectProps: points array is empty')
    return null
  }

  if (coordinates.length !== 8) {
    console.warn(`getRectProps: points must contain exactly 8 numbers, got ${coordinates.length}`)
    return null
  }

  if (coordinates.some(n => Number.isNaN(n))) {
    console.warn('getRectProps: all points must be valid numbers')
    return null
  }

  // 按顺时针顺序：左上(x1,y1)、右上(x2,y2)、右下(x3,y3)、左下(x4,y4)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [x1, y1, x2, y2, x3, y3, x4, y4] = coordinates
  const result = {
    left: Number(x1),
    top: Number(y1),
    width: Math.abs(Number(x2) - Number(x1)) - strokeWidth,
    height: Math.abs(Number(y3) - Number(y1)) - strokeWidth,
    strokeWidth,
  }

  return result
}

const PATH_WIDTH = 62
export const PATH =
  'M12.1021 13.3667C8.40141 14.3973 1 18.3134 1 25.7335C1 35.0085 10.5161 47.3753 37.4784 48.9211C56.5436 50.0142 64.1763 39.6461 62.8547 24.1876C61.533 8.72921 37.4784 2.54584 23.2042 1'

export default function Counter() {
  const [rects, setRects] = useState<RectProps[]>([])
  const [paths, setPaths] = useState<PathProps[]>([])
  const [num, setNum] = useState(0)
  const [scale, setScale] = useState(1)
  const [openFreeRect, setOpenFreeRect] = useState(false)
  const [openFreeDraw, setOpenFreeDraw] = useState(false)


  const [openGrid, setOpenGrid] = useState(false)

  const highLights = useMemo(
    () => [
      getRectProps('210,203,1266,203,1266,259,210,259'),
      getRectProps('108,275,1136,275,1136,330,108,330'),
      getRectProps('185,555,1303,555,1303,610,185,610'),
      getRectProps('108,626,189,626,189,680,108,680'),
    ],
    [],
  )

  const errorShapes = useMemo(
    () => [getRectProps('443,344,490,344,490,401,443,401'), getRectProps('1134,1330,1184,1330,1184,1381,1134,1381')],
    [],
  )
  const matchUps = useMemo(
    () => [
      getRectProps('181,1895,1309,1895,1309,1943,181,1943'),
      getRectProps('1038,1821,1324,1821,1324,1877,1038,1877'),
    ],
    [],
  )

  const [open, setOpen] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setNum(n => n + 1)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <h2>在react中直接使用fabricjs存在缺陷:</h2>
      <ol className='mb-4 px-4'>
        <li>1.单独使用fabric.js会有闭包问题,无法在fabricObject.on('mousedown') 里获取最新的state值,此框架提供的事件解决了这个问题</li>
        <li>2.实现了自动缩放适配宽口,平移,居中, 双指平移,滚轮缩放</li>
        <li>3.实现了自由绘制矩形等插件功能</li>
        <li>4. Toolbar 和 ReactFabric 是兄弟组件, 通过 ReactFabricProvider ,你可以轻松操控 ReactFabric </li>
        <li>5. 所有图形支持 dom control, 结合 <a href="https://base-ui.com/react/components/popover" target='_blank'>loating-ui</a>f 可实现 popover 效果</li>
        <li>6. <a href='https://github.com/cs-open/react-fabric/blob/main/examples/astro/src/components/Canvas.tsx' target='_blank'>该示例源码位置</a></li>
      </ol>

      num 会实时改变, 但onMouseDown能正确捕获实时的值(单独使用fabric.js会将总是初始值):{num}

      <ReactFabricProvider>
        <Toolbar
          onScale={nextScale => {
            setScale(nextScale)
          }}
        >
          <button onClick={() => setOpenFreeRect(prev => !prev)}>{openFreeRect ? '关闭' : '开启'}自由绘制矩形</button>
          <button onClick={() => setOpenGrid(prev => !prev)}>{openGrid ? '关闭' : '开启'}网格</button>
          <button onClick={() => setOpenFreeDraw(prev => !prev)}>{openFreeDraw ? '关闭' : '开启'}自由画笔</button>


        </Toolbar>

        <ReactFabric defaultCentered defaultSelection={false} >
          <BackgroundImage
            src="https://cos.ap-shanghai.myqcloud.com/cs-homework-1305192562/4AC4BECB16754379KL9QR762.jpg"
            scaleToFit
          />
          {/* <Group scaleX={scale}>
            {rects.map((rect, index) => (
              <Control
                key={index}
                closeOnOutsideClick={false}
                open={open}
                Content={
                  <div>
                    <button onClick={() => setOpen(false)}>点击2 关闭 </button>
                  </div>
                }
              >
                <Rect
                  key={index}
                  {...rect}
                  onModified={({ target }) => {
                    setRects(prevRects => prevRects.map((rect, idx) => (idx === index ? { ...rect, ...target } : rect)))
                  }}
                  onMousedown={() => {
                    setOpen(true)
                  }}
                />
              </Control>
            ))}
          </Group> */}
          <Text
            text={'100分'}
            fill={'red'}
            fontSize={80}
            fontWeight={600}
            top={100}
            left={40}
            evented={true}
            hasControls={false}
            objectCaching={false}
            noScaleCache={true}
            onMoving={(e: { transform: { target: any } }) => {
              // 拖拽过程中的边界限制
              const target = e.transform.target
              // 直接限制位置，不允许超出边界
              const newTop = Math.max(0, Math.min(target.top, 2023 - target.height))
              const newLeft = Math.max(0, Math.min(target.left, 1433 - target.width))
              // 强制设置位置
              target.set({
                top: newTop,
                left: newLeft,
              })
              console.log('拖拽中，位置已限制')
            }}
          />
          {
            openGrid && <PluginGrid></PluginGrid>
          }

          {errorShapes.map(child => (
            <>
              <Path
                path={PATH}
                stroke={'#F5222D'}
                fill={'transparent'}
                strokeWidth={2}
                scaleX={Number(child.width) / PATH_WIDTH}
                scaleY={1.5}

                top={Number(child.top)}
                left={Number(child.left)}
                strokeUniform={true}
                strokeLineCap="round"
                selectable={false}
                zIndex={10}
                onMousedown={() => {
                  console.log('onMousedown:num', num)
                }}
              />
            </>
          ))}

          {highLights.map(child => (
            <WavyLine
              hoverCursor="pointer"
              selectable={false}
              stroke={'#1890FF33'}
              strokeWidth={3}
              x1={Number(child.left)}
              y1={Number(child.top) + Number(child.height) + 5}
              x2={Number(child.left) + Number(child.width)}
              y2={Number(child.top) + Number(child.height) + 5}
              onMousedown={() => {
                console.log('onMousedown:num', num)
              }}
            />
          ))}
          {matchUps.map(child => (
            <>
              <Line
                hoverCursor="pointer"
                selectable={false}
                stroke={'#FA8C16'}
                strokeWidth={2}
                x1={Number(child.left)}
                y1={Number(child.top) + Number(child.height) + 10}
                x2={Number(child.left) + Number(child.width)}
                y2={Number(child.top) + Number(child.height) + 10}
                onMousedown={() => {
                  console.log('onMousedown:num', num)
                }}
              />
            </>
          ))}
          {rects.map(item => (
            <Rect stroke="red" strokeWidth={5} selectable={false} fill="transparent" hasControls={false} {...item} >
              <div className="h-full w-full">
                <Tooltip />
              </div>
            </Rect>
          ))}

          {openFreeRect && (
            <PluginFreeRect
              stroke="red"
              strokeWidth={5}
              fill="transparent"
              onComplete={async (nextRect, { canvas }) => {
                let pointsArray = nextRect.pointsArray
                console.log('onComplete', pointsArray)
                setRects(prev => [
                  ...prev,
                  {
                    width: pointsArray[2] - pointsArray[0],
                    height: pointsArray[7] - pointsArray[1],
                    left: pointsArray[0],
                    top: pointsArray[1],
                  },
                ])
              }}
            />
          )}
          {
            paths.map(path => (
              <Path stroke="red"
                evented={false}
                fill="transparent"
                strokeLineCap="round"
                selectable={false}
                strokeWidth={2}
                path={path.path}
                {...path}
              >
              </Path>)
            )

          }
          {
            openFreeDraw && <PluginFreeDraw
              onComplete={path => {
                setPaths(prev => [...prev, {
                  left: path.left,
                  top: path.top,
                  width: path.width,
                  path: path.path as any
                }])
              }}
            />
          }

        </ReactFabric>
      </ReactFabricProvider>

    </>
  )
}

const Toolbar = ({ children }) => {
  const { resetViewport, zoomIn, zoomOut, manualZoom, canvas } = useReactFabric()
  return (
    <div className='my-2'>
      <button onClick={() => resetViewport()}>重置</button>
      <button onClick={zoomIn}>放大</button>
      <span> {Math.round(manualZoom * 100)}%</span>
      <button onClick={zoomOut}>缩小</button>
      {children}

      <button
        onClick={() => {
          console.log('canvas', canvas)
        }}
      >
        打印 canvas
      </button>

    </div>
  )
}

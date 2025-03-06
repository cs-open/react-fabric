import type { CSSProperties } from 'react'
import { forwardRef, memo } from 'react'

// 自定义基础事件类型
type FabricEvent = {
  e: Event
  pointer: { x: number; y: number }
  target?: unknown
  subTargets?: unknown[]
  button?: number
  isClick?: boolean
  transform?: unknown
}

// 重新定义 CanvasProps，不再从 components/Canvas 导入
type BaseCanvasProps = {
  width?: number
  height?: number
  selection?: boolean
  children?: React.ReactNode
  // 添加其他必要的 Canvas 属性
}

import { Wrapper } from './Wrapper'

import Canvas from '../../components/Canvas'
import { StoreUpdater } from '../../components/StoreUpdater'

const wrapperStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 0,
}

export type ReactFabricProps = BaseCanvasProps & {
  style?: CSSProperties
  className?: string
  zoomable?: boolean
  minManualZoom?: number
  maxManualZoom?: number
  /** 背景图是否默认居中显示
   * @default false
   */
  defaultCentered?: boolean
  /** 是否启用选择功能
   * @default true
   *  */
  defaultSelection?: boolean
  /**
   * 是否默认可拖拽
   */
  defaultDraggable?: boolean
  onMouseDown?: (e: FabricEvent) => void
  onMouseMove?: (e: FabricEvent) => void
  onMouseUp?: (e: FabricEvent) => void
  onMouseWheel?: (e: FabricEvent) => void
}

const ForwardReactFabric = forwardRef<HTMLDivElement, ReactFabricProps>(
  (
    {
      minManualZoom,
      maxManualZoom,
      className,
      children,
      width,
      height,
      selection,
      style,
      onMouseWheel,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      zoomable,
      defaultSelection,
      defaultCentered,
      defaultDraggable,
      ...rest
    },
    ref,
  ) => {
    return (
      <div style={{ ...style, ...wrapperStyle }} ref={ref} className={`react-fabric ${className || ''}`}>
        <Wrapper width={width} height={height}>
          <StoreUpdater
            minManualZoom={minManualZoom}
            maxManualZoom={maxManualZoom}
            zoomable={zoomable}
            defaultCentered={defaultCentered}
            selection={selection}
            defaultSelection={defaultSelection}
            defaultDraggable={defaultDraggable}
          />

          <Canvas
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseWheel={onMouseWheel}
            {...rest}
          >
            {children}
          </Canvas>
        </Wrapper>
      </div>
    )
  },
)

type ReactFabricComponent = React.MemoExoticComponent<typeof ForwardReactFabric>

const ReactFabric: ReactFabricComponent = memo(ForwardReactFabric)
ReactFabric.displayName = 'ReactFabric'

export default ReactFabric

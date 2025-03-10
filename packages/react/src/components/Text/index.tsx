import type { Group as BaseGroup } from 'fabric'
import { FabricText } from 'fabric'
import { forwardRef, memo, useEffect, useImperativeHandle } from 'react'
import { useCreateObject } from '../../hooks/useCreateObject'
import { useSplitProps } from '../../hooks/useSplitProps'
import { useStoreApi } from '../../hooks/useStore'
import type { AllObjectEvents } from '../../types/object'
import FontFaceObserver from 'fontfaceobserver'

export type Handle = FabricText | undefined

export type TextProps<T = unknown> = Partial<ConstructorParameters<typeof FabricText>[1] & AllObjectEvents> & {
  group?: BaseGroup
  text: string
} & T

const Text = forwardRef<Handle, TextProps>(({ group, text, ...props }, ref) => {
  const store = useStoreApi()

  const [listeners, attributes] = useSplitProps(props)

  const instance = useCreateObject({
    Constructor: FabricText,
    param: text,
    attributes,
    group,
    listeners,
  })

  /**
   * 字体只有被使用了才会加载;先由 Text 使用一次, 监听加载完成,之后再 set 一次
   */
  useEffect(() => {
    const { canvas } = store.getState()
    if (!attributes.fontFamily || !instance) return
    const font = new FontFaceObserver(attributes.fontFamily)
    font
      .load()
      .then(() => {
        instance.set({
          fontFamily: attributes.fontFamily,
        })
        canvas?.requestRenderAll()
      })
      .catch(() => {
        // 加载失败
        console.error(`ReactFabric: 字体加载失败: ${attributes.fontFamily}`)
      })
  }, [attributes.fontFamily, instance])

  useImperativeHandle(ref, () => instance, [instance])

  return null
})

export default memo(Text)

import { useReactFabric } from "@cs-open/react-fabric"

const Tooltip = () => {
    const { zoom } = useReactFabric()
    return <div style={{
        fontSize: `${40 * zoom}px`,
        padding: `${20 * zoom}px`,
    }}>
        <span>此处支持 dom control </span>
    </div>
}

export default Tooltip
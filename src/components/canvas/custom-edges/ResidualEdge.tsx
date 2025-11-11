import { memo } from 'react'
import { getBezierPath, EdgeProps } from 'reactflow'

/**
 * 自定义残差连接边
 * - 当连接两个 Add 节点时：使用特殊的倒梯形路径避开中间的残差块
 * - 其他情况：使用普通贝塞尔曲线，仅绿色虚线样式
 */
export const ResidualEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  // 检查是否两侧都是 Add 节点
  const sourceType = data?.sourceType
  const targetType = data?.targetType
  const bothAreAddNodes = sourceType === 'add' && targetType === 'add'
  
  // 计算曲线长度
  const deltaX = targetX - sourceX
  const deltaY = targetY - sourceY
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  
  let customPath: string
  
  if (bothAreAddNodes || distance > 400) {
    // 两侧都是 Add 节点或曲线长度大于200：使用特殊的倒梯形路径
    const dropDepth = 150
    const controlOffset = Math.min(deltaX * 0.3, 80)  // 自适应控制点偏移
    
    customPath = `
      M ${sourceX},${sourceY}
      C ${sourceX + controlOffset},${sourceY}
        ${sourceX + controlOffset},${sourceY + dropDepth}
        ${sourceX + deltaX * 0.5},${sourceY + dropDepth}
      C ${targetX - controlOffset},${sourceY + dropDepth}
        ${targetX - controlOffset},${targetY}
        ${targetX},${targetY}
    `.trim()
  } else {
    // 其他情况：使用普通贝塞尔曲线
    const [path] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    })
    customPath = path
  }

  return (
    <>
      {/* 边的路径 */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={customPath}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: '#10b981',
          strokeDasharray: '5,5',
          fill: 'none',
        }}
        markerEnd={markerEnd}
      />
    </>
  )
})

ResidualEdge.displayName = 'ResidualEdge'

import { memo } from "react"
import { Handle, Position } from "reactflow"
import { Plus } from "lucide-react"
import type { AddLayer } from "@/lib/types"
import { getColorTheme } from "@/lib/utils"

interface AddNodeProps {
  data: AddLayer
  selected?: boolean
}

export const AddNode = memo(({ data, selected }: AddNodeProps) => {
  const theme = getColorTheme(data.type)
  
  return (
    <div
      className={`
        relative group
        w-[100px] h-[100px]
        rounded-full border-2 
        bg-background
        shadow-lg
        transition-all duration-300
        flex items-center justify-center
        ${selected ? theme.borderSelected : theme.borderUnselected}
      `}
    >
      {/* 输入 Handle - 主路径 */}
      <Handle
        type="target"
        position={Position.Left}
        id="main"
        className={`!w-2.5 !h-2.5 ${theme.handle} !border-2 !border-white !-left-1`}
        style={{ top: '50%' }}
      />

      {/* 中心内容 */}
      <div className="flex flex-col items-center justify-center">
        <div className={`p-2 rounded-full bg-gradient-to-br ${theme.head}`}>
          <Plus className="w-5 h-5 text-white" />
        </div>
        <span className={`text-[10px] font-semibold ${theme.textHighlight} mt-1`}>
          ADD
        </span>
      </div>

      {/* 输出 Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className={`!w-2.5 !h-2.5 ${theme.handle} !border-2 !border-white !-right-1`}
      />
    </div>
  )
})

AddNode.displayName = "AddNode"

#!/usr/bin/env python3
"""
批量更新模型 JSON 文件中的层类型名称
- conv -> conv2d
- pooling -> maxpool2d/avgpool2d/global_avgpool (根据 poolingType 判断)
- activation -> 具体的激活函数名称 (根据 activation 字段判断)
"""

import json
import glob
import os
from pathlib import Path

# 获取脚本所在目录的父目录(项目根目录)
project_root = Path(__file__).parent.parent
models_dir = project_root / "src" / "models"

def update_layer_type(layer):
    """更新单个层的类型"""
    layer_type = layer.get("type")
    
    # 1. 更新卷积层: conv -> conv2d
    if layer_type == "conv":
        layer["type"] = "conv2d"
        print(f"  ✓ 更新层 '{layer.get('id')}': conv -> conv2d")
    
    # 2. 更新池化层: pooling -> 具体类型
    elif layer_type == "pooling":
        pooling_type = layer.get("poolingType", "max")
        
        if pooling_type == "global":
            layer["type"] = "global_avgpool"
            print(f"  ✓ 更新层 '{layer.get('id')}': pooling (global) -> global_avgpool")
        elif pooling_type == "average":
            layer["type"] = "avgpool2d"
            print(f"  ✓ 更新层 '{layer.get('id')}': pooling (average) -> avgpool2d")
        else:  # max
            layer["type"] = "maxpool2d"
            print(f"  ✓ 更新层 '{layer.get('id')}': pooling (max) -> maxpool2d")
        
        # 删除 poolingType 字段,因为现在类型本身就表明了池化类型
        if "poolingType" in layer:
            del layer["poolingType"]
    
    # 3. 更新激活层: activation -> 具体激活函数
    elif layer_type == "activation":
        activation = layer.get("activation", "relu").lower()
        layer["type"] = activation
        print(f"  ✓ 更新层 '{layer.get('id')}': activation -> {activation}")
        
        # 删除 activation 字段,因为现在类型本身就是激活函数
        if "activation" in layer:
            del layer["activation"]
    
    return layer

def update_model_file(file_path):
    """更新单个模型文件"""
    print(f"\n处理文件: {file_path.name}")
    
    try:
        # 读取 JSON 文件
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 更新层类型
        updated_count = 0
        if "layers" in data:
            for layer in data["layers"]:
                original_type = layer.get("type")
                update_layer_type(layer)
                if layer.get("type") != original_type:
                    updated_count += 1
                
                # 递归处理残差块中的层
                if layer.get("type") == "residual" and "mainPath" in layer:
                    for sub_layer in layer["mainPath"]:
                        original_type = sub_layer.get("type")
                        update_layer_type(sub_layer)
                        if sub_layer.get("type") != original_type:
                            updated_count += 1
        
        # 写回文件
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ 完成! 更新了 {updated_count} 个层")
        return updated_count
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON 解析错误: {e}")
        return 0
    except Exception as e:
        print(f"❌ 处理失败: {e}")
        return 0

def main():
    """主函数"""
    print("=" * 60)
    print("开始批量更新模型 JSON 文件...")
    print("=" * 60)
    
    # 查找所有 JSON 文件 (排除 template)
    json_files = sorted(models_dir.glob("*.json"))
    json_files = [f for f in json_files if "template" not in f.name.lower()]
    
    if not json_files:
        print("❌ 未找到 JSON 文件!")
        return
    
    print(f"\n找到 {len(json_files)} 个模型文件:")
    for f in json_files:
        print(f"  - {f.name}")
    
    # 处理每个文件
    total_updated = 0
    for json_file in json_files:
        total_updated += update_model_file(json_file)
    
    print("\n" + "=" * 60)
    print(f"✅ 全部完成! 共更新了 {total_updated} 个层")
    print("=" * 60)

if __name__ == "__main__":
    main()

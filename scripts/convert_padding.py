#!/usr/bin/env python3
"""
将所有模型 JSON 文件中的 padding 从字符串格式转换为数字数组格式
- "same" → [1, 1]
- "valid" → [0, 0]
"""

import json
import os
from pathlib import Path

# 模型文件目录
MODELS_DIR = Path(__file__).parent.parent / "src" / "models"

def convert_padding_value(value):
    """转换 padding 值"""
    if isinstance(value, str):
        if value == "same":
            return [1, 1]
        elif value == "valid":
            return [0, 0]
        elif value == "full":
            return [2, 2]
    return value

def convert_padding_in_layer(layer):
    """递归转换层中的 padding"""
    if isinstance(layer, dict):
        # 转换当前层的 padding
        if "padding" in layer:
            layer["padding"] = convert_padding_value(layer["padding"])
        
        # 递归处理 branches (用于 Inception 等复合层)
        if "branches" in layer and isinstance(layer["branches"], list):
            for branch in layer["branches"]:
                if "layers" in branch and isinstance(branch["layers"], list):
                    for sub_layer in branch["layers"]:
                        convert_padding_in_layer(sub_layer)
        
        # 递归处理 mainPath (用于 Residual 块)
        if "mainPath" in layer and isinstance(layer["mainPath"], list):
            for sub_layer in layer["mainPath"]:
                convert_padding_in_layer(sub_layer)
    
    return layer

def convert_model_file(filepath):
    """转换单个模型文件"""
    print(f"处理: {filepath.name}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 转换所有层
    if "layers" in data and isinstance(data["layers"], list):
        for layer in data["layers"]:
            convert_padding_in_layer(layer)
    
    # 保存文件
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"  ✓ 完成")

def main():
    """主函数"""
    print("=" * 60)
    print("开始转换 padding 格式...")
    print("=" * 60)
    
    # 获取所有 JSON 文件
    json_files = sorted(MODELS_DIR.glob("*.json"))
    
    if not json_files:
        print("未找到任何 JSON 文件")
        return
    
    print(f"\n找到 {len(json_files)} 个模型文件\n")
    
    # 转换每个文件
    for filepath in json_files:
        try:
            convert_model_file(filepath)
        except Exception as e:
            print(f"  ✗ 错误: {e}")
    
    print("\n" + "=" * 60)
    print("转换完成!")
    print("=" * 60)

if __name__ == "__main__":
    main()

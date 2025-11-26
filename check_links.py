#!/usr/bin/env python3
"""
檢查所有 HTML 文件中的死鏈接
"""
import os
import re
import requests
from urllib.parse import urlparse, urljoin
from pathlib import Path
from html.parser import HTMLParser
from collections import defaultdict

class LinkExtractor(HTMLParser):
    def __init__(self, base_path):
        super().__init__()
        self.base_path = base_path
        self.links = []
        self.anchors = set()
        
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            href = dict(attrs).get('href', '')
            if href:
                self.links.append(href)
        if tag in ['div', 'section', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            id_attr = dict(attrs).get('id', '')
            if id_attr:
                self.anchors.add(id_attr)

def find_html_files(root_dir):
    """找到所有 HTML 文件"""
    html_files = []
    for root, dirs, files in os.walk(root_dir):
        # 跳過隱藏目錄和常見的排除目錄
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', '__pycache__']]
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    return html_files

def check_links():
    """檢查所有鏈接"""
    root_dir = os.getcwd()
    html_files = find_html_files(root_dir)
    
    print(f"找到 {len(html_files)} 個 HTML 文件\n")
    
    broken_links = []
    external_links = []
    all_anchors = defaultdict(set)  # file_path -> set of anchor IDs
    
    # 第一步：提取所有鏈接和錨點
    for html_file in html_files:
        rel_path = os.path.relpath(html_file, root_dir)
        try:
            with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            parser = LinkExtractor(html_file)
            parser.feed(content)
            
            all_anchors[rel_path] = parser.anchors
            
            # 檢查每個鏈接
            for link in parser.links:
                if link.startswith('#'):
                    # 內部錨點
                    anchor = link[1:].split('/')[0]  # 移除 # 並取第一個部分
                    if anchor:
                        broken_links.append({
                            'file': rel_path,
                            'link': link,
                            'type': 'anchor',
                            'anchor': anchor
                        })
                elif link.startswith('http://') or link.startswith('https://'):
                    # 外部鏈接
                    external_links.append({
                        'file': rel_path,
                        'link': link
                    })
                elif link.startswith('mailto:') or link.startswith('tel:'):
                    # 協議鏈接，跳過
                    continue
                elif link.startswith('javascript:'):
                    # JavaScript 鏈接，跳過
                    continue
                else:
                    # 相對路徑鏈接
                    if '#' in link:
                        file_part, anchor_part = link.split('#', 1)
                    else:
                        file_part, anchor_part = link, None
                    
                    # 解析文件路徑
                    base_dir = os.path.dirname(html_file)
                    target_file = os.path.normpath(os.path.join(base_dir, file_part))
                    
                    if not os.path.exists(target_file):
                        broken_links.append({
                            'file': rel_path,
                            'link': link,
                            'type': 'file',
                            'target': target_file
                        })
                    elif anchor_part:
                        # 檢查錨點是否存在（會在後面驗證）
                        pass
    
    # 第二步：驗證內部錨點
    for broken in broken_links[:]:  # 使用切片創建副本以便修改
        if broken['type'] == 'anchor':
            file_path = broken['file']
            anchor = broken['anchor']
            
            # 檢查同一文件中的錨點
            if anchor in all_anchors.get(file_path, set()):
                broken_links.remove(broken)
            else:
                # 檢查是否有 ID 屬性但解析器沒捕獲到（可能是動態生成）
                full_path = os.path.join(root_dir, file_path)
                try:
                    with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                    # 簡單檢查是否有該 ID 或 name
                    if f'id="{anchor}"' in content or f"id='{anchor}'" in content:
                        broken_links.remove(broken)
                except:
                    pass
    
    # 第三步：驗證外部鏈接（抽樣檢查）
    print("檢查外部鏈接（前10個）...")
    checked_external = 0
    for ext_link in external_links[:10]:
        checked_external += 1
        try:
            response = requests.head(ext_link['link'], timeout=5, allow_redirects=True)
            if response.status_code >= 400:
                broken_links.append({
                    'file': ext_link['file'],
                    'link': ext_link['link'],
                    'type': 'external',
                    'status': response.status_code
                })
        except Exception as e:
            broken_links.append({
                'file': ext_link['file'],
                'link': ext_link['link'],
                'type': 'external',
                'error': str(e)
            })
    
    # 輸出結果
    print(f"\n{'='*60}")
    print(f"鏈接檢查報告")
    print(f"{'='*60}\n")
    
    print(f"總共檢查 {len(html_files)} 個 HTML 文件")
    print(f"找到 {len(external_links)} 個外部鏈接（已檢查 {checked_external} 個）")
    print(f"找到 {len(broken_links)} 個可能的死鏈接\n")
    
    if broken_links:
        print("死鏈接詳情：")
        print("-" * 60)
        for i, broken in enumerate(broken_links, 1):
            print(f"{i}. 文件: {broken['file']}")
            print(f"   鏈接: {broken['link']}")
            if broken['type'] == 'anchor':
                print(f"   類型: 內部錨點 (未找到 ID: {broken['anchor']})")
            elif broken['type'] == 'file':
                print(f"   類型: 文件鏈接 (文件不存在: {broken['target']})")
            elif broken['type'] == 'external':
                if 'status' in broken:
                    print(f"   類型: 外部鏈接 (HTTP {broken['status']})")
                else:
                    print(f"   類型: 外部鏈接 (錯誤: {broken.get('error', 'Unknown')})")
            print()
    else:
        print("✓ 沒有發現死鏈接！")
    
    return len(broken_links) == 0

if __name__ == '__main__':
    try:
        success = check_links()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n檢查被中斷")
        exit(1)
    except Exception as e:
        print(f"\n發生錯誤: {e}")
        import traceback
        traceback.print_exc()
        exit(1)


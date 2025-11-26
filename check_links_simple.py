#!/usr/bin/env python3
"""
簡化版鏈接檢查 - 只檢查本地文件和錨點
"""
import os
import re
from pathlib import Path
from html.parser import HTMLParser
from collections import defaultdict

class LinkExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.anchors = set()
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == 'a' and 'href' in attrs_dict:
            self.links.append(attrs_dict['href'])
        if 'id' in attrs_dict:
            self.anchors.add(attrs_dict['id'])
        if 'name' in attrs_dict:  # 舊的 HTML name 屬性
            self.anchors.add(attrs_dict['name'])

def find_html_files(root_dir):
    """找到所有 HTML 文件"""
    html_files = []
    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if not d.startswith('.')]
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
    all_anchors = defaultdict(set)
    all_file_contents = {}
    
    # 第一步：讀取所有文件並提取錨點
    for html_file in html_files:
        rel_path = os.path.relpath(html_file, root_dir)
        try:
            with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            all_file_contents[rel_path] = content
            
            parser = LinkExtractor()
            parser.feed(content)
            all_anchors[rel_path] = parser.anchors
            
        except Exception as e:
            print(f"警告：無法讀取文件 {rel_path}: {e}")
    
    # 第二步：檢查鏈接
    for html_file in html_files:
        rel_path = os.path.relpath(html_file, root_dir)
        content = all_file_contents.get(rel_path, '')
        
        parser = LinkExtractor()
        parser.feed(content)
        
        base_dir = os.path.dirname(html_file)
        
        for link in parser.links:
            # 跳過這些類型的鏈接
            if any(link.startswith(prefix) for prefix in [
                'http://', 'https://', 'mailto:', 'tel:', 'javascript:', 'data:'
            ]):
                continue
            
            if link.startswith('#'):
                # 內部錨點
                anchor = link[1:]
                if anchor and anchor not in all_anchors.get(rel_path, set()):
                    # 再檢查一次原始內容（可能是動態生成）
                    if not (f'id="{anchor}"' in content or 
                           f"id='{anchor}'" in content or
                           f'name="{anchor}"' in content or
                           f"name='{anchor}'" in content):
                        broken_links.append({
                            'file': rel_path,
                            'link': link,
                            'type': 'anchor',
                            'anchor': anchor
                        })
            else:
                # 文件鏈接
                if '#' in link:
                    file_part, anchor_part = link.split('#', 1)
                    anchor = anchor_part
                else:
                    file_part, anchor = link, None
                
                # 解析目標文件
                if file_part:
                    target_file = os.path.normpath(os.path.join(base_dir, file_part))
                    target_rel = os.path.relpath(target_file, root_dir)
                    
                    if not os.path.exists(target_file):
                        broken_links.append({
                            'file': rel_path,
                            'link': link,
                            'type': 'file',
                            'target': target_rel
                        })
                    elif anchor:
                        # 檢查目標文件中的錨點
                        target_content = all_file_contents.get(target_rel, '')
                        if not (f'id="{anchor}"' in target_content or 
                               f"id='{anchor}'" in target_content or
                               f'name="{anchor}"' in target_content or
                               f"name='{anchor}'" in target_content):
                            broken_links.append({
                                'file': rel_path,
                                'link': link,
                                'type': 'anchor_in_file',
                                'target': target_rel,
                                'anchor': anchor
                            })
    
    # 輸出結果
    print(f"{'='*70}")
    print(f"鏈接檢查報告")
    print(f"{'='*70}\n")
    
    print(f"✓ 檢查了 {len(html_files)} 個 HTML 文件")
    print(f"{'✓' if len(broken_links) == 0 else '✗'} 發現 {len(broken_links)} 個可能的死鏈接\n")
    
    if broken_links:
        print("死鏈接詳情：")
        print("-" * 70)
        for i, broken in enumerate(broken_links, 1):
            print(f"\n{i}. 文件: {broken['file']}")
            print(f"   鏈接: {broken['link']}")
            if broken['type'] == 'anchor':
                print(f"   問題: 在同一個文件中找不到 ID='{broken['anchor']}'")
            elif broken['type'] == 'file':
                print(f"   問題: 文件不存在: {broken['target']}")
            elif broken['type'] == 'anchor_in_file':
                print(f"   問題: 在目標文件 '{broken['target']}' 中找不到 ID='{broken['anchor']}'")
        print()
    else:
        print("✓ 沒有發現死鏈接！所有鏈接都是有效的。")
    
    return len(broken_links) == 0

if __name__ == '__main__':
    try:
        success = check_links()
        input("\n按 Enter 鍵退出...")
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n檢查被中斷")
        exit(1)
    except Exception as e:
        print(f"\n發生錯誤: {e}")
        import traceback
        traceback.print_exc()
        input("\n按 Enter 鍵退出...")
        exit(1)


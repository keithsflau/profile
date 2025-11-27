# -*- coding: utf-8 -*-
"""直接執行 Git 操作和鏈接檢查"""
import os
import subprocess
import sys

def execute_git_and_check():
    """執行所有 Git 操作和鏈接檢查"""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("="*70)
    print("開始執行：上傳到 GitHub 並檢查鏈接")
    print("="*70)
    
    # 1. Git add
    print("\n[步驟 1/5] 添加所有更改...")
    try:
        result = subprocess.run(["git", "add", "-A"], 
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode == 0:
            print("✓ 所有文件已添加到暫存區")
        else:
            print(f"✗ 添加失敗: {result.stderr}")
            return
    except Exception as e:
        print(f"✗ 執行錯誤: {e}")
        return
    
    # 2. Git commit
    print("\n[步驟 2/5] 提交更改...")
    commit_msg = "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
    try:
        result = subprocess.run(["git", "commit", "-m", commit_msg],
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode == 0:
            print("✓ 更改已提交")
            if result.stdout:
                print(result.stdout.strip())
        else:
            if "nothing to commit" in result.stdout.lower() or "沒有更改" in result.stdout:
                print("⚠ 沒有需要提交的更改（可能已經提交過了）")
            else:
                print(f"✗ 提交失敗: {result.stderr or result.stdout}")
                return
    except Exception as e:
        print(f"✗ 執行錯誤: {e}")
        return
    
    # 3. Git push
    print("\n[步驟 3/5] 推送到 GitHub...")
    try:
        result = subprocess.run(["git", "push", "origin", "main"],
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode == 0:
            print("✓ 已成功推送到 GitHub")
            if result.stdout:
                print(result.stdout.strip())
        else:
            print(f"⚠ 推送失敗: {result.stderr or result.stdout}")
            print("  可能原因：沒有新提交、網絡問題或權限問題")
    except Exception as e:
        print(f"✗ 執行錯誤: {e}")
    
    # 4. 檢查鏈接
    print("\n" + "="*70)
    print("[步驟 4/5] 檢查死鏈接...")
    print("="*70)
    if os.path.exists("check_links_simple.py"):
        try:
            subprocess.run([sys.executable, "check_links_simple.py"], check=False)
        except Exception as e:
            print(f"✗ 鏈接檢查失敗: {e}")
    else:
        print("⚠ 鏈接檢查腳本不存在")
    
    print("\n" + "="*70)
    print("執行完成！")
    print("="*70)
    input("\n按 Enter 鍵退出...")

if __name__ == '__main__':
    try:
        execute_git_and_check()
    except KeyboardInterrupt:
        print("\n\n操作被中斷")
    except Exception as e:
        print(f"\n\n發生錯誤: {e}")
        import traceback
        traceback.print_exc()
        input("\n按 Enter 鍵退出...")

"""直接執行 Git 操作和鏈接檢查"""
import os
import subprocess
import sys

def execute_git_and_check():
    """執行所有 Git 操作和鏈接檢查"""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("="*70)
    print("開始執行：上傳到 GitHub 並檢查鏈接")
    print("="*70)
    
    # 1. Git add
    print("\n[步驟 1/5] 添加所有更改...")
    try:
        result = subprocess.run(["git", "add", "-A"], 
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode == 0:
            print("✓ 所有文件已添加到暫存區")
        else:
            print(f"✗ 添加失敗: {result.stderr}")
            return
    except Exception as e:
        print(f"✗ 執行錯誤: {e}")
        return
    
    # 2. Git commit
    print("\n[步驟 2/5] 提交更改...")
    commit_msg = "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
    try:
        result = subprocess.run(["git", "commit", "-m", commit_msg],
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode == 0:
            print("✓ 更改已提交")
            if result.stdout:
                print(result.stdout.strip())
        else:
            if "nothing to commit" in result.stdout.lower() or "沒有更改" in result.stdout:
                print("⚠ 沒有需要提交的更改（可能已經提交過了）")
            else:
                print(f"✗ 提交失敗: {result.stderr or result.stdout}")
                return
    except Exception as e:
        print(f"✗ 執行錯誤: {e}")
        return
    
    # 3. Git push
    print("\n[步驟 3/5] 推送到 GitHub...")
    try:
        result = subprocess.run(["git", "push", "origin", "main"],
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode == 0:
            print("✓ 已成功推送到 GitHub")
            if result.stdout:
                print(result.stdout.strip())
        else:
            print(f"⚠ 推送失敗: {result.stderr or result.stdout}")
            print("  可能原因：沒有新提交、網絡問題或權限問題")
    except Exception as e:
        print(f"✗ 執行錯誤: {e}")
    
    # 4. 檢查鏈接
    print("\n" + "="*70)
    print("[步驟 4/5] 檢查死鏈接...")
    print("="*70)
    if os.path.exists("check_links_simple.py"):
        try:
            subprocess.run([sys.executable, "check_links_simple.py"], check=False)
        except Exception as e:
            print(f"✗ 鏈接檢查失敗: {e}")
    else:
        print("⚠ 鏈接檢查腳本不存在")
    
    print("\n" + "="*70)
    print("執行完成！")
    print("="*70)
    input("\n按 Enter 鍵退出...")

if __name__ == '__main__':
    try:
        execute_git_and_check()
    except KeyboardInterrupt:
        print("\n\n操作被中斷")
    except Exception as e:
        print(f"\n\n發生錯誤: {e}")
        import traceback
        traceback.print_exc()
        input("\n按 Enter 鍵退出...")

"""直接執行 Git 操作和鏈接檢查"""
import os
import subprocess
import sys

def execute_git_and_check():
    """執行所有 Git 操作和鏈接檢查"""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("="*70)
    print("開始執行：上傳到 GitHub 並檢查鏈接")
    print("="*70)
    
    # 1. Git add
    print("\n[步驟 1/5] 添加所有更改...")
    try:
        result = subprocess.run(["git", "add", "-A"], 
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode == 0:
            print("✓ 所有文件已添加到暫存區")
        else:
            print(f"✗ 添加失敗: {result.stderr}")
            return
    except Exception as e:
        print(f"✗ 執行錯誤: {e}")
        return
    
    # 2. Git commit
    print("\n[步驟 2/5] 提交更改...")
    commit_msg = "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
    try:
        result = subprocess.run(["git", "commit", "-m", commit_msg],
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode == 0:
            print("✓ 更改已提交")
            if result.stdout:
                print(result.stdout.strip())
        else:
            if "nothing to commit" in result.stdout.lower() or "沒有更改" in result.stdout:
                print("⚠ 沒有需要提交的更改（可能已經提交過了）")
            else:
                print(f"✗ 提交失敗: {result.stderr or result.stdout}")
                return
    except Exception as e:
        print(f"✗ 執行錯誤: {e}")
        return
    
    # 3. Git push
    print("\n[步驟 3/5] 推送到 GitHub...")
    try:
        result = subprocess.run(["git", "push", "origin", "main"],
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode == 0:
            print("✓ 已成功推送到 GitHub")
            if result.stdout:
                print(result.stdout.strip())
        else:
            print(f"⚠ 推送失敗: {result.stderr or result.stdout}")
            print("  可能原因：沒有新提交、網絡問題或權限問題")
    except Exception as e:
        print(f"✗ 執行錯誤: {e}")
    
    # 4. 檢查鏈接
    print("\n" + "="*70)
    print("[步驟 4/5] 檢查死鏈接...")
    print("="*70)
    if os.path.exists("check_links_simple.py"):
        try:
            subprocess.run([sys.executable, "check_links_simple.py"], check=False)
        except Exception as e:
            print(f"✗ 鏈接檢查失敗: {e}")
    else:
        print("⚠ 鏈接檢查腳本不存在")
    
    print("\n" + "="*70)
    print("執行完成！")
    print("="*70)
    input("\n按 Enter 鍵退出...")

if __name__ == '__main__':
    try:
        execute_git_and_check()
    except KeyboardInterrupt:
        print("\n\n操作被中斷")
    except Exception as e:
        print(f"\n\n發生錯誤: {e}")
        import traceback
        traceback.print_exc()
        input("\n按 Enter 鍵退出...")

"""直接執行 Git 操作和鏈接檢查"""
import os
import subprocess
import sys

def execute_git_and_check():
    """執行所有 Git 操作和鏈接檢查"""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("="*70)
    print("開始執行：上傳到 GitHub 並檢查鏈接")
    print("="*70)
    
    # 1. Git add
    print("\n[步驟 1/5] 添加所有更改...")
    try:
        result = subprocess.run(["git", "add", "-A"], 
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode == 0:
            print("✓ 所有文件已添加到暫存區")
        else:
            print(f"✗ 添加失敗: {result.stderr}")
            return
    except Exception as e:
        print(f"✗ 執行錯誤: {e}")
        return
    
    # 2. Git commit
    print("\n[步驟 2/5] 提交更改...")
    commit_msg = "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
    try:
        result = subprocess.run(["git", "commit", "-m", commit_msg],
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode == 0:
            print("✓ 更改已提交")
            if result.stdout:
                print(result.stdout.strip())
        else:
            if "nothing to commit" in result.stdout.lower() or "沒有更改" in result.stdout:
                print("⚠ 沒有需要提交的更改（可能已經提交過了）")
            else:
                print(f"✗ 提交失敗: {result.stderr or result.stdout}")
                return
    except Exception as e:
        print(f"✗ 執行錯誤: {e}")
        return
    
    # 3. Git push
    print("\n[步驟 3/5] 推送到 GitHub...")
    try:
        result = subprocess.run(["git", "push", "origin", "main"],
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode == 0:
            print("✓ 已成功推送到 GitHub")
            if result.stdout:
                print(result.stdout.strip())
        else:
            print(f"⚠ 推送失敗: {result.stderr or result.stdout}")
            print("  可能原因：沒有新提交、網絡問題或權限問題")
    except Exception as e:
        print(f"✗ 執行錯誤: {e}")
    
    # 4. 檢查鏈接
    print("\n" + "="*70)
    print("[步驟 4/5] 檢查死鏈接...")
    print("="*70)
    if os.path.exists("check_links_simple.py"):
        try:
            subprocess.run([sys.executable, "check_links_simple.py"], check=False)
        except Exception as e:
            print(f"✗ 鏈接檢查失敗: {e}")
    else:
        print("⚠ 鏈接檢查腳本不存在")
    
    print("\n" + "="*70)
    print("執行完成！")
    print("="*70)
    input("\n按 Enter 鍵退出...")

if __name__ == '__main__':
    try:
        execute_git_and_check()
    except KeyboardInterrupt:
        print("\n\n操作被中斷")
    except Exception as e:
        print(f"\n\n發生錯誤: {e}")
        import traceback
        traceback.print_exc()
        input("\n按 Enter 鍵退出...")

"""直接執行 Git 操作和鏈接檢查"""
import os
import subprocess
import sys

def execute_git_and_check():
    """執行所有 Git 操作和鏈接檢查"""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("="*70)
    print("開始執行：上傳到 GitHub 並檢查鏈接")
    print("="*70)
    
    # 1. Git add
    print("\n[步驟 1/5] 添加所有更改...")
    try:
        result = subprocess.run(["git", "add", "-A"], 
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode == 0:
            print("✓ 所有文件已添加到暫存區")
        else:
            print(f"✗ 添加失敗: {result.stderr}")
            return
    except Exception as e:
        print(f"✗ 執行錯誤: {e}")
        return
    
    # 2. Git commit
    print("\n[步驟 2/5] 提交更改...")
    commit_msg = "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
    try:
        result = subprocess.run(["git", "commit", "-m", commit_msg],
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode == 0:
            print("✓ 更改已提交")
            if result.stdout:
                print(result.stdout.strip())
        else:
            if "nothing to commit" in result.stdout.lower() or "沒有更改" in result.stdout:
                print("⚠ 沒有需要提交的更改（可能已經提交過了）")
            else:
                print(f"✗ 提交失敗: {result.stderr or result.stdout}")
                return
    except Exception as e:
        print(f"✗ 執行錯誤: {e}")
        return
    
    # 3. Git push
    print("\n[步驟 3/5] 推送到 GitHub...")
    try:
        result = subprocess.run(["git", "push", "origin", "main"],
                              capture_output=True, text=True, encoding='utf-8', errors='replace')
        if result.returncode == 0:
            print("✓ 已成功推送到 GitHub")
            if result.stdout:
                print(result.stdout.strip())
        else:
            print(f"⚠ 推送失敗: {result.stderr or result.stdout}")
            print("  可能原因：沒有新提交、網絡問題或權限問題")
    except Exception as e:
        print(f"✗ 執行錯誤: {e}")
    
    # 4. 檢查鏈接
    print("\n" + "="*70)
    print("[步驟 4/5] 檢查死鏈接...")
    print("="*70)
    if os.path.exists("check_links_simple.py"):
        try:
            subprocess.run([sys.executable, "check_links_simple.py"], check=False)
        except Exception as e:
            print(f"✗ 鏈接檢查失敗: {e}")
    else:
        print("⚠ 鏈接檢查腳本不存在")
    
    print("\n" + "="*70)
    print("執行完成！")
    print("="*70)
    input("\n按 Enter 鍵退出...")

if __name__ == '__main__':
    try:
        execute_git_and_check()
    except KeyboardInterrupt:
        print("\n\n操作被中斷")
    except Exception as e:
        print(f"\n\n發生錯誤: {e}")
        import traceback
        traceback.print_exc()
        input("\n按 Enter 鍵退出...")




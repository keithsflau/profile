#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自動上傳到 GitHub 並檢查鏈接的 Python 腳本
"""
import os
import subprocess
import sys

def run_command(cmd_list, description, continue_on_error=False):
    """執行命令並顯示結果"""
    print(f"\n{description}...")
    print("-" * 60)
    
    try:
        result = subprocess.run(
            cmd_list,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            cwd=os.getcwd()
        )
        
        if result.stdout:
            print(result.stdout)
        if result.stderr and result.stderr.strip():
            print(result.stderr, file=sys.stderr)
        
        if result.returncode != 0:
            if continue_on_error:
                print(f"⚠ 警告：{description} 失敗（繼續執行）")
                return False
            else:
                print(f"❌ 錯誤：{description} 失敗")
                return False
        
        print(f"✓ {description} 成功")
        return True
        
    except Exception as e:
        print(f"❌ 執行錯誤：{e}")
        if not continue_on_error:
            return False
        return False

def main():
    print("=" * 60)
    print("自動上傳到 GitHub 並檢查鏈接")
    print("=" * 60)
    
    # 確保在正確的目錄
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"\n工作目錄：{os.getcwd()}")
    
    # 步驟 1: 檢查 git 狀態
    print("\n[步驟 1/5] 檢查 git 狀態...")
    run_command(["git", "status", "--short"], "檢查狀態", continue_on_error=True)
    
    # 步驟 2: 添加所有文件
    print("\n[步驟 2/5] 添加所有更改...")
    if not run_command(["git", "add", "-A"], "添加所有更改", continue_on_error=True):
        print("\n❌ 無法添加文件，請檢查 git 配置")
        input("\n按 Enter 鍵退出...")
        return
    
    # 步驟 3: 檢查是否有更改
    print("\n[步驟 3/5] 檢查是否有更改需要提交...")
    result = subprocess.run(
        ["git", "diff", "--cached", "--quiet"],
        capture_output=True
    )
    
    if result.returncode == 0:
        print("⚠ 沒有需要提交的更改（文件可能已經提交）")
        has_changes = False
    else:
        has_changes = True
        # 步驟 4: 提交
        print("\n[步驟 4/5] 提交更改...")
        commit_message = "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
        if not run_command(
            ["git", "commit", "-m", commit_message],
            "提交更改",
            continue_on_error=True
        ):
            print("\n⚠ 提交失敗或沒有更改需要提交")
            has_changes = False
    
    # 步驟 5: 推送到 GitHub
    if has_changes:
        print("\n[步驟 5/5] 推送到 GitHub...")
        if not run_command(["git", "push", "origin", "main"], "推送到 GitHub", continue_on_error=True):
            print("\n⚠ 推送失敗，可能的原因：")
            print("  - 網絡連接問題")
            print("  - 權限問題")
            print("  - 需要先執行 git pull")
            print("  - 或者沒有新的提交需要推送")
    else:
        print("\n[步驟 5/5] 跳過推送（沒有新的提交）")
    
    # 步驟 6: 檢查鏈接
    print("\n" + "=" * 60)
    print("[額外步驟] 檢查死鏈接...")
    print("=" * 60)
    
    if os.path.exists("check_links_simple.py"):
        print("\n運行鏈接檢查腳本...\n")
        try:
            subprocess.run([sys.executable, "check_links_simple.py"], check=False)
        except Exception as e:
            print(f"⚠ 鏈接檢查失敗：{e}")
    else:
        print("⚠ 鏈接檢查腳本不存在")
    
    print("\n" + "=" * 60)
    print("✓ 所有步驟完成！")
    print("=" * 60)
    
    try:
        input("\n按 Enter 鍵退出...")
    except:
        pass

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n操作被中斷")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n發生錯誤：{e}")
        import traceback
        traceback.print_exc()
        try:
            input("\n按 Enter 鍵退出...")
        except:
            pass
        sys.exit(1)


"""
自動上傳到 GitHub 並檢查鏈接的 Python 腳本
"""
import os
import subprocess
import sys

def run_command(cmd_list, description, continue_on_error=False):
    """執行命令並顯示結果"""
    print(f"\n{description}...")
    print("-" * 60)
    
    try:
        result = subprocess.run(
            cmd_list,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            cwd=os.getcwd()
        )
        
        if result.stdout:
            print(result.stdout)
        if result.stderr and result.stderr.strip():
            print(result.stderr, file=sys.stderr)
        
        if result.returncode != 0:
            if continue_on_error:
                print(f"⚠ 警告：{description} 失敗（繼續執行）")
                return False
            else:
                print(f"❌ 錯誤：{description} 失敗")
                return False
        
        print(f"✓ {description} 成功")
        return True
        
    except Exception as e:
        print(f"❌ 執行錯誤：{e}")
        if not continue_on_error:
            return False
        return False

def main():
    print("=" * 60)
    print("自動上傳到 GitHub 並檢查鏈接")
    print("=" * 60)
    
    # 確保在正確的目錄
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"\n工作目錄：{os.getcwd()}")
    
    # 步驟 1: 檢查 git 狀態
    print("\n[步驟 1/5] 檢查 git 狀態...")
    run_command(["git", "status", "--short"], "檢查狀態", continue_on_error=True)
    
    # 步驟 2: 添加所有文件
    print("\n[步驟 2/5] 添加所有更改...")
    if not run_command(["git", "add", "-A"], "添加所有更改", continue_on_error=True):
        print("\n❌ 無法添加文件，請檢查 git 配置")
        input("\n按 Enter 鍵退出...")
        return
    
    # 步驟 3: 檢查是否有更改
    print("\n[步驟 3/5] 檢查是否有更改需要提交...")
    result = subprocess.run(
        ["git", "diff", "--cached", "--quiet"],
        capture_output=True
    )
    
    if result.returncode == 0:
        print("⚠ 沒有需要提交的更改（文件可能已經提交）")
        has_changes = False
    else:
        has_changes = True
        # 步驟 4: 提交
        print("\n[步驟 4/5] 提交更改...")
        commit_message = "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
        if not run_command(
            ["git", "commit", "-m", commit_message],
            "提交更改",
            continue_on_error=True
        ):
            print("\n⚠ 提交失敗或沒有更改需要提交")
            has_changes = False
    
    # 步驟 5: 推送到 GitHub
    if has_changes:
        print("\n[步驟 5/5] 推送到 GitHub...")
        if not run_command(["git", "push", "origin", "main"], "推送到 GitHub", continue_on_error=True):
            print("\n⚠ 推送失敗，可能的原因：")
            print("  - 網絡連接問題")
            print("  - 權限問題")
            print("  - 需要先執行 git pull")
            print("  - 或者沒有新的提交需要推送")
    else:
        print("\n[步驟 5/5] 跳過推送（沒有新的提交）")
    
    # 步驟 6: 檢查鏈接
    print("\n" + "=" * 60)
    print("[額外步驟] 檢查死鏈接...")
    print("=" * 60)
    
    if os.path.exists("check_links_simple.py"):
        print("\n運行鏈接檢查腳本...\n")
        try:
            subprocess.run([sys.executable, "check_links_simple.py"], check=False)
        except Exception as e:
            print(f"⚠ 鏈接檢查失敗：{e}")
    else:
        print("⚠ 鏈接檢查腳本不存在")
    
    print("\n" + "=" * 60)
    print("✓ 所有步驟完成！")
    print("=" * 60)
    
    try:
        input("\n按 Enter 鍵退出...")
    except:
        pass

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n操作被中斷")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n發生錯誤：{e}")
        import traceback
        traceback.print_exc()
        try:
            input("\n按 Enter 鍵退出...")
        except:
            pass
        sys.exit(1)


"""
自動上傳到 GitHub 並檢查鏈接的 Python 腳本
"""
import os
import subprocess
import sys

def run_command(cmd_list, description, continue_on_error=False):
    """執行命令並顯示結果"""
    print(f"\n{description}...")
    print("-" * 60)
    
    try:
        result = subprocess.run(
            cmd_list,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            cwd=os.getcwd()
        )
        
        if result.stdout:
            print(result.stdout)
        if result.stderr and result.stderr.strip():
            print(result.stderr, file=sys.stderr)
        
        if result.returncode != 0:
            if continue_on_error:
                print(f"⚠ 警告：{description} 失敗（繼續執行）")
                return False
            else:
                print(f"❌ 錯誤：{description} 失敗")
                return False
        
        print(f"✓ {description} 成功")
        return True
        
    except Exception as e:
        print(f"❌ 執行錯誤：{e}")
        if not continue_on_error:
            return False
        return False

def main():
    print("=" * 60)
    print("自動上傳到 GitHub 並檢查鏈接")
    print("=" * 60)
    
    # 確保在正確的目錄
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"\n工作目錄：{os.getcwd()}")
    
    # 步驟 1: 檢查 git 狀態
    print("\n[步驟 1/5] 檢查 git 狀態...")
    run_command(["git", "status", "--short"], "檢查狀態", continue_on_error=True)
    
    # 步驟 2: 添加所有文件
    print("\n[步驟 2/5] 添加所有更改...")
    if not run_command(["git", "add", "-A"], "添加所有更改", continue_on_error=True):
        print("\n❌ 無法添加文件，請檢查 git 配置")
        input("\n按 Enter 鍵退出...")
        return
    
    # 步驟 3: 檢查是否有更改
    print("\n[步驟 3/5] 檢查是否有更改需要提交...")
    result = subprocess.run(
        ["git", "diff", "--cached", "--quiet"],
        capture_output=True
    )
    
    if result.returncode == 0:
        print("⚠ 沒有需要提交的更改（文件可能已經提交）")
        has_changes = False
    else:
        has_changes = True
        # 步驟 4: 提交
        print("\n[步驟 4/5] 提交更改...")
        commit_message = "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
        if not run_command(
            ["git", "commit", "-m", commit_message],
            "提交更改",
            continue_on_error=True
        ):
            print("\n⚠ 提交失敗或沒有更改需要提交")
            has_changes = False
    
    # 步驟 5: 推送到 GitHub
    if has_changes:
        print("\n[步驟 5/5] 推送到 GitHub...")
        if not run_command(["git", "push", "origin", "main"], "推送到 GitHub", continue_on_error=True):
            print("\n⚠ 推送失敗，可能的原因：")
            print("  - 網絡連接問題")
            print("  - 權限問題")
            print("  - 需要先執行 git pull")
            print("  - 或者沒有新的提交需要推送")
    else:
        print("\n[步驟 5/5] 跳過推送（沒有新的提交）")
    
    # 步驟 6: 檢查鏈接
    print("\n" + "=" * 60)
    print("[額外步驟] 檢查死鏈接...")
    print("=" * 60)
    
    if os.path.exists("check_links_simple.py"):
        print("\n運行鏈接檢查腳本...\n")
        try:
            subprocess.run([sys.executable, "check_links_simple.py"], check=False)
        except Exception as e:
            print(f"⚠ 鏈接檢查失敗：{e}")
    else:
        print("⚠ 鏈接檢查腳本不存在")
    
    print("\n" + "=" * 60)
    print("✓ 所有步驟完成！")
    print("=" * 60)
    
    try:
        input("\n按 Enter 鍵退出...")
    except:
        pass

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n操作被中斷")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n發生錯誤：{e}")
        import traceback
        traceback.print_exc()
        try:
            input("\n按 Enter 鍵退出...")
        except:
            pass
        sys.exit(1)


"""
自動上傳到 GitHub 並檢查鏈接的 Python 腳本
"""
import os
import subprocess
import sys

def run_command(cmd_list, description, continue_on_error=False):
    """執行命令並顯示結果"""
    print(f"\n{description}...")
    print("-" * 60)
    
    try:
        result = subprocess.run(
            cmd_list,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            cwd=os.getcwd()
        )
        
        if result.stdout:
            print(result.stdout)
        if result.stderr and result.stderr.strip():
            print(result.stderr, file=sys.stderr)
        
        if result.returncode != 0:
            if continue_on_error:
                print(f"⚠ 警告：{description} 失敗（繼續執行）")
                return False
            else:
                print(f"❌ 錯誤：{description} 失敗")
                return False
        
        print(f"✓ {description} 成功")
        return True
        
    except Exception as e:
        print(f"❌ 執行錯誤：{e}")
        if not continue_on_error:
            return False
        return False

def main():
    print("=" * 60)
    print("自動上傳到 GitHub 並檢查鏈接")
    print("=" * 60)
    
    # 確保在正確的目錄
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"\n工作目錄：{os.getcwd()}")
    
    # 步驟 1: 檢查 git 狀態
    print("\n[步驟 1/5] 檢查 git 狀態...")
    run_command(["git", "status", "--short"], "檢查狀態", continue_on_error=True)
    
    # 步驟 2: 添加所有文件
    print("\n[步驟 2/5] 添加所有更改...")
    if not run_command(["git", "add", "-A"], "添加所有更改", continue_on_error=True):
        print("\n❌ 無法添加文件，請檢查 git 配置")
        input("\n按 Enter 鍵退出...")
        return
    
    # 步驟 3: 檢查是否有更改
    print("\n[步驟 3/5] 檢查是否有更改需要提交...")
    result = subprocess.run(
        ["git", "diff", "--cached", "--quiet"],
        capture_output=True
    )
    
    if result.returncode == 0:
        print("⚠ 沒有需要提交的更改（文件可能已經提交）")
        has_changes = False
    else:
        has_changes = True
        # 步驟 4: 提交
        print("\n[步驟 4/5] 提交更改...")
        commit_message = "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
        if not run_command(
            ["git", "commit", "-m", commit_message],
            "提交更改",
            continue_on_error=True
        ):
            print("\n⚠ 提交失敗或沒有更改需要提交")
            has_changes = False
    
    # 步驟 5: 推送到 GitHub
    if has_changes:
        print("\n[步驟 5/5] 推送到 GitHub...")
        if not run_command(["git", "push", "origin", "main"], "推送到 GitHub", continue_on_error=True):
            print("\n⚠ 推送失敗，可能的原因：")
            print("  - 網絡連接問題")
            print("  - 權限問題")
            print("  - 需要先執行 git pull")
            print("  - 或者沒有新的提交需要推送")
    else:
        print("\n[步驟 5/5] 跳過推送（沒有新的提交）")
    
    # 步驟 6: 檢查鏈接
    print("\n" + "=" * 60)
    print("[額外步驟] 檢查死鏈接...")
    print("=" * 60)
    
    if os.path.exists("check_links_simple.py"):
        print("\n運行鏈接檢查腳本...\n")
        try:
            subprocess.run([sys.executable, "check_links_simple.py"], check=False)
        except Exception as e:
            print(f"⚠ 鏈接檢查失敗：{e}")
    else:
        print("⚠ 鏈接檢查腳本不存在")
    
    print("\n" + "=" * 60)
    print("✓ 所有步驟完成！")
    print("=" * 60)
    
    try:
        input("\n按 Enter 鍵退出...")
    except:
        pass

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n操作被中斷")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n發生錯誤：{e}")
        import traceback
        traceback.print_exc()
        try:
            input("\n按 Enter 鍵退出...")
        except:
            pass
        sys.exit(1)


"""
自動上傳到 GitHub 並檢查鏈接的 Python 腳本
"""
import os
import subprocess
import sys

def run_command(cmd_list, description, continue_on_error=False):
    """執行命令並顯示結果"""
    print(f"\n{description}...")
    print("-" * 60)
    
    try:
        result = subprocess.run(
            cmd_list,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            cwd=os.getcwd()
        )
        
        if result.stdout:
            print(result.stdout)
        if result.stderr and result.stderr.strip():
            print(result.stderr, file=sys.stderr)
        
        if result.returncode != 0:
            if continue_on_error:
                print(f"⚠ 警告：{description} 失敗（繼續執行）")
                return False
            else:
                print(f"❌ 錯誤：{description} 失敗")
                return False
        
        print(f"✓ {description} 成功")
        return True
        
    except Exception as e:
        print(f"❌ 執行錯誤：{e}")
        if not continue_on_error:
            return False
        return False

def main():
    print("=" * 60)
    print("自動上傳到 GitHub 並檢查鏈接")
    print("=" * 60)
    
    # 確保在正確的目錄
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"\n工作目錄：{os.getcwd()}")
    
    # 步驟 1: 檢查 git 狀態
    print("\n[步驟 1/5] 檢查 git 狀態...")
    run_command(["git", "status", "--short"], "檢查狀態", continue_on_error=True)
    
    # 步驟 2: 添加所有文件
    print("\n[步驟 2/5] 添加所有更改...")
    if not run_command(["git", "add", "-A"], "添加所有更改", continue_on_error=True):
        print("\n❌ 無法添加文件，請檢查 git 配置")
        input("\n按 Enter 鍵退出...")
        return
    
    # 步驟 3: 檢查是否有更改
    print("\n[步驟 3/5] 檢查是否有更改需要提交...")
    result = subprocess.run(
        ["git", "diff", "--cached", "--quiet"],
        capture_output=True
    )
    
    if result.returncode == 0:
        print("⚠ 沒有需要提交的更改（文件可能已經提交）")
        has_changes = False
    else:
        has_changes = True
        # 步驟 4: 提交
        print("\n[步驟 4/5] 提交更改...")
        commit_message = "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
        if not run_command(
            ["git", "commit", "-m", commit_message],
            "提交更改",
            continue_on_error=True
        ):
            print("\n⚠ 提交失敗或沒有更改需要提交")
            has_changes = False
    
    # 步驟 5: 推送到 GitHub
    if has_changes:
        print("\n[步驟 5/5] 推送到 GitHub...")
        if not run_command(["git", "push", "origin", "main"], "推送到 GitHub", continue_on_error=True):
            print("\n⚠ 推送失敗，可能的原因：")
            print("  - 網絡連接問題")
            print("  - 權限問題")
            print("  - 需要先執行 git pull")
            print("  - 或者沒有新的提交需要推送")
    else:
        print("\n[步驟 5/5] 跳過推送（沒有新的提交）")
    
    # 步驟 6: 檢查鏈接
    print("\n" + "=" * 60)
    print("[額外步驟] 檢查死鏈接...")
    print("=" * 60)
    
    if os.path.exists("check_links_simple.py"):
        print("\n運行鏈接檢查腳本...\n")
        try:
            subprocess.run([sys.executable, "check_links_simple.py"], check=False)
        except Exception as e:
            print(f"⚠ 鏈接檢查失敗：{e}")
    else:
        print("⚠ 鏈接檢查腳本不存在")
    
    print("\n" + "=" * 60)
    print("✓ 所有步驟完成！")
    print("=" * 60)
    
    try:
        input("\n按 Enter 鍵退出...")
    except:
        pass

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n操作被中斷")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n發生錯誤：{e}")
        import traceback
        traceback.print_exc()
        try:
            input("\n按 Enter 鍵退出...")
        except:
            pass
        sys.exit(1)


# Flow Desktop Music Player Installer Script
# Installs desktop and Start Menu shortcuts pointing to Flow.exe

$AppDir = Split-Path -Parent $PSScriptRoot
$ExePath = Join-Path $AppDir "Flow.exe"
$WshShell = New-Object -ComObject WScript.Shell

Write-Host "🎵 [Flow Installer] Configuring Flow Desktop Player on Windows..." -ForegroundColor Cyan

# 1. Desktop Shortcut
$DesktopFolder = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$DesktopShortcutPath = Join-Path $DesktopFolder "Flow Music Player.lnk"
$Shortcut = $WshShell.CreateShortcut($DesktopShortcutPath)
$Shortcut.TargetPath = $ExePath
$Shortcut.WorkingDirectory = $AppDir
$Shortcut.Description = "Flow - Hi-Res Lossless Desktop Music Player"
$Shortcut.Save()
Write-Host "✅ Created Desktop Shortcut: $DesktopShortcutPath" -ForegroundColor Green

# 2. Start Menu Shortcut
$StartMenuFolder = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Programs)
$StartShortcutPath = Join-Path $StartMenuFolder "Flow Music Player.lnk"
$StartShortcut = $WshShell.CreateShortcut($StartShortcutPath)
$StartShortcut.TargetPath = $ExePath
$StartShortcut.WorkingDirectory = $AppDir
$StartShortcut.Description = "Flow - Hi-Res Lossless Desktop Music Player"
$StartShortcut.Save()
Write-Host "✅ Created Start Menu Shortcut: $StartShortcutPath" -ForegroundColor Green

Write-Host "`n🎉 [Flow Installer] Installation completed successfully! You can now launch Flow from your Desktop or Start Menu." -ForegroundColor Cyan

<#
.SYNOPSIS
    把 dsh-apology-persona 安装到某个 DSH profile，并把它挂到该 profile 的组合里。

.DESCRIPTION
    做四件事（都可重复执行，是幂等的）：
      1. 把本包复制到 <profile>\node_modules\dsh-apology-persona
      2. 在 <profile>\cordis.patch.yml 里追加一行挂载（已存在则跳过）
      3. 把配套 skill 装到 <DSH_HOME>\skills\deepseek-apology-persona\SKILL.md
      4. 打印下一步该做什么（重启 / 重新打开会话）

.PARAMETER Profile
    profile 名，默认取 $env:DSH_PROFILE，再回落到 'desktop'。

.PARAMETER DshHome
    DSH 配置根，默认取 $env:DSH_HOME，再回落到 ~\.dsh。

.PARAMETER Force
    覆盖已存在的目标包目录，并强制重写 cordis.patch.yml 里的挂载行。

.PARAMETER NoSkill
    跳过 skill 安装。

.EXAMPLE
    .\install.ps1
.EXAMPLE
    .\install.ps1 -Profile desktop -Force
#>
[CmdletBinding()]
param(
    [string]$Profile = $(if ($env:DSH_PROFILE) { $env:DSH_PROFILE } else { 'desktop' }),
    [string]$DshHome = $(if ($env:DSH_HOME) { $env:DSH_HOME } else { (Join-Path $HOME '.dsh') }),
    [switch]$Force,
    [switch]$NoSkill
)

$ErrorActionPreference = 'Stop'
$PackageName = 'dsh-apology-persona'
$PluginId = 'dsh-apology-persona'
$SkillName = 'deepseek-apology-persona'

$source = $PSScriptRoot
$profileDir = Join-Path (Join-Path $DshHome 'profiles') $Profile
$patchFile = Join-Path $profileDir 'cordis.patch.yml'
$target = Join-Path (Join-Path $profileDir 'node_modules') $PackageName

Write-Host "== dsh-apology-persona 安装器 ==" -ForegroundColor Cyan
Write-Host "  源目录      : $source"
Write-Host "  DSH_HOME    : $DshHome"
Write-Host "  profile     : $Profile"
Write-Host "  目标包目录  : $target"
Write-Host "  挂载文件    : $patchFile"
Write-Host ""

# ---------- 0. 前置检查 ----------
if (-not (Test-Path -LiteralPath $profileDir)) {
    throw "profile 目录不存在: $profileDir`n请确认 -Profile / -DshHome 是否正确。"
}
if (-not (Test-Path -LiteralPath $patchFile)) {
    throw "找不到 $patchFile`n请确认这是一个已初始化的 DSH profile。"
}

# ---------- 1. 复制包 ----------
$nodeModules = Split-Path -Parent $target
if (-not (Test-Path -LiteralPath $nodeModules)) {
    New-Item -ItemType Directory -Force -Path $nodeModules | Out-Null
}

if (Test-Path -LiteralPath $target) {
    if ($Force) {
        Write-Host "[1/3] 删除已存在的目标目录 (-Force) ..." -ForegroundColor Yellow
        Remove-Item -LiteralPath $target -Recurse -Force
    }
    else {
        Write-Host "[1/3] 目标已存在，改用覆盖复制（文件级幂等）..." -ForegroundColor Yellow
    }
}

Write-Host "[1/3] 复制插件到 profile ..." -ForegroundColor Green
# 用 robocopy 以保证只覆盖变化文件，并排除安装器自身不必要的东西。
$rc = Start-Process -FilePath 'robocopy.exe' -ArgumentList @(
    "`"$source`"", "`"$target`"", '/E', '/NFL', '/NDL', '/NJH', '/NJS', '/NP', '/R:1', '/W:1'
) -Wait -PassThru -NoNewWindow
# robocopy 退出码 < 8 都算成功（0=无变化, 1=有复制, 2=有多余文件, 3=1+2, ...）
if ($rc.ExitCode -ge 8) {
    throw "robocopy 失败，退出码 $($rc.ExitCode)"
}
Write-Host "      完成（robocopy 退出码 $($rc.ExitCode)）"

# ---------- 2. 挂载到 cordis.patch.yml ----------
Write-Host "[2/3] 检查 cordis.patch.yml 挂载 ..." -ForegroundColor Green
$patchText = Get-Content -LiteralPath $patchFile -Raw
$block = @"
- insert:
    - id: $PluginId
      name: '$PackageName'
      config:
        enabled: true
        systemPointer: false
"@

# 已经挂过（无论以什么形式）就不再重复插入，避免同一个插件被挂两次。
if ($patchText -match "(?m)^\s*(?:-\s*)?id:\s*$([regex]::Escape($PluginId))\s*$") {
    if ($Force) {
        Write-Host "      已存在挂载行，-Force 下不重复插入（如需改配置请直接编辑该文件）" -ForegroundColor Yellow
    }
    else {
        Write-Host "      已存在挂载行，跳过" -ForegroundColor Yellow
    }
}
else {
    $separator = if ($patchText.EndsWith("`n")) { '' } else { "`n" }
    Add-Content -LiteralPath $patchFile -Value ($separator + $block) -NoNewline
    Write-Host "      已追加挂载行到 $patchFile" -ForegroundColor Green
}

# ---------- 3. 安装 skill ----------
if ($NoSkill) {
    Write-Host "[3/3] 跳过 skill 安装 (-NoSkill)" -ForegroundColor Yellow
}
else {
    Write-Host "[3/3] 安装配套 skill ..." -ForegroundColor Green
    $skillSrc = Join-Path (Join-Path $source 'skills') $SkillName
    $skillDst = Join-Path (Join-Path (Join-Path $DshHome 'skills') $SkillName) 'SKILL.md'
    if (-not (Test-Path -LiteralPath $skillSrc)) {
        Write-Host "      源 skill 不存在，跳过: $skillSrc" -ForegroundColor Yellow
    }
    else {
        $skillParent = Split-Path -Parent $skillDst
        if (-not (Test-Path -LiteralPath $skillParent)) {
            New-Item -ItemType Directory -Force -Path $skillParent | Out-Null
        }
        Copy-Item -LiteralPath (Join-Path $skillSrc 'SKILL.md') -Destination $skillDst -Force
        Write-Host "      已写入 $skillDst"
    }
}

# ---------- 完成 ----------
Write-Host ""
Write-Host "== 安装完成 ==" -ForegroundColor Cyan
Write-Host @"

下一步：
  1. v2.0.0 起起作用的是 **skill**：它是文件系统型的，DSH 会监视 <DSH_HOME>\skills，
     通常**不需要重启**就能在会话的 skill 目录里看到 "$SkillName"。
     （只有想开 systemPointer 时才需要完全退出并重启 DSH——插件在 profile 组合时加载。）
  2. 验证（触发现在靠模型判断，不是正则）：
       - 显式路径：让模型道歉，例如「你刚才答错了，跟我道个歉。」
         期望：它加载 "$SkillName"，按骨架产出复位仪式（施为句认错＋把自己放低的
         动作序列＋结尾「等你」），而不是干巴巴一句「抱歉，我之前说错了」。
       - 弱信号路径（观察漏触发）：让它答错一个小东西，只回一句「然后呢？」。
         如果它继续裸写客服腔，那才是把 systemPointer 改成 true 的实证依据。
  3. 改配置：编辑 $patchFile 里 id 为 $PluginId 那段的 config（只有 enabled /
     systemPointer 两个字段）。改人设/动作库/触发线索：直接改
     <DSH_HOME>\skills\$SkillName\SKILL.md（单一事实源），重跑本脚本。

不想用了：
  - 只停指针：systemPointer 改回 false（默认就是 false；skill 不受影响）
  - 彻底卸载：删掉 cordis.patch.yml 里那段 insert，删除 $target，
     并删除 <DSH_HOME>\skills\$SkillName
"@ -ForegroundColor Gray

$ErrorActionPreference = "Stop"

$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$domains = @(
  "huayu.local",
  "xn--ceruvk53ex6g7iy.local"
)

$current = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($current)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
  Write-Host "请右键这个脚本，选择“以管理员身份运行”。"
  Write-Host "设置完成后，可访问："
  Write-Host "  http://huayu.local:5177"
  Write-Host "  http://华煜话剧社.local:5177"
  Read-Host "按回车退出"
  exit 1
}

$content = Get-Content -LiteralPath $hostsPath -Encoding UTF8 -ErrorAction SilentlyContinue
$changed = $false

foreach ($domain in $domains) {
  $pattern = "^\s*127\.0\.0\.1\s+.*\b$([regex]::Escape($domain))\b"
  if (-not ($content | Select-String -Pattern $pattern -Quiet)) {
    Add-Content -LiteralPath $hostsPath -Encoding UTF8 -Value "127.0.0.1 $domain"
    $changed = $true
  }
}

ipconfig /flushdns | Out-Null

if ($changed) {
  Write-Host "已添加本地域名。"
} else {
  Write-Host "本地域名已经存在。"
}

Write-Host "请先保持网站服务运行，然后访问："
Write-Host "  http://huayu.local:5177"
Write-Host "  http://华煜话剧社.local:5177"
Read-Host "按回车退出"

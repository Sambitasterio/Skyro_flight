# Regenerate Skyro PWA icons (indigo #4F46E5 + white "S")
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "public\icons"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
Add-Type -AssemblyName System.Drawing

foreach ($size in @(192, 512)) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear([System.Drawing.Color]::FromArgb(79, 70, 229))
  $fontSize = [int]($size * 0.38)
  $font = New-Object System.Drawing.Font("Segoe UI", $fontSize, [System.Drawing.FontStyle]::Bold)
  $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  $text = "S"
  $sf = $g.MeasureString($text, $font)
  $x = ($size - $sf.Width) / 2
  $y = ($size - $sf.Height) / 2 - ($size * 0.02)
  $g.DrawString($text, $font, $brush, $x, $y)
  $path = Join-Path $outDir "icon-$size.png"
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  Write-Host "Wrote $path"
}

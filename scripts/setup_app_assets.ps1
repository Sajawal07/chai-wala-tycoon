Add-Type -AssemblyName System.Drawing

$projectRoot = "d:\games\chai wala"
$srcIcon = "$projectRoot\assets\images\app_icon.png"
$srcSplash = "$projectRoot\assets\images\splash_screen.png"
$publicImages = "$projectRoot\public\images"
$resDir = "$projectRoot\android\app\src\main\res"

if (!(Test-Path $publicImages)) {
    New-Item -ItemType Directory -Path $publicImages -Force | Out-Null
}

# 1. Copy to public/images
Copy-Item -Path $srcIcon -Destination "$publicImages\app_icon.png" -Force
Copy-Item -Path $srcSplash -Destination "$publicImages\splash_screen.png" -Force
Copy-Item -Path $srcIcon -Destination "$projectRoot\public\favicon.png" -Force
Write-Host "Copied images to public/images and public/favicon.png"

# Helper function to resize image with high quality
function Resize-Image {
    param(
        [System.Drawing.Image]$Image,
        [int]$Width,
        [int]$Height,
        [string]$OutputPath,
        [bool]$CircleClip = $false
    )

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)
    $destImage = New-Object System.Drawing.Bitmap($Width, $Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($destImage)

    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    if ($CircleClip) {
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $path.AddEllipse(0, 0, $Width, $Height)
        $graphics.SetClip($path)
    }

    $wrapMode = New-Object System.Drawing.Imaging.ImageAttributes
    $wrapMode.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
    $graphics.DrawImage($Image, $destRect, 0, 0, $Image.Width, $Image.Height, [System.Drawing.GraphicsUnit]::Pixel, $wrapMode)

    $destImage.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $graphics.Dispose()
    $destImage.Dispose()
    if ($CircleClip) { $path.Dispose() }
}

# Helper to create adaptive foreground (scaled into center 72dp of 108dp canvas)
function Create-AdaptiveForeground {
    param(
        [System.Drawing.Image]$Image,
        [int]$CanvasSize,
        [string]$OutputPath
    )

    $destImage = New-Object System.Drawing.Bitmap($CanvasSize, $CanvasSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($destImage)

    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # 72 / 108 = 66.6% safe zone size
    $iconSize = [int]($CanvasSize * 0.72)
    $offset = [int](($CanvasSize - $iconSize) / 2)
    $destRect = New-Object System.Drawing.Rectangle($offset, $offset, $iconSize, $iconSize)

    $wrapMode = New-Object System.Drawing.Imaging.ImageAttributes
    $wrapMode.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
    $graphics.DrawImage($Image, $destRect, 0, 0, $Image.Width, $Image.Height, [System.Drawing.GraphicsUnit]::Pixel, $wrapMode)

    $destImage.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $graphics.Dispose()
    $destImage.Dispose()
}

$iconImg = [System.Drawing.Image]::FromFile($srcIcon)
$splashImg = [System.Drawing.Image]::FromFile($srcSplash)

# Android Launcher Icon sizes
$mipmapSizes = @{
    "mipmap-mdpi"    = @{ Legacy = 48;  Adaptive = 108 }
    "mipmap-hdpi"    = @{ Legacy = 72;  Adaptive = 162 }
    "mipmap-xhdpi"   = @{ Legacy = 96;  Adaptive = 216 }
    "mipmap-xxhdpi"  = @{ Legacy = 144; Adaptive = 324 }
    "mipmap-xxxhdpi" = @{ Legacy = 192; Adaptive = 432 }
}

foreach ($folder in $mipmapSizes.Keys) {
    $dir = "$resDir\$folder"
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    
    $legacySize = $mipmapSizes[$folder].Legacy
    $adaptiveSize = $mipmapSizes[$folder].Adaptive

    # ic_launcher.png (legacy)
    Resize-Image -Image $iconImg -Width $legacySize -Height $legacySize -OutputPath "$dir\ic_launcher.png"
    # ic_launcher_round.png (legacy round)
    Resize-Image -Image $iconImg -Width $legacySize -Height $legacySize -OutputPath "$dir\ic_launcher_round.png" -CircleClip $true
    # ic_launcher_foreground.png (adaptive)
    Create-AdaptiveForeground -Image $iconImg -CanvasSize $adaptiveSize -OutputPath "$dir\ic_launcher_foreground.png"

    Write-Host "Generated launcher icons for $folder (Legacy: ${legacySize}px, Foreground: ${adaptiveSize}px)"
}

# Android Splash Screen sizes
$splashDrawables = @{
    "drawable"             = @{ Width = 480;  Height = 800  }
    "drawable-port-mdpi"   = @{ Width = 320;  Height = 480  }
    "drawable-port-hdpi"   = @{ Width = 480;  Height = 800  }
    "drawable-port-xhdpi"  = @{ Width = 720;  Height = 1280 }
    "drawable-port-xxhdpi" = @{ Width = 960;  Height = 1600 }
    "drawable-port-xxxhdpi"= @{ Width = 1280; Height = 1920 }
}

foreach ($folder in $splashDrawables.Keys) {
    $dir = "$resDir\$folder"
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $w = $splashDrawables[$folder].Width
    $h = $splashDrawables[$folder].Height
    Resize-Image -Image $splashImg -Width $w -Height $h -OutputPath "$dir\splash.png"
    Write-Host "Generated native splash for $folder (${w}x${h})"
}

$iconImg.Dispose()
$splashImg.Dispose()
Write-Host "All assets successfully processed and deployed!"

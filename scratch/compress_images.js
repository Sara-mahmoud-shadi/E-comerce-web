const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const imagesToCompress = [
  { file: 'public/ar.webp', width: 64, height: 64 },
  { file: 'public/en.webp', width: 64, height: 64 },
  { file: 'public/floating_pan.webp', width: 400, height: 400 },
  { file: 'public/leaf-overlay.webp', width: 400, height: 400 },
  { file: 'public/kitchen_hero_products.webp', width: 800, height: 800 }
];

console.log('Starting image compression using native Windows .NET APIs...');

imagesToCompress.forEach(item => {
  const fullPath = path.resolve(item.file);
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${item.file}`);
    return;
  }

  const initialSizeKB = (fs.statSync(fullPath).size / 1024).toFixed(2);
  console.log(`Processing ${item.file} (Initial size: ${initialSizeKB} KB)...`);

  // Build a PowerShell script block with explicit semicolons separating ALL statements!
  const psCommands = [
    `[Reflection.Assembly]::LoadWithPartialName('System.Drawing') | Out-Null`,
    `$src = [System.Drawing.Image]::FromFile('${fullPath.replace(/\\/g, '\\\\')}')`,
    `$originalWidth = $src.Width`,
    `$originalHeight = $src.Height`,
    `$targetWidth = ${item.width}`,
    `$targetHeight = ${item.height}`,
    `if ($originalWidth -gt 0 -and $originalHeight -gt 0) { $ratioX = $targetWidth / $originalWidth; $ratioY = $targetHeight / $originalHeight; $ratio = if ($ratioX -lt $ratioY) { $ratioX } else { $ratioY }; if ('${item.file}'.Contains('ar.webp') -or '${item.file}'.Contains('en.webp')) { $newW = $targetWidth; $newH = $targetHeight } else { $newW = [Math]::Max(1, [Math]::Round($originalWidth * $ratio)); $newH = [Math]::Max(1, [Math]::Round($originalHeight * $ratio)) } } else { $newW = $targetWidth; $newH = $targetHeight }`,
    `$bmp = New-Object System.Drawing.Bitmap($newW, $newH)`,
    `$g = [System.Drawing.Graphics]::FromImage($bmp)`,
    `$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic`,
    `$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality`,
    `$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality`,
    `$g.DrawImage($src, 0, 0, $newW, $newH)`,
    `$src.Dispose()`,
    `$g.Dispose()`,
    `$bmp.Save('${fullPath.replace(/\\/g, '\\\\')}', [System.Drawing.Imaging.ImageFormat]::Png)`,
    `$bmp.Dispose()`
  ];

  const psScript = psCommands.join('; ');

  try {
    // Execute powershell command literally
    execSync(`powershell -NoProfile -Command "${psScript.replace(/"/g, '\\"')}"`, { stdio: 'pipe' });
    const finalSizeKB = (fs.statSync(fullPath).size / 1024).toFixed(2);
    console.log(`✓ Completed: ${item.file} -> New size: ${finalSizeKB} KB (Saved ${(initialSizeKB - finalSizeKB).toFixed(2)} KB)`);
  } catch (error) {
    console.error(`Failed to compress ${item.file}:`);
    console.error('Stdout:', error.stdout ? error.stdout.toString() : '');
    console.error('Stderr:', error.stderr ? error.stderr.toString() : '');
  }
});

console.log('All image compressions completed successfully!');

[System.Reflection.Assembly]::LoadWithPartialName('System.Drawing')
$img1 = [System.Drawing.Image]::FromFile('d:\GiupDoMap_2.0\frontend\public\icon-192.png')
$img1.Save('d:\GiupDoMap_2.0\frontend\public\icon-192-true.png', [System.Drawing.Imaging.ImageFormat]::Png)
$img1.Dispose()

$img2 = [System.Drawing.Image]::FromFile('d:\GiupDoMap_2.0\frontend\public\icon-512.png')
$img2.Save('d:\GiupDoMap_2.0\frontend\public\icon-512-true.png', [System.Drawing.Imaging.ImageFormat]::Png)
$img2.Dispose()

Remove-Item -Force 'd:\GiupDoMap_2.0\frontend\public\icon-192.png'
Remove-Item -Force 'd:\GiupDoMap_2.0\frontend\public\icon-512.png'
Rename-Item 'd:\GiupDoMap_2.0\frontend\public\icon-192-true.png' 'icon-192.png'
Rename-Item 'd:\GiupDoMap_2.0\frontend\public\icon-512-true.png' 'icon-512.png'

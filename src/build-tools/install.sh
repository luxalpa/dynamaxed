DEVKITPRO=/opt/devkitpro
DEVKITARM=/opt/devkitpro/devkitARM
DEVKITPPC=/opt/devkitpro/devkitPPC

pacman-key --recv F7FD5492264BB9D0
pacman-key --lsign F7FD5492264BB9D0

pacman --noconfirm -U https://downloads.devkitpro.org/devkitpro-keyring-r1.787e015-2-any.pkg.tar.xz

printf '

[dkp-libs]
Server = https://downloads.devkitpro.org/packages

[dkp-windows]
Server = https://downloads.devkitpro.org/packages/windows
' >> /etc/pacman.conf

pacman --noconfirm -Sy
pacman --noconfirm -S gba-dev make mingw-w64-x86_64-toolchain mingw-w64-x86_64-libpng

export DEVKITPRO=/opt/devkitPro
echo "export DEVKITPRO=$DEVKITPRO" >> ~/.bashrc
export DEVKITARM=$DEVKITPRO/devkitARM
echo "export DEVKITARM=$DEVKITARM" >> ~/.bashrc

@echo off
taskkill /im gpg-agent.exe /f
taskkill /im dirmngr.exe /f
rd /s /q dist_electron\msys64
exit /b 0

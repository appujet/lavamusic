@echo off
setlocal enabledelayedexpansion

:: Check if pnpm is installed

where pnpm >nul 2>nul
if %errorlevel% equ 0 (
    set package_manager=pnpm
) else (
    set package_manager=npm
)

:: Check if node_modules exists
if not exist node_modules (
    %package_manager% install
)

:: start the project
%package_manager% run start
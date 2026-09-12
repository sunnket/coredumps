@echo off
REM NodeCraft — start the local server and open the browser
cd /d "%~dp0"
start "" http://localhost:8000
node server.js 8000

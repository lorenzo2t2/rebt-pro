@echo off
cd /d "%~dp0app"
start "" http://localhost:5188/index.html
python -m http.server 5188

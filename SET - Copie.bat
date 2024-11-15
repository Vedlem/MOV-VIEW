@echo off
git init
git remote remove origin
git remote add origin https://github.com/Vedlem/MOV-VIEW.git
git fetch origin
git reset --hard origin/main
git add .
git commit -m "Configuration initiale"
git push --set-upstream origin main
pause
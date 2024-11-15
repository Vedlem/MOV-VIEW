@echo off
REM Activer l'environnement conda
call conda activate ENV1
REM Lancer l'application Python
python web.py
REM Pause pour voir les erreurs
pause
REM Fermer la fenêtre de commande
exit
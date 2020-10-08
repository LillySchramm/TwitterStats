#!/bin/bash

echo "Starting Twitter server.  To view window type screen -r twitter."
echo "To minimize the window and let the server run in the background, press Ctrl+A then Ctrl+D"
cd /home/twitter
/usr/bin/screen -dmS twitter python3 /home/twitter/main.py

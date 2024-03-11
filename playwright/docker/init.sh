#!/bin/bash

# Xvfb is an X server that can run on machines with no display hardware and no physical input devices.
# It emulates a dumb framebuffer using virtual memory.

# Prepare virtual screen
# read more: https://github.com/asweigart/pyperclip/issues/161#issuecomment-1112942799
Xvfb :99 -screen 0 1280x720x16 &
export DISPLAY=:99

# Run tests (see package.json - scripts)
npm run ci-test

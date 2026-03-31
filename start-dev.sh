#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd /Users/adamward/Downloads/6_-_Website_Project_Planning/image_fitness_website_unzipped/nextjs_space
exec npx next dev --port 3000

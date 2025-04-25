#!/bin/bash
# Automated deployment script for Sondy Plugins site

# Text colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   SONDY PLUGINS DEPLOYMENT SCRIPT     ${NC}"
echo -e "${GREEN}========================================${NC}"

# 1. Verify all files exist
echo -e "\n${YELLOW}Step 1: Verifying files...${NC}"
node verify-files.js

# Check if verification was successful
if [ $? -ne 0 ]; then
  echo -e "\n${RED}File verification failed. Please fix missing files before deploying.${NC}"
  exit 1
fi

# 2. Check Git LFS status
echo -e "\n${YELLOW}Step 2: Checking Git LFS...${NC}"
if ! command -v git-lfs &> /dev/null; then
  echo -e "${RED}Git LFS is not installed.${NC}"
  echo -e "Please install Git LFS with: ${YELLOW}brew install git-lfs${NC} (on macOS)"
  echo -e "Then run: ${YELLOW}git lfs install${NC}"
  exit 1
fi

# Initialize Git LFS if not already done
git lfs install

# 3. Stage and commit changes
echo -e "\n${YELLOW}Step 3: Staging files...${NC}"
git add .

echo -e "\n${YELLOW}Step 4: Committing changes...${NC}"
read -p "Enter commit message: " commit_message
git commit -m "$commit_message"

# 4. Push to GitHub
echo -e "\n${YELLOW}Step 5: Pushing to GitHub...${NC}"
git push origin main

# 5. Deploy to Netlify (if netlify-cli is installed)
echo -e "\n${YELLOW}Step 6: Deploying to Netlify...${NC}"
if command -v netlify &> /dev/null; then
  netlify deploy --prod
else
  echo -e "${YELLOW}Netlify CLI not found. Your site will deploy automatically from GitHub.${NC}"
  echo -e "To install Netlify CLI for future deployments: ${GREEN}npm install -g netlify-cli${NC}"
fi

echo -e "\n${GREEN}Deployment process completed!${NC}"
echo -e "Visit your Netlify dashboard to check deployment status."
echo -e "${GREEN}========================================${NC}" 
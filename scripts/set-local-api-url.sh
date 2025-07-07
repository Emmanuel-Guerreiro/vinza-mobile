    #!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Getting local IP address...${NC}"

# Get the local IP address
# This works on Linux, macOS, and most Unix-like systems
LOCAL_IP=$(hostname -I | awk '{print $1}')

# Alternative method if hostname -I doesn't work
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP=$(ip route get 1.1.1.1 | awk '{print $7}' | head -n1)
fi

# Another alternative for macOS
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n1)
fi

if [ -z "$LOCAL_IP" ]; then
    echo -e "${RED}❌ Could not determine local IP address${NC}"
    echo -e "${YELLOW}💡 Make sure you are connected to a network${NC}"
    exit 1
fi

echo -e "${GREEN}📍 Local IP address found: ${LOCAL_IP}${NC}"

# Set the API URL
API_URL="http://${LOCAL_IP}:5000/api/v1"
ENV_FILE=".env"

# Check if .env file exists
if [ -f "$ENV_FILE" ]; then
    # Check if EXPO_PUBLIC_API_URL already exists in the file
    if grep -q "^EXPO_PUBLIC_API_URL=" "$ENV_FILE"; then
        # Replace existing EXPO_PUBLIC_API_URL
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|^EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=${API_URL}|" "$ENV_FILE"
        else
            # Linux
            sed -i "s|^EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=${API_URL}|" "$ENV_FILE"
        fi
    else
        # Add new EXPO_PUBLIC_API_URL
        echo "EXPO_PUBLIC_API_URL=${API_URL}" >> "$ENV_FILE"
    fi
else
    # Create new .env file
    echo "EXPO_PUBLIC_API_URL=${API_URL}" > "$ENV_FILE"
fi

echo -e "${GREEN}✅ EXPO_PUBLIC_API_URL set to: ${API_URL}${NC}"
echo -e "${GREEN}📁 Environment file updated: ${ENV_FILE}${NC}"
echo -e "${GREEN}🎉 Script completed successfully!${NC}"
echo -e "${YELLOW}💡 You can now start your Expo development server${NC}" 
#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { networkInterfaces } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the local IP address of the machine
 * @returns {string|null} The local IP address or null if not found
 */
function getLocalIP() {
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  
  return null;
}

/**
 * Create or update the .env file with the API URL
 * @param {string} ipAddress - The local IP address
 */
function setApiUrl(ipAddress) {
  const envPath = join(__dirname, '..', '.env');
  const apiUrl = `http://${ipAddress}:5000/api/v1`;
  
  // Read existing .env file if it exists
  let envContent = '';
  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, 'utf8');
  }
  
  // Check if EXPO_PUBLIC_API_URL already exists
  const apiUrlRegex = /^EXPO_PUBLIC_API_URL=.*$/m;
  
  if (apiUrlRegex.test(envContent)) {
    // Replace existing EXPO_PUBLIC_API_URL
    envContent = envContent.replace(apiUrlRegex, `EXPO_PUBLIC_API_URL=${apiUrl}`);
  } else {
    // Add new EXPO_PUBLIC_API_URL
    envContent += envContent.endsWith('\n') || envContent === '' ? '' : '\n';
    envContent += `EXPO_PUBLIC_API_URL=${apiUrl}\n`;
  }
  
  // Write the updated content back to the file
  writeFileSync(envPath, envContent);
  
  console.log(`✅ EXPO_PUBLIC_API_URL set to: ${apiUrl}`);
  console.log(`📁 Environment file updated: ${envPath}`);
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Getting local IP address...');
  
  const localIP = getLocalIP();
  
  if (!localIP) {
    console.error('❌ Could not determine local IP address');
    console.log('💡 Make sure you are connected to a network');
    process.exit(1);
  }
  
  console.log(`📍 Local IP address found: ${localIP}`);
  
  try {
    setApiUrl(localIP);
    console.log('🎉 Script completed successfully!');
    console.log('💡 You can now start your Expo development server');
  } catch (error) {
    console.error('❌ Error updating environment file:', error.message);
    process.exit(1);
  }
}

// Run the script
main(); 
// Run this with: node test-backend.js
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/auth/test',
  method: 'GET'
};

const req = http.request(options, res => {
  console.log(`Backend Status: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('✅ Backend is running!');
  } else if (res.statusCode === 404) {
    console.log('⚠️ Backend is running but endpoint not found');
  } else {
    console.log('❌ Backend returned unexpected status');
  }
});

req.on('error', error => {
  console.error('❌ Cannot connect to backend. Make sure Spring Boot is running on port 8080');
  console.error('Error:', error.message);
});

req.end();
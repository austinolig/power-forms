// Test what type of error NextRequest.json() throws
const { NextRequest } = require('next/server');

async function testJsonError() {
  const request = new NextRequest('http://localhost:3000/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{ invalid json'
  });
  
  try {
    await request.json();
  } catch (error) {
    console.log('Error type:', error.constructor.name);
    console.log('Error message:', error.message);
    console.log('Error instanceof SyntaxError:', error instanceof SyntaxError);
    console.log('Error instanceof Error:', error instanceof Error);
    console.log('Message includes JSON:', error.message.includes('JSON'));
  }
}

testJsonError();

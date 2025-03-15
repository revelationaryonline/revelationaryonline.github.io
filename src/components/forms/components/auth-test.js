// Test script to check which authentication method works
async function testAuthentication() {
  const wpToken = localStorage.getItem('wpToken') || '';
  const credentials = btoa(`user@example.com:${wpToken}`);
  const commentId = 1; // Change to a valid comment ID
  
  console.log('Testing JWT authentication...');
  try {
    const jwtResponse = await fetch(
      `${process.env.REACT_APP_WP_API_URL_CUSTOM}/like-comment/${commentId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${wpToken}`,
        },
        body: JSON.stringify({ action: 'like' }),
      }
    );
    
    const jwtData = await jwtResponse.json();
    console.log('JWT Auth Response:', jwtResponse.status, jwtData);
  } catch (error) {
    console.error('JWT Auth Error:', error);
  }
  
  console.log('Testing Basic authentication...');
  try {
    const basicResponse = await fetch(
      `${process.env.REACT_APP_WP_API_URL_CUSTOM}/like-comment/${commentId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
        body: JSON.stringify({ action: 'like' }),
      }
    );
    
    const basicData = await basicResponse.json();
    console.log('Basic Auth Response:', basicResponse.status, basicData);
  } catch (error) {
    console.error('Basic Auth Error:', error);
  }
}

// You can run this in your browser's console to test
// testAuthentication();

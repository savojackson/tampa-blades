// Test script to verify Google Places API key with multiple endpoints
require('dotenv').config({ path: './config.env' });

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

console.log('🔑 Testing Google Places API Key...');
console.log('Key:', GOOGLE_PLACES_API_KEY ? '✅ Found' : '❌ Missing');

if (!GOOGLE_PLACES_API_KEY) {
  console.log('❌ Please add your Google Places API key to config.env');
  process.exit(1);
}

// Test functions
async function testPlacesAutocomplete() {
  console.log('\n🧪 Testing Places Autocomplete API...');
  const testUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=New+York&types=geocode&key=${GOOGLE_PLACES_API_KEY}`;
  
  try {
    const response = await fetch(testUrl);
    const data = await response.json();
    
    if (data.status === 'OK') {
      console.log('✅ Places Autocomplete API is working!');
      console.log(`Found ${data.predictions.length} predictions for "New York"`);
      console.log('Sample prediction:', data.predictions[0]?.description);
    } else {
      console.log('❌ Places Autocomplete API error:', data.status);
      console.log('Error message:', data.error_message);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

async function testPlacesTextSearch() {
  console.log('\n🧪 Testing Places Text Search API...');
  const testUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=skate+park&key=${GOOGLE_PLACES_API_KEY}`;
  
  try {
    const response = await fetch(testUrl);
    const data = await response.json();
    
    if (data.status === 'OK') {
      console.log('✅ Places Text Search API is working!');
      console.log(`Found ${data.results.length} skate parks`);
      console.log('Sample result:', data.results[0]?.name);
    } else {
      console.log('❌ Places Text Search API error:', data.status);
      console.log('Error message:', data.error_message);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

async function testGeocodingAPI() {
  console.log('\n🧪 Testing Geocoding API...');
  const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Times+Square+New+York&key=${GOOGLE_PLACES_API_KEY}`;
  
  try {
    const response = await fetch(testUrl);
    const data = await response.json();
    
    if (data.status === 'OK') {
      console.log('✅ Geocoding API is working!');
      console.log(`Found ${data.results.length} results for "Times Square New York"`);
      const location = data.results[0]?.geometry?.location;
      if (location) {
        console.log('Coordinates:', `${location.lat}, ${location.lng}`);
      }
    } else {
      console.log('❌ Geocoding API error:', data.status);
      console.log('Error message:', data.error_message);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

async function testPlaceDetailsAPI() {
  console.log('\n🧪 Testing Place Details API...');
  // First get a place ID from text search
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=Central+Park+New+York&key=${GOOGLE_PLACES_API_KEY}`;
  
  try {
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (searchData.status === 'OK' && searchData.results.length > 0) {
      const placeId = searchData.results[0].place_id;
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry&key=${GOOGLE_PLACES_API_KEY}`;
      
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();
      
      if (detailsData.status === 'OK') {
        console.log('✅ Place Details API is working!');
        console.log('Place name:', detailsData.result?.name);
        console.log('Address:', detailsData.result?.formatted_address);
      } else {
        console.log('❌ Place Details API error:', detailsData.status);
        console.log('Error message:', detailsData.error_message);
      }
    } else {
      console.log('❌ Could not get place ID for testing Place Details API');
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Google Places API Tests...\n');
  
  await testPlacesAutocomplete();
  await testPlacesTextSearch();
  await testGeocodingAPI();
  await testPlaceDetailsAPI();
  
  console.log('\n✨ API Testing Complete!');
  console.log('\n📋 Summary:');
  console.log('- If you see ✅ messages, your API key is working correctly');
  console.log('- If you see ❌ messages, check your API key and billing setup');
  console.log('- Make sure you have enabled the required APIs in Google Cloud Console:');
  console.log('  • Places API');
  console.log('  • Geocoding API');
  console.log('  • Maps JavaScript API');
}

runAllTests(); 
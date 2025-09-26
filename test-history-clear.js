/**
 * Test script to verify history clearing functionality
 * This can be run in the browser console to test the extension
 */

async function testHistoryClear() {
  console.log('Testing history clear functionality...');
  
  try {
    // First, let's add some test data to history
    console.log('Adding test data to history...');
    await chrome.runtime.sendMessage({
      action: 'saveToHistory',
      original: 'Test original prompt',
      optimized: 'Test optimized prompt',
      options: { tone: 'neutral', length: 'maintain' }
    });
    
    // Check if history has data
    const historyBefore = await chrome.runtime.sendMessage({
      action: 'getHistory'
    });
    console.log('History before clear:', historyBefore.data?.length || 0, 'items');
    
    // Clear history
    console.log('Clearing history...');
    const clearResult = await chrome.runtime.sendMessage({
      action: 'clearHistory'
    });
    console.log('Clear result:', clearResult);
    
    // Check if history is empty
    const historyAfter = await chrome.runtime.sendMessage({
      action: 'getHistory'
    });
    console.log('History after clear:', historyAfter.data?.length || 0, 'items');
    
    if ((historyAfter.data?.length || 0) === 0) {
      console.log('✅ History clearing test PASSED');
    } else {
      console.log('❌ History clearing test FAILED');
    }
    
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run test if in browser console
if (typeof chrome !== 'undefined' && chrome.runtime) {
  testHistoryClear();
} else {
  console.log('This test needs to be run in a browser with the extension loaded.');
}
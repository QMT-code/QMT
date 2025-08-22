// DEBUGGING: This code creates a little debugging window that shows real-time updates about key JavaScript behavior.

// To integrate this debugging into QMT, you can do the following:
  // (1) You can paste this code directly into your .addOnReady function
  // (2) Preferred - the provided QMT code will automatically call and use this debugging code if there is an embedded data variable called "DEBUG_MODE" set to a value of "1"

var debugPanel = document.createElement('div');
debugPanel.id = 'qmt-debug';
debugPanel.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.8);color:white;padding:10px;font-family:monospace;font-size:12px;z-index:9999;width:300px;max-width:300px;word-wrap:break-word;';

// Check for QMT functions
var expectedFunctions = [];
Object.keys(regionConfig).forEach(function(regionId) {
    var config = regionConfig[regionId];
    expectedFunctions.push("show" + config.name);
    expectedFunctions.push("hide" + config.name);
});

var foundFunctions = expectedFunctions.filter(function(fnName) {
    return typeof window[fnName] === 'function';
});

var missingFunctions = expectedFunctions.filter(function(fnName) {
    return typeof window[fnName] !== 'function';
});

// Build the debug panel HTML with all diagnostic info
debugPanel.innerHTML = [
    '<strong>QMT Debug Panel</strong>',
    '<div style="margin-top:5px;">Load time: ' + new Date().toLocaleTimeString() + '</div>',
    '<hr style="margin:5px 0;border:none;border-top:1px solid #666;">',
    
    // Initialization status
    '<div><strong>Initialization:</strong></div>',
    '<div style="color:' + (foundFunctions.length === expectedFunctions.length ? '#0f0' : '#ff0') + ';">',
    '  ✓ Regions configured: ' + Object.keys(regionConfig).length,
    '</div>',
    '<div style="color:' + (foundFunctions.length === expectedFunctions.length ? '#0f0' : '#f00') + ';">',
    '  ' + (foundFunctions.length === expectedFunctions.length ? '✓' : '✗') + ' Functions: ' + foundFunctions.length + '/' + expectedFunctions.length,
    '</div>',
    
    // Show missing functions if any
    missingFunctions.length > 0 ? 
        '<div style="color:#f00;font-size:11px;">Missing: ' + missingFunctions.join(', ') + '</div>' : '',
    
    // Show created functions
    '<div style="font-size:11px;color:#888;">Created: ' + foundFunctions.join(', ') + '</div>',
    
    '<hr style="margin:5px 0;border:none;border-top:1px solid #666;">',
    
    // Runtime stats
    '<div><strong>Runtime Stats:</strong></div>',
    '<div>Active regions: <span id="qmt-active">0</span></div>',
    '<div>Total events: <span id="qmt-shows">0</span></div>',
    
    '<hr style="margin:5px 0;border:none;border-top:1px solid #666;">',
    
    // Main sequence display
    '<div><strong>mainSequence head:</strong></div>',
    '<div id="qmt-sequence" style="color:#0ff;word-wrap:break-word;overflow-wrap:break-word;font-size:11px;">empty</div>'
].join('\n');

document.body.appendChild(debugPanel);

// Update dynamic content periodically
setInterval(function() {
    // Check if variables exist in current context
    if (typeof regionStartTimes !== 'undefined') {
        document.getElementById('qmt-active').textContent = Object.keys(regionStartTimes).length;
    }
    
    // For mainSequence, check BOTH the JS variable and embedded data
    var sequenceToShow = "empty";
    
    // First try the JavaScript variable
    if (typeof mainSequence !== 'undefined' && mainSequence.length > 0) {
        sequenceToShow = mainSequence.join(",");
        document.getElementById('qmt-shows').textContent = mainSequence.length;
    } 
    // If JS variable is empty/undefined, try embedded data
    else {
        var embeddedSequence = "${e://Field/mainSequence}";
        if (embeddedSequence && embeddedSequence !== "" && embeddedSequence !== "${e://Field/mainSequence}") {
            sequenceToShow = embeddedSequence;
            // Count events from embedded data
            var eventCount = embeddedSequence.split(",").filter(function(item) { return item; }).length;
            document.getElementById('qmt-shows').textContent = eventCount;
        }
    }
    
    // Truncate if needed
    if (sequenceToShow.length > 250) {
        sequenceToShow = sequenceToShow.substring(0, 250) + "...";
    }
    
    document.getElementById('qmt-sequence').textContent = sequenceToShow;
}, 100);

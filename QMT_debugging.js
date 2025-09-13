// DEBUGGING: This code creates a little debugging window that shows real-time updates about key JavaScript behavior.

// To integrate this debugging into QMT, you can do the following:
  // (1) You can paste this code directly into your .addOnReady function
  // (2) Preferred - the provided QMT code will automatically call and use this debugging code if there is an embedded data variable called "DEBUG_MODE" set to a value of "1"

// Clean up any existing debug panel and interval (necessary if using within a loop and merge)
var oldDebug = document.getElementById('qmt-debug');
if (oldDebug) oldDebug.remove();
if (window.qmtDebugInterval) {
    clearInterval(window.qmtDebugInterval);
}
		
var debugPanel = document.createElement('div');
debugPanel.id = 'qmt-debug';
debugPanel.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.8);color:white;padding:10px;font-family:monospace;font-size:12px;z-index:9999;width:300px;max-width:300px;word-wrap:break-word;';
document.body.appendChild(debugPanel);

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

// Checking to see what names we expect from show() and hide() functions (based on the hTML, matched by the id)
var unexpectedFunctions = [];
var htmlMismatches = [];

Object.keys(regionConfig).forEach(function(regionId) {
    var config = regionConfig[regionId];
    var element = document.getElementById(regionId);
    if (!element) {
        htmlMismatches.push(regionId + " → no element with id");
        return;
    }

    var expectedShow = "show" + config.name + "()";
    var expectedHide = "hide" + config.name + "()";

    var onEnter = element.getAttribute("onmouseenter") || "";
    var onLeave = element.getAttribute("onmouseleave") || "";

    if (!onEnter.includes(expectedShow)) {
        htmlMismatches.push(regionId + " → onmouseenter mismatch (found '" + onEnter + "', expected '" + expectedShow);
    }
    if (!onLeave.includes(expectedHide)) {
        htmlMismatches.push(regionId + " → onmouseleave mismatch (found '" + onLeave + "', expected '" + expectedHide);
    }

    // If the event handlers (from HTML... onmouseenter and onmouseleave) point to functions that are NOT in expected list
    [onEnter.replace(/\(.*\)/, ""), onLeave.replace(/\(.*\)/, "")]
        .filter(Boolean)
        .forEach(function(fn) {
            if (!expectedFunctions.includes(fn) && !unexpectedFunctions.includes(fn)) {
                unexpectedFunctions.push(fn);
            }
        });
});

// Build the debug panel HTML with all diagnostic info
// Notice, we are using the single quote instead of double quotes to wrap, as discussed
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
    
	// Show validation of function ↔ HTML bindings
    '<hr style="margin:5px 0;border:none;border-top:1px solid #666;">',
    '<div><strong>Function Validation:</strong></div>',
    '<div style="font-size:11px;color:#0ff;">Expected: ' + expectedFunctions.join(', ') + '</div>',
    unexpectedFunctions.length > 0 
        ? '<div style="font-size:11px;color:#ff0;">Unexpected: ' + unexpectedFunctions.join(', ') + '</div>' 
        : '',
    missingFunctions.length > 0 
        ? '<div style="font-size:11px;color:#f00;">Missing: ' + missingFunctions.join(', ') + '</div>' 
        : '',
    htmlMismatches.length > 0 
        ? '<div style="font-size:11px;color:#f00;">HTML mismatches:<br>' + htmlMismatches.join('<br>') + '</div>' 
        : '',

	
    '<hr style="margin:5px 0;border:none;border-top:1px solid #666;">',
    
    // Runtime stats
    '<div><strong>Runtime Stats:</strong></div>',
    '<div>Active regions: <span id="qmt-active">0</span></div>',
    '<div>Total events: <span id="qmt-shows">0</span></div>',
    
    '<hr style="margin:5px 0;border:none;border-top:1px solid #666;">',
    
    // Main sequence display
    '<div><strong>mainSequence head:</strong></div>',
    '<div id="qmt-sequence" style="color:#0ff;word-wrap:break-word;overflow-wrap:break-word;font-size:11px;"></div>'
].join('\n');

document.body.appendChild(debugPanel);

// Update dynamic content periodically
setInterval(function() {
    // Check if variables exist in current context
    if (typeof regionStartTimes !== 'undefined') {
        document.getElementById('qmt-active').textContent = Object.keys(regionStartTimes).length;
    }
    
        document.getElementById('qmt-shows').textContent = mainSequence.length;
        
        if (mainSequence.length > 0) {
            // Show first 250 chars of mainSequence
            var sequenceHead = mainSequence.join(",");
            if (sequenceHead.length > 250) {
                sequenceHead = sequenceHead.substring(0, 250) + "...";
            }
            document.getElementById('qmt-sequence').textContent = sequenceHead;
        } 
}, 100);

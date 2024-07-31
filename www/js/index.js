/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

var defaultCustomOptions = {
    quality: 50,
    angleDetectionEnabled:false,
    blurDetectionEnabled:true,
    glareDetectionEnabled:false,
    tiltDetectionEnabled:false,
    glarePixelBrightnessThreshold:200, // 0 to 255
    glarePctPixelsBrightThreshold:0.1, //0 to 1
    angleGreaterThanThreshold:10,  // 0 to 90
    tiltGreaterThanThreshold:10,  // 0 to 90
    blurGradientThreshold:100,  // 0 to 255
    percentageOverlap:10,  // 0 to 100
    opacityOverlap:50   // 0 to 100
};


let fnUpdateText = function(event) {
    let elParent = event.target.closest('.config-range');
    if (elParent) {
        let el = elParent.querySelector('.config-range-text');
        el.textContent = event.target.value;
        defaultCustomOptions[el.id] = parseFloat(event.target.value);
    }
};

let fnUpdateTextFromSettings = function(selectorRange, value) {
    let elRange = document.querySelector(selectorRange);

    let elParent = elRange.closest('.config-range');
    if (elParent) {
        elRange.value = value;
        elParent.querySelector('.config-range-text').textContent = value;
    }
}

let fnClickEnabler = function(event) {
    let elCB = event.target;
    let bEnabled = elCB.checked;
    fnUpdateEnabler(elCB, bEnabled);
    // Update settings
    defaultCustomOptions[elCB.id] = bEnabled;
};

let fnUpdateEnablerFromSettings = function(selectorCB, bEnabled) {
    let elCB = document.querySelector(selectorCB);
    fnUpdateEnabler(elCB, bEnabled);
    elCB.checked = bEnabled;
};

let fnUpdateEnabler = function(elCB, bEnabled) {
    let elSection = elCB.closest('.config-section');
    if (bEnabled) {
        elSection.classList.remove('section-disable');
    } else {
        elSection.classList.add('section-disable');
    }
    elSection.querySelector('.range').disabled = !bEnabled;
}

function onDeviceReady() {
    // Setup cordova specific parameters not available until device is ready.
    defaultCustomOptions.destinationType = Camera.DestinationType.FILE_URI;

    fnUpdateEnablerFromSettings('#angleDetectionEnabled', defaultCustomOptions.angleDetectionEnabled);
    fnUpdateEnablerFromSettings('#glareDetectionEnabled', defaultCustomOptions.glareDetectionEnabled);
    fnUpdateEnablerFromSettings('#tiltDetectionEnabled', defaultCustomOptions.tiltDetectionEnabled);
    fnUpdateEnablerFromSettings('#blurDetectionEnabled', defaultCustomOptions.blurDetectionEnabled);
    fnUpdateTextFromSettings('#blur-range', defaultCustomOptions.blurGradientThreshold);
    fnUpdateTextFromSettings('#angle-range', defaultCustomOptions.angleGreaterThanThreshold);
    fnUpdateTextFromSettings('#glare-pixels-range', defaultCustomOptions.glarePixelBrightnessThreshold);
    fnUpdateTextFromSettings('#glare-pct-pixels-range', defaultCustomOptions.glarePctPixelsBrightThreshold);
    fnUpdateTextFromSettings('#tilt-range', defaultCustomOptions.tiltGreaterThanThreshold);
    fnUpdateTextFromSettings('#overlap-width-range', defaultCustomOptions.percentageOverlap);
    fnUpdateTextFromSettings('#overlap-opacity-range', defaultCustomOptions.opacityOverlap);


    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    document.querySelector('#chetuCamera').addEventListener('click', () => {
        // Clear out the displayed images before getting more.
        document.getElementById('foundImages').innerHTML = '';
        navigator.CustomCamera.getPicture(function(imageURI) {
            // MOve the files to somewhere local so cordova app can display them.
            navigator.CustomCamera.localizePhotos(imageURI, function(arrayLocalizedFiles) {
                arrayLocalizedFiles.forEach(function(objPhoto) {
                    let newEl;
                    if (objPhoto.status == "ok") {
                        newEl = document.createElement('img');
                        newEl.src = objPhoto.data;
                    } else {
                        newEl = document.createElement('div');
                        newEl.innerHTML = "ERROR" + objPhoto.data;
                    }
                    document.getElementById('foundImages').appendChild(newEl);
                });
            })
        }, function(message) {
            alert('Failed because: ' + message);
        }, defaultCustomOptions, "startCamera");
    });

    document.querySelector('#defaultCamera').addEventListener('click', () => {
        // Clear out the displayed images before getting more.
        document.getElementById('foundImages').innerHTML = '';
        navigator.camera.getPicture(function(imageURI) {
            // MOve the files to somewhere local so cordova app can display them.
            navigator.CustomCamera.localizePhotos(imageURI, function(arrayLocalizedFiles) {
                arrayLocalizedFiles.forEach(function(objPhoto) {
                    let newEl;
                    if (objPhoto.status == "ok") {
                        newEl = document.createElement('img');
                        newEl.src = objPhoto.data;
                    } else {
                        newEl = document.createElement('div');
                        newEl.innerHTML = "ERROR" + objPhoto.data;
                    }
                    document.getElementById('foundImages').appendChild(newEl);
                });
            })
        }, function(message) {
            alert('Failed because: ' + message);
        }, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI
        }, 'defaultCamera');
    });

    document.querySelectorAll('.range').forEach(function(el) {
        el.addEventListener('input', fnUpdateText);
    });

    document.querySelectorAll('.config-cb-input').forEach(function(el) {
        el.addEventListener('change', fnClickEnabler);
    });

}

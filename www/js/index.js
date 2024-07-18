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



function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    //
    // This should work regardless of which plugin you use (cordova_camera or cordova-plugin-camera). But we should be able to include both!!
    //
    const btnDef = document.querySelector('#defaultCamera');
    btnDef.addEventListener('click', () => {

        // Clear out the displayed images before getting more.
        document.getElementById('foundImages').innerHTML = '';
        navigator.camera.getPicture(function(imageURI) {
            // MOve the files to somewhere local so cordova app can display them.
            navigator.camera.localizePhotos(imageURI, function(arrayLocalizedFiles) {
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
            destinationType: Camera.DestinationType.FILE_URI,
            angleValue:false,
            blurValue:false,
            glarValue:false,
            tiltedValue:false
        }, 'startCamera');
    });


}

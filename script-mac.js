// @ts-check
/* -*- Mode: Java; tab-width: 4; indent-tabs-mode:nil; c-basic-offset: 4 -*- */
/* vim: set ts=4 et sw=4 tw=80: */

/* SSML Test Tool - Supporting Javascript
	Author Mark Hakkinen (mhakkinen@ets.org) and Irfan Ali (iali@ets.org)
	Last modifed May 21, 2018
*/

var synth = null;

var voiceSelect = null;

window.addEventListener("load", function () {
	// Adding Stop button to stop the synthesiser 
	var stopButton = document.getElementById('stopButton');
	stopButton.addEventListener('click', function (e) {
		synth.cancel();
	});

	// adding xml wrapper for windows synthesiser
	if (navigator.appVersion.indexOf("Win") != -1) {
		document.getElementById('chkXMLprefix').checked = true;
		document.getElementById('chkWrapSSML').checked = true;
	}

	synth = window.speechSynthesis;
	voiceSelect = document.querySelector('select');
	populateVoiceList();
	if (speechSynthesis.onvoiceschanged !== undefined) {
		speechSynthesis.onvoiceschanged = populateVoiceList;
	}

});

// stop the synthesiser  ends
let voices = [];

function populateVoiceList() {
	voices = synth.getVoices();

	for (i = 0; i < voices.length; i++) {
		var option = document.createElement('option');
		option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

		if (voices[i].default) {
			option.textContent += ' -- DEFAULT';
		}

		option.setAttribute('data-lang', voices[i].lang);
		option.setAttribute('data-name', voices[i].name);
		voiceSelect.appendChild(option);
	}
}


function displayXML(s) {
	var wst;
	wst = s;
	while (wst.indexOf("<") >= 0) wst = wst.replace("<", "&lt;");
	while (wst.indexOf(">") >= 0) wst = wst.replace(">", "&gt;");
	return wst;
}

function jasonToSSML(workString) {
	// ssml : ssmlval : [prevTxt, postTxt]

	var two = {
		"prosody": {
			"fast": ["[[rate 300]]", "[[rset 0]]"],
			"slow": ["[[rate 75]]", "[[rset 0]]"],
			"x-fast": ["[[rate 300]]", "[[rset 0]]"]
		},
		"say-as":
		{
			"characters": ["[[char LTRL]]", "[[char NORM]]"],
			"ordinal": ["[[nmbr NORM]]", "[[nmbr NORM]]"],
			"cardinal": ["[[nmbr NORM]]", "[[nmbr NORM]]"],
			"date": ["[[Day][/][Month][/][Year]]", "[[Day][/][Month][/][Year]]"],
			"time": ["[[hour][:][minute][:][second]]", "[[hour][:][minute][:][second]]"]
		},
		"emphasis": {
			"strong": ["[[emph +]]", "[[rset 0]]"],
			"moderate": ["[[emph +; emph +]]", "[[rset 0]]"],
			"reduced": ["[[emph -]]", "[[rset 0]]"]
		},
		"break": {
			"weak": ["[[slnc 250]]", "[[slnc 0]]"],
			"medium": ["[[slnc 500]]", "[[slnc 0]]"],
			"strong": ["[[slnc 1000]]", "[[slnc 0]]"],
			"time": ["[[second]]", "[[second]]"]

		},

		"sub": {
			"alias": ["[[]]"],
			"red": ["[[]]", "[[]]"],
			"World Wide Web Consortium": ["[[]]", "[[]]"],
			"Speech Synthesis Markup Language": ["[[]]", "[[]]"]


		}

	}


	var ssml2Parse;
	ssml2Parse = workString;
	var ssmlEl = document.getElementById('ssml-string');
	var elems = ssmlEl.getElementsByTagName('span');

	// checking for window operative system only

	if (navigator.appVersion.indexOf("Win") >= 1) {
		var safe = elems.length;
		while (elems[0] && safe) {
			safe--;
			var elem = elems[0];
			var ssml = JSON.parse(elem.dataset.ssml);

			var innerMost = null; // to clear the previous value from the DOM
			var rssml = []; // creating the array of ssml
			for (var t in ssml) {

				rssml.push(t);
			}
			//['parameter1','parameter2','parameter3']
			// staring looping in the reverse order from last child 
			for (var i = rssml.length - 1; i >= 0; i--) {
				var tagName = rssml[i];

				var child = document.createElement(tagName);
				// ssml[tagName] :: {"property":"attribute"}
				for (var a in ssml[tagName]) {
					child.setAttribute(a, ssml[tagName][a]);
				}
				if (innerMost == null) {
					child.innerText = elem.innerText;
				} else {
					child.appendChild(innerMost);
				}
				innerMost = child;
			}
			elem.parentNode.replaceChild(child, elem);


		}

	}
	// window operative system

	else {
		// var elems = document.getElementsByTagName("span");
		var safe = elems.length;
		while (elems[0] && safe) {
			safe--;
			var s = elems[0];
			//console.log("source:"+s);
			var ssml = JSON.parse(s.dataset.ssml);
			for (var i in ssml) {
				for (var j in two) {
					//	console.log("i: "+i + ", j: "+j);
					if (i == j) {
						for (var k in ssml[i]) {
							for (var l in two[j]) {
								//		console.log("ssml[i][k]: "+ssml[i][k] + ", l: "+l);
								if (ssml[i][k] == l) {
									//	console.log("match");
									//	console.log(s.out);
									s.outerHTML = two[j][l][0] + s.innerHTML + two[j][l][1];

								}

							}
						}
					}
				}
			}
		}

	}
};


function produceSpeech() {
	let workString = document.getElementById('ssml-string').innerText;
	var prefix;
	var wrapper;
	var json2ssml = document.getElementById('chkJSONAttr').checked;
	var bWrap = document.getElementById('chkWrapSSML').checked;
	var bPrefix = document.getElementById('chkXMLprefix').checked;
	var bDataAttr = document.getElementById('chkDataAttr').checked;


	var msSpeakTag = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" ' +
		'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
		'xsi:schemaLocation="http://www.w3.org/2001/10/synthesis ' +
		'http://www.w3.org/TR/speech-synthesis/synthesis.xsd" xml:lang="en-US">';

	if (bWrap) {
		workString = msSpeakTag + workString + "</speak>";
	};

	// Function to convert json HTML to SSML

	jasonToSSML(workString)


	if (bPrefix) {
		workString = "<?xml version='1.0'?>" + workString;
	};

	var utterThis = new SpeechSynthesisUtterance(workString);

	var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
	for (let i = 0; i < voices.length; i++) {
		if (voices[i].name === selectedOption) {
			utterThis.voice = voices[i];
			utterThis.rate = 1;
		}
	}

	synth.speak(utterThis);
}

function getBrowserInfo() {
	var ua = navigator.userAgent, tem,
		M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return 'IE ' + (tem[1] || '');
	}
	if (M[1] === 'Chrome') {
		tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
		if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
	}
	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	if ((tem = ua.match(/version\/(\d+)/i)) != null)
		M.splice(1, 1, tem[1]);
	return M.join(' ');
}

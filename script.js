// @ts-check
/* -*- Mode: Java; tab-width: 4; indent-tabs-mode:nil; c-basic-offset: 4 -*- */
/* vim: set ts=4 et sw=4 tw=80: */

window.addEventListener("load", function () {

    function setSSMLAttr(attrValue, requireSelection) {
        requireSelection = (requireSelection !== null) || true;
        const textArea = document.getElementById("AuthoredText");
        const doc = textArea.ownerDocument || textArea.document;
        const win = doc.defaultView || doc.parentWindow;
        if (typeof win.getSelection != "undefined") {
            const sel = win.getSelection();
            if (sel && sel.rangeCount > 0) {
                if ( !(requireSelection && sel.isCollapsed)) {
                    const spanWrapper = document.createElement('span');
                    spanWrapper.setAttribute('data-ssml', attrValue);
    
                    const range = sel.getRangeAt(0);     // only handle single selection
                    if (!requireSelection) {
                        range.collapse(true);   // assure cursor at start
                    }
                    range.surroundContents(spanWrapper);    
                }
            }
        }
    }

    document.getElementById("prosodyFast").onclick = (() => setSSMLAttr('{"prosody" : {"rate":"x-fast"}}'));
    document.getElementById("prosodySlow").onclick = (() => setSSMLAttr('{"prosody" : {"rate":"slow"}}'));
    document.getElementById("strongVoice").onclick = (() => setSSMLAttr('{"emphasis" : {"level":"strong"}}'));
    document.getElementById("sayCardinal").onclick = (() => setSSMLAttr('{"say-as": {"interpret-as": "cardinal"}}'));
    document.getElementById("sayOrdinal").onclick = (() => setSSMLAttr('{"say-as": {"interpret-as": "ordinal"}}'));
    document.getElementById("sayChar").onclick = (() => setSSMLAttr('{"say-as": {"interpret-as": "characters"}}'));
    document.getElementById("breakMedium").onclick = (() => setSSMLAttr('{"break": {"strength":"medium"}}', false));
    document.getElementById("subAlias").onclick = function() {
        const substitutionText = prompt("Enter substitution text:")
        if (substitutionText) {
            setSSMLAttr(`{"sub": {"alias":"${substitutionText}"}}`);
        }
    };

    new MutationObserver(updateSSMLAreas).observe(
        this.document.getElementById("AuthoredText"),
        {childList: true, characterData: true, subtree: true});
});

// From: https://stackoverflow.com/questions/247483/http-get-request-in-javascript/4033310#4033310
var HttpClient = function () {
    this.get = function (aUrl, aCallback) {
        try {
            const anHttpRequest = new XMLHttpRequest();
            anHttpRequest.responseType = "document";
            anHttpRequest.onload = function () {
                if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                    aCallback(anHttpRequest.responseXML);
            }
    
            anHttpRequest.open("GET", aUrl, true);
            anHttpRequest.send(null);
        } catch(error) {
            alert("Failed to get data from url. Reason: " + JSON.stringify(error));
        }
    }
}

/**
 * 
 * @param {string} url 
 */
function getFromURL(url) {
    url = url || prompt("Enter URL of page to edit");
    if (url !== null) {
        url = 'https://yacdn.org/proxy/' + (url.includes('://') ? '' : 'https://') + url;
        var client = new HttpClient();
        client.get(url, function (response) {
            // do something with response
            const el = document.getElementById('webContent');
            el.appendChild(response.body.cloneNode(true));
            $rw_tagSentences();
        });
    }
}

/**
 * @returns {Element}
 */
function getWebContentSelection() {
    const textArea = document.getElementById("webContent");
    const doc = textArea.ownerDocument || textArea.document;
    const win = doc.defaultView || doc.parentWindow;
    if (typeof win.getSelection != "undefined") {
        const sel = win.getSelection();
        if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
            return sel.getRangeAt(0).commonAncestorContainer;     // only handle single selection
        }
    }
}


/**
 * 
 * @param {Element} el 
 * @returns {string}
 */
function nodeToSSML(el) {
	let result = '';
	if (el.tagName === 'SPAN' && el.hasAttribute('data-ssml')) {
        // open tag and attrs
		const keyValArray = Object.entries(JSON.parse(el.getAttribute('data-ssml')));
		keyValArray.forEach(([tag, attrObject]) => {
			result += `<${tag}`;
			Object.entries(attrObject).forEach(([attrName, attrValue]) => {
				result += ` ${attrName}="${attrValue}"`;
			})
		});
		result += '>'
    }

	const children = el.childNodes;
    if (children.length === 0) {     // <span>s might have text but no children
		return el.textContent;
	} 

	for (let i = 0; i < children.length; i++) {
		result += nodeToSSML(children[i]);
	}

	if (el.tagName === 'SPAN' && el.hasAttribute('data-ssml')) {
		// matching close tag (go from last to first)
		const keyValArray = Object.entries(JSON.parse(el.getAttribute('data-ssml'))).reverse();
		keyValArray.forEach(([tag, attrObject]) => {
			result += `</${tag}>`;
		});
    }
    return result;
}

    /**
     * @param {[MutationRecord]} mutationList 
     * @param {MutationObserver} observer 
     */
    function updateSSMLAreas(mutationList, observer) {
        // root node id='AuthoredText'
        const rootElement = document.getElementById("AuthoredText");
        //observer.disconnect();
        const ssmlString = nodeToSSML(rootElement);
        document.getElementById('ssml-string').textContent = ssmlString;
        document.getElementById('json-string').textContent = rootElement.innerHTML.replace(/\&quot;/g, "'");
        //observer.observe(mutation.target);
    }



function removeOldID() {
    const el = document.querySelector('[id="XXX-web-selection-XXX"]');
    if (el) {
        el.removeAttribute('id');
        if (el.hasAttribute('data-savedID')) {
            el.setAttribute('id', el.getAttribute('data-savedID'));
            el.removeAttribute('data-savedID');
        }    
    }
}

function pasteFromWeb() {
    const selectedElement = getWebContentSelection();
    if (!selectedElement) {
        alert('Unable to copy selection');
        return;
    }

    removeOldID();
    if (selectedElement.id) {
        selectedElement.setAttribute('data-savedID', selectedElement.id);
    }
    
    const authorElement = document.getElementById("AuthoredText");
    authorElement.textContent = '';
    authorElement.appendChild(selectedElement.cloneNode(true));
    selectedElement.id = 'XXX-web-selection-XXX';       // do this after cloning so not part of clone

}

function pasteToWeb() {
    // not yet implemented
    const target = document.getElementById('XXX-web-selection-XXX');
    if (target) {
        const authorElement = document.getElementById("AuthoredText");
        target.innerHTML = authorElement.innerHTML;
        // don't remove the old target id -- may want to paste again.
    }
}

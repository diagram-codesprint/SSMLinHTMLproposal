window.addEventListener("load", function () {

    function setSSMLAttr(attrValue) {
        const textArea = document.getElementById("AuthoredText");
        const doc = textArea.ownerDocument || textArea.document;
        const win = doc.defaultView || doc.parentWindow;
        if (typeof win.getSelection != "undefined") {
            const sel = win.getSelection();
            if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
                const spanWrapper = document.createElement('span');
                spanWrapper.setAttribute('data-ssml', attrValue);

                const range = sel.getRangeAt(0);     // only handle single selection
                range.surroundContents(spanWrapper);
            }
        }
    }

    document.getElementById("prosodyFast").onclick = (() => setSSMLAttr('{"prosody" : {"rate":"x-fast"}}'));
    document.getElementById("prosodySlow").onclick = (() => setSSMLAttr('{"prosody" : {"rate":"slow"}}'));
    document.getElementById("strongVoice").onclick = (() => setSSMLAttr('{"emphasis" : {"level":"strong"}}'));
    document.getElementById("sayCardinal").onclick = (() => setSSMLAttr('{"say-as": {"interpret-as": "cardinal"}}'));
    document.getElementById("sayOrdinal").onclick = (() => setSSMLAttr('{"say-as": {"interpret-as": "ordinal"}}'));
    document.getElementById("sayChar").onclick = (() => setSSMLAttr('{"say-as": {"interpret-as": "characters"}}'));
    document.getElementById("breakMedium").onclick = (() => setSSMLAttr('{"break": {"strength":"medium"}}'));
    document.getElementById("subAlias").onclick = function() {
        const substitutionText = prompt("Enter substitution text:")
        if (substitutionText) {
            setSSMLAttr(`{"sub": {"alias":"${substitutionText}"}}`);
        }
    };


});

// From: https://stackoverflow.com/questions/247483/http-get-request-in-javascript/4033310#4033310
var HttpClient = function () {
    this.get = function (aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.responseType = "document";
        anHttpRequest.onload = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseXML);
        }

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
}
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


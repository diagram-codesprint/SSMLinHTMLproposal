window.addEventListener("load", function () {

    function setSSMLAttr(attrValue) {
        const textArea = document.getElementById("AuthoredText");
        const doc = textArea.ownerDocument || textArea.document;
        const win = doc.defaultView || doc.parentWindow;
        if (typeof win.getSelection != "undefined") {
            const sel = win.getSelection();
            if (sel) {
                if (sel.rangeCount > 0 && !sel.isCollapsed) {
                    const spanWrapper = document.createElement('span');
                    spanWrapper.setAttribute('data-ssml', attrValue);

                    const range = win.getSelection().getRangeAt(0);     // only handle single selection
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
    document.getElementById("breakMedium").onclick = (() => setSSMLAttr('{"break": {"strength":"medium"}}'));
    document.getElementById("subAlias").onclick = function() {
        const substitutionText = prompt("Enter substitution text:")
        if (substitutionText) {
            setSSMLAttr(`{"sub": {"alias":"${substitutionText}"}}`);
        }
    };


});


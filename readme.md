# DIAGRAM Code Sprint 2020 - Authoring Tool for SSML in HTML Content
## Based on a Proposal for Including SSML in HTML via a JSON Model

Project lead: Irfan Ali 
Project duration:  June 10th – June 12th  
Starting Group: Irfan,  Laura, Neil and Sina 
 
## Description 
 
The need to provide pronunciation and spoken presentation guidance for text to speech synthesizers is critical in educational contexts. Mispronunciations, numeric values read in an unnatural manner, and lack of pauses during spoken presentation of complex content are among the problems that may impact students (and others) who depend upon spoken infromation using Text to Speech Synthesis (TTS).

A growing number of platforms, including voice assistants, support SSML, the W3C Speech Synthesis Markup Language. However, there are gaps, including authoring tools, standards for integrating SSML in web documents, and assistive technology support. In W3C, the Pronunciation Task Force https://www.w3.org/WAI/APA/task-forces/pronunciation/ is working to define a standard mechanism to include SSML into HTML. 

## Goal

The goal of this code sprint project is to focus on an easy to use (and accessible) tool simplify the authoring of speech markup for purposes of exercising the proposed standard with real world content.

* Step 1 - Use the original SSML Tool prototype as foundation for new tool. SSML Toolalready includes necessary logic (after group analysis could be refactored or discarded).

* Step 2 - Redesign UI and implement a split window interface to allow loading of an HTML document, selection of a document fragment upon which SSML attributes can be applied

* Step 3 - Implement internal "preview mode" to listen to text that has been edited

* Step 4 - Implement Save/Export of the HTML document

* Step 6 - Implement Previewer using TextHelp Speech Stream on saved, standalong document.

Givent the short period allowed for this Sprint, attempt to use existing code wherever feasible.
 
## Background Reading and Resources

### Explainer: Improving Spoken Presentation on the Web
https://www.w3.org/TR/pronunciation-explainer/

### W3C Pronunciation Gap Analysis and Use Cases (Working Draft)
https://www.w3.org/TR/pronunciation-gap-analysis-and-use-cases/

## Examples

### `data-SSML`

We have been experimenting with different approaches over the past several years and settled on the JSON approach, tested using a data attribute, `data-ssml`.  The `data-ssml` attribute can be applied to HTML elements containing textual content. The attribute value is a JSON structure which contains the SSML function (e.g., “say-as”) and any required property-value pairs needed to fully specify the function.  While we could propose simply standardizing on a data-attribute, the Pronunciation Task Force is continuing to explore options, including an aria-ssml and ssml atribute.

#### `say-as`
```javascript
The angle <span data-ssml='{"say-as" : {"interpret-as":"characters"}}'>CAB</span> is 30 degrees.
````
#### `phoneme`
```javascript
The words <span data-ssml='{"phoneme": {"ph":"ˈkɔɹdəˌneɪt/"}}'>coordinate</span> and 
<span data-ssml='{"phoneme": {"ph":"ˈkɔɹdənɪt"}}'>coordinate</span> have different meanings.
````  
#### `break`
````javascript
The point <span data-ssml='{"break":{"time":"250ms"}}'></span>
<span data-ssml='{"say-as" : {"interpret-as":"characters"}}'>x,y</span> is on the coordinate plane.
````
#### `sub`
````javascript
1 <span data-ssml='{"sub": {"alias":"pico meter"}}'>pm</span> is equal to one trillionth of a meter.
````
#### `emphasis`
````javascript
You <strong><span data-ssml='{"emphasis": {"level":"strong"}}'>must</span></strong> answer 
all questions in order to continue.
````
Note in this last example, the `data-ssml` attribute could have been placed on the `strong` element.



## SSML Tool

SSMLTool was the initial demonstrator for examining JSON-based approach to SSML support using the W3C Web Speech Synthesis API.  The tool demonstrates the basic process of consuming JSON encoded SSML contained as the attribute value of `data-ssml`. 

This code is made available "as is" for demonstration purposes, and not intended as a specific proposed method of implementing SSML support in HTML.

A live version is available at [http://ets-research.org/ia11ylab/ia/ssml/tpac-2018/index.html]

*Note* that you will need to have an SSML aware synthesizer available on Windows, or be running on MacOS where we map common SSML features to their equivalents in the MacOS TTS.

Tested on Windows with Chrome and FireFox using Ivona TTS, and Windows 10 Edge with Microsoft TTS.  Also on MacOS with Chrome and Safari using the native Mac OS TTS engine, with a custom mapping of SSML to the native Apple TTS commands.




Questions? Please write Mark Hakkinen (mhakkinen@ets.org) Or Irfan Ali (iali@ets.org)


[1] https://github.com/mhakkinen/SSML-issues/blob/master/overview.md

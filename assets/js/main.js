/*
@version:       0.9.0
@fileoverview:  Translate Text Using Google Cloud Translate API and CF KV
@author:        Corey Jackson
@copyright:     Jax Tech Solutions Inc.
@license:       MIT
@info:			manage installed languages for translator API (N/A for this script)-  chrome://on-device-translation-internals
@todo:			default lang to browser default
@vernhistory:	0.8.0 - Jul. 26, 2026 - added local cache
				0.9.0 - Jul. 29, 2026 - initial release
*/

const strSourceLang = "en";
const apiUrl = 'https://anylove.jax.tech/api/translatetext';

async function translatePage(targetLang)
{
	console.log("targetLang:" + targetLang);
	if (targetLang === "en")
	{
		//load data from data-text attribute
		//TO DO*****

		//temporarily reload the page
		window.location.reload();
		return;
	}
	else
	{
		try
		{
			const elements = document.querySelectorAll('[data-text]');
			
			elements.forEach(element => {
				//console.log(element.dataset.text);
				//translateText("fr", "the cat walked down street");
				translateText(targetLang, element.dataset.text).then((result) => {
					//console.log("result:" + result);
					if (result !== null)
					{
						element.textContent = result;
					}
				});
			})

			//console.log("selindex:" + document.getElementById("selLang").selectedIndex);
			//document.getElementById("iLang").title = document.getElementById("selLang").options[document.getElementById("selLang").selectedIndex].text + " | " + targetLang;
		}
		catch (err)
		{
			console.log("An error has occured in translating language:" + err);
		}
	}
}

async function translateText(targetLang, text)
{
        //check for local storage
        if (isLocalStorageEnabled() === true)
        {
            const hash = fastNonCryptoHash("en:" + targetLang + ":" + text);
            //console.log("hash:" + hash);

            try
            {
                const cachedVal = localStorage.getItem("en:" + targetLang + ":" + hash);
                //console.log("cachedVal:" + cachedVal);

                if (cachedVal !== null)
                {
                    //use cached value if present
					return cachedVal;
                }
                else
                {
                    //no cached value exists so retrieve from API
                    const requestOptions = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            q: text,
                            source: 'en',
                            target: targetLang
                        })
                    };

                    //console.log("targetLang:" + targetLang);
                    //console.log("text:" + text);

                    try
                    {
                        const response = await fetch(apiUrl, requestOptions);
                        const data = await response.text();
						if (response.ok)
						{
							//console.log("data returned");
							//console.log("data:" + data);
							//console.log("JSON data:" + JSON.stringify(data));
							
							//write value to localStorage for future requests
							try
							{
								if (!data.includes("error"))
								{
									localStorage.setItem("en:" + targetLang + ":" + hash, data);
								}
							}
							catch (error)
							{
								console.log("could not write to local storage");
								alert("could not write to local storage");
							}
							return data;
						}
						else
						{
							console.log("error in translating text. response HTTP statusCode:" + response.status);
							return null;
						}
                    }
                    catch (error)
                    {
                        console.error("An error has occured in POST request:" + error);
						return null;
                    }
                }
            }
            catch (error)
            {
                console.error(error);
            }
        }
        else
        {
            console.log("local storage is required to translate page");
            alert("local storage is required to translate page");
        }
    }

    function isLocalStorageEnabled()
    {
        try
        {
            const key = '__storage_test__';
            window.localStorage.setItem(key, key);
            window.localStorage.removeItem(key);
            return true;
        } catch (e) {
            if (e instanceof DOMException && (
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                window.localStorage.length !== 0) {
                    console.log("Local storage is full");
                    alert("Local storage is full");
            } else {
                console.log("Local storage is not available");
                alert("Local storage is not available");
            }
            return false;
        }
    }

    function fastNonCryptoHash(str)
    {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            // Bitwise shift and subtraction
            hash = (hash << 5) - hash + char; 
            // Convert to a 32-bit integer
            hash |= 0; 
        }
        // Ensure an unsigned integer result
        return hash >>> 0; 
    }

function getSystemColorScheme() {
  // Get OS preference
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

function setColorScheme(theme)
{
    console.log(theme);
    if (theme === "system")
    {
        theme = getSystemColorScheme();
    }
    //console.log(theme);
    document.documentElement.style.colorScheme = theme;
    //console.log(document.documentElement.style.colorScheme);
}


//function by HTML5 UP
(function() {
	if (location.href.includes("emojis"))
	{
		return;
	}
	"use strict";

	var	$body = document.querySelector('body');

	// Methods/polyfills.

		// classList | (c) @remy | github.com/remy/polyfills | rem.mit-license.org
			!function(){function t(t){this.el=t;for(var n=t.className.replace(/^\s+|\s+$/g,"").split(/\s+/),i=0;i<n.length;i++)e.call(this,n[i])}function n(t,n,i){Object.defineProperty?Object.defineProperty(t,n,{get:i}):t.__defineGetter__(n,i)}if(!("undefined"==typeof window.Element||"classList"in document.documentElement)){var i=Array.prototype,e=i.push,s=i.splice,o=i.join;t.prototype={add:function(t){this.contains(t)||(e.call(this,t),this.el.className=this.toString())},contains:function(t){return-1!=this.el.className.indexOf(t)},item:function(t){return this[t]||null},remove:function(t){if(this.contains(t)){for(var n=0;n<this.length&&this[n]!=t;n++);s.call(this,n,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(t){return this.contains(t)?this.remove(t):this.add(t),this.contains(t)}},window.DOMTokenList=t,n(Element.prototype,"classList",function(){return new t(this)})}}();

		// canUse
			window.canUse=function(p){if(!window._canUse)window._canUse=document.createElement("div");var e=window._canUse.style,up=p.charAt(0).toUpperCase()+p.slice(1);return p in e||"Moz"+up in e||"Webkit"+up in e||"O"+up in e||"ms"+up in e};

		// window.addEventListener
			(function(){if("addEventListener"in window)return;window.addEventListener=function(type,f){window.attachEvent("on"+type,f)}})();

	// Play initial animations on page load.
		window.addEventListener('load', function() {
			window.setTimeout(function() {
				$body.classList.remove('is-preload');
			}, 100);
		});

	// Slideshow Background.
		(function() {

			// Settings.
				var settings = {

					// Images (in the format of 'url': 'alignment').
						images: {
							'images/bg01.webp': 'center',
							'images/bg02.webp': 'center',
							'images/bg03.webp': 'center',
							'images/bg04.webp': 'center',
							'images/bg05.webp': 'center',
							'images/bg06.webp': 'center',
							'images/bg07.webp': 'center',
							'images/bg08.webp': 'center',
							'images/bg09.webp': 'center',
							'images/bg10.webp': 'center',
							'images/bg11.webp': 'center',
							'images/bg12.webp': 'center',
							'images/bg13.webp': 'center',
							'images/bg14.webp': 'center',
							'images/bg15.webp': 'center',
							'images/bg16.webp': 'center',
							'images/bg17.webp': 'center',
							'images/bg18.webp': 'center',
							'images/bg19.webp': 'center',
							'images/bg20.webp': 'center',
							'images/bg21.webp': 'center'
						},

					// Delay.
						delay: 5000 //6000

				};

			// Vars.
				var	pos = 0, lastPos = 0,
					$wrapper, $bgs = [], $bg,
					k, v;

			// Create BG wrapper, BGs.
				$wrapper = document.createElement('div');
					$wrapper.id = 'bg';
					$body.appendChild($wrapper);

				for (k in settings.images) {

					// Create BG
						$bg = document.createElement('div');
							$bg.style.backgroundImage = 'url("' + k + '")';
							$bg.style.backgroundPosition = settings.images[k];
							$wrapper.appendChild($bg);

					// Add it to array
						$bgs.push($bg);

				}

			// Main loop
				$bgs[pos].classList.add('visible');
				$bgs[pos].classList.add('top');

				// Bail if we only have a single BG or the client doesn't support transitions.
					if ($bgs.length == 1
					||	!canUse('transition'))
						return;

				window.setInterval(function() {

					lastPos = pos;
					pos++;

					// Wrap to beginning if necessary.
						if (pos >= $bgs.length)
							pos = 0;

					// Swap top images.
						$bgs[lastPos].classList.remove('top');
						$bgs[pos].classList.add('visible');
						$bgs[pos].classList.add('top');

					// Hide last image after a short delay.
						window.setTimeout(function() {
							$bgs[lastPos].classList.remove('visible');
						}, settings.delay / 2);

				}, settings.delay);

		})();
})();

function copyRSSURL() {
	navigator.clipboard.writeText("https://jax.tech/anylove/rsstest.xml");
}

function downloadApp()
{
	alert("The app is under development.")
}

async function sharePage()
{
	const shareData = {
		title: 'Any Love',
		url: 'https://anylove.jax.tech'
	};
	
	try {
		await navigator.share(shareData);
	} catch (err) {
		console.error(`Error: ${err}`);
	}
}

function generateBrowserNonce() {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }
  
//const nonce = generateBrowserNonce();
//console.log(nonce); // Example: "dGhpcyBpcyBhIG5vbmNl"
  
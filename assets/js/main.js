/*
	Site by Corey Jackson and Eventually by HTML5 UP | html5up.net | @ajlkn | Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

//manage installed languages -  chrome://on-device-translation-internals

const strSourceLang = "en";

async function translatePage(targetLang)
{
	//target language override for testing
	//targetLang = "ar";
	//console.log("targetLang:" + targetLang);

	if ('Translator' in self && 'LanguageDetector' in self)
	{
		if (targetLang === "en")
		{
			//load data from data-text attribute
			//TO DO*****

			//temporarily reload the page
			window.location.reload();
			return;
		}
		
		//verify translation support
		const translatorAvailability = await Translator.availability({
			sourceLanguage: strSourceLang,
			targetLanguage: targetLang,
		});
		//console.log("translatorAvailability:" + translatorAvailability);

		if (translatorAvailability === "unavailable")
		{
			console.log(targetLang + " language is unavailable in your browser");
			alert(targetLang + " language is unavailable in your browser");
			return;
		}
		else if (translatorAvailability === "downloadable")
		{
			try
			{
				const translator = await Translator.create({
					sourceLanguage: strSourceLang,
					targetLanguage: targetLang,
					monitor(monitor) {
						monitor.addEventListener("downloadprogress", (e) => {
							console.log(`Downloaded ${Math.floor(e.loaded * 100)}%`);
						});
					},
				});
				console.log("download complete");
				translator.destroy();

				translatePage(targetLang);
			}
			catch (e)
			{
				console.log("an error has occured:" + e);
			}
		}
		else if (translatorAvailability === "available")
		{
			const elements = document.querySelectorAll('[data-text]');
			
			elements.forEach(element => {
				//console.log(element.dataset.text);
				translateText(targetLang, element.dataset.text).then((result) => {
					//console.log(result);
					element.textContent = result;
				});
			});
		}
		else
		{
			//unknown state
			console.log("translatorAvailability:" + translatorAvailability);
		}
	}
	else
	{
		//no support for Language Translation API
		alert("Your browser does not support built-in language translation. Visit https://developer.mozilla.org/en-US/docs/Web/API/Translator for support. Chrome on a non-mobile device is supported");
		console.log("Your browser does not support built-in language translation. Visit https://developer.mozilla.org/en-US/docs/Web/API/Translator for support.");
	}
}

async function translateText(targetLang, sourceText)
{
	//target language override for testing
	//targetLang = "fr";

	try
	{
		if ('Translator' in self && 'LanguageDetector' in self)
		{
			console.log(targetLang);

			//verify translation support
			const translatorAvailability = await Translator.availability({
				sourceLanguage: strSourceLang,
				targetLanguage: targetLang,
			});
			//console.log(translatorAvailability);
	
			if (translatorAvailability === "available")
			{
				const translator = await Translator.create({
					sourceLanguage: strSourceLang,
					targetLanguage: targetLang,
				});

				//verify input quota
				const totalInputQuota = translator.inputQuota;
				if (totalInputQuota != "Infinity")
				{
					//warn developer if limited quota
					console.log(totalInputQuota);
				}

				const translation = await translator.translate(sourceText);
				//console.log(translation);
				
				translator.destroy();
				return translation.toString();
			}
			else if (translatorAvailability === "unavailable")
			{
				console.log(targetLang + " language is unavailable in your browser");
				//alert(targetLang + " language is unavailable in your browser");
			}
		}
		else
		{
			console.log("Your browser does not support built-in language translation. Visit https://developer.mozilla.org/en-US/docs/Web/API/Translator for support.");
		}
	}
	catch (e)
	{
		console.log("An error has occured in language translation");
		console.error(e);
	}
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
  
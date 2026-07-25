async function translatePageTransAPI(targetLang)
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
				translateTextTAPI(targetLang, element.dataset.text).then((result) => {
					//console.log(result);
					element.textContent = result;
				});
			});
			//console.log("selindex:" + document.getElementById("selLang").selectedIndex);
			document.getElementById("iLang").title = document.getElementById("selLang").options[document.getElementById("selLang").selectedIndex].text + " | " + targetLang;
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

async function translateTextTAPI(targetLang, sourceText)
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
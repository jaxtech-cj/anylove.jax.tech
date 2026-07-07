//Author: Corey Jackson, Jax Tech
//v1.0 draft
//v1.1 fa-duotone support
//place the following script on HTML document: <script type="text/javascript" src="assets/js/fontanalyze.js" defer></script>

function init()
{
    var codebgcolor = "#CCCCCC";
    var codefont = "sans-serif";
    var marginleft = "10px";

    divCSSDeclarationTitle = document.createElement("div");
    divCSSDeclarationTitle.innerText = "FA CSS Declaration";
    document.body.appendChild(divCSSDeclarationTitle);

    divCSSDeclaration = document.createElement("div");
    divCSSDeclaration.id = "divCSSDeclaration";
    divCSSDeclaration.style.backgroundColor = codebgcolor;
    divCSSDeclaration.style.fontFamily = codefont;
    divCSSDeclaration.style.marginLeft = marginleft;
    document.body.appendChild(divCSSDeclaration);

    divFAUnicodeTitle = document.createElement("div");
    divFAUnicodeTitle.innerText = "FA Unicode Values";
    document.body.appendChild(divFAUnicodeTitle);

    divFAUnicode = document.createElement("div");
    divFAUnicode.id = "divFAUnicode";
    divFAUnicode.style.backgroundColor = codebgcolor;
    divFAUnicode.style.fontFamily = codefont;
    divFAUnicode.style.marginLeft = marginleft;
    document.body.appendChild(divFAUnicode);

    divGlyphhangerTitle = document.createElement("div");
    divGlyphhangerTitle.innerText = "Glyphhanger Unicode Values";
    document.body.appendChild(divGlyphhangerTitle);

    divGlyphhangerUnicode = document.createElement("div");
    divGlyphhangerUnicode.id = "divGlyphhangerUnicode";
    divGlyphhangerUnicode.style.backgroundColor = codebgcolor;
    divGlyphhangerUnicode.style.fontFamily = codefont;
    divGlyphhangerUnicode.style.marginLeft = marginleft;
    document.body.appendChild(divGlyphhangerUnicode);
}

function getUnicodeByName(iconName)
{
    const objElement = document.createElement('i');
    objElement.className = iconName;
    document.body.appendChild(objElement);
    const objStyles = window.getComputedStyle(objElement);
    const faUnicode = objStyles.getPropertyValue('--fa');
    console.log(iconName + ": " + faUnicode);
    return faUnicode;
}

function getFAList(strClassName)
{
    //console.log(strClassName);
    const elements = document.querySelectorAll(`.${strClassName}`);

    document.getElementById("divCSSDeclaration").insertAdjacentHTML('beforeend', "<br/>/*" + strClassName + "*/ <br/>");
    document.getElementById("divGlyphhangerUnicode").insertAdjacentHTML('beforeend', "<br/>" + strClassName + ": "); 

    let arrFACSSDecl = [];

    elements.forEach(element => {
      console.log(element);
      
      //get element styles
      const objStyles = window.getComputedStyle(element); //CSSStyleDeclaration
      //console.log(objStyles);
      
      //get --fa value
      const strFAUnicode = objStyles.getPropertyValue('--fa');
      console.log(strFAUnicode);
      //arrFACSSDecl.push(strFAUnicode);
      
      //Glphhanger unicode values
      const strGlyphhangerCode = "U+" + strFAUnicode.substring(2, strFAUnicode.length - 1);
      document.getElementById("divGlyphhangerUnicode").insertAdjacentHTML('beforeend', strGlyphhangerCode.toUpperCase() + ",");
      

      element.classList.forEach(clElement => {
        console.log(clElement);
        if ((clElement != strClassName) && (clElement != "fa-fw") && (clElement != "fa-2xl") && (clElement != "fa-2xs") && (clElement != "fa-xl") && (clElement.includes("fa-") == true))
        {
            if ((strClassName == "fa-solid" && clElement == "fa-duotone") || (strClassName == "fa-duotone" && clElement == "fa-solid"))
            {
                //do not process multiple fa styles
            }
            else
            {
                //console.log(clElement);

                //Define FA CSS Declaration
                const strCSSDeclaration = "." + clElement + " { --fa: " + strFAUnicode + "; } ";
                //console.log(strCSSDeclaration);
                arrFACSSDecl.push(strCSSDeclaration);
            }
        }
      });
          
      //console.log(strFAUnicode);
      document.getElementById("divFAUnicode").insertAdjacentHTML('beforeend', strFAUnicode + "<br/>");

    });

    //remove duplicates
    const arrFACSSDeclUnique = Array.from(new Set(arrFACSSDecl));

    arrFACSSDeclUnique.sort();
    console.log(arrFACSSDeclUnique.length);
    for (const styledecl of arrFACSSDeclUnique) {
      //console.log(styledecl);
      document.getElementById("divCSSDeclaration").insertAdjacentHTML('beforeend', styledecl + "<br/>");
    }

    //console.log("exiting function");
}

init();
getFAList("fa-solid");
getFAList("fa-duotone");
getFAList("fa-regular");
getFAList("fa-brands");

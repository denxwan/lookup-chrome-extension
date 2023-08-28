document.getElementById("copyButton").addEventListener("click", buttonClicked);
document.getElementById("articleCode").addEventListener("click", buttonClicked);
document.addEventListener("DOMContentLoaded", loadLink, false);

var publicURL;
var textArray= [];

function loadLink() {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        publicURL = url;
        
        try {
            linkValidation(publicURL);
            if (textArray[5]!=null)
            {
                document.getElementById("articleCode").innerHTML = textArray[5];
                document.getElementById("buttonSpace").style.display = "block";
            }
            else {
                throw "Code not found!"
            }
        }
        catch (err)
        {
            document.getElementById("articleCode").innerHTML = err;
            document.getElementById("articleCode").disabled = true;
            document.getElementById("articleCode").style.cursor = "default";
            document.getElementById("buttonSpace").style.display = "none";
        }

        console.log(url);
    });
}

function linkValidation(link){
    if (link.match(/woolworths.com.au/)!=null && link.match(/shop/)!=null && link.match(/productdetails/)!=null)
    {
        textArray = link.split("/");
    }
    else {
        alert("Not a proper woolsworths page.")
    }
}

async function buttonClicked() {
    try {
        if(document.getElementById("articleCode").disabled!=true)
        {
            await copyToClipboard(textArray[5]);
            alert("Article code copied! " + textArray[5]);
        }
    } catch(error) {
        console.error(error);
    }
}

async function copyToClipboard(textToCopy) {
    // Navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
    } else {
        // Use the 'out of viewport hidden text area' trick
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
            
        // Move textarea out of the viewport so it's not visible
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
            
        document.body.prepend(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (error) {
            console.error(error);
        } finally {
            textArea.remove();
        }
    };
}


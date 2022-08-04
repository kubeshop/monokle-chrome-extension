const targetHost = "https://saas.monokle.io/explore/github/";

function findDefaultBranch() {
    let defaultBranch = document.querySelector('[title="Switch branches or tags"]');
    return defaultBranch ? defaultBranch.textContent.trim() : 'main';
}

function insertMonokleContent() {
    let url = window.location.href.replace('https://github.com/', '');

    let splitUrl = url.split('/').filter(element => element != '');
    let targetUrl = ''

    if( splitUrl.length > 1 ) {
        let owner = splitUrl[0];
        let repo = splitUrl[1];

        if (splitUrl.length === 2) {
            targetUrl = targetHost + owner + "/" + repo + "/branch/" + findDefaultBranch();
        } else if (splitUrl.length > 3 && splitUrl[2] === 'tree') {
            // branch names can contain '/' - thus the join at the end
            targetUrl = targetHost + owner + "/" + repo + "/branch/" + splitUrl.slice(3).join('/')
        }
    }

    if( targetUrl.length > 0 ) {
        let scoreDiv = document.createElement('div');
        scoreDiv.className = 'BorderGrid-cell';
        scoreDiv.innerHTML = "<a target='_monokle' href='" + targetUrl + "'>Explore this branch with Monokle</a>";

        try {
            let repoInfo = document.querySelectorAll('.BorderGrid-row');
            if (repoInfo && repoInfo[1]) {
                let releases = repoInfo[1];
                let parent = releases.parentNode;
                if (parent) {
                    parent.insertBefore(scoreDiv, releases);
                }
            } else {
                console.log("missing node for Monokle insert");
            }
        } catch (error) {
            console.error("Error in Monokle insert: " + error);
        }
    }
}

insertMonokleContent();

// Github updates pages without reloading - simple hack to detect
function checkURLchange() {
    if (window.location.href != oldURL) {
        oldURL = window.location.href;
        insertMonokleContent();
    }
}

var oldURL = window.location.href;
setInterval(checkURLchange, 500);

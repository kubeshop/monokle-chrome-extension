const targetHost = "https://saas.monokle.io/explore/github/";

function findCurrentBranch() {
    let defaultBranch = document.querySelector('[title="Switch branches or tags"]');
    return defaultBranch ? defaultBranch.textContent.trim() : 'main';
}

function insertMonokleContent() {
    let url = window.location.href.replace('https://github.com/', '');

    let splitUrl = url.split('/').filter(element => element != '');
    let targetUrl = ''
    let mode = 'explore';

    if (splitUrl.length > 1) {
        let owner = splitUrl[0];
        let repo = splitUrl[1];

        let currentBranch = findCurrentBranch();
        let branchPaths = currentBranch.split;

        if (splitUrl.length === 2) {
            targetUrl = targetHost + owner + "/" + repo + "/branch/" + currentBranch;
        } else if (splitUrl.length > 3 && splitUrl[2] === 'tree') {
            // branch names can contain '/' - thus the join at the end
            targetUrl = targetHost + owner + "/" + repo + "/branch/" + currentBranch;
            if (splitUrl.length > 2 + branchPaths.length) {
                targetUrl += "?view=explorer&f=" + encodeURIComponent(splitUrl.slice(2 + branchPaths.length).join('/'))
                mode = 'folder'
            }
        } else if (splitUrl.length > 4 && splitUrl[2] === 'blob') {
            mode = 'file';
            targetUrl = targetHost + owner + "/" + repo + "/branch/" + currentBranch + "?view=explorer&f=" + encodeURIComponent(splitUrl.slice(2 + branchPaths.length).join('/'))
        }

        console.log("Create targetURL " + targetUrl + " from ", splitUrl);
    }

    if (targetUrl.length > 0) {
        if (mode === 'explore') {
            // make sure we don't already have a link
            let existing = document.querySelectorAll('#monokle-info-insert');
            if (!existing || existing.length === 0) {
                let gridDiv = document.createElement('div');
                gridDiv.className = 'BorderGrid-cell';
                gridDiv.id = 'monokle-info-insert';
                gridDiv.innerHTML = "<h2 class=\"mb-3 h4\">Monokle</h2><p><a href=''>Learn more about all your Monokle Plug-in features</a> - " +
                    "how to explore, validate and preview your yamls, including Helm & Customize, " +
                    "compare your PR to original branches and more.</p>";

                try {
                    let repoInfo = document.querySelectorAll('.BorderGrid-row');
                    if (repoInfo && repoInfo[1]) {
                        let releases = repoInfo[1];
                        let parent = releases.parentNode;
                        if (parent) {
                            parent.insertBefore(gridDiv, releases);
                        }
                    } else {
                        console.log("missing node for Monokle insert");
                    }
                } catch (error) {
                    console.error("Error in Monokle insert: " + error);
                }
            }
        }

        // make sure we don't already have a link
        let existing = document.querySelectorAll('#monokle-browse-insert');
        if (existing && existing.length > 0) {
            return;
        }

        let innerDivClass = mode === 'explore' ? 'btn ml-2 d-none d-md-block' : 'btn mr-2 d-none d-md-block';

        let linkDiv = document.createElement('span');
        linkDiv.id = 'monokle-browse-insert';
        linkDiv.innerHTML = "<a class='" + innerDivClass + "' target='_monokle' href='" + targetUrl + "'>Monokle Explore</a>";

        if (mode === 'explore') {
            try {
                let fileNavigationDivs = document.querySelectorAll('.file-navigation > div');
                if (fileNavigationDivs && fileNavigationDivs.length > 0) {
                    let fileNavigation = fileNavigationDivs[0].parentNode;
                    fileNavigation.insertBefore(linkDiv, fileNavigationDivs[fileNavigationDivs.length - 1].nextSibling);
                } else {
                    console.log("missing node for Monokle insert");
                }
            } catch (error) {
                console.error("Error in Monokle insert: " + error);
            }
        } else if (mode === 'file') {
            try {
                let blobPathNode = document.querySelectorAll('#blob-path');
                if (blobPathNode && blobPathNode.length > 0) {
                    let fileNavigation = blobPathNode[0].parentNode;
                    fileNavigation.insertBefore(linkDiv, blobPathNode[blobPathNode.length - 1].nextSibling);
                } else {
                    console.log("missing node for Monokle insert");
                }
            } catch (error) {
                console.error("Error in Monokle insert: " + error);
            }
        } else if (mode === 'folder') {
            try {
                let fileNavigationDivs = document.querySelectorAll('.file-navigation > div');
                if (fileNavigationDivs && fileNavigationDivs.length > 0) {
                    let fileNavigation = fileNavigationDivs[0].parentNode;
                    fileNavigation.insertBefore(linkDiv, fileNavigationDivs[fileNavigationDivs.length - 1]);
                } else {
                    console.log("missing node for Monokle insert");
                }
            } catch (error) {
                console.error("Error in Monokle insert: " + error);
            }
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

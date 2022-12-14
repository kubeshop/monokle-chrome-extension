const targetHost = "https://app.monokle.com/explore/github/";

const svg = '<svg style="vertical-align: middle; margin-bottom: 3px; margin-right: 3px" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M0 8C0 12.4082 3.59184 16 8 16C12.4082 16 16 12.4082 16 8C16 3.59184 12.4082 0 8 0C3.56851 0 0 3.56851 0 8ZM3.56851 7.09038C3.56851 10.0292 5.94752 12.4315 8.90962 12.4315C11.8484 12.4315 14.2507 10.0525 14.2507 7.09038C14.2507 4.12828 11.8717 1.74927 8.90962 1.74927C5.94752 1.77259 3.56851 4.1516 3.56851 7.09038Z" fill="#24292F"/>' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M8.8864 12.8047C5.73772 12.8047 3.17212 10.2391 3.17212 7.09038C3.17212 3.9417 5.73772 1.3761 8.8864 1.3761C12.0351 1.3761 14.6007 3.9417 14.6007 7.09038C14.6007 10.2624 12.0351 12.8047 8.8864 12.8047ZM8.8864 12.4315C5.94763 12.4315 3.5453 10.0525 3.5453 7.09038C3.5453 4.15161 5.92431 1.74928 8.8864 1.74928C11.8485 1.74928 14.2275 4.12828 14.2275 7.09038C14.2275 10.0525 11.8252 12.4315 8.8864 12.4315Z" fill="#24292F"/>' +
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C3.59184 16 0 12.4082 0 8C0 3.59184 3.56851 0 8 0C12.4315 0 16 3.56851 16 8C16 12.4082 12.4315 15.9767 8 16ZM8 15.6035C3.87172 15.6035 0.373178 12.105 0.373178 7.97668C0.373178 3.8484 3.87172 0.373178 8 0.373178C12.1283 0.373178 15.6268 3.87172 15.6268 7.97668C15.6268 12.0816 12.1283 15.6035 8 15.6035Z" fill="#24292F"/> </svg>' +
    ''

// extract the selected branch from the current page - defaults to 'main'
function findCurrentBranch() {
    let defaultBranch = document.querySelector('[title="Switch branches or tags"]');
    return defaultBranch ? defaultBranch.textContent.trim() : 'main';
}

// insert text block to right of repository listing
function insertExplorePanel() {
    // make sure we don't already have a link
    let existing = document.querySelectorAll('#monokle-info-insert');
    if (existing && existing.length > 0) {
        return;
    }

    let gridDiv = document.createElement('div');
    gridDiv.className = 'BorderGrid-cell';
    gridDiv.id = 'monokle-info-insert';
    gridDiv.innerHTML = "<h2 class=\"mb-3 h4\">" + svg + " Monokle</h2><p><a target='_blank' href='https://monokle.io'>Learn more about all Monokle features</a> - " +
        "how to explore, compare, validate and preview your Kubernetes yamls, including Helm & Kustomize, " +
        "compare your branches and PRs, and much more.</p>";

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

// insert button to explore a repo in the navigation bar
function insertExploreRepoButton(linkDiv) {
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
}

// insert button to explore a specific file in the navigation bar
function insertExloreFileButton(linkDiv) {
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
}

// insert button to explore a folder in the navigation bar
function insertExploreFolderButton(linkDiv) {
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

// only allow exploration of yaml files for now
function isExplorableFile(blobPath) {
    if (blobPath) {
        let path = blobPath.toLowerCase();
        return path.endsWith(".yaml") || path.endsWith(".yml")
    }
    return false;
}

// check if the current repo is private
function isPrivateRepo() {
    let lockIcon = document.querySelectorAll('#repository-container-header .octicon-lock');
    return lockIcon && lockIcon.length > 0;
}

// main method that insert Monokle content
function insertMonokleContent() {
    // private repos not supported for now
    if( isPrivateRepo() ){
        return;
    }

    let url = window.location.href.replace('https://github.com/', '');

    let splitUrl = url.split('/').filter(element => element != '');
    let targetUrl = ''
    let mode = 'explore';
    let subject = 'repository';
    let blobPath = '';

    // identify which page we're on and create corresponding targetUrl
    if (splitUrl.length > 1) {
        let owner = splitUrl[0];
        let repo = splitUrl[1];

        let currentBranch = findCurrentBranch();
        let branchPaths = currentBranch.split;

        // repo level
        if (splitUrl.length === 2) {
            targetUrl = targetHost + owner + "/" + repo + "/branch/" + currentBranch;
        }
        // browsing tree
        else if (splitUrl.length > 3 && splitUrl[2] === 'tree') {
            // branch names can contain '/' - thus the join at the end
            targetUrl = targetHost + owner + "/" + repo + "/branch/" + currentBranch;
            if (splitUrl.length > 2 + branchPaths.length) {
                mode = 'folder'
                subject = 'folder'
                blobPath = splitUrl.slice(2 + branchPaths.length).join('/');
                targetUrl += "?view=explorer&f=" + encodeURIComponent(blobPath);
            }
        }
        // looking at specific file
        else if (splitUrl.length > 4 && splitUrl[2] === 'blob') {
            mode = 'file';
            subject = 'file';
            blobPath = splitUrl.slice(2 + branchPaths.length).join('/');

            let monokleView = 'explorer'

            // special handling for specific files
            if( blobPath.toLowerCase().endsWith('/chart.yaml')){
                monokleView = 'helm';
                subject = 'Helm chart'
            }
            else if( blobPath.toLowerCase().endsWith('/kustomization.yaml')){
                monokleView = 'kustomize';
                subject = 'kustomization';
            }

            targetUrl = targetHost + owner + "/" + repo + "/branch/" + currentBranch + "?view=" + monokleView + "&f=" +
                encodeURIComponent(blobPath)
        }
    }

    // identified targetUrl?
    if (targetUrl.length > 0) {
        if (mode === 'explore') {
            insertExplorePanel();
        }

        // make sure we don't already have a link
        let existing = document.querySelectorAll('#monokle-browse-insert');
        if (existing && existing.length > 0) {
            return;
        }

        // different styles based on which mode we're in
        let innerDivClass = mode === 'explore' ? 'btn ml-2 d-none d-md-block' : 'btn mr-2 d-none d-md-block';

        // create link div
        let linkDiv = document.createElement('span');
        linkDiv.id = 'monokle-browse-insert';
        linkDiv.innerHTML = "<a title='Explore this " + subject + " with Monokle' class='" + innerDivClass +
            "' target='_monokle' href='" + targetUrl + "'>" + svg + " Explore</a>";

        if (mode === 'explore') {
            insertExploreRepoButton(linkDiv);
        } else if (mode === 'file' && isExplorableFile(blobPath)) {
            insertExloreFileButton(linkDiv);
        } else if (mode === 'folder') {
            insertExploreFolderButton(linkDiv);
        }
    }
}

// insert content
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

function getBlob(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (xhr.status === 200) {
            cb(xhr.response);
        }
    };
    xhr.send();
}
function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");

        var body = document.querySelector("body");

        link.href = window.URL.createObjectURL(blob);

        link.download = filename;

        // fix Firefox

        link.style.display = "none";

        body.appendChild(link);

        link.click();

        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
    }
}
function download(url, filename) {
    getBlob(url, function (blob) {
        saveAs(blob, filename);
    });
}
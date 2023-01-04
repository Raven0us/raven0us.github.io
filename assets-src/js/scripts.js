class BidiDev {
    init() {
        this._initForm();
        this._initPills();
    }

    /**
     *
     * @private
     */
    _initForm() {
        window.addEventListener("DOMContentLoaded", function () {
            let form = document.getElementById("contact-form");
            let button = document.getElementById("contact-form-button");
            let status = document.getElementById("contact-form-status");

            function success() {
                form.reset();
                // noinspection JSValidateTypes
                button.style = "display: none;";
                status.innerHTML = "Thanks!";
            }

            function error() {
                status.innerHTML = "Oops! There was a problem.";
            }

            form.addEventListener("submit", function (ev) {
                ev.preventDefault();
                let data = new FormData(form);
                ajax(form.method, form.action, data, success, error);
            });
        });

        function ajax(method, url, data, success, error) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== XMLHttpRequest.DONE) return;
                if (xhr.status === 200) {
                    success(xhr.response, xhr.responseType);
                } else {
                    error(xhr.status, xhr.response, xhr.responseType);
                }
            };
            xhr.send(data);
        }
    }

    /**
     *
     * @private
     */
    _initPills() {
        // see StackOverflow quota
        // this.renewExcerpts();
    }

    renewExcerpts() {
        let nodeLists = document.querySelectorAll('.pill-ctn'), self = this;

        nodeLists.forEach(nodeList => {
            self._fetchExcerpts(nodeList).then(result => {
                nodeList.innerHTML = result
            });
        })
    }

    /**
     *
     * @param nodeList
     * @returns {Promise<any>}
     */
    _fetchExcerpts(nodeList) {
        let stackOverflowEndpoint = `https://api.stackexchange.com/2.2/tags/[tag_placeholder]/wikis?site=stackoverflow`;

        let pills = nodeList.innerText.split(', ');

        let formattedEndpoint = stackOverflowEndpoint.replace('[tag_placeholder]', pills.join(';'));

        let markup = '';
        return fetch(formattedEndpoint)
            .then(response => response.json())
            .then(result => {
                console.warn(result);
                if (!result.hasOwnProperty('items')) return;
                if (result.items.length === 0) return;

                let remappedPills = {};
                result.items.map(rawItem => {
                    if (!rawItem.hasOwnProperty('tag_name')) return;
                    if (!rawItem.hasOwnProperty('excerpt')) return;

                    remappedPills[rawItem.tag_name] = rawItem.excerpt;
                });

                pills.forEach(pill => {
                    if (!remappedPills.hasOwnProperty(pill)) return;
                    let excerpt = remappedPills[pill];

                    markup += `
<div class="pill">
    <div class="pill-name">${pill}</div>
    <div class="pill-excerpt">${excerpt}</div>
</div>
`
                });

                return new Promise(resolve => {
                    resolve(markup);
                })
            });
    }
}

let bidiDev = new BidiDev();
bidiDev.init();

window.bidiDev = bidiDev;
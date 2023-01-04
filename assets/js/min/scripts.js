"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BidiDev = /*#__PURE__*/function () {
  function BidiDev() {
    _classCallCheck(this, BidiDev);
  }

  _createClass(BidiDev, [{
    key: "init",
    value: function init() {
      this._initForm();

      this._initPills();
    }
    /**
     *
     * @private
     */

  }, {
    key: "_initForm",
    value: function _initForm() {
      window.addEventListener("DOMContentLoaded", function () {
        var form = document.getElementById("contact-form");
        var button = document.getElementById("contact-form-button");
        var status = document.getElementById("contact-form-status");

        function success() {
          form.reset(); // noinspection JSValidateTypes

          button.style = "display: none;";
          status.innerHTML = "Thanks!";
        }

        function error() {
          status.innerHTML = "Oops! There was a problem.";
        }

        form.addEventListener("submit", function (ev) {
          ev.preventDefault();
          var data = new FormData(form);
          ajax(form.method, form.action, data, success, error);
        });
      });

      function ajax(method, url, data, success, error) {
        var xhr = new XMLHttpRequest();
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

  }, {
    key: "_initPills",
    value: function _initPills() {// see StackOverflow quota
      // this.renewExcerpts();
    }
  }, {
    key: "renewExcerpts",
    value: function renewExcerpts() {
      var nodeLists = document.querySelectorAll('.pill-ctn'),
          self = this;
      nodeLists.forEach(function (nodeList) {
        self._fetchExcerpts(nodeList).then(function (result) {
          nodeList.innerHTML = result;
        });
      });
    }
    /**
     *
     * @param nodeList
     * @returns {Promise<any>}
     */

  }, {
    key: "_fetchExcerpts",
    value: function _fetchExcerpts(nodeList) {
      var stackOverflowEndpoint = "https://api.stackexchange.com/2.2/tags/[tag_placeholder]/wikis?site=stackoverflow";
      var pills = nodeList.innerText.split(', ');
      var formattedEndpoint = stackOverflowEndpoint.replace('[tag_placeholder]', pills.join(';'));
      var markup = '';
      return fetch(formattedEndpoint).then(function (response) {
        return response.json();
      }).then(function (result) {
        console.warn(result);
        if (!result.hasOwnProperty('items')) return;
        if (result.items.length === 0) return;
        var remappedPills = {};
        result.items.map(function (rawItem) {
          if (!rawItem.hasOwnProperty('tag_name')) return;
          if (!rawItem.hasOwnProperty('excerpt')) return;
          remappedPills[rawItem.tag_name] = rawItem.excerpt;
        });
        pills.forEach(function (pill) {
          if (!remappedPills.hasOwnProperty(pill)) return;
          var excerpt = remappedPills[pill];
          markup += "\n<div class=\"pill\">\n    <div class=\"pill-name\">".concat(pill, "</div>\n    <div class=\"pill-excerpt\">").concat(excerpt, "</div>\n</div>\n");
        });
        return new Promise(function (resolve) {
          resolve(markup);
        });
      });
    }
  }]);

  return BidiDev;
}();

var bidiDev = new BidiDev();
bidiDev.init();
window.bidiDev = bidiDev;
/*! Globo Share - v1.0.0 - 2014-06-18
* Copyright (c) 2014 Time Core; Licensed MIT */
if (window.glb === undefined) {
    window.glb = {};
}

(function (window, document) {
    'use strict';

    // function preventDefault(e) {
    //     if (e && e.preventDefault) {
    //         e.preventDefault();
    //     } else if (window.event) {
    //         window.event.returnValue = false;
    //     }
    // }

    // function stopPropagation(e) {
    //     if (e && e.stopPropagation) {
    //         e.stopPropagation();
    //     }
    // }

    // function addEventListener(element, event, handler) {
    //     if (element.addEventListener) {
    //         return element.addEventListener(event, handler, false);
    //     }
    //     if (element.attachEvent) {
    //         return element.attachEvent('on' + event, handler);
    //     }
    // }

    glb.share = {
        init: function init(options) {
            this.mergeOptions(options);
            this.containers = document.querySelectorAll(this.selector);
            this.createBars();

            console.log(window);
        },

        mergeOptions: function mergeOptions(options) {
            var self = this,
                defaultOptions = {
                // Selector to open lightbox
                selector: '.glb-share',
                networks: {
                    'facebook': self.createFacebookButton
                },
                // theme: 'dark',

                // Callbacks
                // onCreateHTMLStructure: function(){},
            };

            if (!options) {
                options = {};
            }

            for (var option in defaultOptions) {
                this[option] = options[option] || defaultOptions[option];
            }
        },

        createBars: function createBars() {
            var items = this.containers,
                element = 0;

            for (element = 0; element < items.length; element++) {
                this.createBar(items[element]);
            }
        },

        createBar: function createBar(element) {
            var network = '',
                wrapper = document.createElement('div');

            wrapper.className = 'glb-share-wrapper';
            element.appendChild(wrapper);

            for (network in this.networks) {
                this.networks[network](wrapper);
            }
        },

        createFacebookButton: function createFacebookButton(wrapper) {
            var facebookContainer = document.createElement('div');
            facebookContainer.className = "share-facebook";
            wrapper.appendChild(facebookContainer);

            return facebookContainer;
        }
    };

}(window, document));

/*! Globo Share - v1.0.0 - 2014-06-23
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
            var network = '';

            for (network in this.networks) {
                this.networks[network](element);
            }
        },

        getMetadataFromElement: function getMetadataFromElement(element) {
            var encode = window.encodeURIComponent,
                data = {
                'url': encode(element.getAttribute('data-url') || ''),
                'title': encode(element.getAttribute('data-title') || ''),
                'subtitle': encode(element.getAttribute('data-subtitle') || ''),
                'imageUrl': encode(element.getAttribute('data-image-url') || '')
            };
            return data;
        },

        createButton: function createButton(container, className, content) {
            var shareContainer = document.createElement('div');
            shareContainer.className = className;
            shareContainer.innerHTML = content;

            container.appendChild(shareContainer);
        },

        createFacebookButton: function createFacebookButton(container) {
            var data = this.getMetadataFromElement(container);

            this.createButton(container, "share-facebook", [
                '<a class="share-popup" href="http://www.facebook.com/sharer/sharer.php?u=' + data['url'] + '" title="compartilhar facebook">',
                '   <span>recomendar</span>',
                '</a>'
            ].join(""));
        },

        createTwitterButton: function createTwitterButton(container) {
            var data = this.getMetadataFromElement(container);

            this.createButton(container, "share-twitter", [
                '<a class="share-popup" href="https://twitter.com/share?url=' + data['url'] + '&amp;text=' + data['title'] + '%20%23globo.com" title="compartilhar twitter">',
                '   <span>tweetar</span>',
                '</a>'
            ].join(""));
        },

        createGoogleButton: function createGoogleButton(container) {
            var data = this.getMetadataFromElement(container);

            this.createButton(container, "share-googleplus", [
                '<a class="share-popup" href="https://plus.google.com/share?url=' + data['url'] + '" title="compartilhar google+">',
                '   <span>google+</span>',
                '</a>'
            ].join(""));
        },

        createPinterestButton: function createPinterestButton(container) {
            var data = this.getMetadataFromElement(container);

            this.createButton(container, "share-pinterest", [
                '<a class="share-popup" href="http://www.pinterest.com/pin/create/button/?url=' + data['url'] + '&amp;media=' + data['imageUrl'] + '&amp;description=' + data['title'] + '" title="compartilhar pinterest">',
                '   <span>pinterest</span>',
                '</a>'
            ].join(""));
        },

        createWhatsappButton: function createWhatsappButton(container) {
            var data = this.getMetadataFromElement(container);

            this.createButton(container, "share-whatsapp", [
                '<a class="share-popup" href="whatsapp://send?text=' + data['title'] + '%20' + data['url'] + '" title="compartilhar whatsapp">',
                '   <span>whatsapp</span>',
                '</a>'
            ].join(""));
        },
    };

}(window, document));

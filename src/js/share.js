/*global glb */
if (window.glb === undefined) {
    window.glb = {};
}

(function (window, document) {
    'use strict';

    function preventDefault(e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        } else if (window.event) {
            window.event.returnValue = false;
        }
    }

    function addEventListener(element, event, handler) {
        if (element.addEventListener) {
            return element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            return element.attachEvent('on' + event, function() {handler.call(element);});
        }
    }

    glb.share = {
        init: function init(options) {
            this.mergeOptions(options);
            this.createSVG();
            this.containers = document.querySelectorAll(this.selector);
            this.createBars();
            this.bindOpenPopup();
        },

        mergeOptions: function mergeOptions(options) {
            var self = this,
                defaultOptions = {
                // Selector to open lightbox
                selector: '.glb-share',
                classPopup: 'share-popup',
                networks: {
                    'facebook': self.createFacebookButton,
                    'twitter': self.createTwitterButton,
                    'google': self.createGoogleButton,
                    'pinterest': self.createPinterestButton,
                    'whatsapp': self.createWhatsappButton,
                    'email': self.createEmailButton
                },
                theme: 'natural',

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

        createBar: function createBar(element, networks) {
            var network = '',
                theme = ' share-theme-',
                count = 0,
                result = false;

            networks = networks || this.networks;

            for (network in networks) {
                result = networks[network].call(this, element);

                if (result !== false) {
                    count += 1;
                }

                if (count === 6) {
                    break;
                }
            }

            theme += element.getAttribute('data-theme') || this.theme;
            element.className += " glb-share-container" + theme;
        },

        bindOpenPopup: function bindOpenPopup() {
            var linksPopup = document.querySelectorAll("." + this.classPopup);

            for (var i=0; i < linksPopup.length; i++) {
                addEventListener(linksPopup[i], 'click', this.openPopup);
            }
        },

        openPopup: function openPopup(e) {
            var win = window.open(
                this.getAttribute("href"),
                'popup',
                'height=400,width=500,left=10,top=10,resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no'
            );

            win.focus();
            preventDefault(e);
        },

        getMetadataFromElement: function getMetadataFromElement(element) {
            var encode = window.encodeURIComponent,
                data = {
                'url': encode(element.getAttribute('data-url') || ''),
                'title': encode(element.getAttribute('data-title') || ''),
                'imageUrl': encode(element.getAttribute('data-image-url') || '')
            };
            return data;
        },

        deviceIsIphone: function deviceIsIphone() {
            return navigator.userAgent.match(/iPhone/i) !== null;
        },

        isBigScreen: function isBigScreen() {
            return window.outerWidth >= 768;
        },

        createButton: function createButton(container, className, content) {
            var shareContainer = document.createElement('div');
            shareContainer.className = className;
            shareContainer.innerHTML = content;

            container.appendChild(shareContainer);
            return shareContainer;
        },

        createFacebookButton: function createFacebookButton(container) {
            var data = this.getMetadataFromElement(container);

            this.createButton(container, "share-button share-facebook", [
                '<a class="' + this.classPopup + '" href="http://www.facebook.com/sharer/sharer.php?u=' + data['url'] + '" title="compartilhar facebook">',
                '   <svg viewBox="0 0 100 100" class="share-icon">',
                '       <use xlink:href="#icon-facebook"></use>',
                '   </svg>',
                '   <span>facebook</span>',
                '</a>'
            ].join(""));
        },

        createTwitterButton: function createTwitterButton(container) {
            var data = this.getMetadataFromElement(container);

            this.createButton(container, "share-button share-twitter", [
                '<a class="' + this.classPopup + '" href="https://twitter.com/share?url=' + data['url'] + '&amp;text=' + data['title'] + '%20%23globo.com" title="compartilhar twitter">',
                '   <svg viewBox="0 0 100 100" class="share-icon">',
                '       <use xlink:href="#icon-twitter"></use>',
                '   </svg>',
                '   <span>twitter</span>',
                '</a>'
            ].join(""));
        },

        createGoogleButton: function createGoogleButton(container) {
            var data = this.getMetadataFromElement(container);

            this.createButton(container, "share-button share-googleplus", [
                '<a class="' + this.classPopup + '" href="https://plus.google.com/share?url=' + data['url'] + '" title="compartilhar google+">',
                '   <svg viewBox="0 0 100 100" class="share-icon">',
                '       <use xlink:href="#icon-googleplus"></use>',
                '   </svg>',
                '   <span>google+</span>',
                '</a>'
            ].join(""));
        },

        createPinterestButton: function createPinterestButton(container) {
            var data = this.getMetadataFromElement(container);

            this.createButton(container, "share-button share-pinterest", [
                '<a class="' + this.classPopup + '" href="http://www.pinterest.com/pin/create/button/?url=' + data['url'] + '&amp;media=' + data['imageUrl'] + '&amp;description=' + data['title'] + '" title="compartilhar pinterest">',
                '   <svg viewBox="0 0 100 100" class="share-icon">',
                '       <use xlink:href="#icon-pinterest"></use>',
                '   </svg>',
                '   <span>pinterest</span>',
                '</a>'
            ].join(""));
        },

        createWhatsappButton: function createWhatsappButton(container) {
            if (!this.deviceIsIphone()) {
                return false;
            }

            var data = this.getMetadataFromElement(container);

            this.createButton(container, "share-button share-whatsapp", [
                '<a href="whatsapp://send?text=' + data['title'] + '%20' + data['url'] + '" title="compartilhar whatsapp">',
                '   <svg viewBox="0 0 100 100" class="share-icon">',
                '       <use xlink:href="#icon-whatsapp"></use>',
                '   </svg>',
                '   <span>whatsapp</span>',
                '</a>'
            ].join(""));
        },

        createEmailButton: function createEmailButton(container) {
            var data = this.getMetadataFromElement(container);

            this.createButton(container, "share-button share-email", [
                '<a href="mailto:?subject=' + data['title'] + '&amp;body=' + data['url'] + '" title="compartilhar email">',
                '   <svg viewBox="0 0 100 100" class="share-icon">',
                '       <use xlink:href="#icon-email"></use>',
                '   </svg>',
                '   <span>email</span>',
                '</a>'
            ].join(""));
        },

        createSVG: function createSVG() {
            var svgContainer = document.createElement('div');
            svgContainer.innerHTML = '[[X_SVG_X]]';
            svgContainer.style.display = 'none';
            document.body.appendChild(svgContainer);
        }
    };

}(window, document));

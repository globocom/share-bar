/*global glb, DocumentTouch */
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
            this.verifyTouch();
            this.supportSvg = this.hasSupportSvg();
            this.createSVG();
            this.mergeOptions(options);
            this.containers = document.querySelectorAll(this.selector);
            this.createBars();
            this.bindOpenPopup();
        },

        // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js
        verifyTouch: function verifyTouch() {
            var html = document.querySelector('html'),
                isTouch = this.isTouch();

            if (isTouch && html.className.indexOf(' touch') === -1) {
                html.className += ' touch';

            } else if (!isTouch && html.className.indexOf(' no-touch') === -1) {
                html.className += ' no-touch';
            }
        },

        isTouch: function isTouch() {
            var bool = false;

            if (window.ontouchstart !== undefined || (window.DocumentTouch && document instanceof DocumentTouch)) {
                bool = true;
            }
            return bool;
        },

        hasSupportSvg: function hasSupportSvg() {
            return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
        },

        createSVG: function createSVG() {
            if (this.supportSvg) {
                var svgContainer = document.createElement('div');
                svgContainer.innerHTML = '[[X_SVG_X]]';
                svgContainer.style.display = 'none';
                document.body.appendChild(svgContainer);
            }
        },

        mergeOptions: function mergeOptions(options) {
            var self = this,
                defaultOptions = {
                // Selector to open lightbox
                selector: '.glb-share',
                classPopup: 'share-popup',
                networks: [
                    self.createFacebookButton,
                    self.createTwitterButton,
                    self.createGoogleButton,
                    self.createPinterestButton,
                    self.createWhatsappButton,
                    self.createEmailButton
                ],
                theme: 'natural',
                buttonWidth: 34,
                buttonFullWidth: 110,
                buttonPadding: 4,
                maxSocialButtons: 6
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
            var theme = ' share-theme-',
                count = 0,
                buttonClasses = [];

            networks = networks || this.networks;
            networks = networks.slice(0, this.maxSocialButtons);

            count = networks.length;
            buttonClasses = this.getButtonsSize(element.offsetWidth, count);

            for (var i = 0; i < count; i++) {
                networks[i].call(this, element, buttonClasses[i]);
            }

            theme += element.getAttribute('data-theme') || this.theme;
            element.className += " glb-share-container" + theme;
        },

        getButtonsSize: function getButtonsSize(containerWidth, numberOfButtons) {
            var fullButtonWidth = this.buttonFullWidth + this.buttonPadding,
                smallButtonWidth = this.buttonWidth + this.buttonPadding,
                isSmallScreen = this.isSmallScreen();

            if ((numberOfButtons * smallButtonWidth) > containerWidth) {
                return this.getButtonsSmall(
                    numberOfButtons, smallButtonWidth, containerWidth
                );
            }

            if (isSmallScreen) {
                return ['', '', '', '', '', ''];
            }

            return this.getButtonsFull(
                numberOfButtons, fullButtonWidth, smallButtonWidth, containerWidth
            );
        },

        getButtonsSmall: function getButtonsSmall(numberOfButtons, smallButtonWidth, containerWidth) {
            var result = [],
                totalOfSmallButtons = 0,
                isSmallScreen = this.isSmallScreen();

            for (var i = 1; i <= numberOfButtons; i++) {
                totalOfSmallButtons = i * smallButtonWidth;

                if (totalOfSmallButtons <= containerWidth) {
                    result[i-1] = isSmallScreen ? '' : ' share-small';
                } else {
                    result[i-1] = ' share-hidden';
                }
            }

            return result;
        },

        getButtonsFull: function getButtonsFull(numberOfButtons, fullButtonWidth, smallButtonWidth, containerWidth) {
            var result = [],
                totalOfFullButtons = 0,
                totalOfSmallButtons = 0;

            for (var i = 1; i <= numberOfButtons; i++) {
                totalOfFullButtons = i * fullButtonWidth;
                totalOfSmallButtons = (numberOfButtons - i) * smallButtonWidth;

                if ((totalOfSmallButtons + totalOfFullButtons) <= containerWidth) {
                    result[i-1] = ' share-full';
                } else {
                    result[i-1] = ' share-small';
                }
            }

            return result;
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

        isSmallScreen: function isSmallScreen() {
            var desktopMinWidth = 768,
                width = window.innerWidth || screen.width;
            return width < desktopMinWidth;
        },

        createButton: function createButton(container, socialNetworkClass, className, url, socialNetworkTitle) {
            var shareContainer = document.createElement('div');
            socialNetworkTitle = socialNetworkTitle || socialNetworkClass;
            shareContainer.className = 'share-button share-' + socialNetworkClass + className;
            shareContainer.innerHTML = [
                '<a class="' + this.classPopup + '" href="' + url + '" title="Compartilhar via ' + socialNetworkTitle + '">',
                this.createContentButton(socialNetworkClass, socialNetworkTitle),
                '</a>'
            ].join("");

            container.appendChild(shareContainer);
            return shareContainer;
        },

        createContentButton: function createContentButton(name, title){
            var iconElement;
            title = title || name;
            if(this.supportSvg) {
                iconElement = [
                    '   <div class="svg-size">',
                    '      <svg viewBox="0 0 100 100" class="share-icon">',
                    '           <use xlink:href="#icon-' + name + '"></use>',
                    '       </svg>',
                    '   </div>',
                    '<span>' + title + '</span>'
                ].join("");

            } else {
                iconElement = [
                    '   <i class="share-font ico-share-' + name + '"></i>',
                    '   <span>' + title + '</span>'
                ].join("");
            }

            return iconElement;
        },

        createFacebookButton: function createFacebookButton(container, buttonClass) {
            var data = this.getMetadataFromElement(container);
            buttonClass = buttonClass || '';

            this.createButton(
                container, 'facebook', buttonClass,
                'http://www.facebook.com/sharer/sharer.php?u=' + data['url']
            );
        },

        createTwitterButton: function createTwitterButton(container, buttonClass) {
            var data = this.getMetadataFromElement(container);
            buttonClass = buttonClass || '';

            this.createButton(
                container, 'twitter', buttonClass,
                'https://twitter.com/share?url=' + data['url'] + '&amp;text=' + data['title'] + '%20%23globo.com'
            );
        },

        createGoogleButton: function createGoogleButton(container, buttonClass) {
            var data = this.getMetadataFromElement(container);
            buttonClass = buttonClass || '';

            this.createButton(
                container, 'googleplus', buttonClass,
                'https://plus.google.com/share?url=' + data['url'],
                'google+'
            );
        },

        createPinterestButton: function createPinterestButton(container, buttonClass) {
            var data = this.getMetadataFromElement(container);
            buttonClass = buttonClass || '';

            this.createButton(
                container, 'pinterest', buttonClass,
                'http://www.pinterest.com/pin/create/button/?url=' + data['url'] + '&amp;media=' + data['imageUrl'] + '&amp;description=' + data['title']
            );
        },

        createWhatsappButton: function createWhatsappButton(container, buttonClass) {
            if (!this.deviceIsIphone()) {
                return false;
            }

            var data = this.getMetadataFromElement(container);
            buttonClass = buttonClass || '';

            this.createButton(
                container, 'whatsapp', buttonClass,
                'whatsapp://send?text=' + data['title'] + '%20' + data['url']
            );
        },

        createEmailButton: function createEmailButton(container, buttonClass) {
            var data = this.getMetadataFromElement(container);
            buttonClass = buttonClass || '';

            this.createButton(
                container, 'email', buttonClass,
                'mailto:?subject=' + data['title'] + '&amp;body=' + data['url'],
                'e-mail'
            );
        }
    };

}(window, document));

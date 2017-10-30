/*global DocumentTouch, FB */

function ShareBar(options) {
    'use strict';
    return this.init(options);
}

(function (window, document) {
    'use strict';

    var FACEBOOK = 'facebook',
        TWITTER = 'twitter',
        WHATSAPP = 'whatsapp',
        GOOGLE = 'google',
        LINKEDIN = 'linkedin',
        PINTEREST = 'pinterest',
        EMAIL = 'email',
        BUTTON_WIDTH = 34,
        BUTTON_FULL_WIDTH = 110,
        BUTTON_PADDING = 4,
        MAX_SOCIAL_BUTTONS = 6,
        SHARE_BUTTON = 'share-button',
        SVG_CONTAINER = 'sharebar-svg-container';

    function preventDefault(e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
    }

    function supportPassiveEvents() {
        if (window === undefined && typeof window.addEventListener === 'function') {
            var support = false,
                noop = Function,
                options = Object.defineProperty({}, 'passive', {
                    get: function () { support = true; }
                });

            window.addEventListener('testPassiveEventSupport', noop, options);
            window.removeEventListener('testPassiveEventSupport', noop, options);
            return support;
        }
    }

    function addEventListener(element, event, handler) {
        var useCapture = supportPassiveEvents() ? { passive: true } : false;
        return element.addEventListener(event, handler, useCapture);
    }

    ShareBar.prototype = {
        init: function init(options) {
            this.activeNetworks = [];
            this.eventName = this.getActionName();
            this.verifyTouch();
            this.createSVG();
            this.mergeOptions(options);
            this.containers = document.querySelectorAll(this.selector);
            this.createBars();
        },

        getActionName: function getActionName() {
            return this.isTouch() ? 'mouseup' : 'click';
        },

        // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js
        verifyTouch: function verifyTouch() {
            var html = document.querySelector('html'),
                isTouch = this.isTouch(),
                touch = ' touch',
                noTouch = ' no-touch';

            if (isTouch && html.className.indexOf(touch) === -1) {
                html.className += touch;

            } else if (!isTouch && html.className.indexOf(noTouch) === -1) {
                html.className += noTouch;
            }
        },

        isTouch: function isTouch() {
            var bool = false;

            if (window.ontouchstart !== undefined || (window.DocumentTouch && document instanceof DocumentTouch)) {
                bool = true;
            }
            return bool;
        },

        createSVG: function createSVG() {
            var hasSvg = document.querySelector('.sharebar-svg-container'),
                svg;

            if (!hasSvg) {
                svg = document.createElement('div');
                svg.innerHTML = '[[X_SVG_X]]';
                svg.classList.add(SVG_CONTAINER);
                svg.style.display = 'none';

                document.body.appendChild(svg);
            }
        },

        mergeOptions: function mergeOptions(options) {
            var option,
                defaultOptions = {
                    // Selector to open lightbox
                    selector: '.share-bar',
                    campaign: 'share-bar',
                    classPopup: 'share-popup',
                    facebookAppId: '',
                    networks: [
                        FACEBOOK, TWITTER, WHATSAPP, GOOGLE, LINKEDIN, PINTEREST, EMAIL
                    ],
                    theme: 'natural',
                    buttonWidth: BUTTON_WIDTH,
                    buttonFullWidth: BUTTON_FULL_WIDTH,
                    buttonPadding: BUTTON_PADDING,
                    maxSocialButtons: MAX_SOCIAL_BUTTONS,
                    context: 'desktop',
                    onCreateBar: function (bar) { return false; },
                    onCreateButton: function (button) { return false; },
                    onShare: function (button) { return false; }
                };

            if (!options) {
                options = {};
            }

            for (option in defaultOptions) {
                if (defaultOptions.hasOwnProperty(option)) {
                    this[option] = options[option] || defaultOptions[option];
                }
            }
        },

        validateNetworks: function validateNetworks(networks) {
            var msg = 'The list of networks passed on initialization is wrong',
                i = 0,
                networkName = '',
                method = '';

            if (Object.prototype.toString.call(networks) !== '[object Array]') {
                throw new Error(msg + ' [Should be an Array]');
            }

            for (i; i < networks.length; i++) {
                if (typeof networks[i] === 'string') {
                    networkName = networks[i];
                    networkName = networkName.substr(0, 1).toUpperCase() + networkName.substr(1);
                    method = ShareBar.prototype['create' + networkName + 'Button'];

                    if (method) {
                        if (this.activeNetworks.indexOf(networks[i]) === -1) {
                            this.activeNetworks.push(networks[i]);
                        }

                        networks[i] = method;
                    } else {
                        throw new Error(msg + ' [Network name "' + networks[i] + '" is wrong, should be ' + FACEBOOK + ' or ' + TWITTER + ' or ' + WHATSAPP + ' or ' + GOOGLE + ' or ' + LINKEDIN + ' or ' + PINTEREST + ' or ' + EMAIL + ']');
                    }

                } else if (typeof networks[i] !== 'function') {
                    throw new Error(msg + ' [Should be string or function]');
                }
            }

            return networks;
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
                i = 0,
                count = 0,
                buttonClasses = [];

            networks = this.validateNetworks(networks || this.networks);
            networks = networks.slice(0, this.maxSocialButtons);

            count = networks.length;
            buttonClasses = this.getButtonsSize(element.offsetWidth, count);

            for (i; i < count; i++) {
                networks[i].call(this, element, buttonClasses[i]);
            }

            theme += element.getAttribute('data-theme') || this.theme;
            element.className += ' share-bar-container' + theme;
            this.bindOpenPopup(element);
            this.bindShare(element);
            this.onCreateBar(element);
        },

        getButtonsSize: function getButtonsSize(containerWidth, numberOfButtons) {
            var fullButtonWidth = this.buttonFullWidth + this.buttonPadding,
                smallButtonWidth = this.buttonWidth + this.buttonPadding,
                isSmallScreen = this.isSmallScreen();

            if ((numberOfButtons * smallButtonWidth) > containerWidth) {
                return this.getButtonsSmall(
                    numberOfButtons,
                    smallButtonWidth,
                    containerWidth
                );
            }

            if (isSmallScreen) {
                return ['', '', '', '', '', ''];
            }

            return this.getButtonsFull(
                numberOfButtons,
                fullButtonWidth,
                smallButtonWidth,
                containerWidth
            );
        },

        getButtonsSmall: function getButtonsSmall(numberOfButtons, smallButtonWidth, containerWidth) {
            var result = [],
                i = 1,
                totalOfSmallButtons = 0,
                isSmallScreen = this.isSmallScreen();

            for (i; i <= numberOfButtons; i++) {
                totalOfSmallButtons = i * smallButtonWidth;

                if (totalOfSmallButtons <= containerWidth) {
                    result[i - 1] = isSmallScreen ? '' : ' share-small';
                } else {
                    result[i - 1] = ' share-hidden';
                }
            }

            return result;
        },

        getButtonsFull: function getButtonsFull(numberOfButtons, fullButtonWidth, smallButtonWidth, containerWidth) {
            var result = [],
                i = 1,
                totalOfFullButtons = 0,
                totalOfSmallButtons = 0;

            for (i; i <= numberOfButtons; i++) {
                totalOfFullButtons = i * fullButtonWidth;
                totalOfSmallButtons = (numberOfButtons - i) * smallButtonWidth;

                if ((totalOfSmallButtons + totalOfFullButtons) <= containerWidth) {
                    result[i - 1] = ' share-full';
                } else {
                    result[i - 1] = ' share-small';
                }
            }

            return result;
        },

        bindOpenPopup: function bindOpenPopup(element) {
            var linksPopup = element.querySelectorAll('.' + this.classPopup),
                i = 0,
                self = this,
                onShareClick = function (e) {
                    self.openPopup.call(this, e);
                };

            for (i; i < linksPopup.length; i++) {
                addEventListener(linksPopup[i], this.eventName, onShareClick);
                addEventListener(linksPopup[i], 'click', preventDefault);
            }
        },

        bindShare: function bindShare(element) {
            var shareButtons = element.querySelectorAll('.' + SHARE_BUTTON),
                i = 0,
                self = this,
                onShareClick = function (e) {
                    self.onShare(this);
                };

            for (i; i < shareButtons.length; i++) {
                addEventListener(shareButtons[i], this.eventName, onShareClick);
            }
        },

        openPopup: function openPopup(e) {
            var win = window.open(
                this.getAttribute('href'),
                'popup',
                'height=400,width=500,left=10,top=10,resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no'
            );

            win.focus();
        },

        getMetadataFromElement: function getMetadataFromElement(element) {
            var encode = window.encodeURIComponent,
                url = element.getAttribute('data-url') || '',
                urlToShare,
                splitUrl = url.split('#'),
                queryString = '?utm_source=#source#&utm_medium=share-bar-' + this.context + '&utm_campaign=' + this.campaign;

            if (splitUrl.length > 1) {
                urlToShare = splitUrl[0] + queryString + '&#' + splitUrl[1];
            } else {
                urlToShare = url + queryString;
            }

            return {
                'url': encode(urlToShare),
                'title': encode(element.getAttribute('data-title') || ''),
                'imageUrl': encode(element.getAttribute('data-image-url') || ''),
                'hashtags': encode(element.getAttribute('data-hashtags') || '')
            };
        },

        isSmallScreen: function isSmallScreen() {
            var desktopMinWidth = 768,
                width = window.innerWidth || screen.width;
            return width < desktopMinWidth;
        },

        createButton: function createButton(container, socialNetworkClass, className, url, socialNetworkTitle, openInPage) {
            var shareContainer = document.createElement('div'),
                classPopup = '';
            socialNetworkTitle = socialNetworkTitle || socialNetworkClass;
            className = className || '';
            shareContainer.className = SHARE_BUTTON + ' share-' + socialNetworkClass + className;
            socialNetworkTitle = socialNetworkTitle[0].toUpperCase() + socialNetworkTitle.slice(1);
            url = url.replace('%23source%23', socialNetworkClass);

            if (!openInPage) {
                classPopup = this.classPopup;
            }

            shareContainer.innerHTML = [
                '<a class="' + classPopup + '" href="' + url + '" title="Compartilhar via ' + socialNetworkTitle + '" data-social-network="' + socialNetworkClass + '" target="_blank" rel="external">',
                this.createContentButton(socialNetworkClass, socialNetworkTitle),
                '</a>'
            ].join('');

            container.appendChild(shareContainer);
            this.onCreateButton(shareContainer);

            return shareContainer;
        },

        createContentButton: function createContentButton(name, title) {
            var iconElement;
            title = title || name;

            iconElement = [
                '   <div class="svg-size">',
                '      <svg viewBox="0 0 100 100" class="share-icon">',
                '           <use xlink:href="#icon-' + name + '"></use>',
                '       </svg>',
                '   </div>',
                '<span>' + title + '</span>'
            ].join('');

            return iconElement;
        },

        createFacebookButton: function createFacebookButton(container, buttonClass) {
            var onShare = '',
                button = '',
                data = this.getMetadataFromElement(container),
                url = data.url.replace('%23source%23', FACEBOOK);

            button = this.createButton(
                container,
                FACEBOOK,
                buttonClass,
                'http://www.facebook.com/',
                '',
                true
            );

            this.getFacebookUi();

            onShare = function () {
                var decode = window.decodeURIComponent;

                FB.ui({
                    method: 'feed',
                    display: 'popup',
                    link: decode(url),
                    name: decode(data.title),
                    picture: decode(data.imageUrl)
                });
            };

            addEventListener(button, this.eventName, onShare);
            addEventListener(button, 'click', preventDefault);
        },

        getFacebookUi: function getFacebookUi() {
            var facebookAppId = this.facebookAppId || this.getOgFbAppId();

            if (window.FB) {
                return false;
            }

            if (facebookAppId) {
                window.fbAsyncInit = function () {
                    FB.init({
                        appId: facebookAppId,
                        xfbml: true,
                        version: 'v2.8'
                    });
                };
                (function (d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) { return; }
                    js = d.createElement(s);
                    js.id = id;
                    js.src = "//connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            }

        },

        getOgFbAppId: function () {
            var el = document.querySelector("meta[property='fb:app_id']");

            if (el !== null) {
                return el.getAttribute('content');
            }
            return;
        },

        createTwitterButton: function createTwitterButton(container, buttonClass) {
            var data = this.getMetadataFromElement(container);

            this.createButton(
                container,
                TWITTER,
                buttonClass,
                'https://twitter.com/share?url=' + data.url + '&amp;text=' + data.title + ' ' + data.hashtags
            );
        },

        createGoogleButton: function createGoogleButton(container, buttonClass) {
            var data = this.getMetadataFromElement(container);

            this.createButton(
                container,
                GOOGLE + 'plus',
                buttonClass,
                'https://plus.google.com/share?url=' + data.url,
                GOOGLE + '+'
            );
        },

        createLinkedinButton: function createLinkedinButton(container, buttonClass) {
            var data = this.getMetadataFromElement(container);

            this.createButton(
                container,
                LINKEDIN,
                buttonClass,
                'http://www.linkedin.com/shareArticle?mini=true&url=' + data.url
            );
        },

        createPinterestButton: function createPinterestButton(container, buttonClass) {
            var data = this.getMetadataFromElement(container);

            this.createButton(
                container,
                PINTEREST,
                buttonClass,
                'http://br.pinterest.com/pin/create/button/?url=' + data.url + '&amp;media=' + data.imageUrl + '&amp;description=' + data.title
            );
        },

        createWhatsappButton: function createWhatsappButton(container, buttonClass) {
            var data = this.getMetadataFromElement(container);

            if (!this.isSmallScreen() || !this.isTouch()) {
                return false;
            }

            this.createButton(
                container,
                WHATSAPP,
                buttonClass,
                'whatsapp://send?text=' + data.title + '%20' + data.url,
                '',
                true
            );
        },

        createEmailButton: function createEmailButton(container, buttonClass) {
            var data = this.getMetadataFromElement(container);

            if (!this.isTouch()) {
                return false;
            }

            this.createButton(
                container,
                EMAIL,
                buttonClass,
                'mailto:?subject=' + data.title + '&amp;body=' + data.url,
                'e-mail',
                true
            );
        }
    };

}(window, document));

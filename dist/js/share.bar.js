/*! ShareBar - v3.2.0 - 2018-11-08 - * Copyright (c) 2018 Globo.com; Licensed MIT */
function ShareBar(options) {
    'use strict';
    return this.init(options);
}

(function (window, document) {
    'use strict';

    var FACEBOOK = 'facebook',
        TWITTER = 'twitter',
        WHATSAPP = 'whatsapp',
        TELEGRAM = 'telegram',
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

        destroy: function destroy() {
            this.containers.forEach(function (container) {
                var i = 0, item;

                container.classList.remove('share-bar-container');

                for (i; i < container.classList.length; i++) {
                    item = container.classList.item(i);

                    if (item.indexOf('share-theme') !== -1) {
                        container.setAttribute('data-theme', item.split('-')[2]);
                        container.classList.remove(item);
                    }
                }
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
            });
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
                svg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><symbol viewBox="0 0 500 500" id="icon-email"><title>email</title><path d="M1 387c0 27 23 50 50 50h398c28 0 50-23 50-50V138L300 286c-28 17-70 18-99 0L1 138v249zm228-158c10 5 33 6 42 0 98-71 117-86 209-155-7-6-19-11-31-11H51c-12 0-23 5-31 12l209 154z"/></symbol><symbol viewBox="0 0 500 500" id="icon-facebook"><title>facebook</title><path d="M471 1H29C13 1 1 13 1 29v442c0 16 12 28 28 28h238V306h-65v-75h65v-55c0-65 39-100 97-100 27 0 51 2 58 3v67h-40c-31 0-37 15-37 37v48h74l-10 75h-64v193h126c16 0 28-12 28-28V29c0-16-12-28-28-28z"/></symbol><symbol viewBox="0 0 500 500" id="icon-googleplus"><title>googleplus</title><path d="M333 2H186C88 2 35 47 35 127c0 65 60 109 131 99-17 33 2 57 14 69C82 295 2 338 2 401c0 56 47 97 142 97 102 0 175-56 175-124 0-23-8-43-26-64-32-36-71-46-71-72 0-23 22-34 40-49 27-24 36-54 34-83-3-41-27-65-44-78l37 1 44-27zm-70 364c26 36 7 104-86 104-52 0-117-21-117-81 0-70 103-75 141-75 23 17 46 30 62 52zm-64-162c-45 18-82-10-99-68-15-48-4-94 29-106 44-15 79 10 99 63 21 60 7 95-29 111zm240 10v-59h-35v59h-59v36h59v59h35v-59h60v-36h-60z"/></symbol><symbol viewBox="0 0 500.000000 500.000000" id="icon-linkedin"><title>linkedin</title><path d="M820 4981c-206-44-363-132-520-290-118-119-183-218-236-359-69-183-65-72-62-1867L5 845l28-88c61-196 148-338 287-470C469 145 631 59 825 19 911 1 991 0 2500 0s1589 1 1675 19c195 40 362 129 508 270 138 133 224 274 284 468l28 88v3310l-28 88c-60 194-146 335-284 468-146 141-313 230-508 270-86 18-165 19-1680 18-1494 0-1595-1-1675-18zm667-683c70-26 157-108 193-183 21-43 25-64 25-150 0-122-20-171-105-256-72-73-144-102-252-102-66-1-85 4-141 31-223 110-279 388-115 568 107 116 244 149 395 92zm173-2108V1050h-610v2280h610V2190zm1040 955c0-102 4-185 8-185 5 0 13 10 19 23 40 85 166 195 298 258 125 60 218 81 365 82 149 1 228-16 345-73 212-103 334-268 402-540 14-57 17-168 20-862l4-798h-610l-4 643c-3 576-5 648-21 702-56 190-189 311-356 323-202 14-367-105-439-317l-26-76-3-637-3-638h-609v2280h610v-185z" transform="matrix(.1 0 0 -.1 0 500)"/></symbol><symbol viewBox="0 0 500 500" id="icon-pinterest"><title>pinterest</title><path d="M250 1a248 249 0 0 0-100 476 218 218 0 0 1 4-57l33-135s-8-16-8-39c0-37 21-64 48-64 23 0 34 17 34 37 0 23-15 57-22 88-6 26 13 48 39 48 47 0 79-61 79-132 0-55-37-95-104-95-75 0-122 56-122 119 0 22 6 37 16 49 5 5 5 8 4 14l-5 20c-2 6-7 9-13 6-35-14-51-52-51-95 0-71 60-155 178-155 95 0 157 69 157 142 0 98-54 170-134 170-27 0-52-15-61-31 0 0-15 57-18 68a209 209 0 0 1-25 53 249 249 0 0 0 319-238A249 249 0 0 0 250 1z"/></symbol><symbol viewBox="0 0 26.649 26.649" id="icon-telegram"><title>telegram</title><path d="M26.157 1.238A2.3 2.3 0 0 0 24.31.346c-.478 0-.973.133-1.472.395L1.593 11.88c-1.51.793-1.615 1.987-1.59 2.463.024.479.255 1.654 1.839 2.283L4.557 17.7a4.63 4.63 0 0 0 1.711.309c.098 0 .192-.013.289-.018-.037.048-.082.085-.116.135-.506.757-.531 1.783-.073 2.888a.887.887 0 0 0 .021.051c.803 1.779 1.696 3.787 1.804 4.066a1.828 1.828 0 0 0 1.688 1.172c1.146 0 1.486-.552 3.361-3.604.146-.224.471-.744.526-1.406l.601.242 3.008 1.226c.603.246 1.131.463 1.409.578a1.807 1.807 0 0 0 .937.264c1.368 0 1.696-1.185 1.872-1.82.087-.314.207-.749.336-1.229l4.588-16.858c.346-1.273-.079-2.086-.362-2.458zm-14.43 20.501S10.025 24.51 9.88 24.51c-.004 0-.006-.002-.008-.006-.167-.449-1.849-4.176-1.849-4.176-.31-.747-.254-1.387.279-1.387.117 0 .257.031.421.099l1.306.679c.218.149.456.278.718.381l.066.025.123.062c1.009.534 1.33.727.791 1.552zM24.789 3.224l-4.586 16.858c-.259.95-.475 1.727-.479 1.727-.004-.002-.009-.02-.009-.023 0-.006-.748-.312-1.662-.686l-3.01-1.226c-.914-.37-2.413-.969-3.332-1.323l-.152-.061-.562-.292c-.557-.427-.606-1.131-.046-1.728l9.312-9.971c.374-.399.515-.605.434-.605-.064 0-.271.133-.617.404L8.298 15.592c-.514.401-1.295.625-2.029.625-.376 0-.741-.06-1.052-.183l-2.713-1.073c-.917-.363-.952-1.033-.079-1.493L23.672 2.327c.245-.128.46-.188.638-.188.457 0 .665.4.479 1.085z"/></symbol><symbol viewBox="0 0 500 500" id="icon-twitter"><title>twitter</title><path d="M499 96c-19 8-38 14-59 16 21-12 37-32 45-56-20 12-42 20-65 25a102 102 0 0 0-174 93c-84-5-160-45-210-107a101 101 0 0 0 32 136c-17 0-33-5-47-12v1c0 49 36 90 82 100a102 102 0 0 1-46 2c13 40 51 70 95 70A205 205 0 0 1 1 407c46 29 99 45 157 45a288 288 0 0 0 290-303c20-14 37-32 51-53z"/></symbol><symbol viewBox="0 0 500 500" id="icon-whatsapp"><title>whatsapp</title><path d="M255 1A243 243 0 0 0 46 368L2 498l135-43a245 245 0 0 0 362-212C499 109 389 1 255 1zm0 444c-42 0-80-13-112-34l-78 25 25-75c-24-33-39-74-39-118 0-111 92-201 204-201s203 90 203 201-91 202-203 202zm114-147l-42-22c-5-2-10-3-14 3s-17 19-21 23c-3 4-7 5-13 1-6-3-26-10-49-32-18-17-30-38-33-44-4-6 0-10 3-13l10-10 6-10c3-4 2-8 0-11l-17-47c-5-12-10-10-14-10l-12-1c-4-1-11 1-17 7s-22 20-23 50c-1 31 20 61 23 65 3 5 40 70 103 98 62 27 62 18 74 18 11-1 37-14 43-28s6-27 5-29c-2-3-6-5-12-8z"/></symbol></svg>';
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
                        FACEBOOK, TWITTER, WHATSAPP, TELEGRAM, GOOGLE, LINKEDIN, PINTEREST, EMAIL
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

        createTelegramButton: function createTelegramButton(container, buttonClass) {
            var data = this.getMetadataFromElement(container);

            this.createButton(
                container,
                TELEGRAM,
                buttonClass,
                'https://telegram.me/share/url?url=' + data.url + '&text=' + data.title,
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

/*global describe, it, expect, spyOn,
         beforeEach, afterEach, jasmine, xit, ShareBar, FB */

function createBar(options) {
    'use strict';
    return new ShareBar(options);
}

function click(element) {
    'use strict';
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, true, window, 1, 0, 0);
    element.dispatchEvent(event);
    return event;
}

function createShareContainer() {
    'use strict';
    var element = document.createElement('div');
    element.className = 'share-bar';
    element.setAttribute('data-url', 'http://globo.com');
    element.setAttribute('data-title', 'Test title');
    element.setAttribute('data-image-url', 'http://g1.globo.com');
    element.setAttribute('data-hashtags', '#test #g1');
    document.body.appendChild(element);
    return element;
}

function createPopupElement() {
    'use strict';
    var element = document.createElement('a');
    element.className = 'share-button share-popup';
    element.setAttribute('href', '#');
    document.body.appendChild(element);
    return element;
}

describe('ShareBar - Setup Test Case', function () {
    'use strict';

    describe('setup', function () {
        it('should have ShareBar plugin on page', function () {
            expect(ShareBar).not.toBe(undefined);
        });

        it('should call init method on instance new bar', function () {
            var spy = spyOn(ShareBar.prototype, 'init');
            createBar();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('init', function () {
        it('should call createSVG method', function () {
            var spy = spyOn(ShareBar.prototype, 'createSVG');
            createBar();
            expect(spy).toHaveBeenCalled();
        });

        it('should call mergeOptions method', function () {
            var spy = spyOn(ShareBar.prototype, 'mergeOptions'),
                options = {'selector': '.test'};
            createBar(options);
            expect(spy).toHaveBeenCalledWith(options);
        });

        it('should call createBars method', function () {
            var spy = spyOn(ShareBar.prototype, 'createBars');
            createBar();
            expect(spy).toHaveBeenCalled();
        });

        it('should set containers atribute with selected elements', function () {
            var newBar;
            spyOn(ShareBar.prototype, 'createBars');
            newBar = createBar();
            expect(newBar.containers[0]).toEqual(this.el);
        });
    });
});

describe('ShareBar - Methods Test Case', function () {
    'use strict';

    beforeEach(function () {
        this.el = createShareContainer();

        this.newBar = createBar({
            'selector': '.no-elements',
            'buttonWidth': 21,
            'buttonFullWidth': 46,
            'buttonPadding': 4
        });
        this.newBar.containers = [];
        this.newBar.supportSvg = true;
    });

    afterEach(function () {
        document.body.removeChild(this.el);
    });

    describe('mergeOptions', function () {
        it('should create properties with defaultOptions', function () {
            this.newBar.mergeOptions();

            expect(this.newBar.selector).toEqual('.share-bar');
            expect(this.newBar.classPopup).toEqual('share-popup');
            expect(this.newBar.facebookAppId).toEqual('');
            expect(this.newBar.networks).toEqual([
                'facebook',
                'twitter',
                'whatsapp',
                'google',
                'pinterest',
                'email'
            ]);
            expect(this.newBar.theme).toEqual('natural');
        });

        it('should merge options with defaultOptions', function () {
            this.newBar.mergeOptions({'selector': 'test'});
            expect(this.newBar.selector).toEqual('test');
        });

        it('should not create options when not exists in defaultOptions', function () {
            this.newBar.mergeOptions({'selectorEspecial': 'test'});
            expect(this.newBar.selectorEspecial).toBe(undefined);
        });
    });

    describe('validateNetworks', function () {
        it('should throw an error when networks is not an array', function () {
            var self = this;

            expect(
                function () {self.newBar.validateNetworks('facebook'); }
            ).toThrow(
                new Error('The list of networks passed on inicialization is wrong [Should be an Array]')
            );
        });

        it('should find method to create network button by name', function () {
            var networks = this.newBar.validateNetworks(['facebook']);
            expect(networks).toEqual([this.newBar.createFacebookButton]);
        });

        it('should find methods to create any networks button by names', function () {
            var networks = this.newBar.validateNetworks(['facebook', 'twitter']);
            expect(networks).toEqual([this.newBar.createFacebookButton, this.newBar.createTwitterButton]);
        });

        it('should throw an error when can not find method by name', function () {
            var self = this;

            expect(
                function () {self.newBar.validateNetworks(['facebrrk']); }
            ).toThrow(
                new Error('The list of networks passed on inicialization is wrong [Netowrk name "facebrrk" is wrong, should be facebook or twitter or whatsapp or google or pinterest or email]')
            );
        });

        it('should set a function when function is passed', function () {
            var myNetworkFunction = function () { return true; },
                networks = this.newBar.validateNetworks([myNetworkFunction]);
            expect(networks).toEqual([myNetworkFunction]);
        });

        it('should throw an error when something other than string or function', function () {
            var self = this;

            expect(
                function () {self.newBar.validateNetworks([{'object': 'error'}]); }
            ).toThrow(
                new Error('The list of networks passed on inicialization is wrong [Should be string or function]')
            );
        });
    });

    describe('bindOpenPopup', function () {
        beforeEach(function () {
            this.newBar.eventName = 'click';
        });

        it('should call addEventListener function for each popup element', function () {
            var popups = [createPopupElement(), createPopupElement()],
                spies = [];

            this.el.appendChild(popups[0]);
            this.el.appendChild(popups[1]);

            spies[0] = spyOn(popups[0], 'addEventListener');
            spies[1] = spyOn(popups[1], 'addEventListener');

            this.newBar.bindOpenPopup(this.el);

            expect(spies[0]).toHaveBeenCalledWith('click', jasmine.any(Function), false);
            expect(spies[1]).toHaveBeenCalledWith('click', jasmine.any(Function), false);
        });

        it('should call openPopup on click in popup element', function () {
            var popup = createPopupElement(),
                spy = spyOn(ShareBar.prototype, 'openPopup'),
                eventClick = '';

            this.el.appendChild(popup);

            this.newBar.bindOpenPopup(this.el);
            eventClick = click(popup);

            expect(spy).toHaveBeenCalledWith(eventClick);
        });
    });

    describe('bindShare', function () {
        beforeEach(function () {
            this.newBar.eventName = 'click';
        });

        it('should call onShare callback on click in share button', function () {
            var popup = createPopupElement(),
                spy = spyOn(this.newBar, 'onShare');

            this.el.appendChild(popup);

            this.newBar.bindShare(this.el);
            click(popup);

            expect(spy).toHaveBeenCalledWith(popup);
        });

        it('should call onShare callback on click in share button only once', function () {
            var popup = createPopupElement(),
                spy = spyOn(this.newBar, 'onShare'),
                el1 = createShareContainer(),
                el2 = createShareContainer();

            el1.appendChild(popup);

            this.newBar.createBar(el1);
            this.newBar.createBar(el2);

            click(popup);
            expect(spy.callCount).toEqual(1);
        });
    });

    describe('openPopup', function () {
        beforeEach(function () {
            this.popup = createPopupElement();
            this.eventClick = click(this.popup);
            this.spyWindowsOpen = spyOn(window, 'open').andReturn(window);
            this.spyWindowsFocus = spyOn(window, 'focus').andReturn(window);
        });

        it('should call window.open to open popup', function () {
            this.newBar.openPopup.call(this.popup, this.eventClick);

            expect(this.spyWindowsOpen).toHaveBeenCalledWith(
                this.popup.getAttribute("href"),
                'popup',
                'height=400,width=500,left=10,top=10,resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no'
            );
        });

        it('should call window.focus to set focus on popup', function () {
            this.newBar.openPopup.call(this.popup, this.eventClick);
            expect(this.spyWindowsFocus).toHaveBeenCalled();
        });
    });

    describe('createBars', function () {
        it('should call createBar method for each selected element', function () {
            var otherEl = createShareContainer(),
                spy = spyOn(ShareBar.prototype, 'createBar');

            this.newBar.containers = [otherEl, this.el];
            this.newBar.createBars();

            expect(spy).toHaveBeenCalledWith(otherEl);
            expect(spy).toHaveBeenCalledWith(this.el);
        });
    });

    describe('createBar', function () {
        it('should call validateNetworks method', function () {
            var spy = spyOn(ShareBar.prototype, 'validateNetworks').andCallThrough();
            this.newBar.createBar(this.el);
            expect(spy).toHaveBeenCalledWith(this.newBar.networks);
        });

        it('should call validateNetworks method with custom networks', function () {
            var spy = spyOn(ShareBar.prototype, 'validateNetworks').andCallThrough(),
                network = ['facebook'];
            this.newBar.createBar(this.el, network);
            expect(spy).toHaveBeenCalledWith(network);
        });

        it('should call createFacebookButton method', function () {
            var spy = spyOn(ShareBar.prototype, 'createFacebookButton');
            this.newBar.networks = [this.newBar.createFacebookButton];
            this.newBar.createBar(this.el);

            expect(spy).toHaveBeenCalled();
        });

        it('should create a maximum of 6 buttons', function () {
            var spy = jasmine.createSpy('test');
            this.newBar.networks = [spy, spy, spy, spy, spy, spy, spy];
            this.newBar.createBar(this.el);

            expect(spy.calls.length).toEqual(6);
        });

        it('should set class share-bar-container on container element', function () {
            this.newBar.createBar(this.el);
            expect(this.el.classList.contains('share-bar-container')).toBe(true);
        });

        it('should set theme default on container element', function () {
            this.newBar.createBar(this.el);
            expect(this.el.classList.contains('share-theme-natural')).toBe(true);
        });

        it('should set customized theme on container element', function () {
            this.el.setAttribute('data-theme', 'test');
            this.newBar.createBar(this.el);
            expect(this.el.classList.contains('share-theme-test')).toBe(true);
        });

        it('should call method passed as parameter', function () {
            var spy = spyOn(ShareBar.prototype, 'createFacebookButton'),
                spyNetworks = [jasmine.createSpy('test')];

            this.newBar.networks = [this.newBar.createFacebookButton];
            this.newBar.createBar(this.el, spyNetworks);

            expect(spy).not.toHaveBeenCalled();
            expect(spyNetworks[0]).toHaveBeenCalled();
        });

        it('should call bindOpenPopup method', function () {
            var spy = spyOn(ShareBar.prototype, 'bindOpenPopup');
            this.newBar.createBar(this.el);
            expect(spy).toHaveBeenCalled();
        });

        it('should call bindShare callback', function () {
            var spy = spyOn(this.newBar, 'bindShare');
            this.newBar.createBar(this.el);
            expect(spy).toHaveBeenCalledWith(this.el);
        });

        it('should call onCreateBar callback', function () {
            var spy = spyOn(this.newBar, 'onCreateBar');
            this.newBar.createBar(this.el);
            expect(spy).toHaveBeenCalledWith(this.el);
        });
    });

    describe('getButtonsSize', function () {
        it('should call getButtonsSmall when container is small', function () {
            var spy = spyOn(ShareBar.prototype, 'getButtonsSmall');
            spyOn(this.newBar, 'isSmallScreen').andReturn(false);
            this.newBar.getButtonsSize(20, 6);

            expect(spy).toHaveBeenCalledWith(6, 25, 20);
        });

        it('should return all elements as is when container is big and is small sreen', function () {
            var result = [];
            spyOn(ShareBar.prototype, 'isSmallScreen').andReturn(true);

            result = this.newBar.getButtonsSize(200, 6);

            expect(result).toEqual(
                ['', '', '', '', '', '']
            );
        });

        it('should call getButtonsFull when container is big', function () {
            var spy = spyOn(ShareBar.prototype, 'getButtonsFull');
            spyOn(this.newBar, 'isSmallScreen').andReturn(false);
            this.newBar.getButtonsSize(150, 6);

            expect(spy).toHaveBeenCalledWith(6, 50, 25, 150);
        });
    });

    describe('getButtonsSmall', function () {
        it('should return all elements as hidden when container is smallest than button', function () {
            var result = [];
            spyOn(ShareBar.prototype, 'isSmallScreen').andReturn(false);
            result = this.newBar.getButtonsSmall(6, 25, 20);

            expect(result).toEqual(
                [' share-hidden', ' share-hidden', ' share-hidden', ' share-hidden', ' share-hidden', ' share-hidden']
            );
        });

        it('should return some elements as small when container is small', function () {
            var result = [];
            spyOn(ShareBar.prototype, 'isSmallScreen').andReturn(false);
            result = this.newBar.getButtonsSmall(6, 25, 75);

            expect(result).toEqual(
                [' share-small', ' share-small', ' share-small', ' share-hidden', ' share-hidden', ' share-hidden']
            );
        });

        it('should return some elements as is when container is small and is small sreen', function () {
            var result = [];
            spyOn(ShareBar.prototype, 'isSmallScreen').andReturn(true);
            result = this.newBar.getButtonsSmall(6, 25, 75);

            expect(result).toEqual(
                ['', '', '', ' share-hidden', ' share-hidden', ' share-hidden']
            );
        });
    });

    describe('getButtonsFull', function () {
        it('should return all elements as small when container is a little bigger', function () {
            var result = [];
            spyOn(ShareBar.prototype, 'isSmallScreen').andReturn(false);

            result = this.newBar.getButtonsFull(6, 50, 25, 160);

            expect(result).toEqual(
                [' share-small', ' share-small', ' share-small', ' share-small', ' share-small', ' share-small']
            );
        });

        it('should return some elements as full when container is big', function () {
            var result = [];
            spyOn(ShareBar.prototype, 'isSmallScreen').andReturn(false);

            result = this.newBar.getButtonsFull(6, 50, 25, 225);

            expect(result).toEqual(
                [' share-full', ' share-full', ' share-full', ' share-small', ' share-small', ' share-small']
            );
        });

        it('should return all elements as full when container is very big', function () {
            var result = [];
            spyOn(ShareBar.prototype, 'isSmallScreen').andReturn(false);

            result = this.newBar.getButtonsFull(6, 50, 25, 300);

            expect(result).toEqual(
                [' share-full', ' share-full', ' share-full', ' share-full', ' share-full', ' share-full']
            );
        });
    });

    describe('getMetadataFromElement', function () {
        it('should return a dictionary with metadata from element', function () {
            var data = this.newBar.getMetadataFromElement(this.el),
                expectedData = {
                    'url': window.encodeURIComponent('http://globo.com'),
                    'title': window.encodeURIComponent('Test title'),
                    'imageUrl': window.encodeURIComponent('http://g1.globo.com'),
                    'hashtags': window.encodeURIComponent('#test #g1')
                };

            expect(data).toEqual(expectedData);
        });
    });

    describe('createButton', function () {
        it('should create share button', function () {
            this.newBar.createButton(this.el, 'test', '', 'urltest');
            expect(this.el.querySelector('.share-test a[href="urltest"]')).not.toBe(null);
        });

        it('should call createContentButton method', function () {
            var spy = spyOn(ShareBar.prototype, 'createContentButton');

            this.newBar.createButton(this.el, 'test', '', 'urltest');
            expect(spy).toHaveBeenCalledWith('test', 'Test');
        });

        it('should call createContentButton method when title was passed', function () {
            var spy = spyOn(ShareBar.prototype, 'createContentButton');

            this.newBar.createButton(this.el, 'test', '', 'urltest', 'title');
            expect(spy).toHaveBeenCalledWith('test', 'Title');
        });

        it('should return share button', function () {
            var button = this.newBar.createButton(this.el, 'test', '', '<a href="test">test</a>');
            expect(button.className).toEqual('share-button share-test');
        });

        it('should be class share-popup when openInPage is undefined', function () {
            var button = this.newBar.createButton(this.el, 'test', '', '<a href="test">test</a>');
            expect(button.querySelector('a').className).toEqual('share-popup');
        });

        it('should not be class share-popup when openInPage is true', function () {
            var button = this.newBar.createButton(this.el, 'test', '', '<a href="test">test</a>', '', true);
            expect(button.querySelector('a').className).toEqual('');
        });

        it('should call onCreateButton callback', function () {
            var spy = spyOn(this.newBar, 'onCreateButton'),
                button = this.newBar.createButton(this.el, 'test', '', '<a href="test">test</a>');

            expect(spy).toHaveBeenCalledWith(button);
        });
    });

    describe('createContentButton', function () {
        it('should return SVG element when SVG is enabled', function () {
            var result;
            result = this.newBar.createContentButton('test');

            expect(result).toContain('<svg viewBox="0 0 100 100" class="share-icon">');
            expect(result).toContain('<span>test</span>');
        });

        it('should return icon element when SVG is disabled', function () {
            var result;

            this.newBar.supportSvg = false;
            result = this.newBar.createContentButton('test');

            expect(result).toContain('<i class="share-font ico-share-test"></i>');
            expect(result).toContain('<span>test</span>');
        });
    });

    describe('createFacebookButton', function () {
        beforeEach(function () {
            this.newBar.eventName = 'click';
        });

        it('should create facebook button', function () {
            this.newBar.createFacebookButton(this.el);
            expect(this.el.querySelector('.share-button.share-facebook a span')).not.toBe(null);
        });

        it('should set link href with only facebook url', function () {
            var link = '';
            this.newBar.createFacebookButton(this.el);

            link = this.el.querySelector('.share-button.share-facebook a');
            expect(link.href).toEqual('http://www.facebook.com/');
        });

        it('should call getFacebookUi method', function () {
            var spy = spyOn(this.newBar, 'getFacebookUi');
            this.newBar.createFacebookButton(this.el);
            expect(spy).toHaveBeenCalled();
        });

        it('should call FB.ui method when click in button', function () {
            window.FB = jasmine.createSpyObj('FB', ['ui']);
            this.newBar.createFacebookButton(this.el);

            click(this.el.querySelector('.share-button.share-facebook a'));
            expect(window.FB.ui).toHaveBeenCalledWith({
                method: 'feed',
                link: 'http://globo.com',
                name: 'Test title',
                picture: 'http://g1.globo.com'
            });
        });
    });

    describe('createTwitterButton', function () {
        it('should create twitter button', function () {
            this.newBar.createTwitterButton(this.el);
            expect(this.el.querySelector('.share-button.share-twitter a.share-popup span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            this.newBar.createTwitterButton(this.el);

            link = this.el.querySelector('.share-button.share-twitter a');
            expect(link.href).toEqual(
                'https://twitter.com/share?url=http%3A%2F%2Fglobo.com&text=Test%20title%20%23test%20%23g1'
            );
        });
    });

    describe('createGoogleButton', function () {
        it('should create googleplus button', function () {
            this.newBar.createGoogleButton(this.el);
            expect(this.el.querySelector('.share-button.share-googleplus a.share-popup span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            this.newBar.createGoogleButton(this.el);

            link = this.el.querySelector('.share-button.share-googleplus a');
            expect(link.href).toEqual(
                'https://plus.google.com/share?url=http%3A%2F%2Fglobo.com'
            );
        });
    });

    describe('createPinterestButton', function () {
        it('should create pinterest button', function () {
            this.newBar.createPinterestButton(this.el);
            expect(this.el.querySelector('.share-button.share-pinterest a.share-popup span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            this.newBar.createPinterestButton(this.el);

            link = this.el.querySelector('.share-button.share-pinterest a');
            expect(link.href).toEqual(
                'http://www.pinterest.com/pin/create/button/?url=http%3A%2F%2Fglobo.com&media=http%3A%2F%2Fg1.globo.com&description=Test%20title'
            );
        });
    });

    describe('createWhatsappButton', function () {
        it('should create whatsapp button when device is iphone', function () {
            spyOn(ShareBar.prototype, 'isSmallScreen').andReturn(true);
            spyOn(ShareBar.prototype, 'isTouch').andReturn(true);
            this.newBar.createWhatsappButton(this.el);
            expect(this.el.querySelector('.share-button.share-whatsapp a span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            spyOn(ShareBar.prototype, 'isSmallScreen').andReturn(true);
            spyOn(ShareBar.prototype, 'isTouch').andReturn(true);
            this.newBar.createWhatsappButton(this.el);

            link = this.el.querySelector('.share-button.share-whatsapp a');
            expect(link.href).toEqual(
                'whatsapp://send?text=Test%20title%20http%3A%2F%2Fglobo.com'
            );
        });

        it('should not create whatsapp button when is not mobile device', function () {
            spyOn(ShareBar.prototype, 'isSmallScreen').andReturn(false);
            spyOn(ShareBar.prototype, 'isTouch').andReturn(false);
            this.newBar.createWhatsappButton(this.el);
            expect(this.el.querySelector('.share-button.share-whatsapp a span')).toBe(null);
        });

        it('should not open in popup', function () {
            this.newBar.createWhatsappButton(this.el);
            expect(this.el.querySelector('.share-whatsapp a').className).toEqual('');
        });
    });

    describe('createEmailButton', function () {
        it('should create email button', function () {
            this.newBar.createEmailButton(this.el);
            expect(this.el.querySelector('.share-button.share-email a span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            this.newBar.createEmailButton(this.el);

            link = this.el.querySelector('.share-email a');
            expect(link.href).toEqual(
                'mailto:?subject=Test%20title&body=http%3A%2F%2Fglobo.com'
            );
        });

        it('should not create email button when is not mobile device', function () {
            spyOn(ShareBar.prototype, 'isTouch').andReturn(false);
            this.newBar.createEmailButton(this.el);
            expect(this.el.querySelector('.share-button.share-email a span')).toBe(null);
        });

        it('should not open in popup', function () {
            this.newBar.createEmailButton(this.el);
            expect(this.el.querySelector('.share-email a').className).toEqual('');
        });
    });

    describe('createSVG', function () {
        it('should create svg container', function () {
            var element = '',
                elements = [];

            this.newBar.createSVG();
            elements = document.querySelectorAll('div');
            element = elements[elements.length - 1];

            expect(element.style.display).toEqual('none');
            expect(element.innerHTML).toEqual('[[X_SVG_X]]');
        });
    });

    describe('verifyTouch', function () {
        beforeEach(function () {
            document.querySelector('html').className = '';
        });

        it('should add class no-touch for desktop', function () {
            var html;

            spyOn(ShareBar.prototype, 'isTouch').andReturn(false);
            this.newBar.verifyTouch();

            html = document.querySelector('html');
            expect(html.className).toEqual(' no-touch');
        });

        it('should add class touch for touch devices', function () {
            var html;

            spyOn(ShareBar.prototype, 'isTouch').andReturn(true);
            this.newBar.verifyTouch();

            html = document.querySelector('html');
            expect(html.className).toEqual(' touch');
        });
    });

    describe('hasSupportSvg', function () {
        xit('should verify if has support for svg in the browser', function () {
            return false;
        });
    });
});
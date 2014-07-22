/*global describe, it, expect, glb, spyOn,
         beforeEach, afterEach, jasmine, xit */

describe('glb.share Test Case', function () {
    'use strict';

    beforeEach(function () {

        this.click = function (element) {
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, true, window, 1, 0, 0);
            element.dispatchEvent(event);
            return event;
        };

        this.createShareContainer = function () {
            var element = document.createElement('div');
            element.className = 'glb-share';
            element.setAttribute('data-url', 'http://globo.com');
            element.setAttribute('data-title', 'Test title');
            element.setAttribute('data-image-url', 'http://g1.globo.com');
            document.body.appendChild(element);
            return element;
        };

        this.createPopupElement = function () {
            var element = document.createElement('a');
            element.className = 'share-popup';
            element.setAttribute('href', 'http://globo.com');
            document.body.appendChild(element);
            return element;
        };

        this.el = this.createShareContainer();
    });

    afterEach(function () {
        document.body.removeChild(this.el);
    });

    describe('setup', function () {
        it('should have glb.share on page', function () {
            expect(glb.share).not.toBe(undefined);
        });
    });

    describe('init', function () {
        it('should call createSVG method', function () {
            var spy = spyOn(glb.share, 'createSVG');
            glb.share.init();
            expect(spy).toHaveBeenCalled();
        });

        it('should call mergeOptions method', function () {
            var spy = spyOn(glb.share, 'mergeOptions'),
                options = {'selector': '.test'};
            glb.share.init(options);
            expect(spy).toHaveBeenCalledWith(options);
        });

        it('should call createBars method', function () {
            var spy = spyOn(glb.share, 'createBars');
            glb.share.init();
            expect(spy).toHaveBeenCalled();
        });

        it('should set containers atribute with selected elements', function () {
            spyOn(glb.share, 'createBars');
            glb.share.init();
            expect(glb.share.containers[0]).toEqual(this.el);
        });

        it('should call bindOpenPopup method', function () {
            spyOn(glb.share, 'createBars');
            var spy = spyOn(glb.share, 'bindOpenPopup');
            glb.share.init();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('mergeOptions', function () {
        it('should create properties with defaultOptions', function () {
            glb.share.mergeOptions();

            expect(glb.share.selector).toEqual('.glb-share');
            expect(glb.share.classPopup).toEqual('share-popup');
            expect(glb.share.networks).toEqual([
                glb.share.createFacebookButton,
                glb.share.createTwitterButton,
                glb.share.createGoogleButton,
                glb.share.createPinterestButton,
                glb.share.createWhatsappButton,
                glb.share.createEmailButton
            ]);
            expect(glb.share.theme).toEqual('natural');
        });

        it('should merge options with defaultOptions', function () {
            glb.share.mergeOptions({'selector': 'test'});
            expect(glb.share.selector).toEqual('test');
        });

        it('should not create options when not exists in defaultOptions', function () {
            glb.share.mergeOptions({'selectorEspecial': 'test'});
            expect(glb.share.selectorEspecial).toBe(undefined);
        });
    });

    describe('bindOpenPopup', function () {
        it('should call addEventListener function for each popup element', function () {
            var popups = [this.createPopupElement(), this.createPopupElement()],
                spies = [];

            spies[0] = spyOn(popups[0], 'addEventListener');
            spies[1] = spyOn(popups[1], 'addEventListener');

            glb.share.bindOpenPopup();

            expect(spies[0]).toHaveBeenCalledWith('click', glb.share.openPopup, false);
            expect(spies[1]).toHaveBeenCalledWith('click', glb.share.openPopup, false);
        });

        it('should call openPopup on click in popup element', function () {
            var popup = this.createPopupElement(),
                spy = spyOn(glb.share, 'openPopup'),
                eventClick = '';

            glb.share.bindOpenPopup();
            eventClick = this.click(popup);

            expect(spy).toHaveBeenCalledWith(eventClick);
        });
    });

    describe('openPopup', function () {
        beforeEach(function() {
            this.popup = this.createPopupElement();
            this.eventClick = this.click(this.popup);
            this.spyWindowsOpen = spyOn(window, 'open').andReturn(window);
        });

        it('should call window.open to open popup', function () {
            glb.share.openPopup.call(this.popup, this.eventClick);

            expect(this.spyWindowsOpen).toHaveBeenCalledWith(
                this.popup.getAttribute("href"),
                'popup',
                'height=400,width=500,left=10,top=10,resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no'
            );
        });

        it('should call window.focus to set focus on popup', function () {
            var spy = spyOn(window, 'focus');
            glb.share.openPopup.call(this.popup, this.eventClick);

            expect(spy).toHaveBeenCalled();
        });

        it('should call preventDefault to prevent the browser follow the link', function () {
            var spy = spyOn(this.eventClick, 'preventDefault');
            glb.share.openPopup.call(this.popup, this.eventClick);

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('createBars', function () {
        it('should call createBar method for each selected element', function () {
            var otherEl = this.createShareContainer(),
                spy = spyOn(glb.share, 'createBar');

            glb.share.containers = [otherEl, this.el];
            glb.share.createBars();

            expect(spy).toHaveBeenCalledWith(otherEl);
            expect(spy).toHaveBeenCalledWith(this.el);
        });
    });

    describe('createBar', function () {
        it('should call createFacebookButton method', function () {
            var spy = spyOn(glb.share, 'createFacebookButton');
            glb.share.networks = [glb.share.createFacebookButton];
            glb.share.createBar(this.el);
            expect(spy).toHaveBeenCalled();
        });

        it('should create a maximum of 6 buttons', function () {
            var spy = jasmine.createSpy('test');

            glb.share.networks = [spy, spy, spy, spy, spy, spy, spy];

            glb.share.createBar(this.el);
            expect(spy.calls.length).toEqual(6);
        });

        it('should set class glb-share-container on container element', function () {
            glb.share.createBar(this.el);
            expect(this.el.classList.contains('glb-share-container')).toBe(true);
        });

        it('should set theme default on container element', function () {
            glb.share.createBar(this.el);
            expect(this.el.classList.contains('share-theme-natural')).toBe(true);
        });

        it('should set customized theme on container element', function () {
            this.el.setAttribute('data-theme', 'test');
            glb.share.createBar(this.el);
            expect(this.el.classList.contains('share-theme-test')).toBe(true);
        });

        it('should call method passed as parameter', function () {
            var spy = spyOn(glb.share, 'createFacebookButton'),
                spyNetworks = [jasmine.createSpy('test')];

            glb.share.networks = [glb.share.createFacebookButton];
            glb.share.createBar(this.el, spyNetworks);

            expect(spy).not.toHaveBeenCalled();
            expect(spyNetworks[0]).toHaveBeenCalled();
        });
    });

    describe('getMetadataFromElement', function () {
        it('should return a dictionary with metadata from element', function () {
            var data = glb.share.getMetadataFromElement(this.el),
                expectedData = {
                'url': window.encodeURIComponent('http://globo.com'),
                'title': window.encodeURIComponent('Test title'),
                'imageUrl': window.encodeURIComponent('http://g1.globo.com')
            };

            expect(data).toEqual(expectedData);
        });
    });

    describe('createButton', function () {
        it('should create share button', function () {
            glb.share.createButton(this.el, 'test', '', 'urltest');
            expect(this.el.querySelector('.share-test a[href="urltest"]')).not.toBe(null);
        });

        it('should call createContentButton method', function () {
            var spy = spyOn(glb.share, 'createContentButton');

            glb.share.createButton(this.el, 'test', '', 'urltest');
            expect(spy).toHaveBeenCalledWith('test');
        });

        it('should return share button', function () {
            var button = glb.share.createButton(this.el, 'test', '', '<a href="test">test</a>');
            expect(button.className).toEqual('share-button share-test');
        });
    });

    describe('createContentButton', function () {
        it('should return SVG element when SVG is enabled', function () {
            var result;

            glb.share.supportSvg = true;
            result = glb.share.createContentButton('test');

            expect(result).toContain('<svg viewBox="0 0 100 100" class="share-icon">');
            expect(result).toContain('<span>test</span>');
        });

        it('should return icon element when SVG is disabled', function () {
            var result;

            glb.share.supportSvg = false;
            result = glb.share.createContentButton('test');

            expect(result).toContain('<i class="share-font ico-share-test"></i>');
            expect(result).toContain('<span>test</span>');
        });
    });

    describe('createFacebookButton', function () {

        beforeEach(function() {
            glb.share.supportSvg = true;
        });

        afterEach(function() {
            glb.share.supportSvg = '';
        });

        it('should create facebook button', function () {
            glb.share.createFacebookButton(this.el);
            expect(this.el.querySelector('.share-button.share-facebook a.share-popup span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            glb.share.createFacebookButton(this.el);

            link = this.el.querySelector('.share-button.share-facebook a');
            expect(link.href).toEqual(
                'http://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fglobo.com'
            );
        });
    });

    describe('createTwitterButton', function () {
        it('should create twitter button', function () {
            glb.share.createTwitterButton(this.el);
            expect(this.el.querySelector('.share-button.share-twitter a.share-popup span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            glb.share.createTwitterButton(this.el);

            link = this.el.querySelector('.share-button.share-twitter a');
            expect(link.href).toEqual(
                'https://twitter.com/share?url=http%3A%2F%2Fglobo.com&text=Test%20title%20%23globo.com'
            );
        });
    });

    describe('createGoogleButton', function () {
        it('should create googleplus button', function () {
            glb.share.createGoogleButton(this.el);
            expect(this.el.querySelector('.share-button.share-googleplus a.share-popup span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            glb.share.createGoogleButton(this.el);

            link = this.el.querySelector('.share-button.share-googleplus a');
            expect(link.href).toEqual(
                'https://plus.google.com/share?url=http%3A%2F%2Fglobo.com'
            );
        });
    });

    describe('createPinterestButton', function () {
        it('should create pinterest button', function () {
            glb.share.createPinterestButton(this.el);
            expect(this.el.querySelector('.share-button.share-pinterest a.share-popup span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            glb.share.createPinterestButton(this.el);

            link = this.el.querySelector('.share-button.share-pinterest a');
            expect(link.href).toEqual(
                'http://www.pinterest.com/pin/create/button/?url=http%3A%2F%2Fglobo.com&media=http%3A%2F%2Fg1.globo.com&description=Test%20title'
            );
        });
    });

    describe('createWhatsappButton', function () {
        it('should create whatsapp button when device is iphone', function () {
            spyOn(glb.share, 'deviceIsIphone').andReturn(true);
            glb.share.createWhatsappButton(this.el);
            expect(this.el.querySelector('.share-button.share-whatsapp a span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            spyOn(glb.share, 'deviceIsIphone').andReturn(true);
            glb.share.createWhatsappButton(this.el);

            link = this.el.querySelector('.share-button.share-whatsapp a');
            expect(link.href).toEqual(
                'whatsapp://send?text=Test%20title%20http%3A%2F%2Fglobo.com'
            );
        });

        it('should not create whatsapp button when device is not iphone', function () {
            spyOn(glb.share, 'deviceIsIphone').andReturn(false);
            glb.share.createWhatsappButton(this.el);
            expect(this.el.querySelector('.share-button.share-whatsapp a span')).toBe(null);
        });
    });

    describe('createEmailButton', function () {
        it('should create email button', function () {
            glb.share.createEmailButton(this.el);
            expect(this.el.querySelector('.share-button.share-email a span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            glb.share.createEmailButton(this.el);

            link = this.el.querySelector('.share-email a');
            expect(link.href).toEqual(
                'mailto:?subject=Test%20title&body=http%3A%2F%2Fglobo.com'
            );
        });
    });

    describe('createSVG', function () {

        beforeEach(function () {
            glb.share.supportSvg = true;
        });

        afterEach(function () {
            glb.share.supportSvg = '';
        });

        it('should create svg container', function () {
            var element = '',
                elements = [];


            glb.share.createSVG();
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

            spyOn(glb.share, 'isTouch').andReturn(false);
            glb.share.verifyTouch();

            html = document.querySelector('html');
            expect(html.className).toEqual(' no-touch');
        });

        it('should add class touch for touch devices', function () {
            var html;

            spyOn(glb.share, 'isTouch').andReturn(true);
            glb.share.verifyTouch();

            html = document.querySelector('html');
            expect(html.className).toEqual(' touch');
        });
    });


    describe('getNumberOfFullButtons', function () {

        it('should return a list of classes with full and small buttons to apply on desktop', function () {
            var buttons;

            glb.share.buttonFullWidth = 110;
            glb.share.buttonPadding = 4;
            glb.share.buttonWidth = 34;

            spyOn(glb.share, 'isSmallScreen').andReturn(false);

            buttons = glb.share.getNumberOfFullButtons(480, 6);
            expect(buttons).toEqual([ ' share-full', ' share-full', ' share-full', ' share-small', ' share-small', ' share-small' ] );
        });

        it('should return a list with natural behavior if device is small', function () {
            var buttons;
            glb.share.buttonFullWidth = 110;
            glb.share.buttonPadding = 4;
            glb.share.buttonWidth = 34;

            spyOn(glb.share, 'isSmallScreen').andReturn(true);

            buttons = glb.share.getNumberOfFullButtons(480, 6);
            expect(buttons).toEqual([ '', '', '', '', '', '' ] );
        });

    });

    describe('hasSupportSvg', function () {

        xit('should verify if has support for svg in the browser', function () {
        });

    });
});
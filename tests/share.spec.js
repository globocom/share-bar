/*global describe, it, expect, glb, spyOn,
         beforeEach, afterEach, jasmine, xit, ShareBar */

function createBar(options) {
    'use strict';
    return new ShareBar(options);
}

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

    describe('mergeOptions', function () {
        beforeEach(function () {
            spyOn(ShareBar.prototype, 'createBars');
            this.newBar = createBar();
        });

        it('should create properties with defaultOptions', function () {
            this.newBar.mergeOptions();

            expect(this.newBar.selector).toEqual('.glb-share');
            expect(this.newBar.classPopup).toEqual('share-popup');
            expect(this.newBar.networks).toEqual([
                this.newBar.createFacebookButton,
                this.newBar.createTwitterButton,
                this.newBar.createGoogleButton,
                this.newBar.createPinterestButton,
                this.newBar.createWhatsappButton,
                this.newBar.createEmailButton
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

    describe('bindOpenPopup', function () {
        beforeEach(function () {
            spyOn(ShareBar.prototype, 'createBars');
            this.newBar = createBar();
        });

        it('should call addEventListener function for each popup element', function () {
            var popups = [this.createPopupElement(), this.createPopupElement()],
                spies = [];

            spies[0] = spyOn(popups[0], 'addEventListener');
            spies[1] = spyOn(popups[1], 'addEventListener');

            this.newBar.bindOpenPopup();

            expect(spies[0]).toHaveBeenCalledWith('click', this.newBar.openPopup, false);
            expect(spies[1]).toHaveBeenCalledWith('click', this.newBar.openPopup, false);
        });

        it('should call openPopup on click in popup element', function () {
            var popup = this.createPopupElement(),
                spy = spyOn(ShareBar.prototype, 'openPopup'),
                eventClick = '';

            this.newBar.bindOpenPopup();
            eventClick = this.click(popup);

            expect(spy).toHaveBeenCalledWith(eventClick);
        });
    });

    describe('openPopup', function () {
        beforeEach(function () {
            spyOn(ShareBar.prototype, 'createBars');
            this.newBar = createBar();

            this.popup = this.createPopupElement();
            this.eventClick = this.click(this.popup);
            this.spyWindowsOpen = spyOn(window, 'open').andReturn(window);
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
            var spy = spyOn(window, 'focus');
            this.newBar.openPopup.call(this.popup, this.eventClick);

            expect(spy).toHaveBeenCalled();
        });

        it('should call preventDefault to prevent the browser follow the link', function () {
            var spy = spyOn(this.eventClick, 'preventDefault');
            this.newBar.openPopup.call(this.popup, this.eventClick);

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('createBars', function () {
        beforeEach(function () {
            spyOn(ShareBar.prototype, 'init');
            this.newBar = createBar();
        });

        it('should call createBar method for each selected element', function () {
            var otherEl = this.createShareContainer(),
                spy = spyOn(ShareBar.prototype, 'createBar');

            this.newBar.containers = [otherEl, this.el];
            this.newBar.createBars();

            expect(spy).toHaveBeenCalledWith(otherEl);
            expect(spy).toHaveBeenCalledWith(this.el);
        });
    });

    describe('createBar', function () {
        beforeEach(function () {
            spyOn(ShareBar.prototype, 'createBars');
            this.newBar = createBar();
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

        it('should set class glb-share-container on container element', function () {
            this.newBar.createBar(this.el);
            expect(this.el.classList.contains('glb-share-container')).toBe(true);
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
    });

    describe('getButtonsSize', function () {
        beforeEach(function () {
            spyOn(ShareBar.prototype, 'createBars');
            this.newBar = createBar({'buttonWidth': 21, 'buttonFullWidth': 46, 'buttonPadding': 4});
        });

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
        beforeEach(function () {
            spyOn(ShareBar.prototype, 'createBars');
            this.newBar = createBar();
        });

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
        beforeEach(function () {
            spyOn(ShareBar.prototype, 'createBars');
            this.newBar = createBar();
        });

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
        beforeEach(function () {
            spyOn(ShareBar.prototype, 'createBars');
            this.newBar = createBar();
        });

        it('should return a dictionary with metadata from element', function () {
            var data = this.newBar.getMetadataFromElement(this.el),
                expectedData = {
                    'url': window.encodeURIComponent('http://globo.com'),
                    'title': window.encodeURIComponent('Test title'),
                    'imageUrl': window.encodeURIComponent('http://g1.globo.com')
                };

            expect(data).toEqual(expectedData);
        });
    });

    describe('Create Buttons', function () {
        beforeEach(function () {
            spyOn(ShareBar.prototype, 'createBars');
            this.newBar = createBar();
            this.newBar.supportSvg = true;
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
        });

        describe('createContentButton', function () {
            it('should return SVG element when SVG is enabled', function () {
                var result;

                this.newBar.supportSvg = true;
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

            it('should create facebook button', function () {
                this.newBar.createFacebookButton(this.el);
                expect(this.el.querySelector('.share-button.share-facebook a.share-popup span')).not.toBe(null);
            });

            it('should set link href with metadata of container', function () {
                var link = '';
                this.newBar.createFacebookButton(this.el);

                link = this.el.querySelector('.share-button.share-facebook a');
                expect(link.href).toEqual(
                    'http://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fglobo.com'
                );
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
                    'https://twitter.com/share?url=http%3A%2F%2Fglobo.com&text=Test%20title%20%23globo.com'
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
                spyOn(ShareBar.prototype, 'deviceIsIphone').andReturn(true);
                this.newBar.createWhatsappButton(this.el);
                expect(this.el.querySelector('.share-button.share-whatsapp a span')).not.toBe(null);
            });

            it('should set link href with metadata of container', function () {
                var link = '';
                spyOn(ShareBar.prototype, 'deviceIsIphone').andReturn(true);
                this.newBar.createWhatsappButton(this.el);

                link = this.el.querySelector('.share-button.share-whatsapp a');
                expect(link.href).toEqual(
                    'whatsapp://send?text=Test%20title%20http%3A%2F%2Fglobo.com'
                );
            });

            it('should not create whatsapp button when device is not iphone', function () {
                spyOn(ShareBar.prototype, 'deviceIsIphone').andReturn(false);
                this.newBar.createWhatsappButton(this.el);
                expect(this.el.querySelector('.share-button.share-whatsapp a span')).toBe(null);
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
        });
    });

    describe('createSVG', function () {
        beforeEach(function () {
            spyOn(ShareBar.prototype, 'createBars');
            this.newBar = createBar();
            this.newBar.supportSvg = true;
        });

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
            spyOn(ShareBar.prototype, 'createBars');
            this.newBar = createBar();
            this.newBar.supportSvg = true;
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
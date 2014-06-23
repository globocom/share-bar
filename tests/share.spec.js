/*global describe, it, expect, glb, spyOn,
         beforeEach, afterEach */

describe('glb.lightbox Test Case', function () {
    'use strict';

    beforeEach(function () {

        this.click = function (element) {
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, true, window, 1, 0, 0);
            element.dispatchEvent(event);
        };

        this.createShareContainer = function () {
            var element = document.createElement('div');
            element.className = 'glb-share';
            element.setAttribute('data-url', 'http://globo.com');
            element.setAttribute('data-title', 'Test title');
            element.setAttribute('data-subtitle', 'Test subtitle');
            element.setAttribute('data-image-url', 'http://g1.globo.com');
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
    });

    describe('mergeOptions', function () {
        it('should create properties with defaultOptions', function () {
            glb.share.mergeOptions();
            expect(glb.share.selector).toEqual('.glb-share');
            expect(glb.share.networks).toEqual({
                'facebook': glb.share.createFacebookButton
            });
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
            glb.share.networks['facebook'] = glb.share.createFacebookButton;
            glb.share.createBar(this.el);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('getMetadataFromElement', function () {
        it('should return a dictionary with metadata from element', function () {
            var data = glb.share.getMetadataFromElement(this.el),
                expectedData = {
                'url': window.encodeURIComponent('http://globo.com'),
                'title': window.encodeURIComponent('Test title'),
                'subtitle': window.encodeURIComponent('Test subtitle'),
                'imageUrl': window.encodeURIComponent('http://g1.globo.com')
            };

            expect(data).toEqual(expectedData);
        });
    });

    describe('createButton', function () {
        it('should create share button', function () {
            glb.share.createButton(this.el, 'share-test', '<a href="test">test</a>');

            expect(this.el.querySelector('.share-test a[href="test"]')).not.toBe(null);
        });
    });

    describe('createFacebookButton', function () {
        it('should create facebook button', function () {
            glb.share.createFacebookButton(this.el);
            expect(this.el.querySelector('.share-facebook a.share-popup span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            glb.share.createFacebookButton(this.el);

            link = this.el.querySelector('.share-facebook a');
            expect(link.href).toEqual(
                'http://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fglobo.com'
            );
        });
    });

    describe('createTwitterButton', function () {
        it('should create twitter button', function () {
            glb.share.createTwitterButton(this.el);
            expect(this.el.querySelector('.share-twitter a.share-popup span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            glb.share.createTwitterButton(this.el);

            link = this.el.querySelector('.share-twitter a');
            expect(link.href).toEqual(
                'https://twitter.com/share?url=http%3A%2F%2Fglobo.com&text=Test%20title%20%23globo.com'
            );
        });
    });

    describe('createGoogleButton', function () {
        it('should create googleplus button', function () {
            glb.share.createGoogleButton(this.el);
            expect(this.el.querySelector('.share-googleplus a.share-popup span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            glb.share.createGoogleButton(this.el);

            link = this.el.querySelector('.share-googleplus a');
            expect(link.href).toEqual(
                'https://plus.google.com/share?url=http%3A%2F%2Fglobo.com'
            );
        });
    });

    describe('createPinterestButton', function () {
        it('should create pinterest button', function () {
            glb.share.createPinterestButton(this.el);
            expect(this.el.querySelector('.share-pinterest a.share-popup span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            glb.share.createPinterestButton(this.el);

            link = this.el.querySelector('.share-pinterest a');
            expect(link.href).toEqual(
                'http://www.pinterest.com/pin/create/button/?url=http%3A%2F%2Fglobo.com&media=http%3A%2F%2Fg1.globo.com&description=Test%20title'
            );
        });
    });

    describe('createWhatsappButton', function () {
        it('should create whatsapp button', function () {
            glb.share.createWhatsappButton(this.el);
            expect(this.el.querySelector('.share-whatsapp a.share-popup span')).not.toBe(null);
        });

        it('should set link href with metadata of container', function () {
            var link = '';
            glb.share.createWhatsappButton(this.el);

            link = this.el.querySelector('.share-whatsapp a');
            expect(link.href).toEqual(
                'whatsapp://send?text=Test%20title%20http%3A%2F%2Fglobo.com'
            );
        });
    });
});
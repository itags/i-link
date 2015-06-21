module.exports = function (window) {
    "use strict";

    require('./css/i-link.css');

    var itagCore = require('itags.core')(window),
        itagName = 'i-link', // <-- define your own itag-name here
        DOCUMENT = window.document,
        ITSA = window.ITSA,
        Event = ITSA.Event,
        Itag, IFormElement;

    if (!window.ITAGS[itagName]) {
        IFormElement = require('i-formelement')(window);

        Event.before('anchorclick', function(e) {
            e.preventDefault();
        }, 'i-link[disabled="true"] a');

        Event.before(itagName+':manualfocus', function(e) {
            // the i-select itself is unfocussable, but its button is
            // we need to patch `manualfocus`,
            // which is emitted on node.focus()
            // a focus by userinteraction will always appear on the button itself
            // so we don't bother that
            var element = e.target;
            e.preventDefault();
            element.itagReady().then(
                function() {
                    var anchor = element.getElement('>a');
                    anchor && anchor.focus(true);
                }
            );
        });

        Itag = IFormElement.subClass(itagName, {
            /*
             *
             * @property attrs
             * @type Object
             * @since 0.0.1
            */
            attrs: {
                disabled: 'boolean',
                href: 'string',
                target: 'string',
                'button-style': 'boolean'
            },
            init: function() {
                var element = this,
                    designNode = element.getItagContainer(),
                    content = designNode.getHTML();

                // when initializing: make sure NOT to overrule model-properties that already
                // might have been defined when modeldata was boundend. Therefore, use `defineWhenUndefined`
                element.defineWhenUndefined('content', (content==='') ? '&nbsp;' : content); // sets element.model.someprop = somevalue; when not defined yet
            },

            render: function() {
                this.setHTML('<a></a>');
            },

            sync: function() {
                var element = this,
                    model = element.model,
                    anchor = element.getElement('>a');
                if (model['button-style']) {
                    anchor.setHTML('<div>'+model.content+'</div>');
                }
                else {
                    anchor.setHTML(model.content);
                }
                anchor.setAttr('href', model.href || '#');
                if (model.target) {
                    anchor.setAttr('target', model.target);
                }
                else {
                    anchor.removeAttr('target');
                }
            },

            destroy: function() {
            }
        });

        window.ITAGS[itagName] = Itag;
    }

    return window.ITAGS[itagName];
};

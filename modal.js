function () {
    if (typeof window.CustomEvent === "function") return false;
    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    window.CustomEvent = CustomEvent;
})();

$modal = function (options) {
    var
        _elModal,
        _eventShowModal,
        _eventHideModal,
        _hiding = false,
        _destroyed = false,
        _animationSpeed = 200;

    function _createModal(options) {
        var
            elModal = document.createElement('div'),
            modalTemplate = '<div class="modal__backdrop" data-dismiss="modal"><div class="modal__content"><div class="modal__header"><div class="modal__title" data-modal="title">{{title}}</div><span class="modal__btn-close" data-dismiss="modal" title="close">×</span></div><div class="modal__body" data-modal="content">{{content}}</div>{{footer}}</div></div>',
            modalFooterTemplate = '<div class="modal__footer">{{buttons}}</div>',
            modalButtonTemplate = '<button type="button" class="{{button_class}}" data-handler={{button_handler}}>{{button_text}}</button>',
            modalHTML,
            modalFooterHTML = '';

        elModal.classList.add('modal');
        modalHTML = modalTemplate.replace('{{title}}', options.title || '');
        modalHTML = modalHTML.replace('{{content}}', options.content || '');

        if (options.footerButtons) {
            for (var i = 0, length = options.footerButtons.length; i < length; i++) {
                var modalFooterButton = modalButtonTemplate.replace('{{button_class}}', options.footerButtons[i].class);
                modalFooterButton = modalFooterButton.replace('{{button_handler}}', options.footerButtons[i].handler);
                modalFooterButton = modalFooterButton.replace('{{button_text}}', options.footerButtons[i].text);
                modalFooterHTML += modalFooterButton;
            }
            modalFooterHTML = modalFooterTemplate.replace('{{buttons}}', modalFooterHTML);
        }
        modalHTML = modalHTML.replace('{{footer}}', modalFooterHTML);
        elModal.innerHTML = modalHTML;
        document.body.appendChild(elModal);
        return elModal;
    }

    function _showModal() {
        if (!_destroyed && !_hiding) {
            _elModal.classList.add('modal__show');
            document.dispatchEvent(_eventShowModal);
        }
    }

    function _hideModal() {
        _hiding = true;
        _elModal.classList.remove('modal__show');
        _elModal.classList.add('modal__hiding');
        setTimeout(function () {
            _elModal.classList.remove('modal__hiding');
            _hiding = false;
        }, _animationSpeed);
        document.dispatchEvent(_eventHideModal);
    }

    function _handlerCloseModal(e) {
        if (e.target.dataset.dismiss === 'modal') {
            _hideModal();
        }
    }

    _elModal = _createModal(options || {});


    _elModal.addEventListener('click', _handlerCloseModal);
    _eventShowModal = new CustomEvent('show.modal', { detail: _elModal });
    _eventHideModal = new CustomEvent('hide.modal', { detail: _elModal });

    return {
        show: _showModal,
        hide: _hideModal,
        destroy: function () {
            _elModal.parentElement.removeChild(_elModal),
                _elModal.removeEventListener('click', _handlerCloseModal),
                _destroyed = true;
        },
        setContent: function (html) {
            _elModal.querySelector('[data-modal="content"]').innerHTML = html;
        },
        setTitle: function (text) {
            _elModal.querySelector('[data-modal="title"]').innerHTML = text;
        }
    }
};

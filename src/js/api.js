export let noticeJsModalClassName = 'noticejs-modal';
export let closeAnimation = 'noticejs-fadeOut';

export let Defaults = {
    title: '',
    text: '',
    type: 'success',
    position: 'topRight',
    newestOnTop: false,
    timeout: 30,
    progressBar: true,
    closeWith: ['button'],
    animation: null,
    modal: false,
    width: 320,
    scroll: {
        maxHeightContent: 300,
        showOnHover: true
    },
    rtl: false,
    callbacks: {
        beforeShow: [],
        onShow: [],
        afterShow: [],
        onClose: [],
        afterClose: [],
        onClick: [],
        onHover: [],
        onTemplate: []
    }
}
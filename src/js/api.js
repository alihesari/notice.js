export let noticeJsModalClassName = 'noticejs-modal';
export let closeAnimation = 'noticejs-fadeOut';

export let Defaults = {
    title: '',
    text: '',
    type: 'success',
    position: 'topRight',
    timeout: 30,
    progressBar: true,
    closeWith: ['button'],
    animation: null,
    modal: false,
    scroll: null,
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
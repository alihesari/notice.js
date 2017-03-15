$.notice.addTheme({
    themePath: "../theme/bootstrap/",
    themeName: "bootstrap",
    themeCss: "notice-bootstrap.css",
    noticePosition: "right",
    noticeAlign: "right",
    html: {
        container: "<div class=\"noticejs\"></div>",
        notice: "<div class=\"notice alert\"></div>",
        header: "<div class=\"notice-header\"></div>",
        title:  "<div class=\"notice-title\"></div>",
        close:  "<div class=\"notice-close\">&times;</div>",
        body:   "<div class=\"notice-body\"></div>",
        footer: "<div class=\"notice-footer\"></div>"
    },
    defaultNoticeType: {
        error: {
            className: "alert-danger",
            attributes:{}
        },
        warning: {
            className: "alert-warning",
        },
        info: {
            className: "alert-info",
            attributes:{}
        },
        success: {
            className: "alert-success",
            attributes:{}
        }
    },
    noticeType: "error"
});
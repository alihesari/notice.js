(function ($) {
    /* Default plugin options */
    var noticeOptions = {
        themePath: "theme",
        themeName: "bootstrap",
        themeCss: "notice-bootstrap.css",
        noticeClose: true,
        noticePosition: "topRight",
        defaultNoticePosition: {
            topRight:{
                top: "10px",
                right: "10px"
            },
            topCenter:{
                top: "10px",
                left: "50%",
                transform: "translate(-50%, 0)"
            },
            topLeft:{
                top: "10px",
                left: "10px"
            },
            middleRight:{
                right: "10px",
                top: "50%",
                right: "10px",
                transform: "translate(0px, -50%)",
            },
            middleCenter:{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            },
            middleLeft:{
                left: "10px",
                top: "50%",
                right: "10px",
                transform: "translate(0px, -50%)",
            },
            bottomRight:{
                bottom: "10px",
                right: "10px"
            },
            bottomCenter:{
                bottom: "10px",
                left: "50%",
                transform: "translate(-50%, 0)"
            },
            bottomLeft:{
                bottom: "10px",
                left: "10px"
            }
        },
        html: {
            container: "<div class=\"noticejs\"></div>",
            notice: "<div class=\"notice\"></div>",
            header: "<div class=\"notice-header\"></div>",
            title: "<div class=\"notice-title\"></div>",
            close: "<div class=\"notice-close\">&times;</div>",
            body: "<div class=\"notice-body\"></div>",
            footer: "<div class=\"notice-footer\"></div>"
        },
        defaultNoticeType: {},
        noticeType: ""
    };
    
    /* Add Css file */
    var addCss = function(cssPath){
        var linkTag = "<link rel=\"stylesheet\" href=\""+cssPath+"\">";
        $("head").append(linkTag);
    };
    
    /* Set default options */
    var defaults = function(opt){
        return $.extend(noticeOptions, opt);
    }
    
    /* Add theme */
    var addTheme = function(def){
        if (!def) {
            throw "Missing theme definition";
        }
        if(!def.themeCss){
            throw "Missing theme css file name";
        }
        defaults(def);
        addCss(noticeOptions.themePath+noticeOptions.themeCss);
    };    
    
    $.notice = function(data,options){
        var noticeHTML,noticeHeader,noticeBody,noticeFooter = ""
        if (!data) {
            throw "Missing data definition";
        }
        if (!data.content) {
            throw "Missing Notice content definition";
        }
        /* Set Noticejs options */
        defaults(options);
        /* Check exist Notice container */
        if($(".nj_"+noticeOptions.noticePosition).length <= 0){
            var nj_tag = "<div class=\"noticejs nj_"+noticeOptions.noticePosition+"\"></div>";
            /**
            * Add Notice position
            */
            if(noticeOptions.noticePosition && noticeOptions.noticePosition != ""){
               var obj = noticeOptions.defaultNoticePosition[noticeOptions.noticePosition];
               Object.keys(obj).map(function (key) {
                   nj_tag = $(nj_tag).css(key,obj[key])[0];
               });
            }
            $("body").append(nj_tag);
        }
        /**
         * Check Notice title definition
         * Create Notice header 
         */
        if(data.title){
            noticeHeader = $(noticeOptions.html.title).html(data.title)[0];
            /* Check Notice close button */
            if(noticeOptions.noticeClose === true){
                noticeHeader = $(noticeHeader).add(noticeOptions.html.close);
            }
            noticeHeader = $(noticeOptions.html.header).html(noticeHeader)[0];
            noticeHTML = $(noticeOptions.html.notice).append(noticeHeader)[0];
        }else{
            /* Check Notice close button */
            if(noticeOptions.noticeClose === true){
                noticeHTML = $(noticeOptions.html.notice).append(noticeOptions.html.close)[0];
            }else{
                noticeHTML = noticeOptions.html.notice;
            }
        }
        /* Create Notice body */
        noticeBody = $(noticeOptions.html.body).html(data.content)[0];
        noticeHTML = $(noticeHTML).append(noticeBody)[0];
        /**
         * Check Notice footer definition
         * Create Notice footer 
         */
        if(data.footer){
            noticeFooter = $(noticeOptions.html.footer).html(data.footer)[0];
            noticeHTML = $(noticeHTML).append(noticeFooter)[0];
        }
        /**
         * Add Notice type
         * Add Notice type's attribute
         */
        if(noticeOptions.noticeType !== ""){
            /* Add Notice type class */
            if(noticeOptions.defaultNoticeType[noticeOptions.noticeType].className){
                $(noticeHTML).addClass(noticeOptions.defaultNoticeType[noticeOptions.noticeType].className);
            }
            /* Add Notice type's attributes*/
            if(noticeOptions.defaultNoticeType[noticeOptions.noticeType].attributes){
                var obj = noticeOptions.defaultNoticeType[noticeOptions.noticeType].attributes;
                Object.keys(obj).map(function (key) {
                    $(noticeHTML).attr(key,obj[key]);
                });
            }
        }
        $(".nj_"+noticeOptions.noticePosition).append(noticeHTML);
    };
    
    /* Add to Notice object */
    $.extend($.notice, {
        addTheme: addTheme,
    });
    
    /* Close button */
    $(document).on("click",".notice-close",function(){
        $(this).closest(".notice").remove();
    });
}(jQuery));
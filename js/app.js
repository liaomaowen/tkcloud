(function($) {
  'use strict';

  $(function() {
        $("#submit-form").click(function() {
            $.post(
                "/api/order/make",
                $("#order-form").serialize(),
                function(result) {
                    $('#order-info-modal').modal('close');
                    if (!result.status){
                        $("#submit-result-modal .am-modal-hd").text("提交失败");
                        $("#submit-result-modal .am-modal-bd span").removeClass("am-icon-check").addClass("am-icon-close");
                    }else{
                        $("#submit-result-modal .am-modal-hd").text("提交成功");
                        $("#submit-result-modal .am-modal-bd span").removeClass("am-icon-close");
                    }
                    $('#submit-result-modal').modal('open');
                    setTimeout(function () { 
                            $('#submit-result-modal').modal('close');
                    }, 1000);
                });
        });

    });

    var uploader = WebUploader.create({
        swf: 'http://cdn.bootcss.com/webuploader/0.1.1/Uploader.swf',
        // 文件接收服务端。
        server: '/api/file/receiver',
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: {
            id: '#picker'
        },
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false,
        accept: {
            title: 'Documents',
            extensions: 'doc,pdf,ppt',
            mimeTypes: 'application/msword,application/pdf,application/mspowerpoint'
        }
    });

    uploader.onFileQueued = function(file) {
        $('#filename').text(file.name);
        this.upload();
    };
    uploader.onUploadSuccess = function(file, response) {
        $('#uploading-modal').modal('close');
        if(response.status){
            $("#submit-result-modal .am-modal-hd").text("上传失败"+response.info);
            $("#submit-result-modal .am-modal-bd span").removeClass("am-icon-check");
            $('#submit-result-modal').modal('open');
        }else{
            $("#order-form > fieldset").append(
                '<input type="hidden" name="fileid[]" value='+response.data.fileid+' />');
            $('#order-info-modal').modal();
        }
        this.removeFile(file);
    }
    uploader.onStartUpload = function() {
        $('#uploading-modal').modal();
    }
    uploader.onUploadProgress = function(file, per) {
        var $progress = $('#' + file.id).find('.ui-progress span');
        $progress.css("width", per * 100 + "%");
    }
})(jQuery);

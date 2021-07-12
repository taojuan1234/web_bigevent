$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initEditor()

    initCate();

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                console.log(res);
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render(); //下拉框必须加上render才能渲染出数据
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //   上传图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 渲染图片
    $('#coverFile').on('change', function (e) {
        var files = e.target.files;
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域


    })

    var art_state = '已发布';
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    });

    // $('#form-pub').on('submit', function (e) {
    //     e.preventDefault();
    //     var fd = new FormData($(this)[0]);
    //     fd.append('state', art_state);
    //     $image
    //         .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
    //             width: 400,
    //             height: 280
    //         })
    //         .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
    //             // 得到文件对象后，进行后续的操作
    //             fd.append('cover_img', blob);
    //             publishArticle(fd);
    //         })
    // });

    $('#form-pub').on('submit', function(e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
          .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
          })
          .toBlob(function(blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5. 将文件对象，存储到 fd 中
            fd.append('cover_img', blob)
            // 6. 发起 ajax 数据请求
            publishArticle(fd)
          })
      })








    //请求ajax
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                location.href = 'art_list.html';
            }
        })
    }



})


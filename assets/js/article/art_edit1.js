$(function () {
    var layer = layui.layer;
    var form = layui.form;
 // 表单的自定义验证规则
 layui.form.verify({
    title: [/^.{1,30}$/, '文章标题的长度为 1-30 个字符串！']
  })
    initEditor()

    initCate();

    $('.layui-icon-left').on('click', function () {
        history.go(-1)
      })


    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                //console.log(res);
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render(); //下拉框必须加上render才能渲染出数据
                initArticleInfo()
            }
        })
    }


    // 初始化文章信息的方法
    function initArticleInfo() {
        // 处理 URL 路径中的查询参数
        const urlParams = new URLSearchParams(location.href.split('?')[1])
        const id = urlParams.get('id')

        // 请求文章的信息对象
        $.get('/my/article/' + id, function (res) {
            layui.form.val('form-edit', res.data)
            // 初始化富文本编辑器
            initEditor()
            initCropper('http://api-breakingnews-web.itheima.net' + res.data.cover_img)
            //赋值
            $("[name=content]").html(tinyMCE.activeEditor.setContent(res.data.content));
        })
    }
    

 // 初始化图片裁剪的插件
 function initCropper(src) {
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项，参考文档：https://www.cnblogs.com/eightFlying/p/cropper-demo.html
    var options = {
      aspectRatio: 400 / 280,
      preview: '.img-preview',
      // 限制裁剪框不能超出图片的范围 且图片填充模式为 cover 最长边填充
      viewMode: 2,
      // 初始化的裁剪区域大小 0 - 1 之间，1 表示裁剪框占满整个区域
      autoCropArea: 1
    }

    // 3. 初始化裁剪区域
    $image.cropper('destroy').attr('src', src).cropper(options)
    $('.cover-box').css('display', 'flex')
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

    $('#form-pub').on('submit', function (e) {
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
            .toBlob(function (blob) {
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
            url: '/my/article/edit',
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
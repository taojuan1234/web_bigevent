$(function () {
    // 过滤器美化时间
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    var q = {
        pagenum: 1,
        pagesize: 3,
        cate_id: '',
        state: ''
    }

    initTable();
    initCate();
    // 获取文章的数据列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！");
                }
                console.log(res)
                var htmlStr = template('tpl-table', res);

                $('tbody').html(htmlStr);
                renderPage(res.total)
            }
        })
    }

    // 获取分类列表的最新数据
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！');
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    $('#form-search').submit(function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        // 根据筛选的条件重新渲染表格数据
        initTable();
    });

    //分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox' ,//分页容器的id
            count: total ,//总数据条数
            limit:q.pagesize,//每页显示几条数据
            curr:q.pagenum,//设置默认被选中的分页
            layout:['count','limit','prev', 'page', 'next','skip'],
            limits:[3,5,10,15],
            jump:function(obj,first){
                q.pagenum=obj.curr;
                q.pagesize=obj.limit;
                if(!first){
                    initTable();
                }
            }
        });
    }

    //删除文章数据
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-Id');
        layer.confirm('确认删除该数据吗？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！');
                    }
                    layer.msg('删除成功!');
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })

            layer.close(index);
        });
    });




    $('tbody').on('click', '.link-title', function () {
        // 获取文章的 id
        const id = $(this).attr('data-id')
        // 请求文章的数据
        $.get('/my/article/'+id, function (res) {
          console.log(res)
          const htmlStr = template('tmpl-artinfo', res.data)
          layer.open({
            type: 1,
            title: '预览文章',
            area: ['80%', '80%'],
            content: htmlStr
          })
        })
      })


     // 编辑文章按钮的点击事件处理函数
     $('tbody').on('click', '.btn-edit', function () {
        // 获取要编辑的文章的 id
        const id = $(this).attr('data-id')
        // 跳转到文章编辑页面
        location.href = '../article/art_edit1.html?id=' + id
    
      })

})
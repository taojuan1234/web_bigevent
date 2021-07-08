$(function () {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    });

    //   自定义规则
    var form = layui.form;
    var layer=layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            var pwd = $(".reg-box [name=password]").val();
            if (pwd != value) {
                return '两次密码不一致！'
            }
        }
    })


//监听表单注册时间
$('#form_reg').on('submit',function(e){
    //阻止表单默认提交行为
    e.preventDefault();
    var data={
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val()
    }
    $.post('/api/reguser',data,function(res){
        if(res.status!==0){
            return layer.msg(res.message);
        }
        layer.msg('注册成功，请登录！');
        $('#link_login').click();
    })

});

//监听表单登录页面
$('#form_login').submit(function(e){
    e.preventDefault();
    $.ajax({
        method:'POST',
        url: "/api/login",
        data: $(this).serialize(),
        success: function (res) {
            if(res.status!==0){
                return layer.msg('登陆失败！');
            }
            layer.msg('登录成功！');
            localStorage.setItem('token',res.token);
            console.log(res.token);
            //location.href='http://127.0.0.1/index.html';
            
        }
    });
})




})
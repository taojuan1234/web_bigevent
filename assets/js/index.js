$(function () {
    getUserInfo();

    //实现退出功能
    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        layer.confirm('确认退出？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
           localStorage.removeItem('token');
           location.href='login.html';
            layer.close(index);
        });
    })
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            readerAvatar(res.data);
        }
    })
}

//渲染头像、名称
function readerAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //按需求渲染头像
    if (user.user_pic !== null) {
        //说明用户传入了头像图片
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //用户没传入头像，即使用默认的，并且首字母作为头像内容name[0]
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}
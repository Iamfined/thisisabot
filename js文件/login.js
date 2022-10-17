const logid = new verifyeveyinput('txtLoginId', async function(val) {
    if (!val) {
        return '请输入账号';
    }
    const res = await API.verifyid(val);
    if (!res.data) {
        return '账号不存在，请重新输入'
    }
})
const logpwd = new verifyeveyinput('txtLoginPwd', function(val) {
    if (!val) {
        return '密码不能为空！';
    }
})

const but = document.querySelector('.user-form');
but.onsubmit = async function(e) {
    //阻止表单的默认行为
    e.preventDefault();
    //先判断所有的信息与没有填写正确，只有填写正确之后才可以向网络端发送验证消息
    const isOk = await verifyeveyinput.Allverify(logid, logpwd);
    if (!isOk) {
        return;
    }
    //首先应该拿到所有的表单的值，运用网络对其进行检验
    const obj = {
            'loginId': logid.inputid.value,
            'loginPwd': logpwd.inputid.value,
        }
        //将这些对象利用网络进行验证
    const post = await API.login(obj);
    if (post.code === 0) {
        alert('登录成功，点击确定跳转到主页！');
        location.href = './index.html';
    }

}
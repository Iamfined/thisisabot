const regid = new verifyeveyinput('txtLoginId', async function(val) {
    if (!val) {
        return '请输入账号';
    }
    const res = await API.verifyid(val);
    if (res.data) {
        return '当前的账号已经存在，请重新输入一个账号'
    }
})
const regname = new verifyeveyinput('txtNickname', function(val) {
    if (!val) {
        return '请输入昵称';
    }
})

const regpwd = new verifyeveyinput('txtLoginPwd', function(val) {
    if (!val) {
        return '密码不能为空！';
    }
})
const againpwd = new verifyeveyinput('txtLoginPwdConfirm', function(val) {
    if (!val) {
        return '请输入确认密码！';
    }
    if (val !== regpwd.inputid.value) {
        return '两次密码输入不一致，请重新输入';
    }
})

const form = document.querySelector('.user-form');
form.onsubmit = async function(e) {
        //阻止表单的默认行为
        e.preventDefault();
        //先判断所有的信息与没有填写正确，只有填写正确之后才可以向网络端发送验证消息
        const isOk = await verifyeveyinput.Allverify(regid, regname, regpwd, againpwd);
        if (!isOk) {
            return;
        }
        //首先应该拿到所有的表单的值，运用网络对其进行检验
        const obj = {
                'loginId': regid.inputid.value,
                'loginPwd': regpwd.inputid.value,
                'nickname': regname.inputid.value,
            }
            //将这些对象利用网络进行验证
        const post = await API.register(obj);
        if (post.code === 0) {
            alert('登录成功，点击确定跳转到登录页面！');
            location.href = './login.html';
        }

    }
    //  const formData = new FormData(form); // 传入表单dom，得到一个表单数据对象
    //   const data = Object.fromEntries(formData.entries());
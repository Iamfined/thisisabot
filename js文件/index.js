(async function() {
    // 在运行这个界面的时候，首先应该判断当前是否已经登陆
    const login = await API.currentid();
    const user = login.data;
    if (!user) {
        alert('当前未登录账号，点击确认进行登录');
        location.href = './login.html';
        return;
    }
    //如果已经登陆的话，在进行下面的代码

    // 拿到所有要用到的dom元素
    const doms = {
            close: $('.close'),
            aside: {
                nickname: $('#nickname'),
                loginId: $('#loginId'),
            },
            chatcontaier: $('.chat-container'),
            val: $('#txtMsg'),
            form: $('.msg-container'),
        }
        //得到所有的聊天记录
    async function getAllmessage() {
        const chats = await API.getmessage();
        const allchatobj = chats.data;
        for (const every of allchatobj) {
            addcontent(every);
        }
        movebottom();
    }
    getAllmessage();
    //给表单注册提交事件
    doms.form.onsubmit = function(e) {
        e.preventDefault();
        sendmymessage();
    }
    async function sendmymessage() {
        //首先获取聊天框内容，封装对象，调用addhanshu
        const chatinput = doms.val.value.trim();
        if (!chatinput) {
            return;
        }
        addcontent({
            from: user.loginId,
            to: null,
            content: chatinput,
            createdAt: Date.now(),
        })
        doms.val.value = '';
        movebottom();
        const nullmessage = await API.sendmessage(chatinput);
        addcontent({
            from: null,
            to: user.loginId,
            ...nullmessage.data,
        })
        movebottom();
    }

    // 将当前的滚动条移动到最下面
    function movebottom() {
        doms.chatcontaier.scrollTop = doms.chatcontaier.scrollHeight
    }
    // 先给关闭按钮注册点击事件，点击完成后删除当前用户的登录信息
    doms.close.onclick = function() {
        API.loginOut();
        alert('当前登录信息已过期，点击确认重新登录');
        location.href = './login.html';
    }

    // 将当前的用户信息添加到右边栏
    function addUsermes() {
        doms.aside.nickname.innerText = user.nickname;
        doms.aside.loginId.innerText = user.loginId;
    }
    addUsermes();
    // 接下来就是将发送的每一条消息显示到聊天框内
    /*
  content: "你几岁啦？"
  createdAt: 1651213093992
  from: "haha"
  to: null
  */
    function addcontent(chatobj) {
        const div = $$$('div');
        div.classList.add('chat-item');
        if (chatobj.from) {
            div.classList.add('me');
        }
        const img = $$$('img');
        img.classList.add('chat-avatar');
        img.src = chatobj.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

        const divm = $$$('div');
        divm.className = 'chat-content';
        divm.innerText = chatobj.content;

        const divt = $$$('div');
        divt.classList.add('chat-date');
        divt.innerText = formatDate(chatobj.createdAt)

        div.appendChild(img);
        div.appendChild(divm);
        div.appendChild(divt);

        doms.chatcontaier.appendChild(div);
    }

    function formatDate(timeunix) {
        const time = new Date(timeunix);
        const year = time.getFullYear();
        const month = (time.getMonth() + 1).toString().padStart(2, '0');
        const day = time.getDate().toString().padStart(2, '0');
        const hour = time.getHours().toString().padStart(2, '0');
        const minute = time.getMinutes().toString().padStart(2, '0');
        const second = time.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
})();
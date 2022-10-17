var API = (function() {
    const BASE_URL = 'https://study.duyiedu.com';
    const LOCAL_KEY = 'token';

    async function get(feturl, bodyObj) {
        let headers = {};
        const localkey = localStorage.getItem(LOCAL_KEY);
        if (localkey) {
            headers.Authorization = `Bearer ${localkey}`
        }
        return fetch(BASE_URL + feturl, {
            headers,
        })
    }

    async function post(posturl, bodyObj) {
        let headers = {
            'Content-type': 'application/json',
        };
        const localkey = localStorage.getItem(LOCAL_KEY);
        if (localkey) {
            headers.authorization = `Bearer ${localkey}`
        }
        return fetch(BASE_URL + posturl, {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyObj)
        })
    }
    //注册账号
    async function register(reginf) {
        const posth = await post('/api/user/reg', reginf);
        return await posth.json();
    }
    //登录账号
    async function login(logininf) {
        const posth = await post('/api/user/login', logininf);
        const res = await posth.json();
        if (res.code === 0) {
            //如果登陆成功
            // 将响应头中的authorization保存起来
            const token = posth.headers.get('authorization');
            localStorage.setItem(LOCAL_KEY, token);
        }
        return res;
    }
    //当前登录的用户信息
    async function currentid() {
        const posth = await get('/api/user/profile');
        return await posth.json();
    }
    //验证账号
    async function verifyid(verinf) {
        const posth = await get('/api/user/exists?loginId=' + verinf, verinf);
        return await posth.json();
    }
    //发送消息
    async function sendmessage(content) {
        const posth = await post('/api/chat', {
            content
        });
        return await posth.json();
    }
    //获取消息记录
    async function getmessage() {
        const posth = await get('/api/chat/history');
        return await posth.json();
    }
    // 删除本地的登录令牌
    function loginOut() {
        localStorage.removeItem(LOCAL_KEY);
    }
    return {
        register,
        login,
        currentid,
        verifyid,
        sendmessage,
        getmessage,
        loginOut,
    };
})();
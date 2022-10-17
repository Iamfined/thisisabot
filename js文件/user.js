//书写一个通用函数，用来验证每一个表单项

class verifyeveyinput {
    /**
     * 构造器
     * @param {String} inputid 文本框的ID
     * @param {Function} verifyFunc 给验证函数传一个参数，传入的是文本框的值(value)，用来和
     */
    constructor(inputid, verifyFunc) {
            this.inputid = $('#' + inputid);
            this.p = this.inputid.nextElementSibling;
            this.verifyFunc = verifyFunc;
            this.inputid.onblur = () => { this.VerifyFunc() };
        }
        /**
         * 验证 验证成功返回true 验证失败返回false
         * @returns 
         */
    async VerifyFunc() {
            const err = await this.verifyFunc(this.inputid.value);
            if (err) {
                this.p.innerHTML = err;
                return false;
            } else {
                this.p.innerHTML = '';
                return true;
            }
        }
        /**
         * 对传入的所有验证器进行统一的验证，如果所有的验证都通过的话，返回true，否则返回false
         * @param {verifyeveyinput[]} VerifyFunc
         */

    static async Allverify(...totalver) {
        // res相当于返回的是一个Promise数组
        const res = totalver.map(res => res.VerifyFunc());
        // Promise中的静态方法Promise.all(任务数组);
        // 全部成功则成功，全部失败则失败
        const allRes = await Promise.all(res);
        return allRes.every(res => res);
    }
}
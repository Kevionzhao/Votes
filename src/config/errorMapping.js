let errorMapping = {
    getMsgAsRepsCode(repsCode){
        switch(repsCode){
            case 'U_0100_001': return '用户名或者密码错误,请重新输入';
            break;
            case 'U_0100_002': return '用户暂时没有权限,请联系管理员';
            break;
            case 'U_0100_003': return '用户名不存在,请联系管理员';
            case 'C_0000_002': return '选项不能少于一';
            break;
            default : return '服务器崩溃,请检查网络连接或者稍后在试('+repsCode+')'
        }
    }
}
export default errorMapping;
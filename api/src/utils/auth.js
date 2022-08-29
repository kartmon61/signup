const axios = require('axios');
const cryptoJS = require('crypto-js')
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');

(async () => {
    await client.connect();
  })();

exports.create4DigitCode = () => {
    /*
        랜덤 4자리수 생성 함수
        return
        - string with 4 digit
    */
    const code = Math.floor(1000 + Math.random() * 9000);
    return code + '';
};

exports.saveAuthCode = async (key, code) => {
    /*
        인증 코드 redis 캐시 저장 함수
        params
        - key: string
        - code: string
    */
    await client.set(key, code, { EX: 180 });
    await client.set(`${key}_auth_check`, 'false', { EX: 7200 });
};

exports.compareAuthCode = async (key, code) => {
    /*
        인증 코드 식별 함수
        params
        - key: string
        - code: string
        return
        - true: auth success
        - false: auth failed
    */
    const result = await client.get(key);
    if (code === result) {
        await client.del(key);
        await client.set(`${key}_auth_check`, 'true', { EX: 7200 });
        return true;
    } else {
        return false;
    }
};

exports.checkAuthFinished = async (key) => {
    /*
        인증되었는지 확인하는 함수
        params
        - key: string
        return
        - true: auth finished
        - false: auth not finished
    */
    const result = await client.get(`${key}_auth_check`);
    
    if (result === 'true') {
        await client.del(`${key}_auth_check`);
        return true;
    } else {
        return false;
    }
};

exports.sendMessageService = async (to, content) => {
    /*
        메세지 전송 함수
        params
        - to: string
        - content: string
    */
    const serviceId = process.env.SENS_SERVICE_ID; 
    const accessKey = process.env.SENS_ACCESS_KEY;
    const secretKey = process.env.SENS_SECRET_KEY;
    const fromNumber = process.env.SENS_FROM_NUMBER;
    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const date = Date.now().toString();
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
    const url2 = `/sms/v2/services/${serviceId}/messages`;
    const hmac = cryptoJS.algo.HMAC.create(cryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);
    const hash = hmac.finalize();
    const signature = hash.toString(cryptoJS.enc.Base64);
    const messages = [{ to: to }]
    
    const data = {
        type: 'SMS',
        countryCode: '82',
        from: fromNumber,
        content,
        messages,
    };

    await axios({
        url: url,
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-ncp-apigw-timestamp": date,
            "x-ncp-iam-access-key": accessKey,
            "x-ncp-apigw-signature-v2": signature,
        },
        data: data
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
};

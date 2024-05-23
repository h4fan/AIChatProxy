
window.addEventListener("message", (event) => {
  if ( event.origin == "http://127.0.0.1:8000" && event.data.action && event.data.action === "getData") {
   
    if(!window.cp_sessionid){
      window.cp_sessionid= crypto.randomUUID().replace(/-/g, "");
      fetch("https://qianwen.biz.aliyun.com/dialog/conversation", {
      "headers": {
        "accept": "text/event-stream",
        "content-type": "application/json",
        "x-platform": "pc_tongyi",
        "x-xsrf-token": window.csrfToken
      },
      "referrer": "https://tongyi.aliyun.com/qianwen/",
     
      "body": "{\"model\":\"\",\"action\":\"next\",\"mode\":\"chat\",\"userAction\":\"new_top\",\"requestId\":\""+window.cp_sessionid.replace(/"/g, '\\"')+"\",\"sessionId\":\"\",\"sessionType\":\"text_chat\",\"parentMsgId\":\"0\",\"contents\":[{\"content\":\""+event.data.data.replace(/"/g, '\\"')+"\",\"contentType\":\"text\",\"role\":\"user\"}],\"params\":{\"fileUploadBatchId\":\""+window.curBatchId.replace(/"/g, '\\"')+"\"}}",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
       
    }
    else{
      fetch("https://qianwen.biz.aliyun.com/dialog/conversation", {
      "headers": {
        "accept": "text/event-stream",

        "content-type": "application/json",
        "x-platform": "pc_tongyi",
        "x-xsrf-token": window.csrfToken
      },
      "referrer": "https://tongyi.aliyun.com/qianwen/",
     
      "body": "{\"model\":\"\",\"action\":\"next\",\"mode\":\"chat\",\"userAction\":\"chat\",\"requestId\":\""+crypto.randomUUID().replace(/-/g, "")+"\",\"sessionId\":\""+window.cp_sessionid.replace(/"/g, '\\"')+"\",\"sessionType\":\"text_chat\",\"parentMsgId\":\""+window.cp_parentid.replace(/"/g, '\\"')+"\",\"contents\":[{\"content\":\""+event.data.data.replace(/"/g, '\\"')+"\",\"contentType\":\"text\",\"role\":\"user\"}],\"params\":{\"fileUploadBatchId\":\""+window.curBatchId.replace(/"/g, '\\"')+"\"}}",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
    }
    
  }
});


(function() {

const fetch_ori = fetch
 async function fetchAndLog(url, options) {
  // Use fetch to make the network request
  return fetch_ori(url, options)
    .then(async response => {
      // Clone the response so we can log it and return it
      const clonedResponse =  response.clone();
      logAnalyze(url, clonedResponse)
      return response
    })
    .catch(error => {
      console.error('Fetch error:', error);
      //throw error;
    });
}

window.fetch = fetchAndLog

async function logAnalyze(url, clonedResponse){
     //console.log('Response from:', url);
     // console.log('Status Code:', clonedResponse.status);
     // console.log('Headers:', clonedResponse.headers);
        const reader = clonedResponse.body.pipeThrough(new TextDecoderStream()).getReader();
        function pump() {
                  return reader.read().then(({ done, value }) => {
                    // When no more data needs to be consumed, close the stream
                    if (done) {
                      return;
                    }
                    // Enqueue the next data chunk into our target stream
                    //console.log(value);
                    if(value.includes('data: [DONE]')){
                      
                      if(window.opener){
                          
                          respJson = JSON.parse(window.cp_lastmessage.substring(5))
                          window.cp_sessionid = respJson['sessionId']
                          window.cp_parentid = respJson['msgId']
                          window.opener.postMessage({ action: "responseData", data: {data: respJson['contents'][0]["content"], aisource:"qianwen" } }, 'http://127.0.0.1:8000/');
                        }
                    }
                    else{
                      window.cp_lastmessage = value
                    }

                    return pump();
                  }).catch(error => {
                console.error('Fetch error:', error);
                    // throw error;
                 });;
                }
        pump()
    return 
}

  })();
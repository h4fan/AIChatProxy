function cp_getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

window.addEventListener("message", (event) => {
  //console.log(event)
  if ( event.origin == "https://aichatproxy.pages.dev" && event.data.action && event.data.action === "getData") {
    //console.log("Message from the webpage:", event.data.data);
    
    if(window.cp_conversation_id){

    fetch("https://chatglm.cn/chatglm/backend-api/assistant/stream", {
      "headers": {
        "accept": "text/event-stream",
        "accept-language": "en-US,en;q=0.9",
        "authorization": "Bearer " + cp_getCookie('chatglm_token'),
        "content-type": "application/json",
      },
      "referrer": "https://chatglm.cn/main/alltoolsdetail",
      "body": "{\"assistant_id\":\"65940acff94777010aa6b796\",\"conversation_id\":\""+window.cp_conversation_id.replace(/"/g, '\\"')+"\",\"meta_data\":{\"mention_conversation_id\":\"\",\"is_test\":false,\"input_question_type\":\"xxxx\",\"channel\":\"\",\"draft_id\":\"\",\"quote\":\"\"},\"messages\":[{\"role\":\"user\",\"content\":[{\"type\":\"text\",\"text\":\""+event.data.data.replace(/"/g, '\\"')+"\"}]}]}",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });

    }
    else{

      fetch("https://chatglm.cn/chatglm/backend-api/assistant/stream", {
      "headers": {
        "accept": "text/event-stream",
        "accept-language": "en-US,en;q=0.9",
        "authorization": "Bearer " + cp_getCookie('chatglm_token'),
        "content-type": "application/json",
      },
      "body": "{\"assistant_id\":\"65940acff94777010aa6b796\",\"conversation_id\":\"\",\"meta_data\":{\"mention_conversation_id\":\"\",\"is_test\":false,\"input_question_type\":\"xxxx\",\"channel\":\"\",\"draft_id\":\"\",\"quote\":\"\"},\"messages\":[{\"role\":\"user\",\"content\":[{\"type\":\"text\",\"text\":\""+event.data.data.replace(/"/g, '\\"')+"\"}]}]}",
      "method": "POST",
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
     
        const reader = clonedResponse.body.pipeThrough(new TextDecoderStream()).getReader();
        function pump() {
                  return reader.read().then(({ done, value }) => {
                    // When no more data needs to be consumed, close the stream
                    if (done) {
                      return;
                    }
                    // Enqueue the next data chunk into our target stream
                   
                    if(value.includes('"status": "finish"')){
                      
                      if(window.opener){

                          var respdata = value.split('\n')
                          while (respdata.length > 0) {
                            let item = respdata.pop(); // 移除数组最后一个元素，并赋值给item
                            
                            if(item.includes('data:') && item.includes('"last_error": {}}')){
                                respJson = JSON.parse(item.split('data:').pop())
                                                          
                                window.cp_conversation_id = respJson['conversation_id']
                                window.opener.postMessage({ action: "responseData", data: {data: respJson['parts'][0]['content'][0]['text'], aisource:"chatglm" } }, 'https://aichatproxy.pages.dev/');
                                break;
                            }
                            
                          }
                          
                         }
                    }
                    

                    return pump();
                  })     .catch(error => {
                console.error('Fetch error:', error);
                    // throw error;
                 });;
                }
        pump()
    return 
}

  })();
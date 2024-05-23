
window.addEventListener("message", (event) => {
  if (  event.origin == "http://127.0.0.1:8000" && event.data.action && event.data.action === "getData") {
    document.getElementsByClassName("ql-editor")[0].click()
    document.getElementsByClassName("ql-editor")[0].children[0].innerText= event.data.data
    
    const keydownEvent = new KeyboardEvent("keydown", {
                    key: "Enter",
                    keyCode: 13,
                    bubbles: true,
                    cancelable: true
                });
    document.getElementsByClassName("ql-editor")[0].dispatchEvent(keydownEvent)
  }
});


(function() {
  const OriginalXMLHttpRequest = window.XMLHttpRequest;

  const handler = {
    construct(target, args) {
      
      xhrInstance = new OriginalXMLHttpRequest(...args);
      xhrInstance.addEventListener("load", (event)=>{
        if(event.currentTarget.responseText.includes("[DONE]")){
          if(window.opener){
            window.opener.postMessage({ action: "responseData", data: {data: document.getElementsByClassName("general-chat-item-content")[0].innerHTML, aisource:"hunyuan" } }, 'http://127.0.0.1:8000/');
          }  
        }
      
      })
      return xhrInstance;
    }
  };

  window.XMLHttpRequest = new Proxy(OriginalXMLHttpRequest, handler);
  })();
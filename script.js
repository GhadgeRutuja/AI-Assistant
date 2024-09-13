let prompt=document.querySelector("#prompt")
let container=document.querySelector(".container")
let btn=document.querySelector("#btn")
let chatContainer=document.querySelector(".chat-container")
let userMessage=null;
let Api_Url='https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?API_KEY'//APPLY YOUR OWN API KEY HERE
function createChatBox(html,className){
let div=document.createElement("div")
div.classList.add(className)
div.innerHTML=html
return div
}

function showLoading(){
    let html=` <div class="img">
                <img src="chatbot.png" alt="" width="50">
            </div>
            <p class="text"> </p>
       <img class="loading" src="loading.gif" alt="loading" height="50">`
       let AIChatBox= createChatBox(html,"AI-chat-box") 
       chatContainer.appendChild(AIChatBox)
       getApiResponse(AIChatBox)
}
async function getApiResponse(AIChatBox) {
    let textElement = AIChatBox.querySelector(".text");
    textElement.innerText = "..."; // Setting the loading text

    try {
        let response = await fetch(Api_Url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    { "role": "user", "parts": [{ text: userMessage }] }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json(); // Corrected parsing
        let candidates = data?.candidates;

        if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts && candidates[0].content.parts.length > 0) {
            let apiResponse = candidates[0].content.parts[0].text;
            textElement.innerText = apiResponse;
        } else {
            textElement.innerText = "No response available from the API.";
        }
    } catch (error) {
        console.log("Error fetching API response:", error);
        textElement.innerText = "An error occurred while fetching the response.";
    } finally {
        AIChatBox.querySelector(".loading").style.display = "none";
    }
}


btn.addEventListener("click",()=>{
    userMessage=prompt.value
    if(userMessage==""){
        container.style.display="flex"
    }{
         container.style.display="none"
    }
    if(!userMessage) return;
    let html=`  <div class="img">
                <img src="user.png" alt="" width="50">
            </div>
            <p class="text"></p>`;


  let userChatBox= createChatBox(html,"user-chat-box")    
  userChatBox.querySelector(".text").innerText=userMessage
  chatContainer.appendChild(userChatBox)
  prompt.value=""
  setTimeout(showLoading,500)

})
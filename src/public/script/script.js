const messageList = document.getElementById("messages");
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const getSessionId = () => {
    const id = localStorage.getItem("session_id");
    if (id) {
        return id
    } else {
        const newId = makeid(10)
        localStorage.setItem("session_id", newId);
        return newId
    }
}

const socket = io({
    query: {
        id: getSessionId()
    }
});


function sendMessage(val, msg) {
    socket.emit('message', val);
    messageList.innerHTML += `
        <li class='is-user animation'>
            <p class='chatbot__message'>
                ${msg}
            </p>
            <span class='chatbot__arrow chatbot__arrow--right'></span>
        </li>
    `
}

function sendCheckoutMessage(val, msg) {


    if (!$("input[id='checked']:checked").val()) {
        messageList.innerHTML += `
        <li class='is-user animation'>
            <p class='chatbot__message'>
                ${msg}
            </p>
            <span class='chatbot__arrow chatbot__arrow--right'></span>
        </li>
    `
        messageList.innerHTML += `
        <li class='is-ai animation'>
        <div class="is-ai__profile-picture">
          <svg class="icon-avatar" viewBox="0 0 32 32">
            <use xlink:href="#avatar" />
          </svg>
        </div>
        <span class='chatbot__arrow chatbot__arrow--left'></span>
        <div class='chatbot__message'>
        Please select an item to place order
        </div>
      </li>
    `
        return false;
    }

    const ordersToPlace = [];
    $("input[id='checked']:checked").each(function () {
        if (this.checked == true) {
            ordersToPlace.push(this.name)
        }
    });

    socket.emit('message', {
        number: val,
        orders: ordersToPlace
    });

    messageList.innerHTML += `
        <li class='is-user animation'>
      <p class='chatbot__message'>
        ${msg}
      </p>
      <span class='chatbot__arrow chatbot__arrow--right'></span>
    </li>
    `
    $("input[id='checked']:checked").prop("checked", false)
}



socket.on('newMessage', (val) => {
    if (val.type === "order") {
        const random = Math.floor(Math.random() * 110)
        messageList.innerHTML += `
    <li class='is-ai animation'>
        <div class="is-ai__profile-picture">
          <svg class="icon-avatar" viewBox="0 0 32 32">
            <use xlink:href="#avatar" />
          </svg>
        </div>
        <span class='chatbot__arrow chatbot__arrow--left'></span>
        <div class='chatbot__message'>${val.message}
            <div id="OrderList-${random}"></div>
        </div>
      </li>
        `
        const OrderList = document.getElementById(`OrderList-${random}`)
        val.items.forEach((i, e) => {
            OrderList.innerHTML += `<p><input type="checkbox" id='checked' name=${i.name} /> ${i.name}</p>`
        })
    } else
        if (val.type === "allOrders") {
            const random = Math.floor(Math.random() * 110)
            messageList.innerHTML += `
    <li class='is-ai animation'>
        <div class="is-ai__profile-picture">
          <svg class="icon-avatar" viewBox="0 0 32 32">
            <use xlink:href="#avatar" />
          </svg>
        </div>
        <span class='chatbot__arrow chatbot__arrow--left'></span>
        <div class='chatbot__message'>${val.message}
            <div id="ListOrder-${random}"></div>
        </div>
      </li>
        `
            const ListOrder = document.getElementById(`ListOrder-${random}`)
            val.items.forEach((i, e) => {
                const itemListRandom = makeid(10);
                ListOrder.innerHTML += `
                      <div class="order_card">  <p><b>Date</b>: ${new Date(i.createdAt).toLocaleDateString()} ${new Date(i.createdAt).toLocaleTimeString()}</p>
                        <p><b>Status</b>: ${i.status}</p>
                        <p><b>Items</b>:</p>
                        <div id="orderItemsList-${itemListRandom}"></div>
                    </div>
                    `
                i.orders.forEach((a, b) => {

                    const orderItemsList = document.getElementById(`orderItemsList-${itemListRandom}`)
                    orderItemsList.innerHTML += `${a}, `;
                })
            })
        } else {
            messageList.innerHTML += `
    <li class='is-ai animation'>
        <div class="is-ai__profile-picture">
          <svg class="icon-avatar" viewBox="0 0 32 32">
            <use xlink:href="#avatar" />
          </svg>
        </div>
        <span class='chatbot__arrow chatbot__arrow--left'></span>
        <div class='chatbot__message'>${val.message}        
        </div>
      </li>
        `
        }
    console.log(val)
})
const socket = io();
const messageList = document.getElementById("messages")

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
        No order to place
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
                ListOrder.innerHTML += `
                        <p>Date: ${new Date(i.date).toLocaleDateString()}</p>
                        <p>Status: ${i.status}</p>
                        <p>Items:</p>
                    `
                i.orders.forEach((a, b) => {
                    ListOrder.innerHTML += `${a} <br/> <div style="border-bottom: 1px solid #000; margin-bottom: 10px"></div>`;
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
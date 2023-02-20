url = 'http://127.0.0.1:5000/'

document.addEventListener('DOMContentLoaded', () => {
    getAccount();
})

let account_eth = []

async function getAccount() {
    const response = await fetch(url + 'get_eth');
    const data = await response.json();
    const account = data.account;
    let table = document.getElementById('tableBody')
    console.log(account);
    for (let i = 0; i < account.length; i++) {
        let row = table.insertRow(i)
        let cell0 = row.insertCell(0)
        let cell1 = row.insertCell(1)
        let cell2 = row.insertCell(2)
        let cell3 = row.insertCell(3)
        cell0.innerHTML = i + 1
        cell1.innerHTML = account[i][0]
        cell2.innerHTML = account[i][1]
        cell3.innerHTML = "<div class='d-flex justify-content-center'>"
        cell3.innerHTML += `<button type="button" class="btn btn-success" onclick="input_transaction('${(account[i][0])}')">Transfer</button>`
        cell3.innerHTML += '</div>'
        account_eth.push(account[i][0])
    }
}

async function transfer() {

    var praivte_key = document.getElementById('privateKeyVal').value
    var sender = document.getElementById('senderVal').value
    var recipient = document.getElementById('recipientVal').value
    var amount = document.getElementById('amountVal').value
    var gasPrice = document.getElementById('gasPriceVal').value

    console.log(`privateKey: ${praivte_key}, 
    sender: ${sender}, 
    recipient: ${recipient}, 
    amount: ${amount},
    gasPrice: ${gasPrice}`);


    const response = await fetch(url + 'transfer', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'privateKey': praivte_key,
            'sender': sender,
            'recipient': recipient,
            'amount': amount,
            'gasPrice': gasPrice
        }),
    }).catch((error) => {
        if (!praivte_key || !sender || !recipient || !amount || !gasPrice) {
            sweetError('Please fill all the field');
        }else{
            sweetError();
        }
    });
    const data = await response.json();
    console.log(data);
    await success(data.message);
}

// Sweet Alert
success = (msg = '', reload = true) => {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Transaction Successful',
        text: msg,
        showConfirmButton: false,
        timer: 1500
    })
    if (reload) {
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
}

sweetError = (msg = '') => {
    Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Transaction Failed',
        text: msg,
        showConfirmButton: false,
        timer: 1500
    })
}

viewData = (name, deposit, withdraw) => {
    Swal.fire({
        title: 'Data',
        html: `Name:${name}, Deposit:${deposit}, Withdraw:${withdraw}`,
        icon: 'info',
        confirmButtonText: 'Ok'
    })
}

input_transaction = (sender) => {
    Swal.fire({
        title: 'Enter your transfer',
        html:
            `<div class="form-floating mb-3">` +
            `<input type="text" id="privateKeyVal" class="form-control">` +
            `<label for="privateKeyVal">Private Key*</label>` +
            `</div>` +
            `<div class="form-floating mb-3">` +
            `<input type="text" id="senderVal" class="form-control" value="${sender}">` +
            `<label for="senderVal">Sender*</label>` +
            `</div>` +
            `<div class="form-floating mb-3">` +
            `<select id="recipientVal" class="form-select">` +
            `<option selected></option>` +
            `${account_eth.map((item) => `<option value="${item}">${item}</option>`).join('')}` +
            `</select>` +
            `<label for="recipientVal">Recipient*</label>` +
            `</div>` +
            `<div class="form-floating mb-3">` +
            `<input type="text" id="amountVal" class="form-control">` +
            `<label for="amountVal">Amount*</label>` +
            `</div>` +
            `<div class="form-floating mb-3">` +
            `<input type="text" id="gasPriceVal" class="form-control">` +
            `<label for="gasPriceVal">Gas Price*</label>` +
            `</div>`,
        showCancelButton: true,
        confirmButtonText: 'Transfer',
        confirmButtonColor: '#00FF00',
        cancelButtonColor: "#FF0000",
    }).then((result) => {
        if (result.isConfirmed) {
            transfer()
        }
    })
}
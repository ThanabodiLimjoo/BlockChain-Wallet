from flask_cors import CORS
from flask import Flask, jsonify, render_template, request
from web3 import Web3
# from web3.auto import w3

web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))

print(web3.eth.accounts)

app = Flask(__name__)
CORS(app)

@app.route('/get_eth')
def get_eth():

    response = {
        'account': []
    }

    for index, address in enumerate(web3.eth.accounts):
        balance_in_wei = web3.eth.get_balance(address)
        balance_in_ether = web3.fromWei(balance_in_wei, 'ether')
        print(f'Balance of {address} is {balance_in_ether} ETH \n')
        response['account'].append([address, balance_in_ether])

    return jsonify(response)

@app.route('/transfer', methods=['POST'])
def transfer_eth():

    req = request.get_json()

    transaction = {
        'to': req["recipient"],
        'value': web3.toWei(req["amount"], 'ether'),
        'gas':2100000,
        'gasPrice':web3.toWei(req["gasPrice"], 'gwei'),
        'nonce':web3.eth.getTransactionCount(req["sender"])
    }

    signed_txn = web3.eth.account.signTransaction(transaction, req["privateKey"])

    tx_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)

    return jsonify({'message': f'Transfer {req["amount"]} ETH to {req["recipient"]}'})

app.run(debug=True)
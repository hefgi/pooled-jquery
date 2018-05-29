/* eslint-disable */

function addPoolsToDOM(ob, poolsDiv) {
  // start a virtual unordered list (list with bullets - no numbers)
  const ul = $('<ul>');

  let li;
  let term;

  for (tx in ob) {
    li = $('<li>');
    term = $('<span>').html(`<strong>${ob[tx]}</strong>`).addClass('right-margin-5');

    li.append(term);

    ul.append(li);
  }

  // we add the virtual unordered list onto the html
  poolsDiv.append(ul);
}

App = {
  web3Provider: null,
  contracts: {},

  init() {
    return App.initWeb3();
  },

  initWeb3() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract() {
    $.getJSON('Pools.json', (data) => {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      const PoolsArtifact = data;
      App.contracts.Pools = TruffleContract(PoolsArtifact);

      // Set the provider for our contract.
      App.contracts.Pools.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      return App.getAccounts();
    });

    return App.bindEvents();
  },

  bindEvents() {
    $(document).on('click', '#createPoolButton', App.createPool);
    $(document).on('click', '#showPoolButton', App.showPool);
  },

  createPool(event) {
    event.preventDefault();

    const name = $('#createPoolName').val();
    const author = $('#createPoolAuthor').val();

    console.log(`Name ${name} Author ${author}`);

    let poolsInstance;

    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      }

      const account = accounts[0];

      App.contracts.Pools.deployed().then((instance) => {
        poolsInstance = instance;

        return poolsInstance.deployPool(name, author, { from: account });
      }).then((result) => {
        alert('Deploy Successful!');
        console.log(result);
        return App.getPools();
      }).catch((err) => {
        console.log(err.message);
      });
    });
  },

  getAccounts() {
    console.log('Getting Accounts...');

    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      }

      const account = accounts[0];
      $('#navBarAddress').text(account);

      return App.getPools(account);
    });
  },

  getPools() {
    console.log('Getting Pools...');
    let poolsInstance;

    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      }

      const account = accounts[0];

      App.contracts.Pools.deployed().then((instance) => {
        poolsInstance = instance;

        return poolsInstance.getPools(account, { from: account });
      }).then((result) => {
        console.log(result);
        addPoolsToDOM(result, $('#listPoolsDiv'));
      }).catch((err) => {
        console.log(err.message);
      });
    });
  },

  showPool() {
    console.log('Getting Pools...');
    let poolInstance;

    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      }

      const account = accounts[0];

      // need to show detail of a pool using truffle-connect
    });
  },

};

$(() => {
  $(window).on('load', () => {
    App.init();
  });
});

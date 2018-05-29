/* eslint-disable */

function addPoolsToDOM(ob, poolsDiv) {
  //delete old list 
  poolsDiv.empty();

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
}//showPoolDiv

function addPoolToDOM(ob, poolDiv) {
  //delete old list 
  poolDiv.empty();

  // start a virtual unordered list (list with bullets - no numbers)
  const ul = $('<ul>');

  let li;
  let term;

  let strings = [];
  var dateStartOfCrowdSale = new Date(ob[0].toNumber()*1000);
  var name = ob[1];
  var author = ob[2];
  strings.push(dateStartOfCrowdSale, name, author)

  for (let i = 0; i < strings.length; i++) {
    li = $('<li>');
    term = $('<span>').html(`<strong>${strings[i]}</strong>`).addClass('right-margin-5');

    li.append(term);

    ul.append(li);
  }

  // we add the virtual unordered list onto the html
  poolDiv.append(ul);
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

      $.getJSON('Pool.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract.
        var PoolArtifact = data;
        App.contracts.Pool = TruffleContract(PoolArtifact);

        // Set the provider for our contract.
        App.contracts.Pool.setProvider(App.web3Provider);

        //get the balance of erc20 tokens the current user has and put that on the page
        return App.getAccounts();
      });
    });

    //return App.bindEvents();
  },

  bindEvents() {
    $(document).on('click', '#createPoolButton', App.createPool);
    $(document).on('click', '#showPoolButton', App.showPool);
    $(document).on('click', '#testButton', App.showPool);
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

        return poolsInstance.poolCreated().watch((err,res) => {
          if (err) { console.log(err) }
          console.log(`pool created ${res.args.pool} from ${res.args.owner}`);
          App.getPools();
        });

        return App.getPools();
      }).catch((err) => {
        console.log(err.message);
      });
    });
  },

  getAccounts() {
    App.bindEvents();

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
    let poolInstance;
    const poolAddress = $('#showPoolAddress').val();
    console.log(`Show Pool ${poolAddress}`);

    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      }
      console.log('kikoo1');

      const account = accounts[0];

      App.contracts.Pool.at(poolAddress).then((instance) => {
        console.log(instance);

        console.log('kikoo 2');

        poolInstance = instance;

        var promises = [];

        //the first element pushed into promises
          //is the address of the Sale contract to the balanceOf function in the TutorialToken contract
        promises.push(poolInstance.deployed_time(), poolInstance.name(), poolInstance.author());
        return Promise.all(promises);
      }).then(function(result){
        console.log(result);
        addPoolToDOM(result, $('#showPoolDiv'));
      }).catch((err) => {
        console.log(err.message);
      });
      // need to show detail of a pool using truffle-connect
    });
  },

  test() {

  }

};

$(() => {
  $(window).on('load', () => {
    App.init();
  });
});

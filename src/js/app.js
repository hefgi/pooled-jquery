function addPoolsToDOM(ob, poolsDiv) {
    //start a virtual unordered list (list with bullets - no numbers)
    var ul = $('<ul>');

    // //the tx is in a key in ob, so we get to it directly
    // var firstLi = $('<li>');
    // var txTerm = $('<span>').html('<strong>tx</strong>').addClass('right-margin-5');
    // var txVal = $('<span>').html(ob.tx);
    // firstLi.append(txTerm);
    // firstLi.append(txVal);

    // ul.append(firstLi);

    //the rest of the data are grand childs of ob in ob.receipt

    var li, term;

    for (tx in ob) {
        li = $('<li>');
        term = $('<span>').html(`<strong>${ob[tx]}</strong>`).addClass('right-margin-5');

        li.append(term)

        ul.append(li);
    }

    //we add the virtual unordered list onto the html
    poolsDiv.append(ul);
}

App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
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

  initContract: function() {
    $.getJSON('Pools.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var PoolsArtifact = data;
      App.contracts.Pools = TruffleContract(PoolsArtifact);

      // Set the provider for our contract.
      App.contracts.Pools.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      return App.getAccounts();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#createPoolButton', App.createPool);
    $(document).on('click', '#showPoolButton', App.showPool);
  },

  createPool: function(event) {
    event.preventDefault();

    var name = $('#createPoolName').val();
    var author = $('#createPoolAuthor').val();

    console.log('Name ' + name + ' Author ' + author);

    var poolsInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Pools.deployed().then(function(instance) {
        poolsInstance = instance;

        return poolsInstance.deployPool(name, author, {from: account});
      }).then(function(result) {
        alert('Deploy Successful!');
        console.log(result);
        return App.getPools();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getAccounts: function() {
    console.log('Getting Accounts...');

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      $('#navBarAddress').text(account);

      return App.getPools(account);
    });
  },

  getPools: function() {
    console.log('Getting Pools...');
    var poolsInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Pools.deployed().then(function(instance) {
        poolsInstance = instance;

        return poolsInstance.getPools(account, {from: account});
      }).then(function(result) {
        console.log(result);
        addPoolsToDOM(result, $('#listPoolsDiv'));
        return 
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

  showPool: function() {
    console.log('Getting Pools...');
    var poolInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      //need to show detail of a pool using truffle-connect
    });
  }

};

$(function() {
  $(window).on('load', function() {
    App.init();
  });
});

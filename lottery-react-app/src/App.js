import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';//other than metamask version of web3
import lottery from './lottery';

class App extends Component {
  // constructor(props){
  //   super(props);

  //   this.state = {manager: ''};
  // }

  state = {
    manager:'',
    players:[],
    balance : '', // default call the constructor function
    // balance actually a object
    value:'',
    message:''  
  };

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    //this automatically call the first account in the matamask like call({from: accounts[0]})
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager, players, balance});

  }

  onSubmit  = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    this.setState({message:'waiting for transaction to be complete'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value,'ether')
    });
    this.setState({message:'transaction is successfull you have entered the game  '});

  };
  onClick = async ()=>{
    const accounts = await web3.eth.getAccounts();

    this.setState({message:'waiting transaction to complete'});
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    this.setState({ message:'A winner has  been picked!'});
  };
  render() {
   //console.log('print the accounts present in the metamask')
    return (
      <div>
        <h2>Lottery contract Here_________</h2>

        <p>This contract is managed by{this.state.manager} <br/>
           there are currently {this.state.players.length} people entered,< br/>
           competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>
        <hr/>
        <form onSubmit={this.onSubmit}>
          <h4> want  to play game in dapp </h4>
          <div>
            <label>Amount of ether to enter</label>
            <input 
            value = {this.state.value}
            onChange={event => this.setState({value: event.target.value})}
            />
            
          </div>
          <button>Enter</button>

        </form>
        <hr/>
        <h4>Ready to pick a winner</h4>
        <button onClick = {this.onClick}>Pick a winner!</button>
        <hr/>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;

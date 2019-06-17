import React,{ Component } from 'react';
import Blocks from './Blocks';
import logo from '../assets/logobill.png';

class App extends Component{

    state = {
        walletInfo:{
            address:'',
            balance: 0
        }
    }

    componentDidMount(){
        fetch('http://localhost:3500/api/wallet/info')
        .then(Response => Response.json())
        .then(json => this.setState({
            walletInfo: json
        }));
        
        
    }

    render(){
        const { address,balance } = this.state.walletInfo;

        return(
            <div className='App'>
                <img className='logo' src={logo}></img>
                <br/>
                <h3>
                    Welcome to Blockchain!!!
                </h3>
                <br/>
                <div className='walletInfo'>
                     <div>
                         Address: {address}
                     </div>
                     <div> Balance: {balance} </div>
                </div>
                <br/>
                <Blocks/>
            </div>
        )
    }
}

export default App;
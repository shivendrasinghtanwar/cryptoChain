import React,{ Component } from 'react';
import Blocks from './Blocks';

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
            <div>
                <h3>
                    Welcome to Blockchain!!!
                </h3>
                <div>
                    Address: {address}
                </div>
                <div> Balance: {balance} </div>
                <br/>
                <Blocks/>
            </div>
        )
    }
}

export default App;
import React, { Component } from 'react';
import Block from './Block';

class Blocks extends Component {
    state = {
        blocks: []
    }

    componentDidMount() {
        fetch('http://localhost:3500/api/blocks')
            .then(response => response.json())
            .then(json => this.setState({ blocks: json }))
    }


    render() {

        console.log("Block.State",this.state);

        return ( 
            <div>
                <h3>Blocks</h3>
                {
                    this.state.blocks.map(block => {
                        return(
                            <Block key={block.hash} block={block}/>
                        )
                    })
                }
            </div>
        );
    }
}

export default Blocks;
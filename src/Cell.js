import React from 'react';
import ReactDOM from 'react-dom';

class Cell extends React.Component {

    constructor( props ) {

        super( props );
    }

    /**
     *  Build using function components with conditional rendering
     *
     */
    render() {
        
        return <RenderCell data={this.props.data} onClick={this.props.onClick} />;
    }

    /**
     *  Render using different classnames to change
     *  the background colours
     */
    // render() {
    //
    //     let className = 'cell ';
    //
    //     if ( this.props.data.isRevealed ) {
    //
    //         if ( this.props.data.isNearItem ) {
    //
    //             className += ' isNearItem';
    //         } else if ( this.props.data.isFarItem ) {
    //
    //             className += ' isFarItem';
    //         } else if ( this.props.data.containsItem ) {
    //
    //             className += ' containsItem';
    //         } else {
    //
    //             className += ' revealed';
    //         }
    //     }
    //
    //     return (
    //         <div className={className} onClick={this.props.onClick}></div>
    //     );
    // }
};

function RenderCell( props ) {

    if ( props.data.isRevealed ) {

        if ( props.data.isNearItem ) {

            return <CellIsNearItem />;
        } else if ( props.data.isFarItem ) {

            return <CellIsFarItem />;
        } else if ( props.data.containsItem ) {

            return <CellContainsItem />;
        } else {

            return <CellRevealed />;
        }
    }

    return <div className="cell" onClick={props.onClick}></div>;
}

function CellRevealed( props ) {

    return (
        <div className="cell revealed" onClick={props.onClick}></div>
    );
}

function CellIsFarItem( props ) {

    return (
        <div className="cell isFarItem" onClick={props.onClick}></div>
    );
}

function CellIsNearItem( props ) {

    return (
        <div className="cell isNearItem" onClick={props.onClick}></div>
    );
}

function CellContainsItem( props ) {

    return (
        <div className="cell containsItem" onClick={props.onClick}></div>
    );
}

export default Cell;

import React from 'react';
import ReactDOM from 'react-dom';

import Cell from './Cell';

/**
 *  Board uses the data and event handlers passed from Game
 *    to initialise the Cells.
 *
 *
 */
class Board extends React.Component {

    constructor( props ) {

        super( props );
    }

    renderCell( x, y ) {

        return (
            <Cell
                data={this.props.grid[ x ][ y ]}
                onClick={() => this.props.onClick( x, y )}
            />
        );
    }

    buildRow( row, y ) {

        const columns = row.map( ( column, x ) => this.renderCell( x, y ) );

        return <div className="board-row">{columns}</div>;
    }

    /**
     *  BONUS POINTS:
     *      Tweak the loop so that 0, 0 is bottom left instead of top left
     *      I win all the bonus points: board.reverse() flips the rows!
     */
    render() {

        const board = this.props.grid.map( ( row, y ) => this.buildRow( row, y ) );

        // reverse the order, so that the grid is rendered from top to bottom
        board.reverse();

        return (
            <div className="board">
                {board}
            </div>
        );
    }
}

export default Board;

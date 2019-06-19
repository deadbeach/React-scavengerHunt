import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import Board from './Board';
import Modal from './Modal';

/**
 *  Game controls the logic and state of the components
 *  Game passes data and event handlers to it's child components
 *    via props.
 *  The event handlers use setState here to re-render the child components,
 *    which update based on the changed props that are passed down to them
 */
class Game extends React.Component {

    constructor( props ) {

        super( props );

        this.defaultOptions = {
            rows          : 10,
            columns       : 10,
            maxLoopCount  : 50,
            gameComplete  : false,
            numberOfItems : 3,
        };

        // Overwrite default options with props
        this.settings = Object.assign( {}, this.defaultOptions, props );

        const grid = this.createGrid();

        this.state = {
            grid         : grid,
            isModalOpen  : false,
            clickedCell  : {},
            matchedItems : 0,
        };
    }

    /**
     *  Resets the game by resetting the grid, re-populating
     *  the items, and resetting the score
     */
    resetGame() {

        let grid = this.createGrid();

        console.log( 'populatedGrid is:' );
        console.log( grid );

        this.setState( {
            grid  : grid,
            matchedItems : 0,
            isModalOpen  : false,
            gameComplete : false,
        } );
    }

    /**
     *  Calculates the boundary of a cell that could potentially
     *  contain a related cell.
     *
     *  @param {Integer} x
     *  @param {Integer} y
     *  @param {Boolean} close false How many spaces to calculate around
     *
     *  @return {Object} bounds
     */
    calculateBounds( x, y, close = false ) {

        const offset = close ? 1 : 2;

        return {
            x : {
                min : Math.max( x - offset, 0 ),                         // don't drop into -ive figures
                max : Math.min( x + offset, this.settings.columns - 1 ), // don't exceed number of columns
            },
            y : {
                min : Math.max( y - offset, 0 ),
                max : Math.min( y + offset, this.settings.rows - 1 ),
            }
        };
    }

    /**
     *  Controls modal state
     */
    handleModalClick(  ) {

        const newState = {};

        /**
         *  Adding this here as I want the last modal to popup,
         *  the user to dismiss it, *then* the finished modal to appear
         */
        if ( this.state.matchedItems === this.settings.numberOfItems ) {

            newState.gameComplete = true;
        } else {

            newState.isModalOpen = false;
        }

        this.setState( newState );
    }

    handleCellClick( x, y ) {

        console.log( "clicked on " + x + ", " + y );

        // Keep the data immutable
        const grid = this.state.grid.slice();

        let openModal    = false;
        let matchedItems = this.state.matchedItems;

        // Update the data
        grid[ x ][ y ].isRevealed = true;

        if ( grid[ x ][ y ].containsItem ) {

            matchedItems++;
            openModal = true;
        }

        // Replace the existing data with the new set
        this.setState( {
            grid   : grid,
            isModalOpen   : openModal,
            clickedCell   : grid[ x ][ y ],
            matchedItems  : matchedItems,
        } );
    }

    /**
     *  Creates the basic grid structure
     */
    createGrid() {

        let grid = [];

        for ( let x = 0; x < this.settings.columns ; x++ ) {

            grid[ x ] = [];

            for ( let y = 0; y < this.settings.rows; y++ ) {

                grid[ x ][ y ] = {
                    isFarItem    : false,
                    isNearItem   : false,
                    containsItem : false,
                    isRevealed   : false,
                };
            }
        }

        grid = this.populateGrid( grid );

        return grid;
    }

    /**
     *  Places assets into grid
     *
     *  Use
     *      const grid = this.state.baseGrid.slice()
     *  to keep the data immutable.  use
     *      setState( { grid : grid } )
     *  so that we have a base grid to reset to
     */
    populateGrid( grid ) {

        let loopCount   = 0;
        let placedItems = 0;

        while ( placedItems < this.settings.numberOfItems && loopCount < this.settings.maxLoopCount ) {

            // Assume that we can place it here, until we find a reason not to
            let placeItemHere = true;

            // Start by picking a random coordinate
            let x = Math.floor( Math.random() * ( this.settings.columns - 1 ) );
            let y = Math.floor( Math.random() * ( this.settings.rows - 1 ) );

            // Check whether we already have something here
            if ( grid[ x ][ y ].containsItem ) {

                loopCount++;
                continue;
            }

            // Get the boundaries of potentially related cells
            const bounds      = this.calculateBounds( x, y );
            const closeBounds = this.calculateBounds( x, y, true );

            // Check whether placing an item here would clash with another
            for ( let i = bounds.x.min; i <= bounds.x.max; i++ ) {

                for ( let j = bounds.y.min; j <= bounds.y.max; j++ ) {

                    // ignore isFarItem for now...
                    if ( grid[ i ][ j ].containsItem || grid[ i ][ j ].isNearItem ) {

                        placeItemHere = false;
                        break;
                    }
                }

                if ( ! placeItemHere ) break;
            }

            // Discard the position if it clashes with another
            if ( ! placeItemHere ) {

                loopCount++
                continue;
            }

            // We have a valid position to plot the item
            grid[ x ][ y ].containsItem   = true;
            grid[ x ][ y ].itemAssetIndex = placedItems; // re-using a var for array index

            console.log( '<<< Placed Item: >>>' );
            console.log( 'x: ' + x );
            console.log( 'y: '+ y );
            console.log( bounds );

            // Now we set the boundaries of the item
            for ( let i = bounds.x.min; i <= bounds.x.max; i++ ) {

                for ( let j = bounds.y.min; j <= bounds.y.max; j++ ) {

                    /**
                     *  check the inner bounds first, since bounds will iterate over
                     *  the inner bounds coordinates
                     *
                     *  If we are within the inner bounds coordinates, and the cell
                     *  does not containsItem, set isNearItem
                     *
                     *  Otherwise, check whether the cell containsItem or is close
                     *  If it is not, set it to isFarItem
                     *
                     *  calcuating closeBounds and farBounds from just bounds...
                     */

                    if (
                        ( i >= closeBounds.x.min && i <= closeBounds.x.max ) &&
                        ( j >= closeBounds.y.min && j <= closeBounds.y.max ) &&
                        ! grid[ i ][ j ].containsItem
                    ) {

                        grid[ i ][ j ].isNearItem = true;

                        /**
                         *  Just an idea at the moment:
                         *
                         *  I *think* it should already be taken care of just by the order I'm checking
                         *  the boolean values, but just to make sure / keep data intregity:
                         *
                         *  If there is an overlap between isFarItem of a previous item and
                         *  isNearItem of the current item, remove isFarItem from the cell
                         *
                         *  isNearItem takes precedence over isFarItem, and is checked first.
                         *  However, remove isFarItem if we are setting isNearItem
                         */

                        if ( grid[ i ][ j ].isFarItem )
                            grid[ i ][ j ].isFarItem = false;

                    } else if ( ! ( grid[ i ][ j ].containsItem || grid[ i ][ j ].isNearItem ) ) {

                        grid[ i ][ j ].isFarItem = true;
                    }
                }
            }

            placedItems++;
            loopCount++;
        }

        return grid;
    }

    render() {

        return (
            <div className="board-wrapper">
                <Board
                    grid={this.state.grid}
                    onClick={( x, y ) => this.handleCellClick( x, y )}
                />
                <Modal
                    show={this.state.isModalOpen}
                    cell={this.state.clickedCell}
                    gameComplete={this.state.gameComplete}
                    resetGame={() => this.resetGame()}
                    onClick={() => this.handleModalClick()}
                />
            </div>
        );
    }
}

export default Game;

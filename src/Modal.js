import React from 'react';
import ReactDOM from 'react-dom';

class Modal extends React.Component{

    constructor( props ) {

        super( props );

        /**
         *  Ideally, this would be pulled from a JSON dataset or similar.
         *  Something that doesn;t require us to edit code to change assets basically.
         */
        this.assetSet = [
            {
                text     : "Geoff found this Spitfire cannon shell case in a field at the back of the airfield.  This held the explosive, and would fall to the ground after use.",
                title    : "Spitfire cannon shell",
                imageSrc : '/images/1.png',
            },
            {
                text     : "Geoff and his friends found out that a Spitfire had crashed nearby and ran to the site.  Geoff discovered this - it was an escape bar. If a pilot crashed his Spitfire and could not get out he would use the bar to force the canopy open.",
                title    : "Escape bar",
                imageSrc : '/images/2.png',
            },
            {
                title    : "Spitfire compass",
                text     : "This is a Spitfire compass. Geoff actually swapped a piece of a radio for this Spitfire compass with a friend from Downe School.",
                imageSrc : '/images/3.png',
            },
        ];
    }

    render() {

        if ( ! this.props.show ) return null;

        let className;

        console.log( '<< Modal render >>' );
        console.log( this.props );

        if ( this.props.gameComplete ) {

            className = 'modal-complete';
        } else if ( this.props.cell.containsItem ) {

            className = 'modal-containsItem';
        } else if ( this.props.cell.isNearItem ) {

            className = 'modal-isNearItem';
        } else if ( this.props.cell.isFarItem ) {

            className = 'modal-isFarItem';
        }

        return (

            <div id="modal-background">
                <div id="modal" className={className}>
                    <div className="modal-header">
                        <div className="modal-close" onClick={this.props.onClick}>X</div>
                    </div>
                    <div className="modal-body">
                        {this.props.gameComplete && <ModalComplete onClick={this.props.onClick} resetGame={this.props.resetGame} />}
                        {
                            ( this.props.cell.containsItem && ! this.props.gameComplete ) &&
                            <ModalFound item={this.assetSet[ this.props.cell.itemAssetIndex ]} />
                        }
                        {
                            ! ( this.props.cell.containsItem || this.props.gameComplete ) &&
                            <ModalNotFound isNearItem={this.props.cell.isNearItem ? true : false} />
                        }
                    </div>
                    {
                        ! this.props.gameComplete &&
                        <div className="modal-footer">
                            <button onClick={this.props.onClick}>Keep scavenging</button>
                        </div>
                    }

                </div>
            </div>
        );
    }
}

function ModalComplete( props ) {

    return (

        <div className="modal-body-inner">
            <div className="modal-body-header">
                <h3>Well done, you have helped Geoff find all the items.
                But you took lots of risks doing it.  There could have been live, unexploded bombs out there.</h3>
            </div>
            <div className="modal-body-footer">
                <button onClick={props.resetGame}>Restart</button>
                <button onClick={props.onClick}>Close</button>
            </div>
        </div>
    );
}

function ModalFound( props ) {

    return (

        <div className="modal-body-inner">
            <div className="modal-body-header">
                <h3>{props.item.title}</h3>
            </div>
            <div className="modal-body-left">
                <img className="modal-image" src={props.item.imageSrc} />
            </div>
            <div className="modal-body-right">
                <p>{props.item.text}</p>
            </div>
        </div>
    );
}

function ModalNotFound( props ) {

    return (

        <div className="modal-body-inner">
            <h1 className="modal-result-test">{props.isNearItem ? "Getting warmer!\nTry again" : "Brrrr Ice cold!\nNothing here"}</h1>
        </div>
    )
}

export default Modal;

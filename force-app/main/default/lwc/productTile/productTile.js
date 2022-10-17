import { LightningElement,api } from 'lwc';
const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS  = 'tile-wrapper';

export default class ProductTile extends LightningElement {
    @api boat;
    @api selectedBoatId;

    get tileClass() { 
        if(this.selectedBoatId){
            return TILE_WRAPPER_SELECTED_CLASS;
        }else return TILE_WRAPPER_UNSELECTED_CLASS;
    }
    
    // Fires event with the Id of the boat that has been selected.
    selectBoat() {
    //     const boatId = this.boat.Id;
    // const boatselectEvent = new CustomEvent('boatselect', {
    //   detail: { boatId }
    // });
    // this.dispatchEvent(boatselectEvent);
    }
}
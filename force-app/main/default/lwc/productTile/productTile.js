import { LightningElement,api } from 'lwc';
const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS  = 'tile-wrapper';

export default class ProductTile extends LightningElement {
    @api
    product;
    @api
    selectedProduct;
    // get backgroundStyle() {
    //     console.log(this.product.Product2.Product);
    //     return 'background-image:url(' + this.product.Product2.Product_Picture_URL__c + ')';
    // }

}
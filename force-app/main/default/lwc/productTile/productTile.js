import { LightningElement,api, track,wire } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import getPictureUrl from '@salesforce/apex/searchResultController.getPictureUrl';

import seedetails from '@salesforce/label/c.See_Details_Button';
import rating from '@salesforce/label/c.Rating_Label';

export default class ProductTile extends NavigationMixin(LightningElement) {

    label = {
        seedetails,
        rating
    };
    
    @api
    product;
    @api
    selectedProduct;
    @track
    productId;

    selectProduct(){
        console.log(this.product.Product2Id);
        this.selectProduct = this.product.Product2Id;
        const productSelected = new CustomEvent('productSelected',{
            detail:{
                prodId: this.productSelected
            }
        });
        this.dispatchEvent(productSelected);
        this.handleNavigate(this.product.Product2Id);
    }
    handleNavigate(productId) {
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://beebetter-dev-ed.develop.my.site.com/s/prod-details?recordId=' + productId
            }
        }).then(generatedUrl => {
            window.open(generatedUrl,"_self");
        });
      }

}
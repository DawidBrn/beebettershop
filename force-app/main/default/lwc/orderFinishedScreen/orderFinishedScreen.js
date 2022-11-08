import { LightningElement,api,wire,track } from 'lwc';
import { CurrentPageReference,NavigationMixin } from 'lightning/navigation';
import orderNumber from '@salesforce/apex/orderController.getOrderNumber';
export default class OrderFinishedScreen extends NavigationMixin(LightningElement)  {

    recordId;
    ordN;
    @wire(CurrentPageReference)
    currentPageReference; 

    get recordIdFromState(){
        return this.currentPageReference &&
            this.currentPageReference.state.recordId; 
    }

    connectedCallback(){
        this.recordId=this.recordIdFromState;
        console.log(this.recordId);
        this.orderNumber();
    }

    orderNumber(){
        getOrderNumber({id : '$recordId'}).then((result) => {
            console.log(result);
            this.ordN = result.data;
        });
        
    }

    get recordIdState(){
        return this.recordId;
    }

    goToOrders() {
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://beebetter-dev-ed.develop.my.site.com/s/orders'
            }
        }).then(generatedUrl => {
            window.open(generatedUrl,"_self");
        });
    }
}
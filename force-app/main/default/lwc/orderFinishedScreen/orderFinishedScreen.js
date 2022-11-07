import { LightningElement,api,wire,track } from 'lwc';
import { CurrentPageReference,NavigationMixin } from 'lightning/navigation';
export default class OrderFinishedScreen extends NavigationMixin(LightningElement)  {

    recordId;

    @wire(CurrentPageReference)
    currentPageReference; 

    get recordIdFromState(){
        return this.currentPageReference &&
            this.currentPageReference.state.recordId; 
    }

    connectedCallback()
    {
        this.recordId=this.recordIdFromState;
        console.log(this.recordId);
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
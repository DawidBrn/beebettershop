public with sharing class productDiscountManagerController {
    
    @AuraEnabled(Cacheable=true)
    public static List<Pricebook2> getAllPriceBooks(){
        List<Pricebook2> pricebook2s = [
                SELECT Id, IsActive,FlatValueDiscount__c,PercentValueDiscount__c, Name
                FROM Pricebook2
                WHERE IsActive = TRUE
        ];
        return pricebook2s;
    }
    @AuraEnabled(Cacheable=true)
    public static List<Product2> getAllProducts(){
        List<Product2> product2s = [
                SELECT Id, Name, Family,DisplayUrl, IsActive, (SELECT UnitPrice,IsActive FROM PricebookEntries)
                FROM Product2
        ];
        return product2s;
    }
    @AuraEnabled
    public static Pricebook2 createPricebook(String wrp){
        Pricebook2 pricebook = new Pricebook2();
        DiscountWrapper wrapper = (DiscountWrapper) JSON.deserialize(wrp,DiscountWrapper.class);
        if(wrapper.discountName != null){
            pricebook.Name = wrapper.discountName;
            pricebook.IsActive = true;
            if(wrapper.discountType == 'Currency'){
                pricebook.FlatValueDiscount__c = wrapper.discountValue;
            }else{
                pricebook.PercentValueDiscount__c = wrapper.discountValue;
            }
        }else return null;

        try {
            insert pricebook;
            Pricebook2 prcbk = new Pricebook2();
            prcbk.Id = pricebook.Id;
            prcbk.IsActive = pricebook.IsActive;
            prcbk.Name = pricebook.Name;
            If(pricebook.PercentValueDiscount__c != null){
                prcbk.PercentValueDiscount__c = pricebook.PercentValueDiscount__c;
            }else prcbk.FlatValueDiscount__c = pricebook.FlatValueDiscount__c;
            return prcbk;
            
        } catch (DMLException e) {
            return null;
        }
    }
    @AuraEnabled
    public static void deletePricebook2(String id){
        delete [SELECT Id FROM Pricebook2 WHERE Id =: id];
    }
    @AuraEnabled
    public static string addProductsToPricebook(List<Product2> products, Pricebook2 pricebook){

        Boolean flag = false;
        PricebookEntry existingPricebookEntry = new PricebookEntry();
        List<PricebookEntry> existingProducts = [
                SELECT Id, Product2Id, IsActive, Pricebook2Id, Pricebook2.IsStandard, Product2.Name, Product2.Family, UnitPrice
                FROM PricebookEntry
                WHERE Product2Id IN : products
                AND Pricebook2.IsStandard = FALSE
        ];
        for (PricebookEntry pricebookEntry : existingProducts){
            pricebookEntry.IsActive = false;
            if (pricebookEntry.Pricebook2Id == pricebook.Id) {
                flag = true;
                existingPricebookEntry = pricebookEntry;
            }
        }
        update existingProducts;

        if (flag == true) {
            existingPricebookEntry.IsActive = true;
            update existingPricebookEntry;
            return ('flag true' + JSON.serialize(existingPricebookEntry));
        }
        else {
            List<PricebookEntry> standardPricebookEntry = [
                    SELECT Id, Product2Id, IsActive, Pricebook2Id, Pricebook2.IsStandard, Product2.Name, Product2.Family, UnitPrice
                    FROM PricebookEntry
                    WHERE Product2Id IN : products
                    AND Pricebook2.IsStandard = TRUE
            ];

            List<PricebookEntry> newPricebookEntry = new List<PricebookEntry>();
            for (PricebookEntry pricebookEntry : standardPricebookEntry){
                PricebookEntry pricebookEntry2 = new PricebookEntry();
                if (pricebook.FlatValueDiscount__c != 0 && pricebook.FlatValueDiscount__c != null) {
                    pricebookEntry2.UnitPrice = pricebookEntry.UnitPrice - pricebook.FlatValueDiscount__c;
                    if(pricebookEntry2.UnitPrice >= 0){
                        pricebookEntry2.UnitPrice = 0.99;
                    }
                }
                if (pricebook.PercentValueDiscount__c != 0 && pricebook.PercentValueDiscount__c != null) {
                    pricebookEntry2.UnitPrice = pricebookEntry.UnitPrice * (1 - (pricebook.PercentValueDiscount__c * 0.01));
                    if(pricebookEntry2.UnitPrice >= 0){
                        pricebookEntry2.UnitPrice = 0.99;
                    }
                }
                pricebookEntry2.Product2Id = pricebookEntry.Product2Id;
                pricebookEntry2.Pricebook2Id = pricebook.Id;
                pricebookEntry2.IsActive = true;
                newPricebookEntry.add(pricebookEntry2);
            }
            try {
                insert newPricebookEntry;
                return ('flag false' +JSON.serialize(newPricebookEntry));
            } catch (DMLException e){
                return e.getMessage();
            }
        }
    }

    public class DiscountWrapper{
        public String discountName;
        public String discountType;
        public Decimal discountValue; 
    }
}

public without sharing class searchResultController {
    @AuraEnabled(cacheable=true)
    public static List<PriceBookEntry> searchByName(String term){     
            String query = 'SELECT Id, Product2.Name,Product2.DisplayUrl,Product2.Family,Product2.Details_URL__c, UnitPrice, Product2Id, Pricebook2Id, IsActive,' + 
            'ProductCode FROM PriceBookEntry WHERE Pricebook2Id = \'01s7S000000iXSvQAM\' AND IsActive = true';
            if (String.isNotEmpty(term)) {
                query += ' AND Name LIKE \'%' + term + '%\'' ;
            }
            List<PriceBookEntry> pricebookEntries = Database.query(query);
            System.debug(PriceBookEntries);
            return pricebookEntries;        
    }
    @AuraEnabled(cacheable=true)
    public static List<PriceBookEntry> getAllProducts(){
         return [
                SELECT  
                Id,UnitPrice,Product2Id,Pricebook2Id,IsActive,ProductCode,Product2.Name,Product2.Family,Product2.DisplayUrl,Product2.Details_URL__c 
                FROM PriceBookEntry
                WHERE Pricebook2Id = '01s7S000000iXSvQAM' 
                AND IsActive = true
                ];       
    }
    @AuraEnabled(cacheable=true)
    public static PriceBookEntry getProductById(String recordId){
        PriceBookEntry prod = [
            SELECT  
            Id,UnitPrice,Product2Id,Pricebook2Id,IsActive,ProductCode,Product2.Name,Product2.Family,Product2.DisplayUrl,Product2.Description,Product2.Details_URL__c 
            FROM PriceBookEntry
            WHERE Pricebook2Id = '01s7S000000iXSvQAM' 
            AND Product2Id = :recordId
            ];
            return prod;
    }
    @AuraEnabled
    public static string getPictureUrl(String recordId){     
        ContentDocumentLink link = [SELECT ContentDocumentId FROM ContentDocumentLink where LinkedEntityId ='01t7S000000o8VlQAI'];
        String docId = link.ContentDocumentId;
        ContentVersion file = [SELECT Id FROM ContentVersion WHERE ContentDocumentId =: docId LIMIT 1];
        return URL.getSalesforceBaseUrl().toExternalForm() + '/sfc/servlet.shepherd/version/download/' + file.Id;
    }
}
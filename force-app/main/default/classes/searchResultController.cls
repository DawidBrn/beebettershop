public without sharing class searchResultController {
    @AuraEnabled(cacheable=true)
    public static List<PriceBookEntry> searchByName(String term){
        
            String query = 'SELECT Id, Product2.Name,Product2.DisplayUrl, UnitPrice, Product2Id, Pricebook2Id, IsActive,' + 'ProductCode FROM PriceBookEntry WHERE Pricebook2Id = \'01s7S000000iXSvQAM\' AND IsActive = true';
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
                Id,
                UnitPrice,
                Product2Id,
                Pricebook2Id,
                IsActive,
                ProductCode,
                Product2.Name,
                Product2.DisplayUrl FROM PriceBookEntry
                WHERE Pricebook2Id = '01s7S000000iXSvQAM' 
                AND IsActive = true
                ];
            
    }
        
}
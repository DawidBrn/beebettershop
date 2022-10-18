public with sharing class searchResultController {
    @AuraEnabled(cacheable=true)
    public static List<PriceBookEntry> searchByName(String term){
        try {
            String query = 'SELECT Id, Product2.Name, UnitPrice, Product2Id, Pricebook2Id, IsActive,' + 'ProductCode FROM PriceBookEntry WHERE Pricebook2Id = \'01s7S000000iXSvQAM\' AND IsActive = true';
            if (String.isNotEmpty(term)) {
                query += ' AND Name LIKE ' + '\'' + term + '%\'' + ')';
            }
            List<PriceBookEntry> pricebookEntries = Database.query(query);
            System.debug(PriceBookEntries);
            return pricebookEntries;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<PriceBookEntry> getAllProducts(){
        try {
            List<PriceBookEntry> PriceBookEntries = [
                SELECT  
                Id,
                UnitPrice,
                Product2Id,
                Pricebook2Id,
                IsActive,
                ProductCode FROM PriceBookEntry
                WHERE Pricebook2Id = '01s7S000000iXSvQAM' 
                AND IsActive = true
                ];
            return PriceBookEntries;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
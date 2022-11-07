public without sharing class searchResultController {

    @AuraEnabled(cacheable=true)
    public static List<PriceBookEntry> searchByName(String term){     
            String query = 'SELECT Id, Product2.Name,Product2.DisplayUrl,Product2.Family, UnitPrice, Product2Id, Pricebook2Id, IsActive,' + 
            'ProductCode FROM PriceBookEntry WHERE Pricebook2Id = \'01s7S000000iXSvQAM\' AND IsActive = true';
            if (String.isNotBlank(term)) {
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
                Id,UnitPrice,Product2Id,Pricebook2Id,IsActive,ProductCode,Product2.Name,Product2.Family,Product2.DisplayUrl
                FROM PriceBookEntry
                WHERE Pricebook2Id =: getActivePriceBookId() 
                AND IsActive = true
                ];       
    }
    @AuraEnabled(cacheable=true)
    public static PriceBookEntry getProductById(String recordId){
        PriceBookEntry prod = [
            SELECT  
            Id,UnitPrice,Product2Id,Pricebook2Id,IsActive,ProductCode,Product2.Name,Product2.Family,Product2.DisplayUrl,Product2.Description,Product2.Composition__c,Product2.RecommendedUse__c 
            FROM PriceBookEntry
            WHERE Pricebook2Id =: getActivePriceBookId()  
            AND Product2Id = :recordId
            ];
            return prod;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getCategories(){
        List<String> pickListValuesList= new List<String>();
		Schema.DescribeFieldResult fieldResult = Product2.Family.getDescribe();
		List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
		for( Schema.PicklistEntry pickListVal : ple){
			pickListValuesList.add(pickListVal.getLabel());
		}     
		return pickListValuesList;
    }
    @AuraEnabled
    public static List<PriceBookEntry> getFilteredEntries(String filterValue , String term){
        String query = 'SELECT Id, Product2.Name,Product2.DisplayUrl,Product2.Family,Product2.DisplayUrl, UnitPrice, Product2Id, Pricebook2Id, IsActive,' + 
            'ProductCode FROM PriceBookEntry WHERE Pricebook2Id = \'01s7S000000iXSvQAM\' AND IsActive = true';
            if (String.isNotBlank(term)) {
                query += ' AND Name LIKE \'%' + term + '%\'' ;
            }
            if (String.isNotBlank(filterValue)) {
                query += ' AND Product2.Family = \'' + filterValue + '\'' ;
            }
            List<PriceBookEntry> pricebookEntries = Database.query(query);
            System.debug(PriceBookEntries);
            return pricebookEntries; 
    }

    public static String getActivePriceBookId(){
        PriceBook2 pricebook = [
            SELECT Id,IsActive
            FROM PriceBook2
            WHERE Id = '01s7S000000iXSvQAM'
            AND IsActive = true
        ];
        return pricebook.Id;
    }
}
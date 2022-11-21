public with sharing class handleRecord {
    @AuraEnabled(Cacheable=false)
    public static void insertRecord(Integer amortization, Decimal interestRate, Decimal mortgageAmount, String paymentFrequency, Decimal overallPayment, Decimal payment) {
        
        Mortgage_Details__c md = new Mortgage_Details__c(Amortization__c = amortization,
            Interest_Rate__c = interestRate,
            Mortgage_Amount__c = mortgageAmount,
            Payment_Frequency__c = paymentFrequency,
            Overall_Payment__c = overallPayment,
            Payment__c = payment);
        insert md;

    }

    @AuraEnabled(Cacheable=true)
    public static List<Mortgage_Details__c> getRecord() {
        return [SELECT Name, Id, Amortization__c, Interest_Rate__c, Mortgage_Amount__c, Payment_Frequency__c, Overall_Payment__c, Payment__c FROM Mortgage_Details__c ORDER BY Name LIMIT 20];
    }

    @AuraEnabled(Cacheable=false)
    public static void deleteRecord(Id searchId) {
        
        delete [SELECT Id FROM Mortgage_Details__c WHERE Id =:searchId];
    }
}

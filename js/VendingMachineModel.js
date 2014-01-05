/**
 * Model
 *
 * 데이터 관리 객체
 * Domain 로직 처리
 *
 */
function VendingMachineModel() {
    this._init.apply(this, arguments)
};

VendingMachineModel.prototype = {

    _MONEY_LIMIT : 3000,
    _THOUSAND_LIMIT : 2,

    _A_DEFAULT_PRODUCT_LIST : [
        { name : "Pepsi", price : 100, code : 1 },
        { name : "V10", price : 100, code : 2 },
        { name : "Cantata", price : 100, code : 3 },
        { name : "2Pro", price : 100, code : 4 },
        { name : "Fanta", price : 100, code : 5 },
        { name : "Sikhye", price : 100, code : 6 },
        { name : "Vita500", price : 100, code : 7 },
        { name : "Bakas", price : 100, code : 8 }
    ],

    _DEFAULT_STOCKS_TABLE : {
        "Pepsi": 1,
        "V10" : 2,
        "Cantata" : 3,
        "2Pro" : 4,
        "Fanta" : 5,
        "Sikhye" : 6,
        "Vita500" : 7,
        "Bakas" : 8
    },

    _init : function(){
        this._aProductList = this._A_DEFAULT_PRODUCT_LIST;
        this._htStocks = this._DEFAULT_STOCKS_TABLE;
        this._htProductChart = {};
        this._nBalance = 0;
        this._nThousandCount = 0;

        this._fnOnSoldOut = function(){};
        this._fnOnChangeBalance = function(){};

        this.supply(this._htStocks);
        this.fixProduct( this._changePriceByRandom(this._aProductList) );
    },

    _changePriceByRandom : function(aProductList){
        var i = 0;
        var nLength = aProductList.length;
        var htProduct = null;

        for(; i < nLength; i++){
            htProduct = aProductList[i];
            htProduct.price = parseInt(Math.random() * 8 + 1, 10) * 100;
        }

        return aProductList;
    },

    getProductChart : function(){
        return this._aProductList;
    },

    bindCustomEvents : function(htEvents){
        this._fnOnSoldOut = htEvents.onSoldOut;
        this._fnOnChangeBalance = htEvents.onChangeBalance;
    },

    buy : function(sProductName){
        if( !this.hasStock(sProductName) || !this._hasEnoughBalance(sProductName) ){
            return null;
        }

        this._decreaseStocksByOne(sProductName);
        this._decreaseBalanceByPrice(sProductName);

        return sProductName;
    },

    /**
     * 잔액 변동을 통지한다.
     *
     * @param {Number} nBalance 변동된 잔액
     * @private
     */
    _notifyChangedBalance: function (nBalance) {
        this._fnOnChangeBalance.apply(null, [nBalance]);
    },

    /**
     * 제품의 품절을 알린다.
     *
     * @param {String} sProductName 품절된 제품명
     * @private
     */
    _notifySoldOut: function (sProductName) {
        this._fnOnSoldOut.apply(null, [sProductName]);
    },

    _decreaseBalanceByPrice : function(sProductName){
        this._nBalance -= this._htProductChart[sProductName];
        this._notifyChangedBalance(this._nBalance);
    },

    _decreaseStocksByOne : function(sProductName){
        this._htStocks[sProductName]--;

        /* 재고가 없으면 노티한다. */
        if( !this.hasStock(sProductName) ){
            this._notifySoldOut(sProductName);
        }
    },

    _hasEnoughBalance: function (sProductName) {
        return this._nBalance >= this._htProductChart[sProductName]
    },

    supply : function(htStocks){
        this._htStocks = htStocks;
    },

    isOverFlow: function (nMoney) {
        if(this._isThousand(nMoney) && this._isThousandOverFlow()){
            return true;
        }

        return this._isBalanceOverFlow(nMoney);
    },

    _isBalanceOverFlow: function (nMoney) {
        return this._nBalance + nMoney > this._MONEY_LIMIT;
    },

    _isThousandOverFlow: function () {
        return this._nThousandCount >= this._THOUSAND_LIMIT;
    },

    _addToBalance: function (nMoney) {
        this._nBalance += nMoney;
    },

    _increaseThrousandCountByOne: function () {
        this._nThousandCount++;
    },

    _isThousand: function (nMoney) {
        return nMoney === 1000;
    }, /**
     * 돈을 넣는다.
     *
     * @param {Number} nMoney - 투입할 금액
     * @returns {boolean} - 투입 결과
     */
    putMoney : function(nMoney){
        if(this.isOverFlow(nMoney)){
            return false;
        }

        if(this._isThousand(nMoney)){
            this._increaseThrousandCountByOne();
        }

        this._addToBalance(nMoney);
        this._notifyChangedBalance(this._nBalance);

        return true;
    },

    fixProduct : function(aPriceList) {
        var i = 0;
        var htPrice = null;

        for(; i < aPriceList.length; i++){
            htPrice = aPriceList[i];
            this._htProductChart[htPrice.name] = htPrice.price;
        }
    },

    returnChange : function(){
        var nBalance = this._nBalance;
        this._nBalance = 0;
        this._nThousandCount = 0;

        this._notifyChangedBalance(0);
        return nBalance;
    },

    hasStock : function(sProductName){
        return this._htStocks[sProductName] != null && this._htStocks[sProductName] > 0;
    }
};


/**
 * Presenter 역할
 *
 * View와 Model의 데이터 싱크.
 * 상태 관리
 * 사용자 요청 처리
 * 복잡한 프레젠테이션 로직
 *
 */
function VendingMachine() {
    this._init.apply(this, arguments)
};

VendingMachine.prototype = {

    _init : function(){
        this._oModel = new VendingMachineModel();
        this._oView = new VendingMachineView();

        this._oView.displayProducts(this._oModel.getProductChart());
        this._bindModelAndview();
    },

    _bindModelAndview: function () {
        this._oModel.bindCustomEvents({
            onSoldOut: $.proxy(this._oView.markSoldOut, this._oView),
            onChangeBalance: $.proxy(this._oView.displayBalance, this._oView)
        });

        this._oView.bindCustomEvents({
            onBuy: $.proxy(this._onBuy, this),
            onPutMoney: $.proxy(this._onPutMoney, this),
            onReturnMoney: $.proxy(this._onReturnMoney, this)
        });
    },

    _onBuy : function(sProductName){
        var sDrink = this._oModel.buy(sProductName);
        if(sDrink === null){
            this._oView.displayHasNotEnoughMoney();
            return;
        }

        this._oView.giveCustomerTo(sDrink);
    },

    _onPutMoney : function(nMoney){
        var bIsLimit = this._oModel.putMoney(nMoney);
        if(bIsLimit === false){
            this._oView.displayMoneyOverFlow();
            this._notifyOnReturnMoney(nMoney);
        }
    },

    _onReturnMoney : function(){
        this._notifyOnReturnMoney( this._oModel.returnChange() );
    },

    _notifyOnReturnMoney: function (nMoney) {
        $(document).trigger("return_money", nMoney);
        this._oView.displayReturnMoney(nMoney);
    },

    supply : function(htStocks){
        this._oModel.supply(htStocks);
    }

};


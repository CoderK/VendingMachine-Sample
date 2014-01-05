/**
 * 클라이언트의 지갑
 * 코드량이 많지 않아 책임을 분리하지 않았음.
 */
function Wallet() {
    this._nBalance = 0;
    this._init.apply(this, arguments);
};

Wallet.prototype = {

    _NO_MONEY : 0,

    _init : function(nMoney){
        this._welWallet = $("#_wallet");
        this._welBalance = this._welWallet.find(".my_money span");
        this._welDraggableMoney = $( "#_wallet ._drag_able" );

        this.putMoney(nMoney || 0);
        this._updateBalance();
        this._attachEvents();
        this._initDragabble();
    },

    _initDragabble : function(){
        this._welDraggableMoney.draggable({
            helper: "clone"
        });
    },

    _updateBalance : function(){
        this._welBalance.text(this._nBalance);
    },

    _attachEvents: function () {
        this._welDraggableMoney.on("inserted", $.proxy(this._onListenInsertMoney, this));
        $(document).on("return_money", $.proxy(this._onListenReturnMoney, this));
    },

    _onListenInsertMoney : function(wEvent, nMoney){
        this.takeOutMoney(nMoney);
    },

    _onListenReturnMoney : function(wEvent, nMoney){
        this.putMoney(nMoney);
    },

    _increaseMoneyBy: function (nMoney) {
        this._nBalance += nMoney;
    },

    /**
     * 지갑에 돈을 넣는다.
     *
     * @param {Number} nMoney 넣을 금액
     */
    putMoney : function(nMoney){
        this._increaseMoneyBy(nMoney);
        this._updateBalance();
    },

    balance : function(){
        return this._nBalance;
    },

    _hasNotEnoughMoney: function (nMoney) {
        return this._nBalance < nMoney;
    },

    _decreaseMoneyBy: function (nMoney) {
        this._nBalance -= nMoney;
    },

    /**
     * 지갑에서 돈을 꺼낸다.
     *
     * @param {Number} nMoney 꺼내고 싶은 금액
     * @returns {Number}
     */
    takeOutMoney : function(nMoney){
        if(this._hasNotEnoughMoney(nMoney)){
            return this._NO_MONEY;
        }

        this._decreaseMoneyBy(nMoney);
        this._updateBalance();
        return nMoney;
    }

}
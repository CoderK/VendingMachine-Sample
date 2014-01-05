/**
 * VendingMachine의 View를 담당하는 객체
 * 간단한 Presentation Logic을 담당한다.
 * Presentation 책임
 *
 */
function VendingMachineView() {
    this._init.apply(this, arguments)
};

VendingMachineView.prototype = {

    _SOLD_OUT_CLASS : "soldout",

    _init : function(){
        this._tpl_vending_machine = jindo.$Template("_tpl_vending_machine");
        this._tpl_products = jindo.$Template("_tpl_products");
        this._tpl_sold_out = jindo.$Template("_tpl_sold_out");
        this._welVendingMachine = null;
        this._welProductArea = null;
        this._welInsertArea = null;
        this._welConsole = null;
        this._elConsoleBox = null;

        this._htProductElementsMapper = {};
        this._fnOnBuyProduct = function(){};
        this._fnOnPutMoney = function(){};
        this._fnReturnMoney = function(){};

        this._render();
        this._cacheElement();
        this._attachEvent();
        this._initDroppable();
    },

    _attachEvent : function(){
        // Jindo의 이벤트 delegation은 정말 개떡이다.
        this._welProductArea.on("click", "li", $.proxy(this._onClickProduct, this));
        this._welReturnBtn.on("click", $.proxy(this._onClickReturnMoney, this));
    },

    bindCustomEvents : function(htEvents){
        this._fnOnBuyProduct = htEvents.onBuy;
        this._fnOnPutMoney = htEvents.onPutMoney;
        this._fnReturnMoney = htEvents.onReturnMoney;
    },

    _initDroppable: function () {
        $(".insert_coin._drop_able").droppable({
            drop: jindo.$Fn(this._onPutMoney, this).bind()
        });
    },

    /**
     * View를 렌더링한다.
     *
     * @private
     */
    _render : function(){
        jindo.$Element("container").prepend(this._tpl_vending_machine.process());
    },

    /**
     * Element를 캐시한다.
     *
     * @private
     */
    _cacheElement: function () {
        this._welVendingMachine = $("#content");
        this._welProductArea = this._welVendingMachine.find("#_product_area");
        this._welInsertArea = this._welVendingMachine.find("#_insert_area");
        this._welReturnBtn = this._welInsertArea.find("#_btn_money_return");
        this._welConsole = this._welVendingMachine.find("#_console_area ul");
        this._elConsoleBox = this._welVendingMachine.find("#_console_area")[0];
    },

    /**
     * 제품을 전시한다.
     *
     * @param aProducts 전시할 제품 데이터
     */
    displayProducts : function(aProducts){
        for(var i = 0; i < aProducts.length; i++){
            aProducts[i].className = "item" + aProducts[i].code;
        }

        this._welProductArea.append(this._tpl_products.process({ products : aProducts }));
        this._updateProductMapper();
    },

    /**
     * Product의 이름을 Key로 해당 아이템의 엘리먼트를 Value로 맵핑해서 저장해둔다.
     * 제품 클릭 이벤트 발생시에 사용한다.
     *
     * @private
     */
    _updateProductMapper: function () {
        this._welProductArea.find("li").each($.proxy(function (nIdx, elProduct) {
            var welProduct = $(elProduct);
            this._htProductElementsMapper[welProduct.find("._product_name").text()] = welProduct;
        }, this));
    },

    displayBalance : function(nBalance){
        this._welInsertArea.find(".insert span").text(nBalance);
    },

    _onClickProduct : function(welEvent){
        var welCurrentTarget = $(welEvent.currentTarget);
        if( welCurrentTarget.find("button").attr("disabled") ) {
            return;
        }

        this._fnOnBuyProduct.apply( null, [welCurrentTarget.find("._product_name").text()] );
    },

    _onPutMoney : function(woEvent, woDraggable){
        var nPutMoney = parseInt(woDraggable.draggable.data("value"), 10);

        woDraggable.draggable.trigger("inserted", nPutMoney);
        this._fnOnPutMoney.apply(null, [nPutMoney]);
    },

    _onClickReturnMoney : function(){
        this._fnReturnMoney.apply(null);
    },

    /**
     * 고객에데 제품을 제공한다.
     *
     * @param {string} sProduct 제품명
     */
    giveCustomerTo : function(sProduct){
        this._printConsole(sProduct + "가 나왔습니다.");
    },

    /**
     * 품절상태를 표시한다.
     *
     * @param {wrappingElement} welProduct  제품 엘리먼트
     */
    markSoldOut : function(sProductName){
        var welProduct = this._htProductElementsMapper[sProductName];
        welProduct.html(this._tpl_sold_out.process());
        welProduct.addClass(this._SOLD_OUT_CLASS);
    },

    /**
     * 잔액이 부족함을 알린다.
     */
    displayHasNotEnoughMoney : function(){
        this._printConsole("잔액이 부족합니다.");
    },

    displayReturnMoney : function(nMoney){
        this._printConsole(nMoney + "원을 돌려 받았습니다.");
    },

    displayMoneyOverFlow : function(){
        this._printConsole("돈을 더 넣을 수 없습니다.");
    },

    _printConsole : function(sMessage){
        this._welConsole.append("<li>" + sMessage + "</li>");
        this._elConsoleBox.scrollTop = this._elConsoleBox.scrollHeight;
    }

};


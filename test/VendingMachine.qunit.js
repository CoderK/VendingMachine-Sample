$(document).ready(function(){

    var oVendingMachineModel = null;
    var oVendingMachineView = null;
    var oVendingMachine = null;

    module('VendingMachineModel', {
        setup : function(){
            oVendingMachineModel = new VendingMachineModel();
            oVendingMachineModel.supply({
                "Pepsi": 1,
                "V10" : 1,
                "Cantata" : 1,
                "2Pro" : 1,
                "Fanta" : 1,
                "Sikhye" : 1,
                "Vita500" : 1,
                "Bakas" : 1
            });
            oVendingMachineModel.fixProduct([
                { name : "Pepsi", price : 0 },
                { name : "V10", price : 0 },
                { name : "Cantata", price : 0 },
                { name : "2Pro", price : 0 },
                { name : "Fanta", price : 0 },
                { name : "Sikhye", price : 0 },
                { name : "Vita500", price : 0 },
                { name : "Bakas", price : 0 }
            ]);
        },
        teardown : function(){
            /* 리소스 정리 */
            oVendingMachineModel = null;
        }
    });

    /**
     * TODO
     *
     * 재고가 떨어지면 Model이 View로 통지함.
     */
    test("자판기에서 원하는 음료를 뽑을 수 있다.", function(){
        // Given
        // When
        var sBeverage1 = oVendingMachineModel.buy("Pepsi");
        var sBeverage2 = oVendingMachineModel.buy("V10");
        var sBeverage3 = oVendingMachineModel.buy("Cantata");
        var sBeverage4 = oVendingMachineModel.buy("2Pro");
        var sBeverage5 = oVendingMachineModel.buy("Fanta");
        var sBeverage6 = oVendingMachineModel.buy("Sikhye");
        var sBeverage7 = oVendingMachineModel.buy("Vita500");
        var sBeverage8 = oVendingMachineModel.buy("Bakas");

        // Then
        equal(sBeverage1, "Pepsi");
        equal(sBeverage2, "V10");
        equal(sBeverage3, "Cantata");
        equal(sBeverage4, "2Pro");
        equal(sBeverage5, "Fanta");
        equal(sBeverage6, "Sikhye");
        equal(sBeverage7, "Vita500");
        equal(sBeverage8, "Bakas");

    });

    test("재고가 있는 음료만 뽑을 수 있다.", function(){
        // Given
        // When
        var sBeverage1 = oVendingMachineModel.buy("NonExistingDrink");

        // Then
        equal(sBeverage1, null);
    });

    test("재고만큼 음료를 구매할 수 있다.", function(){
        // given
        // when
        var sBeverage1 = oVendingMachineModel.buy("Pepsi");
        var sBeverage2 = oVendingMachineModel.buy("Pepsi");

        // then
        equal( sBeverage1, "Pepsi" );
        equal( sBeverage2, null );
    });

    test("재고를 확인할 수 있다.", function(){
        // given
        // when
        var bHasPepsi = oVendingMachineModel.hasStock("Pepsi");
        var bHasNoneExistingDrink = oVendingMachineModel.hasStock("NoneExistingDrink");

        // then
        equal( bHasPepsi, true );
        equal( bHasNoneExistingDrink, false );
    });

    test("금전을 투입한 만큼 음료를 구매할 수 있다.", function(){
        // given
        oVendingMachineModel.supply({ Fanta : 100 });
        oVendingMachineModel.fixProduct([ { name : "Fanta", price : 2000 } ]);

        oVendingMachineModel.putMoney(500);
        oVendingMachineModel.putMoney(500);
        oVendingMachineModel.putMoney(500);
        oVendingMachineModel.putMoney(500);

        // when
        var sBeverage1 = oVendingMachineModel.buy("Fanta");
        var sBeverage2 = oVendingMachineModel.buy("Fanta");

        // then
        equal( sBeverage1, "Fanta" );
        equal( sBeverage2, null );
    });

    test("음료를 구매하고 남은 잔돈을 거슬러 받을 수 있다.", function(){
        // given
        oVendingMachineModel.supply({ "Pepsi": 100 });
        oVendingMachineModel.fixProduct([ { name : "Pepsi", price : 500 } ]);
        oVendingMachineModel.putMoney(600);
        oVendingMachineModel.buy("Pepsi");

        // when
        var nChange = oVendingMachineModel.returnChange();

        // then
        equal( nChange, 100 );
        equal( oVendingMachineModel.returnChange(), 0 );
    });

    test("3000원 까지만 투입할 수 있다.", function(){
        // given
        oVendingMachineModel.putMoney(3000);
        oVendingMachineModel.putMoney(1000);

        // when
        var nChange = oVendingMachineModel.returnChange();

        // then
        equal( nChange, 3000 );
    });

    test("1000원 짜리 지폐는 2장까지만 넣을 수 있다.", function(){
        // given
        oVendingMachineModel.putMoney(1000);
        oVendingMachineModel.putMoney(1000);
        oVendingMachineModel.putMoney(1000);

        // when
        var nChange = oVendingMachineModel.returnChange();

        // then
        equal( nChange, 2000 );
    });

    module('VendingMachineView', {
        setup : function(){
            oVendingMachineView = new VendingMachineView();
            oVendingMachineView.displayProducts([
                { name : "Pepsi", price : 100 },
                { name : "V10", price : 100 },
                { name : "Cantata", price : 100 },
                { name : "2Pro", price : 100 },
                { name : "Fanta", price : 100 },
                { name : "Sikhye", price : 100 },
                { name : "Vita500", price : 100 },
                { name : "Bakas", price : 100 }
            ]);
        },

        generateWrappingClickEvent : function(wel){
            var welEvent = $.Event("click");
            welEvent.currentTarget = wel;

            return welEvent;
        },

        teardown : function(){
            oVendingMachineView = null;
        }
    });

    test("진열된 음료를 볼 수 있다.", function(){
        // given
        // when
        // then
        equal(oVendingMachineView._welProductArea.find("li").length, 8);
    });

    test("재고가 있는 제품만 클릭해서 구매할 수 있다.", function(){
        // given
        var welNoneExistingPepsi = oVendingMachineView._welProductArea.find("li");
        var welPepsi = oVendingMachineView._welProductArea.find("li").next();
        oVendingMachineView.markSoldOut("Pepsi");

        sinon.spy(oVendingMachineView, "_fnOnBuyProduct");

        // when
        var welNoneExistingEvent = this.generateWrappingClickEvent(welNoneExistingPepsi);
        var welExistingEvent = this.generateWrappingClickEvent(welPepsi);
        oVendingMachineView._onClickProduct(welNoneExistingEvent);  // _fnOnBuyProduct가 호출되지 않는다.
        oVendingMachineView._onClickProduct(welExistingEvent);

        // then
        equal(oVendingMachineView._fnOnBuyProduct.calledOnce, true);
    });

    test("제품을 받을 수 있다.", function(){
        // given
        var oMockVendingMachineView = sinon.mock(oVendingMachineView);
        oMockVendingMachineView.expects("_printConsole").withArgs("Fanta가 나왔습니다.");

        // when
        var sMessage = oVendingMachineView.giveCustomerTo("Fanta");

        // then
        oMockVendingMachineView.verify();
        oMockVendingMachineView.restore();
    });

    test("제품이 품절된 경우 품절 메시지를 화면에서 볼 수 있다.", function(){
        // given
        var welPepsi = $(oVendingMachineView._welProductArea.find("li")[0]);

        // when
        oVendingMachineView.markSoldOut(welPepsi.find("._product_name").text());

        // then
        equal(welPepsi.hasClass("soldout"), true);
        equal(welPepsi.find("button").attr("disabled"), "disabled");
    });

    test("투입한 금액을 볼 수 있습니다.", function(){
        // given
        // when
        oVendingMachineView.displayBalance(1000);

        // then
        equal(oVendingMachineView._welInsertArea.find(".insert span").text(), 1000);
    });

    test("제품을 클릭했는데 잔액이 부족한 경우 알림을 볼 수 있다.", function(){
        // given
        var oMockVendingMachineView = sinon.mock(oVendingMachineView);
        oMockVendingMachineView.expects("_printConsole").withArgs("잔액이 부족합니다.");

        // when
        oVendingMachineView.displayHasNotEnoughMoney();

        // then
        oMockVendingMachineView.verify();
        oMockVendingMachineView.restore();
    });

    module('VendingMachine', {
        setup : function(){
            var aProducts = [{ name : "Fanta", price : 100 }];
            oVendingMachine = new VendingMachine();
            oVendingMachineModel = oVendingMachine._oModel;
            oVendingMachineView = oVendingMachine._oView;

            oVendingMachineModel.supply( {"Fanta" : 1} );
            oVendingMachineModel.fixProduct(aProducts);
            oVendingMachineView.displayProducts(aProducts);
        },
        teardown : function(){
            oVendingMachineModel = null;
            oVendingMachineView = null;
        }
    });

    test("음료를 구매할 수 있다.", function(){
        // given
        var welProduct = oVendingMachineView._welProductArea.find("li");
        oVendingMachineModel.putMoney(100);

        sinon.spy(oVendingMachineView, "giveCustomerTo");

        // when
        oVendingMachine._onBuy("Fanta");

        // then
        equal(oVendingMachineView.giveCustomerTo.calledOnce, true);
        equal(oVendingMachineView.giveCustomerTo.calledWith("Fanta"), true);
    });

    test("음료 구매 후 품절인 경우에만 품절 여부가 표시된다.", function(){
        // given
        oVendingMachineModel.supply( {"Fanta" : 2} );
        oVendingMachineModel.putMoney(100);

        sinon.spy(oVendingMachineView, "markSoldOut");

        // when
        oVendingMachine._onBuy("Fanta");

        // then
        equal(oVendingMachineView.markSoldOut.calledOnce, false);
    });

    test("잔액이 부족한 경우 메시지를 확인할 수 있다.", function(){
        // given
        sinon.spy(oVendingMachineView, "displayHasNotEnoughMoney");

        // when
        oVendingMachine._onBuy("Fanta");

        // then
        equal(oVendingMachineView.displayHasNotEnoughMoney.calledOnce, true);
    });

    test("화폐를 투입할 수 있다.", function(){
        // given
        var oMockVendingMachineModel = sinon.mock(oVendingMachineModel);
        oMockVendingMachineModel.expects("putMoney").withArgs(500);

        // when
        oVendingMachine._onPutMoney(500);

        // then
        oMockVendingMachineModel.verify();
    });

    module('Wallet', {
        setup : function(){
            oVendingMachineView = new VendingMachineView();
        },
        teardown : function(){
        }
    });

    test("돈을 넣을 수 있다.", function(){
        // given
        var oMyWallet = new Wallet();

        // when
        oMyWallet.putMoney(5000);
        oMyWallet.putMoney(5000);

        // then
        equal(oMyWallet.balance(), 10000);
    });

    test("돈을 꺼낼 수 있다.", function(){
        // given
        var oMyWallet = new Wallet();
        oMyWallet.putMoney(10000);

        // when
        var nMoney = oMyWallet.takeOutMoney(5000);

        // then
        equal(nMoney, 5000);
        equal(oMyWallet.balance(), 5000);
    });

    test("가지고 있는 금액만큼만 꺼낼 수 있다.", function(){
        // given
        var oMyWallet = new Wallet();
        oMyWallet.putMoney(10000);

        // when
        var nMoney = oMyWallet.takeOutMoney(9000);
        var nNotTakenMoney = oMyWallet.takeOutMoney(5000);

        // then
        equal(nMoney, 9000);
        equal(nNotTakenMoney, 0);
    });

});




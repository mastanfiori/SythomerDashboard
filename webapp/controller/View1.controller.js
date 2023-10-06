sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/fiori/dashboard/zfiori_dashboartd/model/Formatter",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"sap/m/MessageToast"

], function (Controller, Filter, FilterOperator, formatter, UIComponent, oMessageBox, oMessageToast) {
	"use strict";
	var _contextPath = '';
	var oCred;
	var recognition;
	var i18nModel;
	var oView;
	return Controller.extend("com.fiori.dashboard.zfiori_dashboartd.controller.View1", {
		formatter: formatter,
		onInit: function () {

			// smartfilter bar 
			this._smartFilterBar = this.getView().byId("smartfilterbar");
			sap.ui.core.BusyIndicator.show(0);

			// date format based on user format	

			var oDateFormat = sap.ui.core.LocaleData.getInstance(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale()).mCustomData[
				"dateFormats-short"];
			if (oDateFormat == "MM/dd/yyyy" || oDateFormat == "MM-DD-YYYY") {
				sap.ui.core.LocaleData.getInstance(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale()).mData[
					"weekData-firstDay"] = 0;
			} else {

				sap.ui.core.LocaleData.getInstance(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale()).mData[
					"weekData-firstDay"] = 1;
			}

			// we have 6 kpi tiles, calling below odata service for 6 times to get count.
			// KPI is the model name to store the count details

			var thiz = this;
			var sUrl = "/sap/opu/odata/sap/ZPROTIF_KPI_TILES_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
			var arr = {};
			arr.ViewAllOrder = "";
			arr.OpenOrder = "";
			arr.CreditBlock = "";
			arr.NewOrder = "";
			arr.NoPlannedDate = "";
			arr.OnDeliveryBlock = "";
			arr.Previouslyconfirmed = "";

			this.getOwnerComponent().getModel("KPI").setData(arr);

			var aFilters = [];

			var filter = new Filter("OpenOrder", "EQ", 'X');
			aFilters.push(filter);

			var aFilters2 = [];

			var filter2 = new Filter("NewOrder", "EQ", 'X');
			aFilters2.push(filter2);

			var aFilters3 = [];
			var filter3 = new Filter("CreditBlock", "EQ", 'X');
			aFilters3.push(filter3);

			var aFilters4 = [];
			var filter4 = new Filter("NoPlannedDate", "EQ", 'X');
			aFilters4.push(filter4);

			var aFilters5 = [];

			var filter5 = new Filter("OnDeliveryBlock", "EQ", 'X');
			aFilters5.push(filter5);

			var aFilters6 = [];
			var filter6 = new Filter("ViewAllOrder", "EQ", 'X');
			aFilters6.push(filter6);

			var aFilters61 = [];
			var filter61 = new Filter("Previouslyconfirmed", "EQ", 'X');
			aFilters61.push(filter61);

			var filter7 = new Filter("Count", "EQ", 'X');
			aFilters.push(filter7);
			aFilters2.push(filter7);
			aFilters3.push(filter7);
			aFilters4.push(filter7);
			aFilters5.push(filter7);
			aFilters6.push(filter7);
			aFilters61.push(filter7);

			// open order call
			oModel.read("/SO_HeaderSet/$count", {
				filters: aFilters,
				success: function (oData, Response) {

					var arr = thiz.getOwnerComponent().getModel("KPI").getData();
					arr.OpenOrder = Response.body;
					thiz.getOwnerComponent().getModel("KPI").setData(arr);
					sap.ui.core.BusyIndicator.hide();
					if (Response.body == "0") {
						if (Response.headers["sap-message"]) {
							var oJson = Response.headers["sap-message"];
							var messageObj = JSON.parse(oJson);
							oMessageBox.error(messageObj.message);
						}
					}

				}
			});

			// NewOrder call

			oModel.read("/SO_HeaderSet/$count", {
				filters: aFilters2,
				success: function (oData, Response) {

					arr = thiz.getOwnerComponent().getModel("KPI").getData();
					arr.NewOrder = Response.body;
					thiz.getOwnerComponent().getModel("KPI").setData(arr);
					sap.ui.core.BusyIndicator.hide();

				}
			});

			// CreditBlock call

			oModel.read("/SO_HeaderSet/$count", {
				filters: aFilters3,
				success: function (oData, Response) {

					arr = thiz.getOwnerComponent().getModel("KPI").getData();
					arr.CreditBlock = Response.body;
					thiz.getOwnerComponent().getModel("KPI").setData(arr);
					sap.ui.core.BusyIndicator.hide();

				}
			});

			// NoPlannedDate call

			oModel.read("/SO_HeaderSet/$count", {
				filters: aFilters4,
				success: function (oData, Response) {

					arr = thiz.getOwnerComponent().getModel("KPI").getData();
					arr.NoPlannedDate = Response.body;
					thiz.getOwnerComponent().getModel("KPI").setData(arr);
					sap.ui.core.BusyIndicator.hide();

				}
			});

			// OnDeliveryBlock call

			oModel.read("/SO_HeaderSet/$count", {
				filters: aFilters5,
				success: function (oData, Response) {

					arr = thiz.getOwnerComponent().getModel("KPI").getData();
					arr.OnDeliveryBlock = Response.body;
					thiz.getOwnerComponent().getModel("KPI").setData(arr);
					sap.ui.core.BusyIndicator.hide();

				}
			});

			// viewallorder call

			oModel.read("/SO_HeaderSet/$count", {
				filters: aFilters6,
				success: function (oData, Response) {

					arr = thiz.getOwnerComponent().getModel("KPI").getData();
					arr.ViewAllOrder = Response.body;
					thiz.getOwnerComponent().getModel("KPI").setData(arr);
					sap.ui.core.BusyIndicator.hide();

				}
			});

			// previously confirmed

			oModel.read("/SO_HeaderSet/$count", {
				filters: aFilters61,
				success: function (oData, Response) {

					arr = thiz.getOwnerComponent().getModel("KPI").getData();
					arr.Previouslyconfirmed = Response.body;
					thiz.getOwnerComponent().getModel("KPI").setData(arr);
					sap.ui.core.BusyIndicator.hide();

				}
			});

		},

		onCreate: function (oEvt) {

			// navigate to create sales order
			// change request - defect 47 
			//soc - 8/21/2023
			if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
				oCrossAppNavigator.toExternal({
					target: {
						semanticObject: "SalesDocument",
						action: "create"
					},
				});
			}

			//eoc - 8/21/2023

		},

		onDataGet: function (oSource) {
			// when click on ant kpi tile, globally saving tile description in zbinding model
			// and reading the data below and adding it to filter.
			var binding = oSource.getParameter("bindingParams");
			var data = this.getOwnerComponent().getModel("zbinding").getData();
			// check the type, if it is object. "ZFILTER"
			// we need to pass to backend to work
			// search and filter operations
			// if zfilter not passed, backend tile data will hit

			if (typeof (data) == "object") {
				if (binding.filters.length == "0") {
					binding.filters = data;
				}

				for (var i = 0; i < binding.filters.length; i++) {
					if (binding.filters[i].sPath == "ZFILTER") {
						var oExists = 'X';
					}
				}
				// when smart table filter search, default we are passing zfilter field to backend
				// for smartfilter search, in onsearch method already passing zfilter method.

				if (oExists == 'X') {} else {
					var filter15 = new Filter("ZFILTER", "EQ", 'X');
					binding.filters.push(filter15);
				}
			} else {
				// when tile clicks directly passing tile description to backend
				if (data.length === undefined) {} else {

					if (data == "OpenOrder" || data == "NewOrder" || data == "CreditBlock" || data == "NoPlannedDate" || data == "OnDeliveryBlock" ||
						data == "ViewAllOrder" || data == "Previouslyconfirmed")

					{
						var oFilter = new sap.ui.model.Filter(data, sap.ui.model.FilterOperator.EQ, "X");
						binding.filters.push(oFilter);
					}
				}
			}
		},

		// open order kpi tile click
		onPressOpenOrder: function (oEvt) {
			this.getOwnerComponent().getModel("zbinding").setData("OpenOrder");
			this.getOwnerComponent().getModel("FilterItemsTableData").setData("OO");
			this.getView().byId("smrtTblSpecificBadDebt1").rebindTable();

		},

		// new order kpi tile click
		onPressNewOrder: function (oEvt) {
			this.getOwnerComponent().getModel("zbinding").setData("NewOrder");
			this.getOwnerComponent().getModel("FilterItemsTableData").setData("NO");
			this.getView().byId("smrtTblSpecificBadDebt1").rebindTable();
		},

		// creditblock kpi tile click
		onPressCreditBlock: function (oEvt) {
			this.getOwnerComponent().getModel("zbinding").setData("CreditBlock");
			this.getOwnerComponent().getModel("FilterItemsTableData").setData("CB");
			this.getView().byId("smrtTblSpecificBadDebt1").rebindTable();

		},
		// noplanneddate kpi tile click

		onPressNoPlannedDate: function (oEvt) {

			this.getOwnerComponent().getModel("zbinding").setData("NoPlannedDate");
			this.getOwnerComponent().getModel("FilterItemsTableData").setData("NP");
			this.getView().byId("smrtTblSpecificBadDebt1").rebindTable();

		},

		// onDeliveryblock kpi tile

		onPressOnDeliveryBlock: function (oEvt) {
			this.getOwnerComponent().getModel("zbinding").setData("OnDeliveryBlock");
			this.getView().byId("smrtTblSpecificBadDebt1").rebindTable();

		},
		// Press View All order kpi tile	
		onPressViewAllOrder: function () {
			this.getOwnerComponent().getModel("zbinding").setData("ViewAllOrder");
			this.getOwnerComponent().getModel("FilterItemsTableData").setData("AO");
			this.getView().byId("smrtTblSpecificBadDebt1").rebindTable();
		},

		// previously confirmed kpi tile

		onPressPreviouslyconfirmed: function () {

			this.getOwnerComponent().getModel("zbinding").setData("Previouslyconfirmed");
			this.getOwnerComponent().getModel("FilterItemsTableData").setData("PC");
			this.getView().byId("smrtTblSpecificBadDebt1").rebindTable();
		},

		// click on go in smart filter bar
		onSearch: function (oEvt) {

			// multiple filter for all search fields.
			// soc 8/24/2023

			var thiz = this;
			var oOrderType = oEvt.getParameters()[0].selectionSet[12].getValue();
			var oPlant = oEvt.getParameters()[0].selectionSet[13].getValue();

			var aFilters = [];

			// employee name

			for (var e = 0; e < oEvt.getParameters()[0].selectionSet[0].getTokens().length; e++) {

				var oName = oEvt.getParameters()[0].selectionSet[0].getTokens()[e].getKey();

				var filte = new Filter("EMPLOYEENAME", "EQ", oName);
				aFilters.push(filte);
			}

			// sales org

			for (var s = 0; s < oEvt.getParameters()[0].selectionSet[1].getTokens().length; s++) {

				var oSalesOrg = oEvt.getParameters()[0].selectionSet[1].getTokens()[s].getKey();

				var filteSales = new Filter("SALESORG", "EQ", oSalesOrg);
				aFilters.push(filteSales);
			}

			// sales order

			for (var so = 0; so < oEvt.getParameters()[0].selectionSet[2].getTokens().length; so++) {

				var oSalesOrder = oEvt.getParameters()[0].selectionSet[2].getTokens()[so].getKey();

				var filter = new Filter("VBELN", "EQ", oSalesOrder);
				aFilters.push(filter);
			}

			// soldtoparty

			for (var sol = 0; sol < oEvt.getParameters()[0].selectionSet[3].getTokens().length; sol++) {

				var oSoldTo = oEvt.getParameters()[0].selectionSet[3].getTokens()[sol].getKey();

				var filter1 = new Filter("SOLDTOPARTY", "EQ", oSoldTo);
				aFilters.push(filter1);
			}
			// shipto party

			for (var sh = 0; sh < oEvt.getParameters()[0].selectionSet[4].getTokens().length; sh++) {

				var oShipTo = oEvt.getParameters()[0].selectionSet[4].getTokens()[sh].getKey();

				var filter2 = new Filter("SHIPTOPARTY", "EQ", oShipTo);
				aFilters.push(filter2);
			}
			// material

			for (var ma = 0; ma < oEvt.getParameters()[0].selectionSet[5].getTokens().length; ma++) {

				var oMaterial = oEvt.getParameters()[0].selectionSet[5].getTokens()[ma].getKey();

				var filter3 = new Filter("MATERIAL", "EQ", oMaterial);
				aFilters.push(filter3);
			}

			// check date exists or not
			var oReqDate = oEvt.getParameters()[0].selectionSet[6].getValue();
			var oPlanDate = oEvt.getParameters()[0].selectionSet[7].getValue();
			var oPlanDispDate = oEvt.getParameters()[0].selectionSet[8].getValue();

			// requested deilvery date

			if (oReqDate != "") {
				var oFrom = oEvt.getParameters()[0].selectionSet[6].getFrom();

				var oTo = oEvt.getParameters()[0].selectionSet[6].getTo();
				oFrom = oFrom.toISOString().slice(0, 10).replace(/-/g, "");
				oTo = oTo.toISOString().slice(0, 10).replace(/-/g, "");
				var filter4 = new Filter("REQUESTEDDELIVERYDATE", "BT", oFrom, oTo);
				aFilters.push(filter4);
			}

			// planned dispatch date

			if (oPlanDispDate != "") {
				var oFrom = oEvt.getParameters()[0].selectionSet[8].getFrom()
				var oTo = oEvt.getParameters()[0].selectionSet[8].getTo()
				oFrom = oFrom.toISOString().slice(0, 10).replace(/-/g, "");
				oTo = oTo.toISOString().slice(0, 10).replace(/-/g, "");
				var filter41 = new Filter("PLANNEDDISPATCHDATE", "BT", oFrom, oTo);
				aFilters.push(filter41);
			}

			// planned delivery date

			if (oPlanDate != "") {
				var oFrom = oEvt.getParameters()[0].selectionSet[7].getFrom()
				var oTo = oEvt.getParameters()[0].selectionSet[7].getTo()
				oFrom = oFrom.toISOString().slice(0, 10).replace(/-/g, "");
				oTo = oTo.toISOString().slice(0, 10).replace(/-/g, "");
				var filter5 = new Filter("PLANNEDDELIVERYDATE", "BT", oFrom, oTo);
				aFilters.push(filter5);
			}

			// credit status

			for (var c = 0; c < oEvt.getParameters()[0].selectionSet[9].getSelectedKeys().length; c++) {

				var oCredStat = oEvt.getParameters()[0].selectionSet[9].getSelectedKeys()[c];

				var filter6 = new Filter("CREDITSTATUS", "EQ", oCredStat);
				aFilters.push(filter6);
			}

			// atp status

			for (var a = 0; a < oEvt.getParameters()[0].selectionSet[10].getSelectedKeys().length; a++) {

				var oAtpStat = oEvt.getParameters()[0].selectionSet[10].getSelectedKeys()[a];

				var filter6 = new Filter("ATPSTATUS", "EQ", oAtpStat);
				aFilters.push(filter6);
			}

			// order type

			for (var ot = 0; ot < oEvt.getParameters()[0].selectionSet[12].getTokens().length; ot++) {

				var oOrderType = oEvt.getParameters()[0].selectionSet[12].getTokens()[ot].getKey();

				var filter8 = new Filter("ORDERTYPE", "EQ", oOrderType);
				aFilters.push(filter8);

			}

			// plant

			for (var pl = 0; pl < oEvt.getParameters()[0].selectionSet[13].getTokens().length; pl++) {

				var oPlant = oEvt.getParameters()[0].selectionSet[13].getTokens()[pl].getKey();

				var filter9 = new Filter("PLANT", "EQ", oPlant);
				aFilters.push(filter9);
			}

			// rag status

			for (var r = 0; r < oEvt.getParameters()[0].selectionSet[11].getSelectedKeys().length; r++) {

				var oRagStatus = oEvt.getParameters()[0].selectionSet[11].getSelectedKeys()[r];

				var filter13 = new Filter("RAGSTATUS", "EQ", oRagStatus);
				aFilters.push(filter13);
			}

			// zfilter is the differentiation in backend
			// if zfilter value passed, user clicks on 'go' button after entering values in search
			// else they click on kpi tile

			var filter11 = new Filter("ZFILTER", "EQ", 'X');
			aFilters.push(filter11);

			this.getOwnerComponent().getModel("zbinding").setData(aFilters);
			this.getView().byId("smrtTblSpecificBadDebt1").rebindTable();
		},

		// back button click
		onBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("View2", true);
		},

		// notification check box clicked in main screen
		onSelected: function (oEvt) {

			i18nModel = this.getView().getModel("i18n").getResourceBundle();
			var oData = oEvt.getSource().getBindingContext().getObject();
			var oDataModel = this.getOwnerComponent().getModel();
			var oSelected = oEvt.getSource().getSelected();
			if (oSelected == true) {
				oSelected = 'X';
			}
			if (oSelected == false) {
				oSelected = '';
			}

			// call backend odata call
			var that = this;
			var data = {
				VBELN: oData.VBELN,
				LINEITEM: oData.LINEITEM,
				NOTIFICATION: oSelected

			};

			sap.ui.core.BusyIndicator.show(0);
			oDataModel.create("/salesorderSet", data, {
				success: function (oData, oResponse) {
					sap.ui.core.BusyIndicator.hide();
					if (oData.NOTIFICATION == 'X') {
						i18nModel.getText("notActive")
						var oMsg = i18nModel.getText("notActive") + " " + oData.VBELN;
						oMessageBox.success(oMsg);
					} else {
						var oMsg = i18nModel.getText("notInActive") + " " + oData.VBELN;
						oMessageBox.success(oMsg);
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
				}
			});

		},

		// sales document link press in main page and detail page
		handleOperationLinkPress: function (oEvt) {
			this.Salesorder = oEvt.getSource().getText();
			this.Salesorder.replaceAll(" ", "");

			if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
				oCrossAppNavigator.toExternal({
					target: {
						semanticObject: "SalesDocument",
						action: "display"
					},
					params: {
						"SalesDocument": this.Salesorder
					}
				});
			}

		},

		// when select any row on main screen

		onTableRowSelect: function (oEvent) {
			if (!oEvent) {
				return;
			}
			sap.ui.core.BusyIndicator.show(0);

			// get sales order
			var oRecord = oEvent.getSource().getSelectedItem().getBindingContext().getObject().VBELN;
			//get entire table row data
			var oRecord1 = oEvent.getSource().getSelectedItem().getBindingContext().getObject();

			// sales order model
			this.getOwnerComponent().getModel("zsalesorder").setData(oRecord);
			// row details model
			this.getOwnerComponent().getModel("zorderdetails").setData(oRecord1);
			this.getView().byId("treeTable1").removeSelections(true);
			this.getOwnerComponent().getModel("EntryCollection").setData([]);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oRouter.navTo("View2", {
				VBELN: oRecord,
				AUTHNOTE: oRecord1.AUTHNOTE
			});

		},

		//smart filter bar custom control fields, below variant 

		onBeforeVariantFetch: function (oEvent) {
			this._updateCustomFilter();
		},

		_updateCustomFilter: function () {
			if (this._smartFilterBar) {

				var REQUESTEDDELIVERYDATE = this._smartFilterBar.determineControlByName("REQUESTEDDELIVERYDATE");
				var PLANNEDDISPATCHDATE = this._smartFilterBar.determineControlByName("PLANNEDDISPATCHDATE");
				var PLANNEDDELIVERYDATE = this._smartFilterBar.determineControlByName("PLANNEDDELIVERYDATE");
				var ATPSTATUS = this._smartFilterBar.determineControlByName("ATPSTATUS");
				var RAGSTATUS = this._smartFilterBar.determineControlByName("RAGSTATUS");
				var CREDITSTATUS = this._smartFilterBar.determineControlByName("CREDITSTATUS");

				this._smartFilterBar.setFilterData({
					_CUSTOM: {

						REQUESTEDDELIVERYDATE: REQUESTEDDELIVERYDATE.getValue(),
						PLANNEDDELIVERYDATE: PLANNEDDELIVERYDATE.getValue(),
						PLANNEDDISPATCHDATE: PLANNEDDISPATCHDATE.getValue(),
						CREDITSTATUS: CREDITSTATUS.getValue(),
						ATPSTATUS: ATPSTATUS.getValue(),
						RAGSTATUS: RAGSTATUS.getValue(),
					}
				});

				//	}
			}
		},

		onAfterVariantLoad: function (oEvent) {
			if (this._smartFilterBar) {

				var oData = this._smartFilterBar.getFilterData();
				var oCustomFieldData = oData["_CUSTOM"];

				var RAGSTATUS = this._smartFilterBar.determineControlByName("RAGSTATUS");

				if (RAGSTATUS) {
					RAGSTATUS.setValue(oCustomFieldData.RAGSTATUS);

				}

				var ATPSTATUS = this._smartFilterBar.determineControlByName("ATPSTATUS");

				if (ATPSTATUS) {
					ATPSTATUS.setValue(oCustomFieldData.ATPSTATUS);

				}

				var CREDITSTATUS = this._smartFilterBar.determineControlByName("CREDITSTATUS");

				if (CREDITSTATUS) {
					CREDITSTATUS.setValue(oCustomFieldData.CREDITSTATUS);

				}

				var REQUESTEDDELIVERYDATE = this._smartFilterBar.determineControlByName("REQUESTEDDELIVERYDATE");
				if (REQUESTEDDELIVERYDATE) {
					REQUESTEDDELIVERYDATE.setValue(oCustomFieldData.REQUESTEDDELIVERYDATE);

				}

				var PLANNEDDELIVERYDATE = this._smartFilterBar.determineControlByName("PLANNEDDELIVERYDATE");
				if (PLANNEDDELIVERYDATE) {
					PLANNEDDELIVERYDATE.setValue(oCustomFieldData.PLANNEDDELIVERYDATE);

				}
				var PLANNEDDISPATCHDATE = this._smartFilterBar.determineControlByName("PLANNEDDISPATCHDATE");
				if (PLANNEDDISPATCHDATE) {
					PLANNEDDISPATCHDATE.setValue(oCustomFieldData.PLANNEDDISPATCHDATE);

				}

			}

		},

	});
});
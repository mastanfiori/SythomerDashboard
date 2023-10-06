sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/routing/History",
	"com/fiori/dashboard/zfiori_dashboartd/model/Formatter",
	"sap/ui/core/Fragment",
	"sap/ui/core/UIComponent",
	"sap/ui/core/format/DateFormat",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	'sap/m/Token',
	"sap/m/Dialog",
	"sap/m/Button"
], function (Controller, Filter, FilterOperator, formatter, History, UIComponent, Fragment, DateFormat, oMessageBox, oMessageToast, Token,
	Dialog, Button) {
	"use strict";
	var _contextPath = '';
	var recognition;
	var i18nModel;
	return Controller.extend("com.fiori.dashboard.zfiori_dashboartd.controller.View2", {
		formatter: formatter,
		onInit: function () {

			var oView = this.getView();
			var thiz = this;
			var oView = this.getView();
			this.oProcessFlow2 = oView.byId("processflow2");
			this.oOwnerComponent = this.getOwnerComponent();
			this.oRouter = this.oOwnerComponent.getRouter();
			this.oModel = this.oOwnerComponent.getModel();
			this.oRouter.getRoute("View2").attachPatternMatched(this._onRouteMatched, this);

		},

		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		onRefresh: function () {
			this.getView().byId("smrtTblSpecificBadDebt").rebindTable();
		},

		onPost: function (oEvent) {
			i18nModel = this.getView().getModel("i18n").getResourceBundle();
			var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
				format: "yMMMd"
			});
			var oType = this.getOwnerComponent().getModel("zorderdetails").getData().DEPARTMENT;
			var oDate = new Date();
			var oHrs = oDate.getHours(); // => 9
			var oMins = oDate.getMinutes(); // =>  30
			var oSecs = oDate.getSeconds();
			var oTime = oHrs + ":" + oMins + ":" + oSecs;
			var sDate = oFormat.format(oDate);
			// create new entry
			var sValue = oEvent.getParameter("value");
			var oAuthor = this.getOwnerComponent().getModel("zorderdetails").getData().USERFULLNAME;
			var oEntry = {
				AUTHOR: oAuthor,
				AuthorPicUrl: "",
				Type: oType,
				Date: "" + sDate + " " + oTime,
				Notetext: sValue
			};

			// update model
			var oModel = this.getOwnerComponent().getModel("EntryCollection").getData();
			if (oModel.length === undefined) {
				oModel = [];
				oModel.push(oEntry);

			} else {
				oModel.push(oEntry);

			}
			//sending call to backend

			var that = this;
			var oSales = this.getOwnerComponent().getModel("zsalesorder").getData();
			var oAuthNote = this.getOwnerComponent().getModel("zorderdetails").getData().AUTHNOTE;
			var data = {

				SalesOrder: oSales,
				AUTHOR: oAuthor,
				Notetext: sValue,
				AuthNote: oAuthNote

			};
			var oDataModel = this.getOwnerComponent().getModel();
			sap.ui.core.BusyIndicator.show(0);
			oDataModel.create("/SO_NoteSet", data, {

				success: function (oData, oResponse) {
					if (oData.SalesOrder != "") {
						var oMsg = i18nModel.getText("notessaved") + "-" + oData.SalesOrder;
						oMessageBox.success(oMsg);
					}

					sap.ui.core.BusyIndicator.hide();

				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
				}
			});

			var oSalesOrder = this.getOwnerComponent().getModel("zsalesorder").getData();
			var aFilters = [];

			var filter = new Filter("SalesOrder", "EQ", oSalesOrder);
			aFilters.push(filter);

			oDataModel.read("/SO_NoteSet", {
				filters: aFilters,
				success: function (data) {
					that.getOwnerComponent().getModel("EntryCollection").setData(data.results);
					that.getOwnerComponent().getModel("CountNotesNo").setData(data.results.length);
				}
			});

		},

		onProces: function (oEvent) {
			var thiz = this;
			var binding = oEvent.getParameter("bindingParams");
			var data = this.getOwnerComponent().getModel("zsalesorder").getData();
			var aFilters = [];
			var oFilter = new sap.ui.model.Filter("VBELN", sap.ui.model.FilterOperator.EQ, data);
			var oFilter1 = new sap.ui.model.Filter("ZFILTER", sap.ui.model.FilterOperator.EQ, 'X');
			binding.filters.push(oFilter);
			binding.filters.push(oFilter1);

			binding.events = {
				"dataReceived": function (oEvent) {
					var aReceivedData = oEvent.getParameter('data');
					var oLength = aReceivedData.results.length;

					var oEntry = {
						LINEITEM: oLength,
					};

					thiz.getOwnerComponent().getModel("zorderdetailsitem").setData(oEntry);
					if (oLength > 0) {

						thiz.getOwnerComponent().getModel("zorderdetails").setData(aReceivedData.results[0]);

					}
					// process flow details - below are hardcoded valuse
					// only status will change

					var oNodes = {
						"nodes": [{
							"id": "1",
							"lane": "0",
							"title": "Credit Check",
							"titleAbbreviation": "SO 2",
							"children": [11],
							"isTitleClickable": false,
							"state": "Positive",
							"stateText": "OK status",
							"focused": true,
							"highlighted": true

						}, {
							"id": "11",
							"lane": "1",
							"title": "ATP Check",
							"titleAbbreviation": "OD 43",
							"children": [20],
							"isTitleClickable": false,
							"state": "Neutral",
							"stateText": null,
							"focused": false,
							"highlighted": false

						}, {
							"id": "20",
							"lane": "2",
							"title": "Shipping Confirmed",
							"titleAbbreviation": "I 9",
							"children": [30],
							"isTitleClickable": false,
							"state": "Positive",
							"stateText": "OK status",
							"focused": false,
							"highlighted": true,

						}, {
							"id": "30",
							"lane": "3",
							"title": "Order Confirmed",
							"titleAbbreviation": "AD 5",
							"children": null,
							"isTitleClickable": false,
							"state": "Critical",
							"stateText": "AD Issue",
							"focused": false,
							"highlighted": false,

						}, ],
						"lanes": [{
							"id": "0",
							"icon": "sap-icon://accept",
							"label": "Credit Check",
							"position": 0,
							"state": [{
								"state": "Positive",
								"value": 100
							}]
						}, {
							"id": "1",
							"icon": "sap-icon://accept",
							"label": "ATP Check",
							"position": 1,
							"state": [{
								"state": "Positive",
								"value": 100
							}]
						}, {
							"id": "2",
							"icon": "sap-icon://accept",
							"label": "Shipping Confirmed",
							"position": 2,
							"state": [{
								"state": "Positive",
								"value": 100
							}]
						}, {
							"id": "3",
							"icon": "sap-icon://accept",
							"label": "Order Confirmed",
							"position": 3,
							"state": [{
								"state": "Positive",
								"value": 100
							}]
						}]
					};

					var oRecord1 = aReceivedData.results[0];

					var sCredit = oRecord1.CREDITSTATUS;
					var oAtp = oRecord1.ATPSTATUS;
					var oShip = oRecord1.SHIPPINGCONFIRMED;
					var oOrder = oRecord1.DELIVERYBLOCKREASONTEXT;

					if (oOrder == '') {
						oNodes.nodes[3].state = 'Positive'
						oNodes.nodes[3].title = 'Order Shipment Checked'
						oNodes.nodes[3].stateText = 'Approved'
						oNodes.lanes[3].state[0].state = 'Positive'

					} else {
						oNodes.nodes[3].state = 'Negative'
						oNodes.nodes[3].title = 'Order Delivery block reason Checked'
						oNodes.nodes[3].stateText = 'UnConfirmed'
						oNodes.lanes[3].state[0].state = 'Negative'

					}

					if (oShip == 'X') {
						oNodes.nodes[2].state = 'Positive'
						oNodes.nodes[2].title = 'Order Shipment Checked'
						oNodes.nodes[2].stateText = 'Approved'
						oNodes.lanes[2].state[0].state = 'Positive'

					} else {
						oNodes.nodes[2].state = 'Negative'
						oNodes.nodes[2].title = 'Order Shipment Checked'
						oNodes.nodes[2].stateText = 'UnConfirmed'
						oNodes.lanes[2].state[0].state = 'Negative'
					}

					if (oAtp == 'X') {
						oNodes.nodes[1].state = 'Positive'
						oNodes.nodes[1].title = 'Order ATP Checked'
						oNodes.nodes[1].stateText = 'Approved'
						oNodes.lanes[1].state[0].state = 'Positive'
					}

					if (oAtp != 'X') {
						oNodes.nodes[1].state = 'Negative'
						oNodes.nodes[1].title = 'Order ATP Checked'
						oNodes.nodes[1].stateText = 'UnConfirmed'
						oNodes.lanes[1].state[0].state = 'Negative'
					}

					if (sCredit == "A" || sCredit == "D" || sCredit == "") {

						oNodes.nodes[0].state = 'Positive'
						oNodes.nodes[0].title = 'Order Credit Checked'
						oNodes.nodes[0].stateText = 'Approved'
						oNodes.lanes[0].state[0].state = 'Positive'
					} else {

						oNodes.nodes[0].state = 'Negative'
						oNodes.nodes[0].title = 'Order Credit Checked'
						oNodes.nodes[0].stateText = 'UnConfirmed'
						oNodes.lanes[0].state[0].state = 'Negative'
					}

					thiz.getOwnerComponent().getModel("pf2").setData(oNodes);
					thiz.getView().byId("ObjectPageLayout").setSelectedSection(thiz.getView().byId("goalsSectionSS1"));

				},
			};

		},

		// back button logic
		onBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("View1", true);
			this.getOwnerComponent().getModel("EntryCollection").setData([]);

		},

		// detail page sales order click
		handleOperationLinkPress: function (oEvt) {
			this.Salesorder = oEvt.getSource().getText();
			this.Salesorder.replaceAll(" ", "");
			this.Salesorder = this.Salesorder.split(":")[1];

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

		_onRouteMatched: function (e) {
			var oSalesDocument = e.getParameter("arguments").VBELN;
			var oAuthNote = e.getParameter("arguments").AUTHNOTE;
			// reading directly with tab no
			if (oAuthNote == 'N') {
				this.getView().byId("ObjectPageLayout").getSections()[2].setVisible(false)
			} else {
				this.getView().byId("ObjectPageLayout").getSections()[2].setVisible(true)
			}
			this.getOwnerComponent().getModel("zsalesorder").setData(oSalesDocument);
			sap.ui.core.BusyIndicator.hide();
			var thiz = this;
			this.getView().byId("smrtTblSpecificBadDebt").rebindTable();
			var sUrl = "/sap/opu/odata/sap/ZPROTIF_KPI_TILES_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
			var oSalesOrder = this.getOwnerComponent().getModel("zsalesorder").getData();
			var aFilters = [];

			var filter = new Filter("SalesOrder", "EQ", oSalesOrder);
			aFilters.push(filter);

			oModel.read("/SO_NoteSet", {
				filters: aFilters,
				success: function (data) {
					thiz.getOwnerComponent().getModel("EntryCollection").setData(data.results);
					thiz.getOwnerComponent().getModel("CountNotesNo").setData(data.results.length);

				}
			});

		},

	});
});
/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/fiori/dashboard/zfiori_dashboartd/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
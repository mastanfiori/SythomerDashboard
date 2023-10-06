sap.ui.define(function () {
	"use strict";

	var Formatter = {

		setRowColor: function (x, z, t, u, v, w, c, ra) {
			/*
						var oCheck;
						if (x == 'X') {
							var a = "Success";
						}

						if (t == "X") {
							var c = "Success";
						}
						if (z == "A" || z == "D") {
							var e = "Success";
						}
						if (w != "00/00/0000" || w != "00.00.0000") {
							var f = "Success";
						}

						if (c != "00/00/0000" || c != "00.00.0000") {
							var g = "Success";
						}

						if (a == "Success" && c == "Success" && e == "Success" && f == "Success" && g == "Success") {
							return "Success";

						}

						if (w == "00/00/0000" || w == "00.00.0000") {
							return "Error";
						}

						if (c == "00/00/0000" || c == "00.00.0000") {
							return "Error";
						}

						if (u == "R" || v == "R") {
							return "Error";
						}

						if (u == "A" || v == "A") {
							return "Warning";
						}

						if (u == "G" || v == "G") {
							return "Success";
						}
						
						


			*/

			if (ra == "R") {
				return "Error";
			}

			if (ra == "A") {
				return "Warning";
			}

			if (ra == "G") {
				return "Success";
			}

		},

		setReqDate: function (a) {
			if (a) {
				if (a == "00/00/0000" || a == "00.00.0000") {

					return 'Not Set';
				} else {
					//		a = a.replace(/(\d{4})(\d{2})(\d{2})/g, '$3-$2-$1');
					return a;
				}
			}
		},

		setReqDateColor: function (a) {
			if (a) {
				if (a == "00/00/0000" || a == "00.00.0000") {

					return 'Error';
				} else {
					a = a.replace(/(\d{4})(\d{2})(\d{2})/g, '$3-$2-$1');
					return 'Success';
				}
			}

		},

		setStatusColorShip: function (a) {

			if (a == "X") {

				return "Success";
			} else {
				return "Error";
			}

		},

		setStatusValueShip: function (a) {
			if (a == "X") {

				return 'Yes';
			} else {
				return 'No';
			}
		},

		setATPStatus: function (a) {
			if (a == 'X') {
				return "Confirmed";
			}

			if (a != 'X') {
				return "Not Confirmed";
			}

		},
		/*
				setATPColor: function (kwmeng, kbmeng) {
					if (kwmeng == kbmeng) {
						return "Success";
					}

					if (kwmeng != kbmeng) {
						return "Error";
					}

				},
				*/

		setATPColor: function (a) {
			if (a == 'X') {
				return "Success";
			}

			if (a != 'X') {
				return "Error";
			}

		},

		setStatusValue: function (sCredit) {

			if (sCredit == "") {
				return "Not Checked";
			}

			if (sCredit == "A") {
				return "Approved";
			}

			if (sCredit == "D") {
				return "Released";

			}

			if (sCredit == "B") {
				return "Blocked";

			}

			if (sCredit == "C") {
				return "Blocked";

			}

		},

		setStatusColor: function (sCredit) {

			if (sCredit == "A" || sCredit == "D" || sCredit == "") {
				return "Success";

			} else {

				return "Error";
			}

		},
		setReqDateColorAlv: function (a) {
			if (a == '0.000' || a == '' || a == '0,000') {
				return 'Error';
			} else {
				return "Success";
			}
		},

		setReqDateColorAlv1: function (a) {
			if (a == '0.000' || a == '' || a == '0,000') {
				return 'Error';
			} else {
				return "Success";
			}
		},

	};

	return Formatter;

}, /* bExport= */ true);
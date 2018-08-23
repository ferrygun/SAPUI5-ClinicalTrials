sap.ui.jsview("view.CTL1", {

    getControllerName: function() {
        return "view.CTL1";
    },

    createContent: function(oController) {

        var app = new sap.m.App("L1");


        var sf = new sap.m.SearchField({
            placeholder: "Search",
            showRefreshButton: true,
            liveChange: Search,
            search: Search,
            tooltip: "Search for info..",
        });

        function Search(evt) {
            var searchValue = evt.oSource.mProperties.value;

            var filters = new Array();
            var oFilter = new sap.ui.model.Filter("title", sap.ui.model.FilterOperator.Contains, searchValue);
            filters.push(oFilter);

            //get list created in view
            this.oList = sap.ui.getCore().byId("polist");
            this.oList.getBinding("items").filter(filters);
        }

        var oListTemplate = new sap.m.ObjectListItem({
            type: "Active",
            title: "{title}",
            //icon: "sap-icon://goal",
            intro: "{nct_id}",
            number: "{order}",
            numberUnit: "{condition_summary}",
            press: handleOnPress
        });

        var oList = new sap.m.List("polist");

        var busyDialog = (busyDialog) ? busyDialog : new sap.m.BusyDialog({
            text: '{i18n>MSG0}',
            title: '{i18n>MSG1}'
        });

        function wasteTime() {
            busyDialog.open();
        }

        function runNext() {
            busyDialog.close();
        }

        function getLatitudeLongitude(address, callback) {
			$.ajax({
                type: 'GET',
                async: true,
                cache: true,
                url: "/nodejs?loc=" + address,
                success: function(data) {
					callback(data);
				},
                error: function(jqXHR, textStatus, errorThrown) {
                   console.log('error');
				   callback(error);
                }
			});
        }

        function FD(oEvent, nct_id, ArrayData, data, oController, position) {
            //This block is executed when all innerFunction calls are finished.
            if (!data.hasOwnProperty("required_header"))
                url = "N/A";
            else
                url = data.required_header.url;

            if (!data.hasOwnProperty("brief_title"))
                brief_title = "N/A";
            else
                brief_title = data.brief_title;

            if (!data.hasOwnProperty("official_title"))
                official_title = "N/A";
            else
                official_title = data.official_title;

            if (!data.hasOwnProperty("location_countries"))
                country = "N/A";
            else
                country = data.location_countries.country;

            if (!data.hasOwnProperty("detailed_description"))
                detailed_description = "N/A";
            else
                detailed_description = data.detailed_description.textblock;

            if (!data.hasOwnProperty("last_update_submitted"))
                last_update_submitted = "N/A";
            else
                last_update_submitted = data.last_update_submitted;

            if (!data.hasOwnProperty("overall_contact")) {
                last_name = "N/A";
                phone = "N/A";
                email = "N/A";
            } else {
                last_name = data.overall_contact.last_name;
                phone = data.overall_contact.phone;
                email = data.overall_contact.email;
            }

			console.log(position);
            var obj = [{
                nct_id: nct_id,
                url: url,
                brief_title: brief_title,
                official_title: official_title,
                country: country,
                detailed_description: detailed_description,
                last_update_submitted: last_update_submitted,
                last_name: last_name,
                phone: phone,
                email: email,
				position: position,

                //longitude - latitude
                Spots: ArrayData
            }];
			console.log(obj);

            oModel.setData({
                modelData1: obj
            });
            oController.onNavButtonTo(oEvent, "fd:18");
        }

		function sleep(milliseconds) {
		  var start = new Date().getTime();
		  for (var z = 0; z < 1e7; z++) {
			if ((new Date().getTime() - start) > milliseconds){
			  break;
			}
		  }
		}


        function handleOnPress(oEvent) {
            var data = {};
            data.context = oEvent.getSource().getBindingContext();
            var selectedIndex = data.context.sPath.split("/")[2];

            var nct_id = data.context.oModel.oData.modelData[selectedIndex].nct_id;
            wasteTime();

            //** Offline mode **
            /*
			 oModel = new sap.ui.model.json.JSONModel();
			 var obj = [{ 
				nct_id: '123', 
				url: 'http://www.google.com',
				brief_title: 'title', 
				official_title: 'official_title',
				country: 'country',
				detailed_description: 'detailed_description.textblock',
				last_update_submitted: 'last_update_submitted',
				last_name: 'overall_contact.last_name',
				phone: 'overall_contact.phone',
				email: 'overall_contact.email'
			}];

			//console.log(JSON.parse(data1));
			var myJSON = JSON.stringify(obj);

			oModel.setData({
				modelData1 : JSON.parse(myJSON)
			});
			oController.onNavButtonTo(oEvent,  "fd:18");
			*/
            //** Offline mode **


            //** Online mode **
            var ArrayData = [];
			var position = '';

            oModel = new sap.ui.model.json.JSONModel();
            $.ajax({
                type: 'GET',
                async: true,
                cache: true,
                url: "/nodejs?q=" + nct_id,
                //url: "/nodejs?q=NCT03031938",
                success: function(data) {
                    if (data.length > 0) {
                        runNext();
                        data = JSON.parse(data);

						var innerFunction = function(j, geoAddress, city, process) {
                            // Your work to be done is here...
                            getLatitudeLongitude(geoAddress, function(result) {
								if(result != 'no data') {
									var obj = eval('(' + result + ')');
									result = JSON.parse(JSON.stringify(obj));
									lat = result.lat;
									lng = result.lng;
									position = "" + lng + ";" + lat + ";0";

									ArrayData.push({
										key: "" + j + "",
										pos: lng + ';' + lat + ';0',
										tooltip: city + ',' + geoAddress,
										type: sap.ui.vbm.SemanticType.Success,
										select: true
									});
								}
                                process.done();
                            });
                        };

                        var outerFunction = function(cb) {

                            if (data.hasOwnProperty("location")) {
								var lengthdata = 1;
								if(typeof data.location.length === 'undefined') 
									lengthdata = 1;
								else 
									lengthdata = data.location.length;

                                if (lengthdata > 0) {
                                    // Process object for tracking state of innerFunction executions
                                    var process = {
                                        // Total number of work ahead (number of innerFunction calls required).
                                        count: lengthdata,
                                        // Method which is triggered when some call of innerFunction finishes  
                                        done: function() {
                                            // Decrease work pool
                                            this.count--;
                                            // Check if we are done & trigger a callback
                                            if (this.count === 0) {
                                                setTimeout(cb, 0);
                                            }
                                        }
                                    };

                                    var f=1;
									wasteTime();
									console.log(lengthdata);
									for (var j = 0; j < lengthdata; j++) {
										if(lengthdata == 1)
											innerFunction(f, data.location.facility.address.country, data.location.facility.address.city, process);
										else {
											innerFunction(f, data.location[j].facility.address.country, data.location[j].facility.address.city, process);
										}
										f=f+1;
                                    }
                                }
                            } else {
								runNext();
								console.log(ArrayData);
                                FD(oEvent, nct_id, ArrayData, data, oController, position);
                            }

                        };

                        outerFunction(function() {
                            //All done for outerFunction! - What you should do next?
							runNext();
							console.log(ArrayData);
                            FD(oEvent, nct_id, ArrayData, data, oController, position);
                        });
						
                    } else {
                        jQuery.sap.require("sap.m.MessageBox");
                        sap.m.MessageBox.show(jQuery.sap.resources({
                            url: "i18n/i18n.properties"
                        }).getText("NO_INFO"), {
                            icon: sap.m.MessageBox.Icon.INFORMATION,
                            title: "{i18n>WELCOME_TITLE}",
                            actions: sap.m.MessageBox.Action.OK,
                            onClose: null,
                            //styleClass: ""                        
                        });
                    }

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    runNext();
                    jQuery.sap.require("sap.m.MessageBox");
                    sap.m.MessageBox.show(errorThrown, {
                        icon: sap.m.MessageBox.Icon.INFORMATION,
                        title: "{i18n>WELCOME_TITLE}",
                        actions: sap.m.MessageBox.Action.OK,
                        onClose: null,
                        //styleClass: ""                        
                    });
                }
            });

            //** Online mode **
        }

        function createListFromModel(oListContainer, modelPath, id) {
            if (oListContainer.hasModel() == false) {
                console.log(oListContainer + " Error");
                return;
            }
            oList.setModel(oModel);

            var oModelPath = new sap.ui.model.json.JSONModel(oModel);
            sap.ui.getCore().setModel(oModelPath, "pathmodel");

            oListContainer.bindAggregation("items", "/modelData", oListTemplate);
        }


        this.addEventDelegate({
            onBeforeShow: function(evt) {
                createListFromModel(oList, "/modelData", evt.data.context);
            }
        }, this);

        var oPage = new sap.m.Page({
            showNavButton: true,
            enableScrolling: true,
            navButtonPress: [oController.doNavBack, oController],
            customHeader: new sap.m.Bar({
                contentLeft: [new sap.m.Button("BackButtonD", {
                    icon: "sap-icon://nav-back",
                    text: "Back",
                    tap: function() {
                        oController.doNavBack();
                    }
                })],
                contentMiddle: [new sap.m.Label("titleD", {
                    text: "Clinical Trials",
                    design: "Bold"
                })]
            })
        });

        oPage.addContent(sf);
        oPage.addContent(oList);
        app.addPage(oPage);
        return app;
    }
});
jQuery.sap.require("sap.ui.layout.form.SimpleForm");

sap.ui.jsview("view.CT", {

    getControllerName: function() {
        return "view.CT";
    },

    createContent: function(oController) {

        var oForm = new sap.ui.layout.form.SimpleForm({
			minWidth        : 1024,
			maxContainerCols: 2,
			editable        : true,
			layout          : "ResponsiveGridLayout",
			//title           : "Date Controls",
			labelSpanL : 4,
			labelSpanM : 4,
			emptySpanL : 1,
			emptySpanM : 1,
			columnsL   : 1,
			columnsM   : 1		
		});

		var oCondition = new sap.m.Label({
			text : "Condition",
		});
		var oText1 = new sap.m.Input({value:"", placeholder:"Enter a condition"});


		var busyDialog = (busyDialog) ? busyDialog : new sap.m.BusyDialog({text:'{i18n>MSG0}', title: '{i18n>MSG1}'});

		function wasteTime(){
			busyDialog.open();
        }

		function runNext(){
			busyDialog.close();
		}

		var oBtnAdd = new sap.m.Button({
            text : "Search",
        	press : function(oEvent){
				var condition = oText1.getValue();
				if(condition.trim().length > 0) {
					console.log(condition);
			
					wasteTime();

									
					//** Offline mode **
					/*
					oModel = new sap.ui.model.json.JSONModel("model/list.json");
					oController.onNavButtonTo(oEvent,  "fd:18");
					*/
					//** Offline mode **




					//** Online mode **
					
					oModel = new sap.ui.model.json.JSONModel();
					oModel.setSizeLimit(999999);

					$.ajax({
						type: 'GET',
						async: true,
						cache: true,
						url: "/nodejs?condition=" + condition,
						success: function (data) {
							if(data.length > 0) {
								runNext();
								console.log( JSON.parse(data));
								oModel.setData({
									modelData : JSON.parse(data)
								});
								oController.onNavButtonTo(oEvent,  "fd:18");
							} else {
								runNext();
								jQuery.sap.require("sap.m.MessageBox");
								sap.m.MessageBox.show(jQuery.sap.resources({url : "i18n/i18n.properties"}).getText("NO_INFO"), {
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
				} else {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(jQuery.sap.resources({url : "i18n/i18n.properties"}).getText("VALID_KEYWORD"), {
						icon: sap.m.MessageBox.Icon.INFORMATION,      
						title: "{i18n>WELCOME_TITLE}",                             
						actions: sap.m.MessageBox.Action.OK,    
						onClose: null,                         
						//styleClass: ""                        
					});
				}		
        	} 
        });

		oForm.addContent(oCondition);
		oForm.addContent(oText1);
		oForm.addContent(oBtnAdd);

        var page = new sap.m.Page({
			setShowHeader: true,
			
		});


		var oIconTabBar = new sap.m.IconTabBar({
            items: [
                new sap.m.IconTabFilter({
                    text: "Clinical Trials",
                    content : [oForm]
                }),
       
            ]
        });  

		page.addContent(oIconTabBar);
		page.setEnableScrolling(false);
        page.setShowHeader(true);

		
		return page;

	}

});
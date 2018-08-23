sap.ui.controller("view.CT", {

    onInit: function() {
        this.bus = sap.ui.getCore().getEventBus();
    },

    doNavBack: function(event) {
        this.bus.publish("nav", "back");
    },
		
	onNavButtonTo: function(evt, data) {
		this.bus.publish("nav", "to", { 
			id : "CTL1",
			data : {
				context: data
			}
		});

	},


    
});
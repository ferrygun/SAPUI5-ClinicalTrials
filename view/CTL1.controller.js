sap.ui.controller("view.CTL1", {

    onInit: function() {
        this.bus = sap.ui.getCore().getEventBus();
    },

    /*
	doNavBack: function(event) {
        this.bus.publish("nav", "back");
    },
	*/

	doNavBack: function(event) {
		app.ref.AppView.app.backDetail();
    }, 
		
	onNavButtonTo: function(evt, data) {
		this.bus.publish("nav", "to", { 
			//id : "CTL2",
			id : "Detail",
			data : {
				context: data
			}
		});

	},
  
});
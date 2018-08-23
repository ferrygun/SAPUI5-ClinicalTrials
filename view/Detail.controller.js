sap.ui.controller("view.Detail", {

    onInit: function() {
        var oView = this.getView();
        this.getView().addEventDelegate({
            onBeforeShow: function(evt) {
                oView.setModel(oModel);
                oView.bindElement("/modelData1/0");

                // create model and set the data
                oView.setModel(oModel);
                console.log(oModel);
                this.oVBI = oView.byId("vbi");

                var conf = {
                    "MapProvider": [{
                        "type": "",
                        "name": "BING",
                        "description": "Bing",
                        "tileX": "256",
                        "tileY": "256",
                        "minLOD": "0",
                        "maxLOD": "19",
                        "copyright": "Microsoft Corp.",
                        "Source": [{
                            "id": "1",
                            "url": "http://ecn.t0.tiles.virtualearth.net/tiles/r{QUAD}?g=685&&shading=hill"
                        }]
                    }],
                    "MapLayerStacks": [{
                        "name": "Default",
                        "MapLayer": [{
                            "name": "layer1",
                            "refMapProvider": "BING",
                            "opacity": "1.0",
                            "colBkgnd": "RGB(255,255,255)"
                        }]
                    }]
                };
                this.oVBI.setMapConfiguration(conf);
            }
        });

    },
	

    doNavBack: function() {
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

        wasteTime();

        oModel = new sap.ui.model.json.JSONModel(sap.ui.getCore().getModel('pathmodel').oData.oData);
        oModel.setSizeLimit(999999);
        app.ref.AppView.app.backDetail();
        runNext();
    },
});
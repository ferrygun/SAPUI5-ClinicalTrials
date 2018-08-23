sap.ui.controller("view.Detail", {

		
		oVBI: new sap.ui.vbm.GeoMap(),
        currentDetailLevel: 0,
        onZoomChanged: function(e) {
            var oVBI = this.oVBI;
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

            oVBI.setMapConfiguration(conf);

            if (oVBI) {
                var switchZoomLevel = 5;
                var zl = e.getParameter("zoomLevel");
                var oModel = this.getView().getModel();
                if (oVBI.getFeatureCollections().length > 0) {
                    if (zl > switchZoomLevel && this.currentDetailLevel === 0) {
                        oModel.setData(this.oDataDetail);
                        this.currentDetailLevel = 1;
                    } else if (zl <= switchZoomLevel && this.currentDetailLevel === 1) {
                        oModel.setData(this.oData);
                        this.currentDetailLevel = 0;
                    }
                    oVBI.removeFeatureCollection(this.FCRef);
                    this.addFeatureCollection(this.currentDetailLevel);
                }
            }
        },
        oData: {
            Features: [{
                "id": "DEU",
                "tooltip": "Germany",
                "color": "rgba(92,186,230,0.6)"
            }]
        },
        oDataDetail: {
            Features: [{
                    "id": "DE-BB",
                    "tooltip": "Brandenburg",
                    "color": "rgba(92,186,230,0.6)"
                },
                {
                    "id": "DE-BE",
                    "tooltip": "Berlin",
                    "color": "rgba(182,217,87,0.6)"
                },
                {
                    "id": "DE-BW",
                    "tooltip": "Baden-W\u00FCrttemberg",
                    "color": "rgba(217,152,203,0.6)"
                },
                {
                    "id": "DE-BY",
                    "tooltip": "Bayern",
                    "color": "rgba(140,211,255,0.6)"
                },
                {
                    "id": "DE-HB",
                    "tooltip": "Bremen",
                    "color": "rgba(217,152,203,0.6)"
                },
                {
                    "id": "DE-HE",
                    "tooltip": "Hessen",
                    "color": "rgba(242,210,73,0.6)"
                },
                {
                    "id": "DE-HH",
                    "tooltip": "Hamburg",
                    "color": "rgba(250,195,100,0.6)"
                },
                {
                    "id": "DE-MV",
                    "tooltip": "Mecklenburg-Vorpommern",
                    "color": "rgba(219,219,70,0.6)"
                },
                {
                    "id": "DE-NI",
                    "tooltip": "Niedersachsen",
                    "color": "rgba(82,186,204,0.6)"
                },
                {
                    "id": "DE-NW",
                    "tooltip": "Nordrhein-Westfalen",
                    "color": "rgba(204,197,168,0.6)"
                },
                {
                    "id": "DE-RP",
                    "tooltip": "Rheinland-Pfalz",
                    "color": "rgba(152,170,251,0.6)"
                },
                {
                    "id": "DE-SH",
                    "tooltip": "Schleswig-Holstein",
                    "color": "rgba(152,170,251,0.6)"
                },
                {
                    "id": "DE-SL",
                    "tooltip": "Saarland",
                    "color": "rgba(182,217,87,0.6)"
                },
                {
                    "id": "DE-SN",
                    "tooltip": "Sachsen",
                    "color": "rgba(250,195,100,0.6)"
                },
                {
                    "id": "DE-ST",
                    "tooltip": "Sachsen-Anhalt",
                    "color": "rgba(217,152,203,0.6)"
                },
                {
                    "id": "DE-TH",
                    "tooltip": "Th\u00FCringen",
                    "color": "rgba(152,170,251,0.6)"
                }
            ]
        },
        onInit: function() {
            //		var oVBI = this.oVBI;


            var oModel1 = new sap.ui.model.json.JSONModel();
            oModel1.setData(this.oData);
            this.getView().setModel(oModel1);
            this.oVBI = this.getView().byId("vbi");
            this.addFeatureCollection(0);

			var oView = this.getView();
			this.getView().addEventDelegate({
				onBeforeShow: function(evt) {
					oView.setModel(oModel);
					oView.bindElement("/modelData1/0");
				}
			});

        },
        FCRef: null,
        addFeatureCollection: function(currentDetailLevel) {
            this.FCRef = new sap.ui.vbm.FeatureCollection({
                srcURL: (!currentDetailLevel) ? "media/L0_DE.json" : "media/L1_DE.json",
                click: this.onClickFC.bind(this),
                items: {
                    path: "/Features",
                    template: new sap.ui.vbm.Feature({
                        color: '{color}',
                        tooltip: '{tooltip}',
                        featureId: '{id}'
                    })
                }
            });

            this.oVBI.addFeatureCollection(this.FCRef);

        },
        onClickFC: function(e) {
            var id = e.getParameter("featureId");
            var FeatureIds = [id];
            var datas = this.FCRef.getFeaturesInfo(FeatureIds);
            var bbs = [datas[id].BBox];
            this.oVBI.zoomToAreas(bbs, 0.95);

        },


		/*
		onInit: function() {
			var oView = this.getView();
			this.getView().addEventDelegate({
				onBeforeShow: function(evt) {
					oView.setModel(oModel);
					oView.bindElement("/modelData1/0");
				}
			});
		},
		*/
		
		doNavBack: function() {
			var busyDialog = (busyDialog) ? busyDialog : new sap.m.BusyDialog({text:'{i18n>MSG0}', title: '{i18n>MSG1}'});
	
			function wasteTime(){
				busyDialog.open();
			}

			function runNext(){
				busyDialog.close();
			}
        
			wasteTime();

			oModel = new sap.ui.model.json.JSONModel(sap.ui.getCore().getModel('pathmodel').oData.oData);
			oModel.setSizeLimit(999999);
			app.ref.AppView.app.backDetail();
			runNext();
		}, 
});


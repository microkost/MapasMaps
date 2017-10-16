(function(){
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(item, from) {
		    var len = this.length;
		    var i = from || 0;
		    if (i < 0) { i += len; }
		    for (;i<len;i++) {
				if (i in this && this[i] === item) { return i; }
		    }
		    return -1;
		}
	}
	if (!Array.indexOf) {
		Array.indexOf = function(obj, item, from) { return Array.prototype.indexOf.call(obj, item, from); }
	}

	var Loader = {
		base: (location.protocol.match(/^http/i) ? "" : "http:") + "//api.mapy.cz",
		mode: "single",
		version: "4.12.96",
		async: false,

		_callback: false,
		_files: {
			css: {
				api: ["/css/api/api.css", "/css/api/card.css", "/css/api/marker.css"],
				poi: "/css/api/poi.css",
				pano: "/css/api/pano.css",
				suggest: "/css/api/suggest.css",
				"api-simple": "/css/api/api.css",
				"api-jak": "/css/api/smap-jak.css",
				"api-poi": "/css/api/smap-poi.css",
				"api-jak-poi-pano-suggest": "/css/api/smap-jak-poi-pano-suggest.css"
			},

			single: {
				jak: "/js/api/jak.js",
				api: ["/js/api/smap.js", "/config.js?key={key}"],
				poi: "/js/api/poi.js",
				pano: "/js/api/pano.js",
				suggest: "/js/api/suggest.js",
				"api-simple": ["/js/api/smap-simple.js", "/config.js?key={key}"],
				"api-jak": ["/js/api/smap-jak.js", "/config.js?key={key}"],
				"api-poi": ["/js/api/smap-jak.js", "/config.js?key={key}", "/js/api/poi.js"],
				"api-jak-poi-pano-suggest": ["/js/api/smap-jak.js", "/config.js?key={key}", "/js/api/poi-pano-suggest.js"]
			},

			multi: {
				jak: ["/js/api/jak/touchr.js", "/js/api/jak/jak.js"],
				api: [
						"/js/api/api/polyfills.js",
						"/js/api/jak/graphics.js",
						"/js/api/jak/xml.js",
						"/js/api/jak/interpolator.js",
						"/js/api/jak/rpc.js",
						"/js/api/jak/frpc.js",
						"/js/api/jak/base64.js",
						"/js/api/jak/css3.js",
						"/js/api/jak/xmlrpc.js",
						"/js/api/api/map.js",
						"/js/api/api/map-iowned.js",
						"/js/api/api/ophoto-date.js",
						"/js/api/api/util.js",
						"/js/api/api/projection.js",
						"/js/api/api/projection-oblique.js",
						"/js/api/api/projection-robinson.js",
						"/js/api/api/layer.js",
						"/js/api/api/layer-tile.js",
						"/js/api/api/layer-tile-oblique.js",
						"/js/api/api/layer-image.js",
						"/js/api/api/layer-wms.js",
						"/js/api/api/layer-wmts.js",
						"/js/api/api/layer-smart.js",
						"/js/api/api/layer-smart-turist.js",
						"/js/api/api/layer-turist.js",
						"/js/api/api/layer-marker.js",
						"/js/api/api/layer-geometry.js",
						"/js/api/api/geometry.js",
						"/js/api/api/geometry-multi.js",
						"/js/api/api/geometry-smart.js",
						"/js/api/api/marker.js",
						"/js/api/api/marker-repositioner.js",
						"/js/api/api/marker-cluster.js",
						"/js/api/api/marker-clusterer.js",
						"/js/api/api/card.js",
						"/js/api/api/control.js",
						"/js/api/api/control-keyboard.js",
						"/js/api/api/control-mouse.js",
						"/js/api/api/control-orientation.js",
						"/js/api/api/control-overview.js",
						"/js/api/api/control-layer.js",
						"/js/api/api/control-zoom.js",
						"/js/api/api/control-copyright.js",
						"/js/api/api/control-minimap.js",
						"/js/api/api/control-rosette.js",
						"/js/api/api/control-scale.js",
						"/js/api/api/control-pointer.js",
						"/js/api/api/contextmenu.js",
						"/js/api/api/contextmenu-item.js",
						"/js/api/api/wmmarker.js",
						"/js/api/util/gpx.js",
						"/js/api/util/kml.js",
						"/js/api/util/geocoder.js",
						"/js/api/util/route.js",
						"/js/api/util/url.js",
						"/js/api/util/open-location-code.js",
						"/js/api/api/eggs.js",
					 "/config.js?key={key}"
				],
				poi: [
						"/js/api/poi/poiserver.js",
						"/js/api/poi/poiserver-xml.js",
						"/js/api/poi/poiserver-frpc.js",
						"/js/api/poi/dataprovider.js",
						"/js/api/poi/layer-lookup.js",
						"/js/api/poi/marker-poi.js",
						"/js/api/poi/marker-fotopoi.js",
						"/js/api/poi/marker-trafficdetail.js",
						"/js/api/poi/geometry-traffic.js",
						"/js/api/poi/def.js"
				],
				pano: [
						"/js/api/pano/gl-matrix-min.js",
						"/js/api/pano/gl.js",
						"/js/api/pano/pano.js",
						"/js/api/pano/pano-renderer.js",
						"/js/api/pano/pano-webgl.js",
						"/js/api/pano/pano-flash.js",
						"/js/api/pano/pano-nav.js",
						"/js/api/pano/pano-clickmask.js",
						"/js/api/pano/pano-place.js",
						"/js/api/pano/pano-scene.js",
						"/js/api/pano/pano-sphere.js",
						"/js/api/pano/pano-tile.js",
						"/js/api/pano/pano-marker.js",
						"/js/api/pano/pano-layer.js"
				],
				suggest: [
						"/js/api/suggest/suggest-item.js",
						"/js/api/suggest/suggest-provider.js",
						"/js/api/suggest/suggest.js"
				],
				"api-simple": [
						"/js/api/api/map-simple.js",
						"/js/api/api/util.js",
						"/js/api/api/projection.js",
					 "/config.js?key={key}"
				],
				"api-jak": [],
				"api-poi": [],
				"api-jak-poi-pano-suggest": []
			}
		},

		load: function(key_, what_, callback) {
			var key = key_ || "";
			var what = {
				jak: true,
				poi: false,
				pano: false,
				suggest: false,
				api: "full"
			};

			for (var p in what_) { what[p] = what_[p]; }
			if (callback) { this._callback = callback; }

			/* soupis souboru k naloadovani */
			var list = [];
			var css = [];
			var files = this._files[this.mode];
			var load = false;
			if (this.mode == "single" && what.api == "full" && what.jak && what.poi && what.pano && what.suggest
				&& !window.JAK && !window.SMap) {
				list = list.concat(files["api-jak-poi-pano-suggest"]);
				css = css.concat(this._files.css["api-jak-poi-pano-suggest"]);
			}
			else if (this.mode == "single" && what.api == "full" && what.jak && !window.SMap && !window.JAK) {
				list = list.concat(files["api-jak"]);
				css = css.concat(this._files.css["api-jak"]);
			}
			else if (this.mode == "single" && what.api == "full" && what.jak && what.poi && !window.SMap && !window.JAK) {
				list = list.concat(files["api-poi"]);
				css = css.concat(this._files.css["api-poi"]);
			}

			if (what.jak && !window.JAK && list.indexOf(files["api-jak"][0]) == -1) { list = list.concat(files.jak); }
			if (what.api == "simple" && !window.SMap) { 
				list = list.concat(files["api-simple"]); 
				css = css.concat(this._files.css["api-simple"]);
			}
			if (what.api == "full" && !window.SMap && list.indexOf(files["api-jak"][0]) == -1) {
				list = list.concat(files.api);
				css = css.concat(this._files.css.api);
			}
			if (what.poi && !(window.SMap && window.SMap.Detail) && list.indexOf(files["api-poi"][2]) == -1
				&& list.indexOf(files["api-jak-poi-pano-suggest"][2]) == -1) {
				list = list.concat(files.poi);
				css = css.concat(this._files.css.poi);
			}
			if (what.pano && !(window.SMap && window.SMap.Pano) && list.indexOf(files["api-jak-poi-pano-suggest"][2]) == -1) {
				list = list.concat(files.pano);
				css = css.concat(this._files.css.pano);
			}
			if (what.suggest && !(window.SMap && window.SMap.Suggest) && list.indexOf(files["api-jak-poi-pano-suggest"][2]) == -1) {
				list = list.concat(files.suggest);
				css = css.concat(this._files.css.suggest);
			}

			/* mozna neni co delat? */
			if (!list.length) { 
				if (this._callback) { this._callback(); }
				return;
			}
			/* vyrobit celou cestu */
			for (var i=0;i<list.length;i++) { 
				var value = list[i];
				value = value.replace(/{key}/, key);
				if (value.indexOf("?") != -1) {
					value += "&";
				} else {
					value += "?";
				}
				value += "v=" + (this.version == 0 ? Math.random() : this.version);
				list[i] = this.base + value; 
			}
			this._loadList(list);

			/* nacist css */
			var parent = (document.getElementsByTagName("head")[0] || document.documentElement);
			while (css.length) {
				var link = document.createElement("link");
				link.rel = "stylesheet";
				link.type = "text/css";
				link.href = this.base + css.shift() + "?v" + (this.version == 0 ? Math.random() : this.version);
				parent.appendChild(link);
			}
		},

		_onLoad: function() {
			this.async = true;

			if (this._callback) {
				this._callback();
				this._callback = null;
			}
		},
		
		_loadAsync: function(list) {
			var head = document.getElementsByTagName("head")[0];
			
			function readyStateChange(e) {
				var elm = e.srcElement;
				if (elm.readyState == 'loaded' || elm.readyState == 'complete') { loadNext(); }
			}
			
			function loadNext() {
				if (!list.length) {
					if (Loader._callback) {
						Loader._callback();
						Loader._callback = null;
					}
					return;
				}
				
				var name = list.shift();
				var script = document.createElement("script");
				script.charset = "utf-8";
				
				if (script.attachEvent) {
					script.attachEvent("onreadystatechange", readyStateChange);
				} else {
					script.addEventListener("load", loadNext, false);
				}
				
				script.type = "text/javascript";
				script.src = name;
				head.appendChild(script);
			}
			
			loadNext();
		},
		
		_loadSync: function(list) {
			for (var i=0;i<list.length;i++) {
				document.write('<script charset="utf-8" type="text/javascript" src="'+list[i]+'"></script>');
			}
		},
		
		_loadList: function(list) {
			if (this.async) {
				this._loadAsync(list);
			} else {
				this._loadSync(list);
			}
		}		
	};
	
	window.Loader = Loader;

	if (window.attachEvent) {
		window.attachEvent("onload", function() { Loader._onLoad(); });
	} else {
		window.addEventListener("load", function() { Loader._onLoad(); }, false);
	}
})();
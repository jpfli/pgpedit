
/* ================
 * Property classes
 * ================ */

/* StringProperty class
*/
function StringProperty(maxlen = 0) {
//  console.log("IntProperty.constructor(maxlen="+maxlen+")");

  this._observers = [];
  this._maxlen = maxlen;
  this._value = "";
}
StringProperty.prototype = {
  get maxlen() {
    return this._maxlen;
  },

  get value() {
    return this._value;
  },

  set value(value) {
//    console.log("StringProperty.setValue("+value+")");

    if(value.localeCompare(this._value) != 0) {
      if(this._maxlen > 0) {
        value = value.slice(0, this._maxlen);
      }
      this._value = value;
      this._notifyObservers();
    }
  },

  addObserver: function(observer) {
    this._observers.push(observer);
    observer.onPropertyUpdated(this);
  },
  removeObserver: function(observer) {
    let idx = this._observers.indexOf(observer);
    if(idx >= 0) {
      this._observers.splice(idx, 1);
    }
  },
  _notifyObservers: function() {
//    console.log("StringProperty._notifyObservers()");

    for(let idx = 0; idx < this._observers.length; idx++) {
      this._observers[idx].onPropertyUpdated(this);
    }
  }
};

/* IntProperty class
*/
function IntProperty(min = -2147483648, max = 2147483647) {
//  console.log("IntProperty.constructor(min="+min+", max="+max+")");

  this._observers = [];
  this._min = min;
  this._max = max;
  this._value = 0;
}
IntProperty.prototype = {
  get value() {
    return this._value;
  },

  set value(value) {
//    console.log("IntProperty.setValue("+value+")");
    value = parseInt(value);
    if(!isNaN(value)) { // && this._value != value) {
      if(this._min >= value) {
        value = this._min;
      }
      else if(this._max <= value) {
        value = this._max;
      }
      this._value = value;
      this._notifyObservers();
    }
  },

  addObserver: function(observer) {
    this._observers.push(observer);
    observer.onPropertyUpdated(this);
  },

  removeObserver: function(observer) {
    let idx = this._observers.indexOf(observer);
    if(idx >= 0) {
      this._observers.splice(idx, 1);
    }
  },

  _notifyObservers: function() {
    for(let idx = 0; idx < this._observers.length; idx++) {
      this._observers[idx].onPropertyUpdated(this);
    }
  }
};

/* FloatProperty class
*/
function FloatProperty(min = -2147483648, max = 2147483647) {
//  console.log("IntProperty.constructor(min="+min+", max="+max+")");

  this._observers = [];
  this._min = min;
  this._max = max;
  this._value = 0;
}
FloatProperty.prototype = {
  get value() {
    return this._value;
  },

  set value(value) {
//    console.log("FloatProperty.setValue("+value+")");
    value = parseFloat(value);
    if(!isNaN(value)) { // && this._value != value) {
      if(this._min >= value) {
        value = this._min;
      }
      else if(this._max <= value) {
        value = this._max;
      }
      this._value = value;
      this._notifyObservers();
    }
  },

  addObserver: function(observer) {
    this._observers.push(observer);
    observer.onPropertyUpdated(this);
  },

  removeObserver: function(observer) {
    let idx = this._observers.indexOf(observer);
    if(idx >= 0) {
      this._observers.splice(idx, 1);
    }
  },

  _notifyObservers: function() {
    for(let idx = 0; idx < this._observers.length; idx++) {
      this._observers[idx].onPropertyUpdated(this);
    }
  }
};


/* ============
 * Data classes
 * ============ */


/* BillboardModel class
*/
function BillboardModel(name, color) {
  this.name = name;
  this.color = color;
  this.texture = "";
}


/* BillboardObject class
*/
function BillboardObject(creator, model_index, x, y) {
  this._creator = creator;
  this._model_index = model_index;
  this._x = x;
  this._y = y;
}

BillboardObject.prototype = {
  get model_index() {
    return this._model_index;
  },
  set model_index(val) {
    this._model_index = val;
    this._notifyCreator();
  },

  get x() {
    return this._x;
  },
  set x(val) {
    this._x = val;
    this._notifyCreator();
  },

  get y() {
    return this._y;
  },
  set y(val) {
    this._y = val;
    this._notifyCreator();
  },

  _notifyCreator: function() {
    this._creator.onBillboardObjectUpdated();
  }
};


/* Billboards class
*/
function Billboards() {
//  console.log("Billboards.constructor()");

  this._observers = [];

  this._active_model_idx = -1;
  this._active_billboard_object = null;
  this._billboard_models = [];
  this._billboard_objs = [];
}

Billboards.prototype = {
  numBillboardModels: function() {
    return this._billboard_models.length;
  },

  clearBillboardModels: function() {
    this._types.length = 0;
    this._active_model_idx = -1;
  },

  getBillboardModel: function(idx) {
    if(idx >= 0 && idx < this._billboard_models.length) {
      return this._billboard_models[idx];
    }
    return null;
  },

  addBillboardModel: function() {
    let len = this._billboard_models.push(new BillboardModel("", "#ffffff"));
    this._active_model_idx = len-1;
    return this._billboard_models[len-1];
  },

  delBillboardModel: function(idx) {
//    console.log("Billboards.delType("+idx+")");
    if(idx >= 0 && idx < this._billboard_models.length) {
      if(idx == this._active_model_idx) {
        if(idx > 0) {
          this._active_model_idx--;
        }
      }
      else if(idx < this._active_model_idx) {
        this._active_model_idx--;
      }
      this._billboard_models.splice(idx, 1);
    }
    if(this._billboard_models.length > 0) {
//      console.log("Active BillboardModel: '"+this._billboard_models[_active_model_idx].name+"'");
    }
  },

  getActiveModelIndex: function() {
    return this._active_model_idx;
  },

  setActiveModelIndex: function(idx) {
    if(idx >= 0 && idx < this._billboard_models.length) {
      this._active_model_idx = idx;
    }
    else {
      this._active_model_idx = -1;
    }
  },

  numBillboardObjects: function() {
    return this._billboard_objs.length;
  },

  clearBillboardObjects: function() {
    this._billboard_objs.length = 0;

    this._notifyObservers();
  },

  getBillboardObject: function(idx) {
    if(idx >= 0 && idx < this._billboard_objs.length) {
      return this._billboard_objs[idx];
    }
    return null;
  },

  addBillboardObject: function(idx) {
    let billboard_obj = new BillboardObject(this, this._active_model_idx, 0, 0);
    this._billboard_objs.splice(idx, 0, billboard_obj);

    this._active_billboard_obj = billboard_obj;

    this._notifyObservers();

    return billboard_obj;
  },

  delBillboardObject: function(idx) {
    if(idx >= 0 && idx < this._billboard_objs.length) {
      if(this._active_billboard_obj == this._billboard_objs[idx]) {
        if(idx > 0) {
          this._active_billboard_obj = this._billboard_objs[idx-1];
        }
        else {
          this._active_billboard_obj = (this._billboard_objs.length > 1) ? 
            this._billboard_objs[idx+1] : 
            null;
        }
      }
      this._billboard_objs.splice(idx, 1);
//      console.log("Billboards.delBillboardObject(): Billboard object deleted");
      this._notifyObservers();
    }
  },

  getActiveBillboardObject: function() {
    return this._active_billboard_obj;
  },

  setActiveBillboardObject: function(billboard_obj) {
    this._active_billboard_obj = billboard_obj;

    this._notifyObservers();
  },

  onBillboardObjectUpdated: function() {
    this._notifyObservers();
  },

  addObserver: function(observer) {
    this._observers.push(observer);
    observer.onBillboardsUpdated();
  },

  removeObserver: function(observer) {
    let idx = this._observers.indexOf(observer);
    if(idx >= 0) {
      this._observers.splice(idx, 1);
    }
  },

  _notifyObservers: function() {
//    console.log("Billboards._notifyObservers()");
    for(let idx = 0; idx < this._observers.length; idx++) {
      this._observers[idx].onBillboardsUpdated();
    }
  }
};


/* PhysicsParameters class
*/
function PhysicsParameters(fs, fk, traction, rr) {
  this._fs = new FloatProperty(0.0, 10.0);
  this._fk = new FloatProperty(0.0, 10.0);
  this._traction = new IntProperty(100, 30000);
  this._rr = new FloatProperty(0.0, 10.0);
  this._observers = [];

  this._fs.value = fs;
  this._fk.value = fk;
  this._traction.value = traction;
  this._rr.value = rr;

  this._fs.addObserver(this);
  this._fk.addObserver(this);
  this._traction.addObserver(this);
  this._rr.addObserver(this);
}
PhysicsParameters.prototype = {
  get static_friction() {
    return this._fs.value;
  },
  set static_friction(val) {
    this._fs.value = val;
  },

  get kinetic_friction() {
    return this._fk.value;
  },
  set kinetic_friction(value) {
    this._fk.value = value;
  },

  get traction_constant() {
    return this._traction.value;
  },
  set traction_constant(value) {
    this._traction.value = value;
  },

  get rolling_resistance() {
    return this._rr.value;
  },
  set rolling_resistance(value) {
    this._rr.value = value;
  },

  onPropertyUpdated: function() {
    this._notifyObservers();
  },

  addObserver: function(observer) {
    this._observers.push(observer);
    observer.onPhysicsParametersUpdated();
  },

  removeObserver: function(observer) {
    let idx = this._observers.indexOf(observer);
    if(idx >= 0) {
      this._observers.splice(idx, 1);
    }
  },

  _notifyObservers: function() {
//    console.log("PhysicsParameters._notifyObservers()");
    for(let idx = 0; idx < this._observers.length; idx++) {
      this._observers[idx].onPhysicsParametersUpdated();
    }
  }
};


/* Texture class
*/
function Texture(name) {
//  console.log("Texture.constructor()");

  this._name = name;
  this._width = 0;
  this._height = 0;
  this._rgb_data = [];
}
Texture.prototype = {
  _BKGND_COLOR: "#ff00ff",

  get name() {
    return this._name;
  },

  get width() {
    return this._width;
  },

  get height() {
    return this._height;
  },

  getRGBData: function(sx, sy, width, height) {
    let num_pixels = width*height;
    let rgb_data = [];
    rgb_data.length = 3*num_pixels;
    let offset = 3*(this._width*sy+sx);
    for(let y = 0; y < height; y++) {
      for(let x = 0; x < width; x++) {
        rgb_data[3*(width*y+x)] = this._rgb_data[offset+3*(this._width*y+x)];
        rgb_data[3*(width*y+x)+1] = this._rgb_data[offset+3*(this._width*y+x)+1];
        rgb_data[3*(width*y+x)+2] = this._rgb_data[offset+3*(this._width*y+x)+2];
      }
    }
    return rgb_data;
  },

  fromRGBData: function(rgb_data, width, height, autocrop) {
    let rect = {x: 0, y: 0, w: width, h: height};
    if(autocrop) {
      rect = this._getCropRectangle(rgb_data, width, height);
    }

    this._width = rect.w;
    this._height = rect.h;

    // Copy rgb_data array
    this._rgb_data.length = 3*rect.w*rect.h;
    for(let idx = 0; idx < rect.w*rect.h; idx++) {
      let sy = rect.y+((idx/rect.w)|0);
      let sx = rect.x+(idx%rect.w);
      this._rgb_data[3*idx] = rgb_data[3*(width*sy+sx)];
      this._rgb_data[3*idx+1] = rgb_data[3*(width*sy+sx)+1];
      this._rgb_data[3*idx+2] = rgb_data[3*(width*sy+sx)+2];
    }

//    console.log(rect);
  },

  _getCropRectangle: function(rgb_data, width, height) {
    let padding_top = height;
    let padding_right = width;
    let padding_bottom = height;
    let padding_left = width;

    for(let y = 0; y < height; y++) {
      for(let x = 0; x < width; x++) {
        let r = rgb_data[3*(width*y+x)+0];
        let g = rgb_data[3*(width*y+x)+1];
        let b = rgb_data[3*(width*y+x)+2];
        let color = this._RGBToHtmlColor(r, g, b);
        if(color != this._BKGND_COLOR) {
          padding_top = Math.min(padding_top, y);
          padding_right = Math.min(padding_right, width-1-x);
          padding_bottom = Math.min(padding_bottom, height-1-y);
          padding_left = Math.min(padding_left, x);
        }
      }
    }
    let rect = {
      x: padding_left,
      y: padding_top,
      w: width-(padding_left+padding_right),
      h: height-(padding_top+padding_bottom)
    };

    width_adj = ((rect.w+3)&0xfffffffc)-rect.w;
    rect.x -= (width_adj>>1);
    rect.w += width_adj;
    if(rect.x < 0) {
      rect.x = 0;
    }
    else if(rect.x+rect.w >= width) {
      rect.x = width-rect.w;
    }
    return rect;
  },

  _RGBToHtmlColor: function(r, g, b) {
    r_str = (r < 0x10) ? "0"+r.toString(16) : r.toString(16);
    g_str = (g < 0x10) ? "0"+g.toString(16) : g.toString(16);
    b_str = (b < 0x10) ? "0"+b.toString(16) : b.toString(16);
    return "#"+r_str+g_str+b_str;
  }
};


/* Tilemap class
*/
function Tilemap(width, height) {
//  console.log("Tilemap.constructor()");

  this._observers = [];

  this._width = width;
  this._height = height;
  this._data = [];

  this._data.length = width*height;
  for(let idx = 0; idx < width*height; idx++) {
    this._data[idx] = 0;
  }
}
Tilemap.prototype = {
  get width() {
    return this._width;
  },

  set width(width) {
    if(this._width != width) {
      this._width = width;
      this._data.length = width*this._height;
      for(let idx = 0; idx < width*this._height; idx++) {
        this._data[idx] = 0;
      }
    }
  },

  get height() {
    return this._height;
  },

  set height(height) {
    if(this._height != height) {
      this._height = height;
      this._data.length = this._width*height;
      for(let idx = 0; idx < this._width*height; idx++) {
        this._data[idx] = 0;
      }
    }
  },

  getTileData: function(sx, sy, width, height) {
    let data = [];
    data.length = width*height;
    for(let idx = 0; idx < width*height; idx++) {
      let x = idx%width;
      let y = (idx/width)|0;
      data[idx] = this._data[this._width*(sy+y)+sx+x];
    }
    return data;
  },

  putTileData: function(data, dx, dy, width, height) {
    for(let idx = 0; idx < width*height; idx++) {
      let x = idx%width;
      let y = (idx/width)|0;
      if(dx+x >= 0 && dx+x < this._width && dy+y >= 0 && dy+y < this._height) {
        this._data[this._width*(dy+y)+dx+x] = data[idx];
      }
    }

    this._notifyObservers(dx, dy, width, height);
  },

  addObserver: function(observer) {
    this._observers.push(observer);
    observer.onTilemapUpdated(this, 0, 0, this._width, this._height);
  },

  removeObserver: function(observer) {
    let idx = this._observers.indexOf(observer);
    if(idx >= 0) {
      this._observers.splice(idx, 1);
    }
  },

  _notifyObservers: function(x, y, width, height) {
//    console.log("Tilemap._notifyObservers()");
    for(let idx = 0; idx < this._observers.length; idx++) {
      this._observers[idx].onTilemapUpdated(this, x, y, width, height);
    }
  }
};


/* Tileset class
*/
function Tileset(pgpedit_app) {
//  console.log("Tileset.constructor()");

  this._pgpedit_app = pgpedit_app;
  this._symbols = [];
  this._patterns = [];
  this._pattern_w = 8;
  this._pattern_h = 8;
}
Tileset.prototype = {
  _NUM_TILE_TEXTURES: 7,
  _TEXTURE_BLOCK_WIDTH: 8,
  _TEXTURE_BLOCK_HEIGHT: 8,

  initTiles: function(symbols, pattern_w, pattern_h, patterns) {
//    console.log("Tileset.initTiles()");

    this._symbols = symbols.split("");

    this._pattern_w = pattern_w;
    this._pattern_h = pattern_h;
    this._patterns.length = patterns.length;
    for(idx = 0; idx < this._patterns.length; idx++) {
      // Copy array at patterns[idx]
      this._patterns[idx] = patterns[idx].slice(0);
    }

//    console.log(symbols);
//    console.log(patterns);
  },

  numTiles: function() {
    return this._patterns.length;
  },

  getTileSymbol: function(tile_id) {
    if(tile_id >=0 && tile_id < this.numTiles()) {
      return this._symbols[tile_id];
    }
  },

  tileIndexOf: function(symbol) {
    return this._symbols.indexOf(symbol);
  },

  getTileWidth: function() {
    return this._pattern_w*this._TEXTURE_BLOCK_WIDTH;
  },

  getTileHeight: function() {
    return this._pattern_h*this._TEXTURE_BLOCK_HEIGHT;
  },

  getTileRGBData: function(tile_idx) {
    let tblocks = [];
    for(let idx = 0; idx < this._NUM_TILE_TEXTURES; idx++) {
      tblocks.push(this._createTextureBlocks(this._pgpedit_app.textures[idx]));
    }
    // Flatten the array
    tblocks = [].concat.apply([], tblocks);
//    console.log(tblocks);

    // Width and height of single texture block in pixels
    let tblock_w = this._TEXTURE_BLOCK_WIDTH;
    let tblock_h = this._TEXTURE_BLOCK_HEIGHT;
    let tile_w = this.getTileWidth();
    let tile_h = this.getTileHeight();

    let tcoord_arr = [];
    tcoord_arr.length = tile_w*tile_h;
    let tidx_arr = [];
    tidx_arr.length = tile_w*tile_h;

    let pattern_data = this._patterns[tile_idx];
    let rgb_data = [];
    rgb_data.length = 3*tile_w*tile_h;

    for(let y = 0; y < tile_h; y++) {
      let tex_y = y%tblock_h;
      let pattern_y = (y/tblock_h)|0;
      for(let x = 0; x < tile_w; x++) {
        let tex_x = x%tblock_w;
        let pattern_x = (x/tblock_w)|0;
        let tex_idx = pattern_data[this._pattern_w*pattern_y+pattern_x];
        let tblock = tblocks[tex_idx];
        rgb_data[3*(tile_w*y+x)] = tblock[3*(tblock_w*tex_y+tex_x)];
        rgb_data[3*(tile_w*y+x)+1] = tblock[3*(tblock_w*tex_y+tex_x)+1];
        rgb_data[3*(tile_w*y+x)+2] = tblock[3*(tblock_w*tex_y+tex_x)+2];

        tidx_arr[tile_w*y+x] = tex_idx;
        tcoord_arr[tile_w*y+x] = [tex_x, tex_y];
      }
    }

//    console.log(tcoord_arr);
//    console.log(tidx_arr);

    return rgb_data;
  },

  _createTextureBlocks: function(texture) {
    let tblock_w = this._TEXTURE_BLOCK_WIDTH;
    let tblock_h = this._TEXTURE_BLOCK_HEIGHT;
    let img_w = texture.width;
    let img_h = img_w;

    // Textures may contain several texture blocks in one image -
    // here we determine positions of those blocks
    let tblocks = [];
    let num_blocks = ((img_w/tblock_w)*(img_h/tblock_h))|0;
    for(let idx = 0; idx < num_blocks; idx++) {
      let y = tblock_h*(((tblock_w*idx)/img_w)|0);
      let x = (tblock_w*idx)%img_w;
      tblocks.push(texture.getRGBData(x, y, tblock_w, tblock_h));
    }
    return tblocks;
  }
};


/* Waypoint class
*/
function Waypoint(creator, x = 0, y = 0, radius = 0, speed = 0, checkpoint = true) {
  this._creator = creator;

  this._checkpoint = checkpoint;
  this._radius = new IntProperty(0, 1024);
  this._speed = new IntProperty(0, 100);
  this._x = x;
  this._y = y;

  this._radius.value = radius;
  this._speed.value = speed;

  this._radius.addObserver(this);
  this._speed.addObserver(this);
}

Waypoint.prototype = {
  get checkpoint() {
    return this._checkpoint
  },
  set checkpoint(val) {
    this._checkpoint = val;
    this._notifyCreator();
  },

  get radius() {
    return this._radius.value;
  },
  set radius(val) {
    this._radius.value = val;
//    this._notifyCreator();
  },

  get speed() {
    return this._speed.value;
  },
  set speed(val) {
    this._speed.value = val;
//    this._notifyCreator();
  },

  get x() {
    return this._x;
  },
  set x(val) {
    this._x = val;
    this._notifyCreator();
  },

  get y() {
    return this._y;
  },
  set y(val) {
    this._y = val;
    this._notifyCreator();
  },

  onPropertyUpdated: function() {
    this._creator.onWaypointUpdated();
  },

  _notifyCreator: function() {
    this._creator.onWaypointUpdated();
  }
};


/* Waypoints class
*/
function Waypoints() {
//  console.log("Waypoints.constructor()");

  this._observers = [];

  this._active_waypoint = null;
  this._waypoints = [];
}

Waypoints.prototype = {
  numWaypoints: function() {
    return this._waypoints.length;
  },

  clearWaypoints: function() {
    this._waypoints.length = 0;

    this._notifyObservers();
  },

  getWaypoint: function(idx) {
    if(idx >= 0 && idx < this._waypoints.length) {
      return this._waypoints[idx];
    }
    return null;
  },

  addWaypoint: function(idx) {
    let new_wp = new Waypoint(this);
    this._waypoints.splice(idx, 0, new_wp);

    this._active_waypoint = new_wp;

    this._notifyObservers();

    return new_wp;
  },

//    let idx = 0;
//    while(idx < this._waypoints.length) {
//      if(this._waypoints[idx] == this._active_waypoint) {
//        idx++;
//        break;
//      }
//      idx++;
//    }
//    let new_wp = new Waypoint();
//    this._waypoints.splice(idx, 0, new_wp);
//    this._active_waypoint = new_wp;
//
//    this._notifyObservers();
//
//    return new_wp;
//  },

  delWaypoint: function(idx) {
    if(idx >= 0 && idx < this._waypoints.length) {
      if(this._active_waypoint == this._waypoints[idx]) {
        if(idx > 0) {
          this._active_waypoint = this._waypoints[idx-1];
        }
        else {
          this._active_waypoint = (this._waypoints.length > 1) ? this._waypoints[idx+1] : null;
        }
      }
      this._waypoints.splice(idx, 1);

      this._notifyObservers();
    }
  },

  getActiveWaypoint: function() {
    return this._active_waypoint;
  },

  setActiveWaypoint: function(waypoint) {
    this._active_waypoint = waypoint;
    this._notifyObservers();
  },

  onWaypointUpdated: function() {
    this._notifyObservers();
  },

  addObserver: function(observer) {
    this._observers.push(observer);
    observer.onWaypointsUpdated();
  },

  removeObserver: function(observer) {
    let idx = this._observers.indexOf(observer);
    if(idx >= 0) {
      this._observers.splice(idx, 1);
    }
  },

  _notifyObservers: function() {
//    console.log("Waypoints._notifyObservers()");
    for(let idx = 0; idx < this._observers.length; idx++) {
      this._observers[idx].onWaypointsUpdated();
    }
  }
};


/* PgpEdit_View class (command invoker)
*/
function PgpEdit_View(pgpedit_app) {
//  console.log("PgpEdit_View.constructor()");

  this._pgpedit_app = pgpedit_app;
  this._temp_canvas = document.createElement("canvas");
  this._tilemap_canvas = document.getElementById("tilemap-canvas");
  this._tileset_canvas = document.getElementById("tileset-canvas");
  this._tilebrush_canvas = document.getElementById("tilebrush-canvas");
  this._tilemap_image = null;
  this._tile_images = [];
  this._tilebrush = {width: 1, height: 1, tile_data: [0]};
  this._tilebrush_lastpos = null;
  this._prop_bindings = new Map();
  this._selection_rect = {x: 0, y: 0, w: 0, h: 0};
  this._tileset_mousedown_flag = false;
  this._tilemap_mousedown_flag = false;
  this._tilemap_selection_started = false;
  this._mode = "TILES";
  this._tilemap_updated_rects = [];

  this._billboard_grabbed = false;
  this._billboard_grab_x = 0;
  this._billboard_grab_y = 0;
  this._billboard_move_op = null;

  this._waypoint_grabbed = false;
  this._waypoint_grab_x = 0;
  this._waypoint_grab_y = 0;
  this._waypoint_move_op = null;

  this._tilemap_canvas_dirty = false;
  this._billboards_dirty = false;
  this._waypoints_dirty = false;
  this._tilebrush_cursor_visible = false;
  this._box_select = {x1: 0, y1: 0, x2: 0, y2: 0};

  let img_w = this._TILE_SIZE*this._pgpedit_app.track_tiles.width;
  let img_h = this._TILE_SIZE*this._pgpedit_app.track_tiles.height;
  this._tilemap_canvas.width = img_w
  this._tilemap_canvas.height = img_h;
  let ctx = this._tilemap_canvas.getContext("2d");
  this._tilemap_image = ctx.getImageData(0, 0, img_w, img_h);
  
}
PgpEdit_View.prototype = {
  _TILE_SIZE: 32,
  _TILESET_ROWLEN: 5,
  _GRID_COLOR: "rgb(48, 48, 48)",
  _SELECTION_COLOR: "rgba(255, 128, 128, 0.3)",
  _TEX_IMAGE_W: 64,
  _TEX_IMAGE_H: 64,
  _BBRD_MAX_NUM: 16,
  _BBRD_RECT_SIZE: 10,
  _WP_MAX_NUM: 30,
  _WP_LINE_COLOR: "rgb(255,255,255)",
  _WP_RIM_COLOR: "hsl(200,50%,50%)",
  _WP_TARGET_COLOR: "hsl(180,75%,50%)",
  _WP_TARGET_RECT_SIZE: 10,

  get mode() {
    return this._mode;   // "TILES", "BILLBOARDS", "WAYPOINTS"
  },

  init: function(settings) {
//    console.log("PgpEdit_View.init():");

    document.getElementById("mode-select").value = "tiles-tab";
    this._populateBillboardDroplist(settings);

    this._tilemap_canvas.addEventListener("mousedown", this);
    this._tilemap_canvas.addEventListener("mousemove", this);
    this._tilemap_canvas.addEventListener("mouseout", this);

    window.addEventListener("mouseup", this);
    window.addEventListener("keydown", this);
    window.addEventListener("keyup", this);

    document.getElementById("mode-select").addEventListener("change", this);
    document.getElementById("billboard-droplist").addEventListener("change", this);
    document.getElementById("loadtex-fileinput").addEventListener("change", this);
    document.getElementById("radius-textinput").addEventListener("change", this);
    document.getElementById("speed-textinput").addEventListener("change", this);
    document.getElementById("checkpoint-boolinput").addEventListener("change", this);

    document.getElementById("physparms-button").addEventListener("click", this);
    document.getElementById("physparms_ok-button").addEventListener("click", this);
    document.getElementById("track_physparms_reset-button").addEventListener("click", this);
    document.getElementById("terrain_physparms_reset-button").addEventListener("click", this);
    document.getElementById("edge_physparms_reset-button").addEventListener("click", this);

    document.getElementById("loadtrack-fileinput").addEventListener("change", this);
    document.getElementById("savetrack-button").addEventListener("click", this);

    this.bindProperty(this._pgpedit_app.trackname, "trackname-textinput");
    this.bindProperty(this._pgpedit_app.author, "author-textinput");
    this._pgpedit_app.track_tiles.addObserver(this);
    this._pgpedit_app.billboards.addObserver(this);
    this._pgpedit_app.waypoints.addObserver(this);

//    this._pgpedit_app.physics_parameters["track"].addObserver(this);
//    this._pgpedit_app.physics_parameters["terrain"].addObserver(this);
//    this._pgpedit_app.physics_parameters["edge"].addObserver(this);

    this.updateTileset();
    this._drawTileset();
    this._drawGrid(this._tileset_canvas, this._TILE_SIZE, this._GRID_COLOR);
    this._drawTilebrushView();

    this._drawTilemap();

    this._tileset_canvas.addEventListener("mousedown", this);
    this._tileset_canvas.addEventListener("mousemove", this);
  },

  handleEvent: function(evt) {
//    console.log("{event.target.id:\""+evt.target.id+"\", event.type:\""+evt.type+"\"}");

    if(evt.type == "mouseup" || evt.target.id == "tileset-canvas") {
      this._handleTilesetCanvasEvent(evt);
    }
    if(evt.type == "mouseup" || evt.target.id == "tilemap-canvas") {
      this._handleTilemapCanvasEvent(evt);
    }

    if(evt.type == "change") {
      let dom_id = evt.target.id;
      if(dom_id == "mode-select") {
        this._onSelectMode(evt);
      }
      else if(dom_id == "loadtex-fileinput") {
        this._onLoadTextures(evt);
      }
      else if(dom_id == "loadtrack-fileinput") {
        this._onLoadTrack(evt);
      }
      else if(dom_id == "billboard-droplist") {
        let idx = evt.target.selectedIndex;
        this._pgpedit_app.billboards.setActiveModelIndex(idx);
        this._drawBillboardsPanel();
      }
      else if(dom_id == "radius-textinput" || dom_id == "speed-textinput" || dom_id == "checkpoint-boolinput") {
        if(this._pgpedit_app.waypoints.numWaypoints() > 0) {
          let radius = parseInt(document.getElementById("radius-textinput").value);
          let speed = parseInt(document.getElementById("speed-textinput").value);
          let checkpoint = document.getElementById("checkpoint-boolinput").checked;

          let op = new SetWaypointProperties_Operator(radius, speed, checkpoint, "WAYPOINTS");
          this._pgpedit_app.executeOperator(op);
        }
        else {
          document.getElementById("radius-textinput").value = "";
          document.getElementById("speed-textinput").value = "";
          document.getElementById("checkpoint-boolinput").checked = false;
        }
      }
      else {
        if(this._prop_bindings.has(dom_id) && dom_id.indexOf("-textinput") >= 0) {
          let prop = this._prop_bindings.get(dom_id);
          let value = document.getElementById(dom_id).value;
          let op = new setStringPropertyValue_Operator(prop, value);
          this._pgpedit_app.executeOperator(op);
        }
      }
    }
    else if(evt.type == "keydown") {
      // Only handle key event if popup dialog is hidden
      if(document.getElementById("popup-container").style.display != "block") {
        if(evt.ctrlKey && evt.key == "z") {
          this._pgpedit_app.undo();
        }
        else if(evt.ctrlKey && (evt.key == "Z" || evt.key == "y")) {
          this._pgpedit_app.redo();
        }
        else if(evt.key == "Shift" && this._mode == "TILES") {
          this._tilemap_canvas.style.cursor = "pointer";
          this._tilemap_canvas_dirty = true;
          this._tilebrush_cursor_visible = false;
        }
      }
    }
    else if(evt.type == "keyup") {
      if(evt.key == "Shift" && this._mode == "TILES") {
        this._tilemap_canvas.style.cursor = "default";
      }
    }
    else if(evt.type == "click") {
      if(evt.target.id == "savetrack-button") {
        if(this._pgpedit_app.trackname.value.length > 0) {
          let op = new ExportAsZip_Operator();
          this._pgpedit_app.executeOperator(op);
        }
        else {
          alert("Track name is empty");
        }
      }
      else if(evt.target.id == "physparms-button") {
        let tile_id_arr = ["track", "terrain", "edge"];
        let idx = tile_id_arr.length;
        while(idx--) {
          tile_id = tile_id_arr[idx];
          this._physicsParametersUpdated(tile_id);
        }

        // Show popup dialog
        document.getElementById("popup-container").style.display = "block";
      }
      else if(evt.target.id == "physparms_ok-button") {
        // Hide popup dialog
        document.getElementById("popup-container").style.display = null;

        let physparms = {};
        let tile_id_arr = ["track", "terrain", "edge"];
        let idx = tile_id_arr.length;
        while(idx--) {
          tile_id = tile_id_arr[idx];
          let fs = document.getElementById(tile_id+"_fs-textinput").value;
          let fk = document.getElementById(tile_id+"_fk-textinput").value;
          let tract = document.getElementById(tile_id+"_tract-textinput").value;
          let rr = document.getElementById(tile_id+"_rr-textinput").value;
          physparms[tile_id] = [fs, fk, tract, rr];
        }

        // Update physics parameters if any of the values has changed
        idx = tile_id_arr.length;
        while(idx--) {
          tile_id = tile_id_arr[idx];
          let fs = this._pgpedit_app.physics_parameters[tile_id].static_friction;
          let fk = this._pgpedit_app.physics_parameters[tile_id].kinetic_friction;
          let tract = this._pgpedit_app.physics_parameters[tile_id].traction_constant;
          let rr = this._pgpedit_app.physics_parameters[tile_id].rolling_resistance;
          if(physparms[tile_id][0] != fs || physparms[tile_id][1] != fk || physparms[tile_id][2] != tract || physparms[tile_id][3] != rr) {
            let op = new SetPysicsParameters_Operator(physparms, "");
            this._pgpedit_app.executeOperator(op);
            break;
          }
        }
      }
      else if(evt.target.id == "track_physparms_reset-button") {
        this._pgpedit_app.resetDefaultPhysicsParameters("track");
        this._physicsParametersUpdated("track");
      }
      else if(evt.target.id == "terrain_physparms_reset-button") {
        this._pgpedit_app.resetDefaultPhysicsParameters("terrain");
        this._physicsParametersUpdated("terrain");
      }
      else if(evt.target.id == "edge_physparms_reset-button") {
        this._pgpedit_app.resetDefaultPhysicsParameters("edge");
        this._physicsParametersUpdated("edge");
      }
    }

    if(this._tilemap_canvas_dirty) {
      this._drawTilemap(evt);
      this._tilemap_canvas_dirty = false;
    }
  },

  _drawBillboardsPanel: function() {
//    console.log("PgpEditUI._drawBillboardsPanel()");

    let bb_idx = this._pgpedit_app.billboards.getActiveModelIndex();
    let billboard_tex_name = this._pgpedit_app.billboards.getBillboardModel(bb_idx).texture;

    let tex = null;
    for(let idx = 0; idx < this._pgpedit_app.textures.length; idx++) {
//      console.log([this._pgpedit_app.textures[idx].name, billboard_tex_name]);
      if(this._pgpedit_app.textures[idx].name == billboard_tex_name) {
        tex = this._pgpedit_app.textures[idx];
      }
    }

    let canvas = document.getElementById("billboard-canvas");
//    let tex = this._pgpedit_app.textures[6+idx];
    if(tex != null) {
      canvas.width = tex.width;
      canvas.height = tex.height;
      let rgb_data = tex.getRGBData(0, 0, tex.width, tex.height);
      let ctx = canvas.getContext("2d");
      let billboard_img = ctx.createImageData(tex.width, tex.height);
      for(let idx = 0; idx < tex.width*tex.height; idx++) {
        billboard_img.data[4*idx+0] = rgb_data[3*idx+0];
        billboard_img.data[4*idx+1] = rgb_data[3*idx+1];
        billboard_img.data[4*idx+2] = rgb_data[3*idx+2];
        billboard_img.data[4*idx+3] = 255;
      }
      ctx.putImageData(billboard_img, 0, 0);
    }
    else {
      canvas.width = 32;
      canvas.height = 32;
    }

    document.getElementById("billboard-droplist").selectedIndex = bb_idx;
    let bboard_model = this._pgpedit_app.billboards.getBillboardModel(bb_idx);
    document.getElementById("billboard-color").style.backgroundColor = bboard_model.color;
  },

  bindProperty: function(property, dom_id) {
    this._prop_bindings.set(dom_id, property);
    property.addObserver(this);

    if(dom_id.indexOf("-textinput") >= 0) {
      let element = document.getElementById(dom_id);
      element.maxLength = property.maxlen;
      element.addEventListener("change", this);
    }
  },

  onPropertyUpdated: function(property) {
    // Find dom_id that is connected to this property
    let dom_id = null;
    for(let [key, value] of this._prop_bindings) {
      if(value == property) {
        dom_id = key;
        break;
      }
    }

    if(dom_id.indexOf("-textinput") >= 0) {
      document.getElementById(dom_id).value = property.value;
    }
  },

  onTilemapUpdated: function(tilemap, x, y, width, height) {
//    console.log("PgpEdit_View.onTilemapUpdated()");

    this._tilemap_updated_rects.push({x: x, y: y, w: width, h: height});
    this._tilemap_canvas_dirty = true;
  },

  onBillboardsUpdated: function() {
//    console.log("PgpEdit_View.onBillboardsUpdated()");

    let num_billboards = this._pgpedit_app.billboards.numBillboardObjects();
    let str = "Billboards: "+num_billboards+"/"+this._BBRD_MAX_NUM;
    document.getElementById("numbillboards-label").innerHTML = str;

    this._tilemap_canvas_dirty = true;
  },

  onWaypointsUpdated: function() {
//    console.log("PgpEdit_View.onWaypointsUpdated()");

    let num_waypoints = this._pgpedit_app.waypoints.numWaypoints();
    let str = "Waypoints: "+num_waypoints+"/"+this._WP_MAX_NUM;
    document.getElementById("numwaypoints-label").innerHTML = str;

    this._tilemap_canvas_dirty = true;

    if(this._pgpedit_app.waypoints.numWaypoints() > 0) {
      let wp = this._pgpedit_app.waypoints.getActiveWaypoint();
      if(wp != null) {
        document.getElementById("radius-textinput").value = wp.radius;
        document.getElementById("speed-textinput").value = wp.speed;
        document.getElementById("checkpoint-boolinput").checked = wp.checkpoint;
      }
    }
  },

//  onPhysicsParametersUpdated: function() {
//    console.log("PgpEdit_View.onPhysicsParametersUpdated()");
//
//    let tile_id_arr = ["track", "terrain", "edge"];
//    let idx = tile_id_arr.length;
//    while(idx--) {
//      tile_id = tile_id_arr[idx];
//      let fs = this._pgpedit_app.physics_parameters[tile_id].static_friction;
//      let fk = this._pgpedit_app.physics_parameters[tile_id].kinetic_friction;
//      let tract = this._pgpedit_app.physics_parameters[tile_id].traction_constant;
//      let rr = this._pgpedit_app.physics_parameters[tile_id].rolling_resistance;
//      document.getElementById(tile_id+"_fs-textinput").value = fs;
//      document.getElementById(tile_id+"_fk-textinput").value = fk;
//      document.getElementById(tile_id+"_tract-textinput").value = tract;
//      document.getElementById(tile_id+"_rr-textinput").value = rr;
//    }
//  },

  updateTileset: function() {
//    console.log("PgpEdit.updateTileset()");

    let tile_w = this._pgpedit_app.tileset.getTileWidth();
    let tile_h = this._pgpedit_app.tileset.getTileHeight();
    let num_tiles = this._pgpedit_app.tileset.numTiles();

    this._tile_images.length = num_tiles;

    if(this._temp_canvas.width < Math.max(tile_w, this._TILE_SIZE)) {
      this._temp_canvas.width = Math.max(tile_w, this._TILE_SIZE);
    }
    if(this._temp_canvas.height < Math.max(tile_h, this._TILE_SIZE)) {
      this._temp_canvas.height = Math.max(tile_h, this._TILE_SIZE);
    }
    let temp_ctx = this._temp_canvas.getContext("2d");
    let tile_img = temp_ctx.getImageData(0, 0, tile_w, tile_h);

    for(let tile_idx = 0; tile_idx < num_tiles; tile_idx++) {
      let rgb_data = this._pgpedit_app.tileset.getTileRGBData(tile_idx);
      for(let idx = 0; idx < tile_w*tile_h; idx++) {
        tile_img.data[4*idx] = rgb_data[3*idx];
        tile_img.data[4*idx+1] = rgb_data[3*idx+1];
        tile_img.data[4*idx+2] = rgb_data[3*idx+2];
        tile_img.data[4*idx+3] = 255;
      }
      // Scale image to tile size 
      temp_ctx.putImageData(tile_img, 0, 0);
      temp_ctx.drawImage(this._temp_canvas, 0, 0, tile_w, tile_h, 
        0, 0, this._TILE_SIZE, this._TILE_SIZE);
      // Save scaled tile image to an array
      this._tile_images[tile_idx] = 
        temp_ctx.getImageData(0, 0, this._TILE_SIZE, this._TILE_SIZE);
    }
//    console.log(this._tile_images);
  },

  _drawTilemap: function(evt) {
//    console.log("PgpEdit_View._drawTilemap()");

    let ctx = this._tilemap_canvas.getContext("2d");
    ctx.putImageData(this._tilemap_image, 0, 0);
    this._drawUpdatedTiles(this._tilemap_canvas);

    if(this._mode == "TILES") {
      if(this._tilemap_mousedown_flag && this._tilemap_selection_started) {
        let rect = this._selection_rect;
        this._drawBoxSelect(this._tilemap_canvas, rect.x, rect.y, rect.w, rect.h);
      }

      if(this._tilebrush_cursor_visible) {
        let canvas = this._tilemap_canvas;
        let mouse = this._canvasCoordinatesFromMouse(canvas, evt);
        let x = mouse.x+this._TILE_SIZE*0.5*(this._tilebrush.width+1);
        x = this._TILE_SIZE*(((x/this._TILE_SIZE)|0)-this._tilebrush.width);
        let y = mouse.y+this._TILE_SIZE*0.5*(this._tilebrush.height+1);
        y = this._TILE_SIZE*(((y/this._TILE_SIZE)|0)-this._tilebrush.height);
        let brush = this._tilebrush;
        this._drawTileData(brush.width, brush.height, brush.tile_data, canvas, x, y);

        // Highlight cursor with transparent selection rectangle
        ctx.fillStyle = this._SELECTION_COLOR;
        ctx.fillRect(x, y, this._TILE_SIZE*brush.width, this._TILE_SIZE*brush.height);
      }

      this._drawGrid(this._tilemap_canvas, this._TILE_SIZE, this._GRID_COLOR);
    }
    else if(this._mode == "BILLBOARDS") {
//      if(this._billboards_dirty) {
        this._drawBillboards();
//        this._billboards_dirty = false;
//      }
    }
    else if(this._mode == "WAYPOINTS") {
      this._drawWaypoints();
    }
  },

  _drawBoxSelect: function(canvas, x, y, w, h) {
//    console.log("PgpEdit_View._drawBoxSelect()");
//    console.log([x, y, w, h]);

    let coords = this._rectangleToTileCoordinates(x, y, w, h);
    x = this._TILE_SIZE*coords.x1;
    y = this._TILE_SIZE*coords.y1;
    w = this._TILE_SIZE*(1+coords.x2-coords.x1);
    h = this._TILE_SIZE*(1+coords.y2-coords.y1);

    let ctx = canvas.getContext("2d");
    ctx.fillStyle = this._SELECTION_COLOR;
    ctx.fillRect(x, y, w, h);
  },

  _drawUpdatedTiles: function(canvas) {
//    console.log("PgpEdit_View._drawUpdatedTiles()");

    let start_ms = Date.now();

    let ctx = canvas.getContext("2d");
    let tilemap = this._pgpedit_app.track_tiles;
    for(let rect_idx = 0; rect_idx < this._tilemap_updated_rects.length; rect_idx++) {
      let rect = this._tilemap_updated_rects[rect_idx];
      let tile_data = tilemap.getTileData(rect.x, rect.y, rect.w, rect.h);

      for(let data_idx = 0; data_idx < rect.w*rect.h; data_idx++) {
        let tile_idx = tile_data[data_idx];
        if(tile_idx >= 0 && tile_idx < this._tile_images.length) {
          let tile_img = this._tile_images[tile_idx];
          let dx = this._TILE_SIZE*(rect.x+data_idx%rect.w);
          let dy = this._TILE_SIZE*((rect.y+data_idx/rect.w)|0);
          ctx.putImageData(tile_img, dx, dy);
        }
      }
      let w = this._tilemap_image.width;
      let h = this._tilemap_image.height;
      this._tilemap_image = ctx.getImageData(0, 0, w, h);
    }
    this._tilemap_updated_rects.length = 0;

    let time_ms = Date.now()-start_ms;
//    console.log("Time: "+time_ms);
  },

  _drawTileset: function() {
    let num_tiles = this._pgpedit_app.tileset.numTiles();

    this._tile_images.length = num_tiles;

    let rowlen = this._TILESET_ROWLEN;
    this._tileset_canvas.width = this._TILE_SIZE*Math.min(num_tiles, rowlen);
    this._tileset_canvas.height = this._TILE_SIZE*(((num_tiles+rowlen-1)/rowlen)|0);
//    console.log([this._tileset_canvas.width, this._tileset_canvas.height]);
    let ctx = this._tileset_canvas.getContext("2d");

    for(let tile_idx = 0; tile_idx < num_tiles; tile_idx++) {
      let tile_image = this._tile_images[tile_idx];
      let x = this._TILE_SIZE*(tile_idx%rowlen);
      let y = this._TILE_SIZE*((tile_idx/rowlen)|0);
      ctx.putImageData(tile_image, x, y);
    }
  },

  _drawTilebrushView: function() {
    let brush_w = this._tilebrush.width;
    let brush_h = this._tilebrush.height;

    let img_w = this._TILE_SIZE*brush_w;
    let img_h = this._TILE_SIZE*brush_h;

    this._tilebrush_canvas.width = img_w;
    this._tilebrush_canvas.height = img_h;

    let data = this._tilebrush.tile_data;
    this._drawTileData(brush_w, brush_h, data, this._tilebrush_canvas, 0, 0);

    if(img_w > 96 || img_h > 96) {
      let scale = Math.min(96/img_w, 96/img_h);
      img_w *= scale;
      img_h *= scale;
    }
    let ctx = this._tilebrush_canvas.getContext("2d");
    ctx.drawImage(this._tilebrush_canvas, 0, 0, img_w, img_h);
    let image = ctx.getImageData(0, 0, img_w, img_h);
    this._tilebrush_canvas.width = img_w;
    this._tilebrush_canvas.height = img_h;
    ctx.putImageData(image, 0, 0);
  },

  _drawTileData: function(w, h, tile_data, canvas, dx, dy) {
    let ctx = canvas.getContext("2d");
    for(let idx = 0; idx < w*h; idx++) {
      let x = this._TILE_SIZE*(idx%w);
      let y = this._TILE_SIZE*((idx/w)|0);
      tile_idx = tile_data[idx];
      if(tile_idx >= 0 && tile_idx < this._tile_images.length) {
        ctx.putImageData(this._tile_images[tile_idx], dx+x, dy+y);
      }
      else {
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(dx+x, dy+y, this._TILE_SIZE, this._TILE_SIZE);
      }
    }
  },

  _drawGrid: function(canvas, grid_size, color) {
    let ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let y = grid_size; y < canvas.height; y += grid_size) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    for(let x = grid_size; x < canvas.width; x += grid_size) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    ctx.stroke();
  },

  _handleTilesetCanvasEvent: function(evt) {
    let canvas = this._tileset_canvas;

    if(evt.type == "mousedown") {
      if(evt.button == 0) {
        this._tileset_mousedown_flag = true;

        let mouse = this._canvasCoordinatesFromMouse(canvas, evt);
        this._selection_rect.x = mouse.x;
        this._selection_rect.y = mouse.y;
        this._selection_rect.w = 0;
        this._selection_rect.h = 0;

        let rect = this._selection_rect;
        let coords = this._rectangleToTileCoordinates(rect.x, rect.y, rect.w, rect.h);
        let x = this._TILE_SIZE*coords.x1;
        let y = this._TILE_SIZE*coords.y1;
        let w = this._TILE_SIZE*(1+coords.x2-coords.x1);
        let h = this._TILE_SIZE*(1+coords.y2-coords.y1);

        this._drawTileset();

        let ctx = canvas.getContext("2d");
        ctx.fillStyle = this._SELECTION_COLOR;
        ctx.fillRect(x, y, w, h);

        this._drawGrid(canvas, this._TILE_SIZE, this._GRID_COLOR);
      }
    }
    else if(evt.type == "mousemove") {
      if(this._tileset_mousedown_flag) {
        let mouse = this._canvasCoordinatesFromMouse(canvas, evt);
        this._selection_rect.w = mouse.x-this._selection_rect.x;
        this._selection_rect.h = mouse.y-this._selection_rect.y;

        let rect = this._selection_rect;
        let coords = this._rectangleToTileCoordinates(rect.x, rect.y, rect.w, rect.h);
        let x = this._TILE_SIZE*coords.x1;
        let y = this._TILE_SIZE*coords.y1;
        let w = this._TILE_SIZE*(1+coords.x2-coords.x1);
        let h = this._TILE_SIZE*(1+coords.y2-coords.y1);

        this._drawTileset();

        let ctx = canvas.getContext("2d");
        ctx.fillStyle = this._SELECTION_COLOR;
        ctx.fillRect(x, y, w, h);

        this._drawGrid(canvas, this._TILE_SIZE, this._GRID_COLOR);
      }
    }
    else if(evt.type == "mouseup") {
      if( evt.button == 0 && this._tileset_mousedown_flag) {
        this._tileset_mousedown_flag = false;

        let rect = this._selection_rect;
        let coords = this._rectangleToTileCoordinates(rect.x, rect.y, rect.w, rect.h);
        let data_w = 1+coords.x2-coords.x1;
        let data_h = 1+coords.y2-coords.y1;
        this._tilebrush.tile_data.length = data_w*data_h;
        for(let idx = 0; idx < this._tilebrush.tile_data.length; idx++) {
          let tile_idx = ((canvas.width/this._TILE_SIZE)|0)*(coords.y1+((idx/data_w)|0));
          tile_idx += coords.x1+idx%data_w;
          this._tilebrush.tile_data[idx] = tile_idx
        }
        this._tilebrush.width = data_w;
        this._tilebrush.height = data_h;
        this._drawTilebrushView();

        this._drawTileset();
        this._drawGrid(canvas, this._TILE_SIZE, this._GRID_COLOR);
      }
    }
  },

  _handleTilemapCanvasEvent: function(evt) {
    if(evt.type == "mousedown") {
      if(evt.button == 0) {
        this._tilemap_mousedown_flag = true;
      }
    }
    else if(evt.type == "mouseup") {
      if(evt.button == 0 && this._tilemap_mousedown_flag) {
        this._tilemap_mousedown_flag = false;
      }
    }

    if(this._mode == "TILES") {
      this._tileModeEventHandler(evt);
    }
    else if(this._mode == "BILLBOARDS") {
      this._billboardModeEventHandler(evt);
    }
    if(this._mode == "WAYPOINTS") {
      this._waypointModeEventHandler(evt);
    }
  },

  _tileModeEventHandler: function(evt) {
    if(evt.type == "mousedown") {
      this._onTileModeMousedown(evt);
    }
    else if(evt.type == "mousemove") {
      this._onTileModeMousemove(evt);
    }
    else if(evt.type == "mouseup") {
      this._onTileModeMouseup(evt);
    }
    else if(evt.type == "mouseout") {
      this._tilemap_canvas_dirty = true;
      if(!this._tilemap_selection_started) {
        this._tilebrush_cursor_visible = false;
      }
    }
  },

  _onTileModeMousedown: function(evt) {
    if(evt.button == 0) {
      if(evt.shiftKey) {
        this._tilemap_selection_started = true;

        let mouse = this._canvasCoordinatesFromMouse(this._tilemap_canvas, evt);
        this._selection_rect.x = mouse.x;
        this._selection_rect.y = mouse.y;
        this._selection_rect.w = 0;
        this._selection_rect.h = 0;

        this._tilemap_canvas_dirty = true;
        this._tilebrush_cursor_visible = false;
      }
      else {
        let mouse = this._canvasCoordinatesFromMouse(this._tilemap_canvas, evt);
        let x = mouse.x+this._TILE_SIZE*0.5*(this._tilebrush.width+1);
        x = ((x/this._TILE_SIZE)|0)-this._tilebrush.width;
        let y = mouse.y+this._TILE_SIZE*0.5*(this._tilebrush.height+1);
        y = ((y/this._TILE_SIZE)|0)-this._tilebrush.height;

        let w = this._tilebrush.width;
        let h = this._tilebrush.height;
        let brush_data = this._tilebrush.tile_data;
        let track_data = this._pgpedit_app.track_tiles.getTileData(x, y, w, h);
        for(let idx = 0; idx < w*h; idx++) {
          if(brush_data[idx] != track_data[idx]) {
            // Only draw brush when it actually differs from track tiles beneath
            let op = new putTileData_Operator(brush_data, x, y, w, h, "TILES");
            this._pgpedit_app.executeOperator(op);
            break;
          }
        }
      }
    }
  },

  _onTileModeMousemove: function(evt) {
    if(evt.buttons&1) {
      if(this._tilemap_selection_started) {
        let mouse = this._canvasCoordinatesFromMouse(this._tilemap_canvas, evt);
        this._selection_rect.w = mouse.x-this._selection_rect.x;
        this._selection_rect.h = mouse.y-this._selection_rect.y;

        this._tilemap_canvas_dirty = true;
        this._tilebrush_cursor_visible = false;
      }
      else if(this._tilemap_mousedown_flag) {
        let mouse = this._canvasCoordinatesFromMouse(this._tilemap_canvas, evt);
        let x = mouse.x+this._TILE_SIZE*0.5*(this._tilebrush.width+1);
        x = ((x/this._TILE_SIZE)|0)-this._tilebrush.width;
        let y = mouse.y+this._TILE_SIZE*0.5*(this._tilebrush.height+1);
        y = ((y/this._TILE_SIZE)|0)-this._tilebrush.height;

        let w = this._tilebrush.width;
        let h = this._tilebrush.height;
        let brush_data = this._tilebrush.tile_data;
        let track_data = this._pgpedit_app.track_tiles.getTileData(x, y, w, h);
        for(let idx = 0; idx < w*h; idx++) {
          let dy = (idx/w)|0;
          let dx = idx%w;
          if(x+dx >= 0 && x+dx < this._pgpedit_app.track_tiles.width && y+dy >= 0 && y+dy < this._pgpedit_app.track_tiles.height ) {
            if(brush_data[idx] != track_data[idx]) {
              // Only draw brush when it actually differs from track tiles
              let op = new putTileData_Operator(brush_data, x, y, w, h, "TILES");
              this._pgpedit_app.executeOperator(op);
              break;
            }
          }
        }
      }
    }
    else {
      this._tilemap_canvas_dirty = true;
      if(evt.shiftKey) {
        this._tilebrush_cursor_visible = false;
      }
      else {
        this._tilebrush_cursor_visible = true;
      }
    }
  },

  _onTileModeMouseup: function(evt) {
    let canvas = this._tilemap_canvas;

    if(evt.button == 0 && this._tilemap_selection_started) {
      this._tilemap_selection_started = false;

      let rect = this._selection_rect;
      let coords = this._rectangleToTileCoordinates(rect.x, rect.y, rect.w, rect.h);
      let data_w = 1+coords.x2-coords.x1;
      let data_h = 1+coords.y2-coords.y1;
      this._tilebrush.tile_data = this._pgpedit_app.track_tiles.getTileData(coords.x1, coords.y1, data_w, data_h);
      this._tilebrush.width = data_w;
      this._tilebrush.height = data_h;
      this._drawTilebrushView();

      this._tilemap_canvas_dirty = true;
      this._tilebrush_cursor_visible = true;
    }
  },

  _billboardModeEventHandler: function(evt) {
    if(evt.type == "mousedown") {
      this._onBillboardModeMousedown(evt);
    }
    else if(evt.type == "mousemove") {
      this._onBillboardModeMousemove(evt);
    }
    else if(evt.type == "mouseup") {
      this._onBillboardModeMouseup(evt);
    }
  },

  _onBillboardModeMousedown: function(evt) {
    if(evt.button != 0) {
      return;
    }

    let billboards = this._pgpedit_app.billboards;
    let mouse = this._canvasCoordinatesFromMouse(this._tilemap_canvas, evt);
    let canvas_h = this._tilemap_canvas.height;

    if(document.getElementById("add_billboard-tool").checked) {
      // Add billboard
      if(billboards.numBillboardObjects() < this._BBRD_MAX_NUM) {
        let model_index = billboards.getActiveModelIndex();
        let op = new AddBillboard_Operator(mouse.x*2, (canvas_h-mouse.y)*2, model_index, "BILLBOARDS");
        this._pgpedit_app.executeOperator(op);

//        this._billboard_grabbed = true;
//        this._billboard_grabx = 0;
//        this._billboard_graby = 0;
      }
      else {
        alert("Maximum number of billboards: "+this._BBRD_MAX_NUM);
      }
    }
    else {
      // Select billboard
      if(billboards.numBillboardObjects() > 0) {
        for(let idx = billboards.numBillboardObjects()-1; idx >= 0; idx--) {
          let billboard = billboards.getBillboardObject(idx);
          let offs_x = mouse.x-(billboard.x/2);
          let offs_y = mouse.y-(canvas_h-billboard.y/2);
          let dist = Math.max(Math.abs(offs_x), Math.abs(offs_y));
//          console.log("dist: "+dist);
          if(dist <= this._BBRD_RECT_SIZE/2) {
            if(document.getElementById("del_billboard-tool").checked) {
              // Delete billboard
              let op = new DelBillboard_Operator(idx, "BILLBOARDS");
              this._pgpedit_app.executeOperator(op);
            }
            else {
              // Grab billboard
              this._pgpedit_app.billboards.setActiveBillboardObject(billboard);
              this._billboard_grabbed = true;
              this._billboard_grab_x = 2*mouse.x;
              this._billboard_grab_y = 2*(canvas_h-mouse.y);
            }
            break;
          }
        }
      }
    }
  },

  _onBillboardModeMousemove: function(evt) {
//    console.log("PgpEdit_View._onBillboardModeMousemove()");
    if(evt.buttons&1 && this._billboard_grabbed) {
      let canvas_h = this._tilemap_canvas.height;
      let mouse = this._canvasCoordinatesFromMouse(this._tilemap_canvas, evt);

      let dist_x = 2*mouse.x-this._billboard_grab_x;
      let dist_y = 2*(canvas_h-mouse.y)-this._billboard_grab_y;
      if(this._billboard_move_op == null) {
        this._billboard_move_op = new MoveBillboard_Operator(dist_x, dist_y, "BILLBOARDS");
        this._pgpedit_app.executeOperator(this._billboard_move_op);
      }
      else {
        this._pgpedit_app.undo();
        this._billboard_move_op.dist_x = dist_x;
        this._billboard_move_op.dist_y = dist_y;
        this._pgpedit_app.redo();
      }
    }
  },

  _onBillboardModeMouseup: function(evt) {
    if(evt.button == 0 && this._billboard_grabbed) {
      this._billboard_grabbed = false;
      this._billboard_move_op = null;
    }
  },

  _waypointModeEventHandler: function(evt) {
    if(evt.type == "mousedown") {
      this._onWaypointModeMousedown(evt);
    }
    else if(evt.type == "mousemove") {
      this._onWaypointModeMousemove(evt);
    }
    else if(evt.type == "mouseup") {
      this._onWaypointModeMouseup(evt);
    }
  },

  _onWaypointModeMousedown: function(evt) {
    if(evt.button != 0) {
      return;
    }

    let waypoints = this._pgpedit_app.waypoints;
    let mouse = this._canvasCoordinatesFromMouse(this._tilemap_canvas, evt);
    let canvas_h = this._tilemap_canvas.height;

    if(document.getElementById("add_waypoint-tool").checked) {
      // Add waypoint
      if(waypoints.numWaypoints() < this._WP_MAX_NUM) {
        let op = new AddWaypoint_Operator(mouse.x*2, (canvas_h-mouse.y)*2, 128, 100, true, "WAYPOINTS");
        this._pgpedit_app.executeOperator(op);
      }
      else {
        alert("Maximum number of waypoints: "+this._WP_MAX_NUM);
      }
    }
    else {
      if(waypoints.numWaypoints() > 0) {
        // Select waypoint
        for(let idx = waypoints.numWaypoints()-1; idx >= 0; idx--) {
          let waypoint = waypoints.getWaypoint(idx);
          let offs_x = mouse.x-(waypoint.x/2);
          let offs_y = mouse.y-(canvas_h-waypoint.y/2);
          let dist_sq = offs_x*offs_x+offs_y*offs_y;
//          console.log("dist: "+Math.sqrt(dist_sq));
          if(dist_sq <= waypoint.radius*waypoint.radius/4) {
            if(document.getElementById("del_waypoint-tool").checked) {
              // Delete waypoint
              let op = new DelWaypoint_Operator(idx, "WAYPOINTS");
              this._pgpedit_app.executeOperator(op);
            }
            else {
              // Grab waypoint
              this._pgpedit_app.waypoints.setActiveWaypoint(waypoint);
              this._waypoint_grabbed = true;
              this._waypoint_grab_x = 2*mouse.x;
              this._waypoint_grab_y = 2*(canvas_h-mouse.y);
            }
            break;
          }
        }
      }
    }
  },

  _onWaypointModeMousemove: function(evt) {
//    console.log("PgpEdit_View._onWaypointModeMousemove()");

    if(evt.buttons&1 && this._waypoint_grabbed) {
      let canvas_h = this._tilemap_canvas.height;
      let mouse = this._canvasCoordinatesFromMouse(this._tilemap_canvas, evt);

      let dist_x = 2*mouse.x-this._waypoint_grab_x;
      let dist_y = 2*(canvas_h-mouse.y)-this._waypoint_grab_y;
      if(this._waypoint_move_op == null) {
        this._waypoint_move_op = new MoveWaypoint_Operator(dist_x, dist_y, "WAYPOINTS");
        this._pgpedit_app.executeOperator(this._waypoint_move_op);
      }
      else {
        this._pgpedit_app.undo();
        this._waypoint_move_op.dist_x = dist_x;
        this._waypoint_move_op.dist_y = dist_y;
        this._pgpedit_app.redo();
      }

//      this._tilemap_canvas_dirty = true;
    }
  },

  _onWaypointModeMouseup: function(evt) {
    if(evt.button == 0 && this._waypoint_grabbed) {
      this._waypoint_grabbed = false;
      this._waypoint_move_op = null;
    }
  },

  _onSelectMode: function(evt) {
//    console.log("onSelectMode()");

    let tabcontents = document.getElementsByClassName("tabcontent");
    for(let i = 0; i < tabcontents.length; i++) {
      tabcontents[i].style.display = "none";
    }
    let tabcontent_id = document.getElementById(evt.target.id).value;
    document.getElementById(tabcontent_id).style.display = "block";

    let canvas = this._tilemap_canvas;
    let ctx = canvas.getContext("2d");
    ctx.putImageData(this._tilemap_image, 0, 0);

    if(tabcontent_id == "billboards-tab") {
      this._mode = "BILLBOARDS";
      if(this._pgpedit_app.billboards.numBillboardObjects() > 0) {
        this._drawBillboards();
      }
      this._drawBillboardsPanel();
    }
    else if(tabcontent_id == "waypoints-tab") {
      this._mode = "WAYPOINTS";
      if(this._pgpedit_app.waypoints.numWaypoints() > 0) {
        this._drawWaypoints();

        let waypoint = this._pgpedit_app.waypoints.getActiveWaypoint();
//        console.assert(waypoint != null, "Assertion failed");
        document.getElementById("radius-textinput").value = waypoint.radius;
        document.getElementById("speed-textinput").value = waypoint.speed;
        document.getElementById("checkpoint-boolinput").checked = waypoint.checkpoint;
      }
      else {
        document.getElementById("radius-textinput").value = "";
        document.getElementById("speed-textinput").value = "";
        document.getElementById("checkpoint-boolinput").checked = false;
      }
    }
    else {
      this._mode = "TILES";
      this._drawGrid(canvas, this._TILE_SIZE, this._GRID_COLOR);
    }

  },

  _drawBillboards: function() {
    let billboards = this._pgpedit_app.billboards;
    if(billboards.numBillboardObjects() <= 0 ) {
      return;
    }

    let canvas_h = this._tilemap_canvas.height;
    let ctx = this._tilemap_canvas.getContext("2d");

    for(let idx = 0; idx < billboards.numBillboardObjects(); idx++) {
      let billboard = billboards.getBillboardObject(idx);
      let x = billboard.x/2;
      let y = canvas_h-billboard.y/2;

      ctx.lineWidth = 2;
      ctx.strokeStyle = billboards.getBillboardModel(billboard.model_index).color;
      ctx.strokeRect(x-this._BBRD_RECT_SIZE/2, y-this._BBRD_RECT_SIZE/2, 
        this._BBRD_RECT_SIZE, this._BBRD_RECT_SIZE);

      if(billboard == billboards.getActiveBillboardObject()) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(x-this._BBRD_RECT_SIZE/2-3, y-this._BBRD_RECT_SIZE/2-3, 
          this._BBRD_RECT_SIZE+6, this._BBRD_RECT_SIZE+6);
        ctx.setLineDash([]);
      }
    }
  },

  _drawWaypoints: function() {
    waypoints = this._pgpedit_app.waypoints;
    if(waypoints.numWaypoints() <= 0 ) {
      return;
    }

    let canvas_h = this._tilemap_canvas.height;
    let ctx = this._tilemap_canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.strokeStyle = this._WP_LINE_COLOR;

    let waypoint = waypoints.getWaypoint(0);
    let prevx = waypoint.x;
    let prevy = waypoint.y;
    for(let idx = 1; idx < waypoints.numWaypoints(); idx++) {
      waypoint = waypoints.getWaypoint(idx);
      ctx.setLineDash([(waypoint.speed/5)|0, ((100-waypoint.speed)/5)|0]);
      ctx.beginPath();
      ctx.moveTo(prevx/2, canvas_h-prevy/2);
      ctx.lineTo(waypoint.x/2, canvas_h-waypoint.y/2);
      ctx.stroke();
      ctx.setLineDash([]);
      prevx = waypoint.x;
      prevy = waypoint.y;
    }

    for(let idx = 0; idx < waypoints.numWaypoints(); idx++) {
      waypoint = waypoints.getWaypoint(idx);
      let x = waypoint.x/2;
      let y = canvas_h-waypoint.y/2;
      let radius = waypoint.radius/2;

      ctx.lineWidth = 2;
      ctx.strokeStyle = this._WP_RIM_COLOR;
      if(!waypoint.checkpoint) {
        ctx.setLineDash([20, 10]);
      }
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2*Math.PI, false);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.lineWidth = 2;
      ctx.strokeStyle = this._WP_TARGET_COLOR;
      ctx.strokeRect(x-this._WP_TARGET_RECT_SIZE/2, y-this._WP_TARGET_RECT_SIZE/2, 
        this._WP_TARGET_RECT_SIZE, this._WP_TARGET_RECT_SIZE);

      if(waypoint == waypoints.getActiveWaypoint()) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(x-radius-1, y-radius-1, radius*2+2, radius*2+2);
        ctx.setLineDash([]);
      }
    }
  },

  _onLoadTextures: function(evt) {
    let fileinput = document.getElementById(evt.target.id);
    let file = fileinput.files[0];
    if (file.type.match("image/*")) {
      let img = new Image();
      img.onload = function(evt) {
        let canvas = this._temp_canvas;
        if(canvas.width < img.width) {
          canvas.width = img.width;
        }
        if(canvas.height < img.height) {
          canvas.height = img.height;
        }
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        let ctximg = ctx.getImageData(0, 0, img.width, img.height);

        let rgb_data = [];
        rgb_data.length = 3*img.width*img.height;
        for(let idx = 0; idx < img.width*img.height; idx++) {
          let x = idx%img.width;
          let y = (idx/img.width)|0;
          let src_idx = 4*(img.width*y+x);
          let dest_idx = 3*(img.width*y+x);
          rgb_data[dest_idx] = ctximg.data[src_idx];
          rgb_data[dest_idx+1] = ctximg.data[src_idx+1];
          rgb_data[dest_idx+2] = ctximg.data[src_idx+2];
        }

        let op = new loadTextures_Operator(rgb_data, img.width, img.height);
        this._pgpedit_app.executeOperator(op);

        this.updateTileset();
        this._drawTileset();
        this._drawGrid(this._tileset_canvas, this._TILE_SIZE, this._GRID_COLOR);
        this._drawTilebrushView();

//        let w = this._tilebrush.width;
//        let h = this._tilebrush.height;
//        this.onTilemapUpdated(this._tilebrush, 0, 0, w, h);

        w = this._pgpedit_app.track_tiles.width;
        h = this._pgpedit_app.track_tiles.height;
        this.onTilemapUpdated(this._pgpedit_app.track_tiles, 0, 0, w, h);
        this._drawTilemap(evt);
      }.bind(this);
      img.src = window.URL.createObjectURL(file);
    }
    else {
      alert("Invalid file type. Please choose an image file.");
    }
    fileinput.value = "";
  },

  _onLoadTrack: function(evt) {
    let fileinput = document.getElementById(evt.target.id);
    let file = fileinput.files[0];
    if(file.type.match("text/*")) {
      let reader = new FileReader();
//      reader.addEventListener("load", this);
      reader.onload = function(evt) {
        let op = new ImportTrack_Operator(reader.result, "TILES");
        this._pgpedit_app.executeOperator(op);
        op = new ImportPhysicsParameters_Operator(reader.result, "");
        this._pgpedit_app.executeOperator(op);
        op = new ImportBillboards_Operator(reader.result, "BILLBOARDS");
        this._pgpedit_app.executeOperator(op);
        op = new ImportWaypoints_Operator(reader.result, "WAYPOINTS");
        this._pgpedit_app.executeOperator(op);

        this._drawTilemap(evt);
      }.bind(this);
      reader.readAsText(file);
    }
    else {
      alert("Invalid file type. Please choose a text file.");
    }
    fileinput.value = "";
  },

  _canvasCoordinatesFromMouse(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    let mouse_x = evt.clientX-((rect.left+0.5)|0)-canvas.clientLeft;
    let mouse_y = evt.clientY-((rect.top+0.5)|0)-canvas.clientTop;

    if(mouse_x < 0) {
      mouse_x = 0;
    }
    else if(mouse_x >= canvas.width) {
      mouse_x = canvas.width-1;
    }
    if(mouse_y < 0) {
      mouse_y = 0;
    }
    else if(mouse_y >= canvas.height) {
      mouse_y = canvas.height-1;
    }

    return { x: mouse_x,
             y: mouse_y };
  },

  _rectangleToTileCoordinates: function(x, y, w, h) {
    let x1 = (w >= 0) ? x : x+w;
    let x2 = (w >= 0) ? x+w : x;
    let y1 = (h >= 0) ? y : y+h;
    let y2 = (h >= 0) ? y+h : y;
    return { x1: (x1/this._TILE_SIZE)|0,
             y1: (y1/this._TILE_SIZE)|0,
             x2: (x2/this._TILE_SIZE)|0,
             y2: (y2/this._TILE_SIZE)|0 };
  },

  _populateBillboardDroplist: function(settings) {
    let droplist = document.getElementById("billboard-droplist");
    while(droplist.length > 0) {
      droplist.remove(0);
    }

    let billboards = settings.billboards;
    for(let idx = 0; idx < billboards.length; idx++) {
      let opt = document.createElement("option");
      opt.innerHTML = billboards[idx].name;
      droplist.appendChild(opt);
    }
  },

  _physicsParametersUpdated: function(tile_id) {
    let fs = this._pgpedit_app.physics_parameters[tile_id].static_friction;
    let fk = this._pgpedit_app.physics_parameters[tile_id].kinetic_friction;
    let tract = this._pgpedit_app.physics_parameters[tile_id].traction_constant;
    let rr = this._pgpedit_app.physics_parameters[tile_id].rolling_resistance;
    document.getElementById(tile_id+"_fs-textinput").value = fs;
    document.getElementById(tile_id+"_fk-textinput").value = fk;
    document.getElementById(tile_id+"_tract-textinput").value = tract;
    document.getElementById(tile_id+"_rr-textinput").value = rr;
  },
};


/* PgpEdit_Application class (command receiver)
*/
function PgpEdit_Application() {
//  console.log("PgpEdit_Application.constructor()");

  this._author = new StringProperty(12);
  this._trackname = new StringProperty(12);
  this._billboards = new Billboards();
  this._textures = [];
  this._tileset = new Tileset(this);
  this._track_tiles = new Tilemap(32, 32);
  this._waypoints = new Waypoints();
  this._tex_img = {width: 0, height: 0, rects: []};
  this._view = new PgpEdit_View(this);
  this._default_phys_parms = {
    track: [1.5, 1.4, 1500, 0.02], 
    terrain: [0.9, 0.9, 500, 0.2], 
    edge: [1.2, 1.1, 1500, 0.05]
  };
  this._phys_parms = {};
  this._redo_stack = [];
  this._undo_stack = [];

  for(tile_id in this._default_phys_parms) {
    let fs = this._default_phys_parms[tile_id][0];
    let fk = this._default_phys_parms[tile_id][1];
    let tract = this._default_phys_parms[tile_id][2];
    let rr = this._default_phys_parms[tile_id][3];
    this._phys_parms[tile_id] = new PhysicsParameters(fs, fk, tract, rr);
  }
}
PgpEdit_Application.prototype = {
  _MAX_UNDOS: 999,

  init: function(settings) {
//    console.log("PgpEdit_Application.init()");

    let billboard_tex_names = [];
    let num_billboards = settings.billboards.length;
    for(let idx = 0; idx < num_billboards; idx++) {
      billboard_tex_names.push(settings.billboards[idx].texture);
    }

    // Initialize textures
    let num_texs = settings.textures.length;
    this.textures.length = num_texs;
    for(let idx = 0; idx < num_texs; idx++) {
      let name = settings.textures[idx].name;
      this.textures[idx] = new Texture(name);
      let width = settings.textures[idx].width;
      let height = settings.textures[idx].height;
      let data = this._b64StringToArray(settings.textures[idx].data);
      // Autocrop billboard textures
      let autocrop = (billboard_tex_names.indexOf(name) >= 0) ? true : false;
      this.textures[idx].fromRGBData(data, width, height, autocrop);
    }

    this._tex_img.width = settings.texture_img_w;
    this._tex_img.height = settings.texture_img_h;
    this._tex_img.rects.length = num_texs;
    for(let idx = 0; idx < num_texs; idx++) {
      this._tex_img.rects[idx] = {
        x: settings.textures[idx].x,
        y: settings.textures[idx].y,
        width: settings.textures[idx].width,
        height: settings.textures[idx].height
      };
    }

    // Initialize tiles
    let ptn_w = settings.tileset.pattern_width;
    let ptn_h = settings.tileset.pattern_height;
    let patterns = settings.tileset.patterns.map(item => this._b64StringToArray(item));
    this.tileset.initTiles(settings.tileset.symbols, ptn_w, ptn_h, patterns);

    // Initialize billboards
    let billboards = settings.billboards;
    for(let idx = 0; idx < billboards.length; idx++) {
      let bboard_model = this.billboards.addBillboardModel();
      bboard_model.name = billboards[idx].name;
      bboard_model.color = billboards[idx].color;
      bboard_model.texture = billboards[idx].texture;
    }
    this.billboards.setActiveModelIndex(0);
//    console.log(this.billboards.numBillboardModels()+" BilboardModels added");

    // Put tiles for starting straight
    let tile_data = [];
    tile_data.length = 3*10;
    for(let idx = 0; idx < 10; idx++) {
      tile_data[3*idx] = 1;
      tile_data[3*idx+1] = 2;
      tile_data[3*idx+2] = 3;
    }
    tile_data[3] = 6;
    tile_data[4] = 7;
    tile_data[5] = 8;
    this._track_tiles.putTileData(tile_data, 0, 14, 3, 10);

    // Set initial track name and author
    this._trackname.value = "mytrack";
    this._author.value = "myname";

    this._view.init(settings);
  },

  get author() {
    return this._author;
  },

  get trackname() {
    return this._trackname;
  },

  get billboards() {
    return this._billboards;
  },

  get textures() {
    return this._textures;
  },

  get tileset() {
    return this._tileset;
  },

  get track_tiles() {
    return this._track_tiles;
  },

  get waypoints() {
    return this._waypoints;
  },

  get texture_image() {
    return this._tex_img;
  },

  get view() {
    return this._view;
  },

  get physics_parameters() {
    return this._phys_parms;
  },

  resetDefaultPhysicsParameters: function(tile_id) {
    let parms = this._default_phys_parms[tile_id];
    this._phys_parms[tile_id].static_friction = parms[0];
    this._phys_parms[tile_id].kinetic_friction = parms[1];
    this._phys_parms[tile_id].traction_constant = parms[2];
    this._phys_parms[tile_id].rolling_resistance = parms[3];
  },

  executeOperator: function(operator) {
    operator.init(this);
    if(operator.execute(this)) {
      this._redo_stack.length = 0;
      if(this._undo_stack.length > this._MAX_UNDOS) {
        this._undo_stack.shift();
      }
      this._undo_stack.push(operator);

//      console.log(this._undo_stack);
    }
  },

  undo: function() {
//    console.log("PgpEdit_Application.undo()");
    for(let idx = this._undo_stack.length-1; idx >= 0; idx--) {
      operator = this._undo_stack[idx];
      if(operator.poll(this)) {
        this._undo_stack.splice(idx, 1);
        this._redo_stack.push(operator);
        operator.revert(this);

//        console.log(this._undo_stack);
        return;
      }
    }
    if(this._undo_stack.length == 0) {
//      console.log("Undo stack is empty");
    }
    else {
//      console.log("No operator to undo");
    }

//    if(this._undo_stack.length > 0) {
//      operator = this._undo_stack.pop();
//      this._redo_stack.push(operator);
//      operator.revert(this);
//    }
//    else {
//      console.log("Stack is empty");
//    }
  },

  redo: function() {
//    console.log("PgpEdit_Application.redo()");
    for(let idx = this._redo_stack.length-1; idx >= 0; idx--) {
      operator = this._redo_stack[idx];
      if(operator.poll(this)) {
        this._redo_stack.splice(idx, 1);
        this._undo_stack.push(operator);
        operator.execute(this);
        return;
      }
    }
    if(this._redo_stack.length == 0) {
//      console.log("Redo stack is empty");
    }
    else {
//      console.log("No operators to redo");
    }

//    if(this._redo_stack.length > 0) {
//      operator = this._redo_stack.pop();
//      this._undo_stack.push(operator);
//      operator.execute(this);
//    }
//    else {
//      console.log("Stack is empty");
//    }
  },

  get history() {
    return this._undo_stack;
  },

  _b64StringToArray: function(b64string) {
    return Array.from(atob(b64string), (x) => x.charCodeAt(0));
  }
};


/* ================
 * Operator classes
 * ================ */

/* setStringPropertyValue_Operator class
*/
function setStringPropertyValue_Operator(property, value, mode = "") {
  this._mode = mode;
  this._prev_value = null;
  this._value = value;
  this._property = property;
}
setStringPropertyValue_Operator.prototype = {
  init: function(app) {
  },

  poll: function(app) {
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

  execute: function(app) {
    this._prev_value = this._property.value;
    this._property.value = this._value;
//    console.log("setStringPropertyValue_Operator.execute()");
//    console.log("prev_value: "+this._prev_value+", value: "+this._value);
    return true;
  },

  revert: function(app) {
//    console.assert(this._prev_value != null, "Previous value is not defined");
    this._property.value = this._prev_value;
//    console.log("setStringPropertyValue_Operator.revert()");
  }
};


/* putTileData_Operator class
*/
function putTileData_Operator(tile_data, x, y, w, h, mode = "") {
  this._mode = mode;
  this._prev_data = null;
  this._data = tile_data.slice();
  this._x = x;
  this._y = y;
  this._w = w;
  this._h = h;
}

putTileData_Operator.prototype = {
  init: function(app) {
  },

  poll: function(app) {
//    console.log([this._mode, app.view.mode]);
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

  execute: function(app) {
//    console.log("putTileData_Operator.execute()");
    this._prev_data = app.track_tiles.getTileData(this._x, this._y, this._w, this._h);
    app.track_tiles.putTileData(this._data, this._x, this._y, this._w, this._h);
//    console.log("prev_data: "+this._prev_data+", data: "+this._data);
    return true;
  },

  revert: function(app) {
//    console.log("putTileData_Operator.revert()");
//    console.assert(this._prev_data != null, "Previous data is not defined");
    app.track_tiles.putTileData(this._prev_data, this._x, this._y, this._w, this._h);
  }
};


/* AddBillboard_Operator class
*/
function AddBillboard_Operator(x, y, model_index, mode = "") {
  this._mode = mode;
  this._x = x;
  this._y = y;
  this._model_index = model_index;
  this._index = null;
}

AddBillboard_Operator.prototype = {
  get options() {
    return ["UNDO"];
  },

  init: function(app) {
  },

  poll: function(app) {
//    console.log([this._mode, app.view.mode]);
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

  execute: function(app) {
//    console.log("AddBillboard_Operator.execute()");

    this._index = app.billboards.numBillboardObjects();
    let billboard = app.billboards.addBillboardObject(this._index);
    billboard.model_index = this._model_index;
    billboard.x = this._x;
    billboard.y = this._y;

    return true;
  },

  revert: function(app) {
//    console.log("AddBillboard_Operator.revert()");
//    console.assert(this._billboard != null, "Billboard is not defined");

    app.billboards.delBillboardObject(this._index);
//    console.log("Billboard deleted");
  }
};


/* DelBillboard_Operator class
*/
function DelBillboard_Operator(index, mode = "") {
  this._mode = mode;
  this._index = index;
  this._billboard = null;
}

DelBillboard_Operator.prototype = {
  get options() {
    return ["UNDO"];
  },

  init: function(app) {
  },

  poll: function(app) {
//    console.log([this._mode, app.view.mode]);
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

  execute: function(app) {
//    console.log("DelBillboard_Operator.execute()");

    this._billboard = app.billboards.getBillboardObject(this._index);
    if(this._billboard != null) {
      app.billboards.delBillboardObject(this._index);
      return true;
    }

    return false;
  },

  revert: function(app) {
//    console.log("DelBillboard_Operator.revert()");
//    console.assert(this._billboard != null, "Billboard is not defined");

    let billboard = app.billboards.addBillboardObject(this._index);
    billboard.model_index = this._billboard.model_index;
    billboard.x = this._billboard.x;
    billboard.y = this._billboard.y;
  }
};


/* MoveBillboard_Operator class
*/
function MoveBillboard_Operator(dist_x, dist_y, mode = "") {
  this._mode = mode;

  this._billboard_idx = -1;
  this._dist_x = dist_x;
  this._dist_y = dist_y;
}

MoveBillboard_Operator.prototype = {
  get options() {
    return ["UNDO", "MODAL"];
  },

  get dist_x() {
    return this._dist_x;
  },
  set dist_x(val) {
    this._dist_x = val;
  },

  get dist_y() {
    return this._dist_y;
  },
  set dist_y(val) {
    this._dist_y = val;
  },

  init: function(app) {
    let billboard = app.billboards.getActiveBillboardObject();
    for(let idx = 0; idx < app.billboards.numBillboardObjects(); idx++) {
      if(app.billboards.getBillboardObject(idx) == billboard) {
        this._billboard_idx = idx;
        break;
      }
    }
//    console.assert(this._billboard_idx >= 0, "Assertion failed");
  },

  poll: function(app) {
//    console.log([this._mode, app.view.mode]);
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

//  modal: function(app, evt) {
//    if() {
//      return "FINISHED";
//    }
//    else if() {
//      return "CANCELLED";
//    }
//    return "RUNNING";
//  },

  execute: function(app) {
//    console.log("MoveBillboard_Operator.execute()");

    let billboard = app.billboards.getBillboardObject(this._billboard_idx);
    billboard.x += this._dist_x;
    billboard.y += this._dist_y;

    return true;
  },

  revert: function(app) {
//    console.log("MoveBillboard_Operator.revert()");

    let billboard = app.billboards.getBillboardObject(this._billboard_idx);
    billboard.x -= this._dist_x;
    billboard.y -= this._dist_y;
  }
};


/* setWaypointProperties_Operator class
*/
function SetWaypointProperties_Operator(radius, speed, checkpoint, mode = "") {
  this._mode = mode;
  this._prev_radius = null;
  this._prev_speed = null;
  this._prev_checkpoint = null;
  this._radius = radius;
  this._speed = speed;
  this._checkpoint = checkpoint;
  this._waypoint_idx = -1;
}
SetWaypointProperties_Operator.prototype = {
  init: function(app) {
    let waypoint = app.waypoints.getActiveWaypoint();
    for(let idx = 0; idx < app.waypoints.numWaypoints(); idx++) {
      if(app.waypoints.getWaypoint(idx) == waypoint) {
        this._waypoint_idx = idx;
        break;
      }
    }
//    console.assert(this._waypoint_idx >= 0, "Assertion failed");

    this._prev_radius = waypoint.radius;
    this._prev_speed = waypoint.speed;
    this._prev_checkpoint = waypoint.checkpoint;
  },

  poll: function(app) {
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

  execute: function(app) {
//    console.log("SetWaypointProperties_Operator.execute()");

    let waypoint = app.waypoints.getWaypoint(this._waypoint_idx);
    waypoint.radius = this._radius;
    waypoint.speed = this._speed;
    waypoint.checkpoint = this._checkpoint;
    return true;
  },

  revert: function(app) {
//    console.log("SetWaypointProperties_Operator.revert()");

    let waypoint = app.waypoints.getWaypoint(this._waypoint_idx);
    waypoint.radius = this._prev_radius;
    waypoint.speed = this._prev_speed;
    waypoint.checkpoint = this._prev_checkpoint;
  }
};


/* AddWaypoint_Operator class
*/
function AddWaypoint_Operator(x, y, radius, speed, checkpoint, mode = "") {
  this._mode = mode;
  this._checkpoint = checkpoint;
  this._radius = radius;
  this._speed = speed;
  this._x = x;
  this._y = y;
  this._waypoint_idx = -1;
}

AddWaypoint_Operator.prototype = {
  init: function(app) {
  },

  poll: function(app) {
//    console.log([this._mode, app.view.mode]);
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

  execute: function(app) {
//    console.log("AddWaypoint_Operator.execute()");

    if(this._waypoint_idx < 0) {
      let active_wp = app.waypoints.getActiveWaypoint();
//      console.log(active_wp);
      this._waypoint_idx = 0;
      while(this._waypoint_idx < app.waypoints.numWaypoints()) {
        if(active_wp == app.waypoints.getWaypoint(this._waypoint_idx)) {
          this._waypoint_idx++;
          break;
        }
        this._waypoint_idx++;
      }
    }
    let wp = app.waypoints.addWaypoint(this._waypoint_idx);
    wp.checkpoint = this._checkpoint;
    wp.radius = this._radius;
    wp.speed = this._speed;
    wp.x = this._x;
    wp.y = this._y;

    return true;
  },

  revert: function(app) {
//    console.log("AddWaypoint_Operator.revert()");

    app.waypoints.delWaypoint(this._waypoint_idx);
//    console.log("Waypoint deleted");
  }
};


/* DelWaypoint_Operator class
*/
function DelWaypoint_Operator(index, mode = "") {
  this._mode = mode;
  this._waypoint_idx = index;
  this._waypoint = null;
}

DelWaypoint_Operator.prototype = {
  init: function(app) {
  },

  poll: function(app) {
//    console.log([this._mode, app.view.mode]);
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

  execute: function(app) {
//    console.log("DelWaypoint_Operator.execute()");

    this._waypoint = app.waypoints.getWaypoint(this._waypoint_idx);
    if(this._waypoint != null) {
      app.waypoints.delWaypoint(this._waypoint_idx);
      return true;
    }

    return false;
  },

  revert: function(app) {
//    console.log("DelWaypoint_Operator.revert()");
//    console.assert(this._waypoint != null, "Waypoint is not defined");

    let waypoint = app.waypoints.addWaypoint(this._waypoint_idx);
    waypoint.checkpoint = this._waypoint.checkpoint;
    waypoint.radius = this._waypoint.radius;
    waypoint.speed = this._waypoint.speed;
    waypoint.x = this._waypoint.x;
    waypoint.y = this._waypoint.y;
  }
};


/* MoveWaypoint_Operator class
*/
function MoveWaypoint_Operator(dist_x, dist_y, mode = "") {
  this._mode = mode;

  this._waypoint_idx = -1;
  this._dist_x = dist_x;
  this._dist_y = dist_y;
}

MoveWaypoint_Operator.prototype = {
  get dist_x() {
    return this._dist_x;
  },
  set dist_x(val) {
    this._dist_x = val;
  },

  get dist_y() {
    return this._dist_y;
  },
  set dist_y(val) {
    this._dist_y = val;
  },

  init: function(app) {
    let waypoint = app.waypoints.getActiveWaypoint();
    for(let idx = 0; idx < app.waypoints.numWaypoints(); idx++) {
      if(app.waypoints.getWaypoint(idx) == waypoint) {
        this._waypoint_idx = idx;
        break;
      }
    }
//    console.assert(this._waypoint_idx >= 0, "Assertion failed");
  },

  poll: function(app) {
//    console.log([this._mode, app.view.mode]);
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

//  modal: function(app, evt) {
//    if() {
//      return "FINISHED";
//    }
//    else if() {
//      return "CANCELLED";
//    }
//    return "RUNNING";
//  },

  execute: function(app) {
//    console.log("MoveWaypoint_Operator.execute()");

    let waypoint = app.waypoints.getWaypoint(this._waypoint_idx);
    waypoint.x += this._dist_x;
    waypoint.y += this._dist_y;

    return true;
  },

  revert: function(app) {
//    console.log("MoveWaypoint_Operator.revert()");

    let waypoint = app.waypoints.getWaypoint(this._waypoint_idx);
    waypoint.x -= this._dist_x;
    waypoint.y -= this._dist_y;
  }
};

/* SetPysicsParameters_Operator class
*/
SetPysicsParameters_Operator = function(physparms, mode = "") {
  // physparms: { track: [fk, fs, tract, rr], terrain: [fk, fs, tract, rr], edge: [fk, fs, tract, rr] }
  this._mode = mode;
  this._prev_physparms = null;
  this._physparms = physparms;
}
SetPysicsParameters_Operator.prototype = {
  init: function(app) {
//    console.log("SetPysicsParameters_Operator.init()");

    this._prev_physparms = {track: [], terrain: [], edge: []};

    tile_id_arr = ["track", "terrain", "edge"];
    let idx = tile_id_arr.length;
    while(idx--) {
      tile_id = tile_id_arr[idx];
      let fs = app.physics_parameters[tile_id].static_friction;
      let fk = app.physics_parameters[tile_id].kinetic_friction;
      let tract = app.physics_parameters[tile_id].traction_constant;
      let rr = app.physics_parameters[tile_id].rolling_resistance;
      this._prev_physparms[tile_id] = [fs, fk, tract, rr];
    }
  },

  poll: function(app) {
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

  execute: function(app) {
//    console.log("SetPysicsParameters_Operator.execute()");

    tile_id_arr = ["track", "terrain", "edge"];
    let idx = tile_id_arr.length;
    while(idx--) {
      tile_id = tile_id_arr[idx];
      app.physics_parameters[tile_id].static_friction = this._physparms[tile_id][0];
      app.physics_parameters[tile_id].kinetic_friction = this._physparms[tile_id][1];
      app.physics_parameters[tile_id].traction_constant = this._physparms[tile_id][2];
      app.physics_parameters[tile_id].rolling_resistance = this._physparms[tile_id][3];
    }
    // Not undoable
    return false;
  },

  revert: function(app) {
//    console.log("SetPysicsParameters_Operator.revert()");

    tile_id_arr = ["track", "terrain", "edge"];
    let idx = tile_id_arr.length;
    while(idx--) {
      tile_id = tile_id_arr[idx];
      app.physics_parameters[tile_id].static_friction = this._prev_physparms[tile_id][0];
      app.physics_parameters[tile_id].kinetic_friction = this._prev_physparms[tile_id][1];
      app.physics_parameters[tile_id].traction_constant = this._prev_physparms[tile_id][2];
      app.physics_parameters[tile_id].rolling_resistance = this._prev_physparms[tile_id][3];
    }
  },
};


/* ImportTrack_Operator class
*/
ImportTrack_Operator = function(text, mode = "") {
  this._mode = mode;
  this._prev_trackname = null;
  this._prev_author = null;
  this._prev_track_tiles = null;

  this._text = text.slice();
}

ImportTrack_Operator.prototype = {
  init: function(app) {
  },

  poll: function(app) {
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

  execute: function(app) {
//    console.log("ImportTrack_Operator.execute()");

    if(this._text.trim()[0] == "[") {
      // No track data in this file
      return false;
    }

    lines = this._text.split('\n');
    if(lines.length < this.rows+2) {
      alert("Import failed: too few lines.");
      return false;
    }

    let linenum = 0;
    let currline = lines[linenum].trim();
    if(this._filename != "objects.txt") {
      linenum = this._parseTrackTiles(app, lines, 2);
      if(linenum < 2+32) {
        // Error in parsing tilemap
        return false;
      }
      app.trackname.value = lines[0].slice(0, 12);
      app.author.value = lines[1].slice(0, 12);
    }

    return true;
  },

  revert: function(app) {
//    console.log("ImportTrack_Operator.revert()");

    if(this._prev_track_tiles != null) {
      app.trackname.value = this._prev_trackname;
      app.author.value = this._prev_author;

      let map_w = app.track_tiles.width;
      let map_h = app.track_tiles.height;
      app.track_tiles.putTileData(this._prev_track_tiles, 0, 0, map_w, map_h);
    }
  },

  _parseTrackTiles: function(app, lines, linenum) {
//    console.log("ImportTrack_Operator._parseTrackTiles()");

    this._prev_trackname = app.trackname.value;
    this._prev_author = app.author.value;

    let map_w = app.track_tiles.width;
    let map_h = app.track_tiles.height;
    this._prev_track_tiles = app.track_tiles.getTileData(0, 0, map_w, map_h);

    let track_tiles = [];
    track_tiles.length = map_w*map_h;

    for(let row = 0; row < map_h; row++) {
      let currline = lines[linenum].trim();
      if(currline.length != map_w) {
        alert("Error on line "+(linenum+1)+": Track definition must have exactly "
          +map_w+" tile symbols on every line.");
        return linenum;
      }

      for(let col=0; col < map_w; col++) {
        let tile_idx = app.tileset.tileIndexOf(currline[col]);
        if(tile_idx < 0) {
          alert("Invalid tile symbol '"+currline[col]+"' on line "+(linenum+1)+".");
          tile_idx = 0;
        }
        track_tiles[map_w*row+col] = tile_idx;
      }
      linenum++;
    }

    app.track_tiles.putTileData(track_tiles, 0, 0, map_w, map_h);

    return linenum;
  }
};


/* ImportPhysicsParameters_Operator class
*/
ImportPhysicsParameters_Operator = function(text, mode = "") {
  this._mode = mode;
  this._prev_physparms = [];

  this._text = text.slice();
}

ImportPhysicsParameters_Operator.prototype = {
  init: function(app) {
//    console.log("ImportPhysicsParameters_Operator.init()");

    this._prev_physparms = {track: [], terrain: [], edge: []};

    tile_id_arr = ["track", "terrain", "edge"];
    let idx = tile_id_arr.length;
    while(idx--) {
      tile_id = tile_id_arr[idx];
      let fs = app.physics_parameters[tile_id].static_friction;
      let fk = app.physics_parameters[tile_id].kinetic_friction;
      let tract = app.physics_parameters[tile_id].traction_constant;
      let rr = app.physics_parameters[tile_id].rolling_resistance;
      this._prev_physparms[tile_id] = [fs, fk, tract, rr];
    }
  },

  poll: function(app) {
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

  execute: function(app) {
//    console.log("ImportPhysicsParameters_Operator.execute()");

    let lines = this._text.split('\n');
    let linenum = 0;
    let currline = lines[linenum].trim();

    while(linenum < lines.length) {
      currline = lines[linenum].trim();
      if(currline.length > 0) {
        if(currline == "[physics]") {
          linenum = this._parsePhysicsParameters(app, lines, linenum+1);
        }
      }
      linenum++;
    }
    // Not undoable
    return false;
  },

  revert: function(app) {
//    console.log("ImportPhysicsParameters_Operator.revert()");

    tile_id_arr = ["track", "terrain", "edge"];
    let idx = tile_id_arr.length;
    while(idx--) {
      tile_id = tile_id_arr[idx];
      app.physics_parameters[tile_id].static_friction = this._prev_physparms[tile_id][0];
      app.physics_parameters[tile_id].kinetic_friction = this._prev_physparms[tile_id][1];
      app.physics_parameters[tile_id].traction_constant = this._prev_physparms[tile_id][2];
      app.physics_parameters[tile_id].rolling_resistance = this._prev_physparms[tile_id][3];
    }
  },

  _parsePhysicsParameters: function(app, lines, linenum) {
    let tile_id_arr = ["track", "terrain", "edge"];

    while(linenum < lines.length) {
      let errorFlag = false;
      let currline = lines[linenum].trim();
      if(currline.length > 0) {
        if(currline[0] == "[") {
          break;
        }
        values = currline.split(",")
        if(values.length == 5) {
          let idx = parseInt(values[0]);
          let fs = parseFloat(values[1]);
          let fk = parseFloat(values[2]);
          let tract = parseInt(values[3]);
          let rr = parseFloat(values[4]);
          if(idx < tile_id_arr.length) {
            if(isNaN(fs) || isNaN(fk) || isNaN(tract) || isNaN(rr)) {
              errorFlag = true;
            }
            else {
              let tile_id = tile_id_arr[idx];
              app.physics_parameters[tile_id].static_friction = fs/100.0;
              app.physics_parameters[tile_id].kinetic_friction = fk/100.0;
              app.physics_parameters[tile_id].traction_constant = tract;
              app.physics_parameters[tile_id].rolling_resistance = rr/100.0;
            }
          }
          else {
            errorFlag = true;
          }
        }
        else {
          errorFlag = true;
        }
      }
      if(errorFlag) {
        alert("Error on line "+(linenum+1)+": Invalid physics parameters definition.");
      }
      linenum++;
    }

    return linenum;
  }
};


/* ImportBillboards_Operator class
*/
ImportBillboards_Operator = function(text, mode = "") {
  this._mode = mode;
  this._prev_billboards = [];

  this._text = text.slice();
}

ImportBillboards_Operator.prototype = {
  init: function(app) {
  },

  poll: function(app) {
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

  execute: function(app) {
//    console.log("ImportBillboards_Operator.execute()");

    let lines = this._text.split('\n');
    let linenum = 0;
    let currline = lines[linenum].trim();

    this._saveBillboards(app);
    app.billboards.clearBillboardObjects();

    while(linenum < lines.length) {
      currline = lines[linenum].trim();
      if(currline.length > 0) {
        if(currline == "[billboards]") {
          linenum = this._parseBillboards(app, lines, linenum+1);
        }
      }
      linenum++;
    }

    return true;
  },

  revert: function(app) {
//    console.log("ImportBillboards_Operator.revert()");

    app.billboards.clearBillboardObjects();

    for(let idx = 0; idx < this._prev_billboards.length; idx++) {
      let num_billboards = app.billboards.numBillboardObjects();
      let billboard = app.billboards.addBillboardObject(num_billboards);
      billboard.model_index = this._prev_billboards[idx].model_index;
      billboard.x = this._prev_billboards[idx].x;
      billboard.y = this._prev_billboards[idx].y;
    }
  },

  _saveBillboards: function(app) {
    this._prev_billboards.length = app.billboards.numBillboardObjects();
    for(let idx = 0; idx < app.billboards.numBillboardObjects(); idx++) {
      let billboard = app.billboards.getBillboardObject(idx);
      this._prev_billboards[idx] = {
        model_index: billboard.model_index,
        x: billboard.x,
        y: billboard.y
      };
    }
  },

  _parseBillboards: function(app, lines, linenum) {
//    console.log("ImportBillboards_Operator._parseBillboards()");

    while(linenum < lines.length) {
      let errorFlag = false;
      let currline = lines[linenum].trim();
      if(currline.length > 0) {
        if(currline[0] == "[") {
          break;
        }
        values = currline.split(",")
        if(values.length == 3) {
          for(let idx = 0; idx < values.length; idx++) {
            values[idx] = parseInt(values[idx]);
            if(isNaN(values[idx])) {
              errorFlag = true;
              break;
            }
          }
          let idx = app.billboards.numBillboardObjects();
          let billboard = app.billboards.addBillboardObject(idx);
          billboard.model_index = values[0];
          billboard.x = values[1];
          billboard.y = values[2];
        }
        else {
          errorFlag = true;
        }
      }
      if(errorFlag) {
        alert("Error on line "+(linenum+1)+": Invalid billboard definition.");
      }
      linenum++;
    }

//    console.log("Imported "+app.billboards.numBillboardObjects()+" billboards.");

    return linenum;
  }
};


/* ImportWaypoints_Operator class
*/
ImportWaypoints_Operator = function(text, mode = "") {
  this._mode = mode;
  this._prev_waypoints = [];

  this._text = text.slice();
}

ImportWaypoints_Operator.prototype = {
  init: function(app) {
  },

  poll: function(app) {
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

  execute: function(app) {
//    console.log("ImportWaypoints_Operator.execute()");

    let lines = this._text.split('\n');
    let linenum = 0;
    let currline = lines[linenum].trim();

    this._saveWaypoints(app);
    app.waypoints.clearWaypoints();

    while(linenum < lines.length) {
      currline = lines[linenum].trim();
      if(currline.length > 0) {
        if(currline == "[waypoints]") {
          linenum = this._parseWaypoints(app, lines, linenum+1);
        }
      }
      linenum++;
    }

    return true;
  },

  revert: function(app) {
//    console.log("ImportWaypoints_Operator.revert()");

    app.waypoints.clearWaypoints();

    for(let idx = 0; idx < this._prev_waypoints.length; idx++) {
      let waypoint = app.waypoints.addWaypoint();
      waypoint.radius = this._prev_waypoints[idx].radius;
      waypoint.speed = this._prev_waypoints[idx].speed;
      waypoint.x = this._prev_waypoints[idx].x;
      waypoint.y = this._prev_waypoints[idx].y;
    }
  },

  _saveWaypoints: function(app) {
    this._prev_waypoints.length = app.waypoints.numWaypoints();
    for(let idx = 0; idx < app.waypoints.numWaypoints(); idx++) {
      let waypoint = app.waypoints.getWaypoint(idx);
      this._prev_waypoints[idx] = {
        radius: waypoint.radius,
        speed: waypoint.speed,
        x: waypoint.x,
        y: waypoint.y
      };
    }
  },

  _parseWaypoints: function(app, lines, linenum) {
//    console.log("ImportWaypoints_Operator._parseWaypoints()");

    while(linenum < lines.length) {
      let errorFlag = false;
      let currline = lines[linenum].trim();
      if(currline.length > 0) {
        if(currline[0] == "[") {
          linenum--;
          break;
        }
        values = currline.split(",")
        if(values.length == 5) {
          for(let idx = 0; idx < values.length; idx++) {
            values[idx] = parseInt(values[idx]);
            if(isNaN(values[idx])) {
              errorFlag = true;
              break;
            }
          }
          let idx = app.waypoints.numWaypoints();
          let waypoint = app.waypoints.addWaypoint(idx);
          waypoint.x = values[0];
          waypoint.y = values[1];
          waypoint.radius = values[2];
          waypoint.speed = Math.min(values[3], 100);
          waypoint.checkpont = (values[4] != 0);
        }
        else {
          errorFlag = true;
        }
      }
      if(errorFlag) {
        alert("Error on line "+(linenum+1)+": Invalid waypoint definition.");
      }
      linenum++;
    }

//    console.log("Imported "+app.waypoints.numWaypoints()+" waypoints.");

    return linenum;
  }
};


/* ExportAsZip_Operator class
*/
function ExportAsZip_Operator(mode = "") {
  this._mode = mode;
}

ExportAsZip_Operator.prototype = {
  _BKGND_COLOR: "#ff00ff",
  _COLORS_MAX: 214,

  init: function(app) {
  },

  poll: function(app) {
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

  execute: function(app) {
//    console.log("ExportAsZip_Operator.execute()");

    let zip = new JSZip();

    // Use track name as the folder name, but replace special chars with '_' and cut to 8 chars
    let foldername = app.trackname.value;
    foldername = foldername.replace(/[^a-zA-Z0-9]/g,'_').replace(/_{2,}/g,'_').slice(0,8);
    let folder = zip.folder("pgpdata/tracks/"+foldername);

    let track_str = this._trackToString(app);
    let physparms_str = this._physicsParametersToString(app);
    // PokittoGP fails to read the last value if there is no newline at the end
    folder.file("track.txt", [track_str, physparms_str].join("\n")+"\n");

    if(app.waypoints.numWaypoints() > 0 || app.billboards.numBillboardObjects() > 0) {
      let waypoints_str = this._waypointsToString(app);
      let billboards_str = this._billboardsToString(app);
    // PokittoGP fails to read the last value if there is no newline at the end
      folder.file("objects.txt", [waypoints_str, billboards_str].join("\n")+"\n");
    }

    let color_map = this._createColorMap(app);
    for(let idx = 0; idx < app.textures.length; idx++) {
      let tex = app.textures[idx];
      let dataurl = this._textureToDataURL(app, color_map, tex);
      folder.file(tex.name+".bmp", dataurl.split('base64,')[1], {base64: true});
    }

    zip.generateAsync({type:"blob"}).then(function(content) {
      let link = document.createElement('a');
      link.setAttribute("download", "track.zip");
      link.href = window.URL.createObjectURL(content);
      document.body.appendChild(link);

      let event = new MouseEvent('click');
      link.dispatchEvent(event);

      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    });

    // No undo
    return false;
  },

  revert: function(app) {
  },

  _trackToString: function(app) {
    let lines = [app.trackname.value, app.author.value];

    let w = app.track_tiles.width;
    let h = app.track_tiles.height;
    let tile_data = app.track_tiles.getTileData(0, 0, w, h);

    for(let idx = 0; idx < tile_data.length; idx += w) {
      let arr = tile_data.slice(idx, idx+w).map(x => app.tileset.getTileSymbol(x));
      lines.push(arr.join(""));
    }
//    console.log(lines.join('\n'));
//    console.assert(lines.length == 2+h, "Assertion failed");

    return lines.join('\n');
  },

  _physicsParametersToString: function(app) {
    let lines = [];
    lines.push("[physics]");

    let tile_id_array = ["track", "terrain", "edge"];
    for(let idx = 0; idx < tile_id_array.length; idx++) {
      let tile_id = tile_id_array[idx];
      let fs = parseInt(100*app.physics_parameters[tile_id].static_friction);
      let fk = parseInt(100*app.physics_parameters[tile_id].kinetic_friction);
      let tract = app.physics_parameters[tile_id].traction_constant;
      let rr = parseInt(100*app.physics_parameters[tile_id].rolling_resistance);
      lines.push(idx+","+fs+","+fk+","+tract+","+rr);
    }
    return lines.join('\n');
  },

  _billboardsToString: function(app) {
    let lines = [];
    lines.push("[billboards]");
    let num_billboards = app.billboards.numBillboardObjects();
    for(let idx = 0; idx < num_billboards; idx++) {
      let billboard = app.billboards.getBillboardObject(idx);
      lines.push(billboard.model_index+","+billboard.x+","+billboard.y);
    }
    return lines.join('\n');
  },

  _waypointsToString: function(app) {
    let lines = [];
    lines.push("[waypoints]");
    let num_waypoints = app.waypoints.numWaypoints();
    for(let idx = 0; idx < num_waypoints; idx++) {
      let waypoint = app.waypoints.getWaypoint(idx);
      lines.push(waypoint.x+","+waypoint.y+","+waypoint.radius+","+waypoint.speed+","+(waypoint.checkpoint ? 1 : 0));
    }
    return lines.join('\n');
  },

  _createColorMap: function(app) {
    let color_map = new Map();

    for(let idx = 0; idx < app.textures.length; idx++) {
      let w = app.textures[idx].width;
      let h = app.textures[idx].height;
      let rgb_data = app.textures[idx].getRGBData(0, 0, w, h);
//      console.log({w: w, h: h, data: rgb_data});
      for(let idx = 0; idx < w*h; idx++) {
        let r = rgb_data[3*idx+0];
        let g = rgb_data[3*idx+1];
        let b = rgb_data[3*idx+2];
        let color = this._RGBToHtmlColor(r, g, b);
        color_map.set(color, 0);
      }
    }

    let idx = 1;
    for(let key of color_map.keys()) {
      if(key != this._BKGND_COLOR) {
        if(idx < this._COLORS_MAX) {
          color_map.set(key, idx);
        }
        else {
          color_map.set(key, 0);
        }
        idx++;
      }
    }
//    console.log(this._color_map);
    if(idx > this._COLORS_MAX) {
      alert("Warning: Texture image has more than "+this._COLORS_MAX+" colors.");
    }

    return color_map;
  },

  _textureToDataURL: function(app, color_map, texture) {
    let color_array = [];
    let len = 0;
    for(let val of color_map.values()) {
      len = Math.max(len, val);
    }
    color_array.length = len;
    for(let [color, idx] of color_map) {
      color_array[idx] = color;
    }
    color_array[0] = this._BKGND_COLOR;
//    console.log(color_array);

    let color_table = "";
    for(let idx = 0; idx < color_array.length; idx++) {
      let color = color_array[idx];
      let r = parseInt(color.substring(1, 3), 16);
      let g = parseInt(color.substring(3, 5), 16);
      let b = parseInt(color.substring(5, 7), 16);
      color_table += this._int32ToString((r<<16)+(g<<8)+b);
    }

    // Color header:
    let color_header = this._int32ToString(0x73524742);   // color space type, default "sRGB" (0x73524742)
    for(let c = 0; c < 16; c++) {
      color_header += this._int32ToString(0);
    }

    // Info header:
    let img_w = texture.width;
    let img_h = texture.height;
    let bpp = 8;
    let padded_w = (img_w+3)&0xfffffffc;
    let bpp_bytes = ((bpp+7)/8)|0;
    let info_header_len = 40+color_header.length;
    let info_header = this._int32ToString(40+color_header.length);   // Size of this header
    info_header += this._int32ToString(img_w);   // bitmap width in pixels
    info_header += this._int32ToString(img_h);   // bitmap height in pixels
    info_header += this._int16ToString(1);   // number of color planes (must be 1)
    info_header += this._int16ToString(bpp);   // number of bits per pixel
    info_header += this._int32ToString(0);   // compression method (0 - none)
    info_header += this._int32ToString(padded_w*img_h*bpp_bytes);   // size of the raw bitmap data (can be 0 for uncompressed images)
   info_header += this._int32ToString(0);   // x pixels per meter
    info_header += this._int32ToString(0);   // y pixels per meter
    info_header += this._int32ToString(color_table.length/4);   // No. color indexes in the color table. Use 0 for the max number of colors allowed by bit_count
    info_header += this._int32ToString(0);   // No. of colors used for displaying the bitmap. If 0 all colors are required

    // File header:
    let data_offset = 14+info_header_len+color_table.length;
    let pxlarray_size = padded_w*img_h*bpp_bytes;
    let file_size = data_offset+pxlarray_size;
    let file_header = this._int16ToString(0x4d42);   // file type, always "BM" which is 0x4D42
    file_header += this._int32ToString(file_size);   // file size in bytes
    file_header += this._int16ToString(0);   // Reserved, always 0
    file_header += this._int16ToString(0);   // Reserved, always 0
    file_header += this._int32ToString(data_offset);   // start position of pixel data from the beginning of the file

    // Pixel array:
    let rgb_data = texture.getRGBData(0, 0, img_w, img_h);
    let pxlarray = "";
    for(let y = img_h-1; y >= 0 ; y--) {
      let offset = y*3*img_w;
      let x = 0;
      while(x < img_w) {
        let r = rgb_data[offset+3*x+0];
        let g = rgb_data[offset+3*x+1];
        let b = rgb_data[offset+3*x+2];
        let color = this._RGBToHtmlColor(r, g, b);
        pxlarray += (color_map.has(color)) ? 
          String.fromCharCode(color_map.get(color)) : 
          String.fromCharCode(0);
        x++;
      }
      while(x < padded_w) {
        pxlarray += String.fromCharCode(0);
        x++;
      }
    }

    return "data:image/bmp;base64,"+btoa(file_header+info_header+color_header+color_table+pxlarray);
  },

  _RGBToHtmlColor: function(r, g, b) {
    r_str = (r < 0x10) ? "0"+r.toString(16) : r.toString(16);
    g_str = (g < 0x10) ? "0"+g.toString(16) : g.toString(16);
    b_str = (b < 0x10) ? "0"+b.toString(16) : b.toString(16);
    return "#"+r_str+g_str+b_str;
  },

  _int16ToString: function(val) {
    let arr = [val, (val>>8)];
    return arr.map(item => String.fromCharCode(item&0xff)).join("");
  },

  _int32ToString: function(val) {
    let arr = [val, (val>>8), (val>>16), (val>>24)];
    return arr.map(item => String.fromCharCode(item&0xff)).join("");
  }
};


/* loadTextures_Operator class
*/
function loadTextures_Operator(rgb_data, w, h, mode = "") {
  this._mode = mode;
  this._width = w;
  this._height = h;
  this._rgb_data = rgb_data;
}

loadTextures_Operator.prototype = {
  init: function(app) {
  },

  poll: function(app) {
    return (this._mode == "" || this._mode.indexOf(app.view.mode) >= 0);
  },

  execute: function(app) {
    let tex_img = app.texture_image;
    if(this._width != tex_img.width || this._height != tex_img.height) {
      alert("Image size must be "+tex_img.width+"x"+tex_img.height+" pixels.");
    }
    else {
      for(let tex_idx = 0; tex_idx < tex_img.rects.length; tex_idx++) {
        let tex = app.textures[tex_idx];
        let rect = tex_img.rects[tex_idx];

        let tex_rgb_data = [];
        tex_rgb_data.length = 3*rect.width*rect.height;
        for(let idx = 0; idx < rect.width*rect.height; idx++) {
          let x = idx%rect.width;
          let y = (idx/rect.width)|0;
          let src_idx = 3*(this._width*(rect.y+y)+rect.x+x);
          let dest_idx = 3*(rect.width*y+x);
          tex_rgb_data[dest_idx] = this._rgb_data[src_idx];
          tex_rgb_data[dest_idx+1] = this._rgb_data[src_idx+1];
          tex_rgb_data[dest_idx+2] = this._rgb_data[src_idx+2];
        }
        let autocrop = (idx < 6) ? false : true;
        tex.fromRGBData(tex_rgb_data, rect.width, rect.height, autocrop);
      }
    }

    // No undo
    return false;
  },

  revert: function(app) {
  },
};


let pgpedit_app = new PgpEdit_Application();
pgpedit_app.init(pgpedit_settings);

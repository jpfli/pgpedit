
/* =====================
 * PgpEdit Data classes:
 * =====================
*/

/* BillboardModel class
*/
function BillboardModel(name, color) {
  this.name = name;
  this.color = color;
}


/* BillboardObject class
*/
function BillboardObject(model_index, x, y) {
  this.model_index = model_index;
  this.x = x;
  this.y = y;
}


/* Billboards class
*/
function Billboards() {
  console.log("Billboards.constructor()");
  this._active_model_idx = -1;
  this._active_billboard_object = null;
  this._billboard_models = [];
  this._billboard_objs = [];
}

Billboards.prototype.numBillboardModels = function() {
  return this._billboard_models.length;
}

Billboards.prototype.clearBillboardModels = function() {
  this._types.length = 0;
  this._active_model_idx = -1;
}

Billboards.prototype.getBillboardModel = function(idx) {
  if(idx >= 0 && idx < this._billboard_models.length) {
    return this._billboard_models[idx];
  }
  return null;
}

Billboards.prototype.addBillboardModel = function() {
  let len = this._billboard_models.push(new BillboardModel("", "#ffffff"));
  this._active_model_idx = len-1;
  return this._billboard_models[len-1];
}

Billboards.prototype.delBillboardModel = function(idx) {
  console.log("Billboards.delType("+idx+")");
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
    console.log("Active BillboardModel: '"+this._billboard_models[_active_model_idx].name+"'");
  }
}

Billboards.prototype.getActiveModelIndex = function() {
  return this._active_model_idx;
}

Billboards.prototype.setActiveModelIndex = function(idx) {
  if(idx >= 0 && idx < this._billboard_models.length) {
    this._active_model_idx = idx;
  }
  else {
    this._active_model_idx = -1;
  }
}

Billboards.prototype.numBillboardObjects = function() {
  return this._billboard_objs.length;
}

Billboards.prototype.clearBillboardObjects = function() {
  this._billboard_objs.length = 0;
}

Billboards.prototype.getBillboardObject = function(idx) {
  if(idx >= 0 && idx < this._billboard_objs.length) {
    return this._billboard_objs[idx];
  }
  return null;
}

Billboards.prototype.addBillboardObject = function() {
  let len = this._billboard_objs.push(new BillboardObject(this._active_model_idx, 0, 0));
  this._active_billboard_obj = this._billboard_objs[len-1];
  return this._active_billboard_obj;
}

Billboards.prototype.delBillboardObject = function(idx) {
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
  }
}

Billboards.prototype.getActiveBillboardObject = function() {
  return this._active_billboard_obj;
}

Billboards.prototype.setActiveBillboardObject = function(billboard_obj) {
  this._active_billboard_obj = billboard_obj;
}


/* Textures class
*/
function Textures(settings) {
  console.log("Textures.constructor()");
  this._textures = [];

  this._textures.length = settings.textures.length;
  for(let tex_idx = 0; tex_idx < this._textures.length; tex_idx++) {
    let tex_name = settings.textures[tex_idx].name;
    let w = settings.textures[tex_idx].width;
    let h = settings.textures[tex_idx].height;
    let b64data = settings.textures[tex_idx].data;
    let tex_image = this._RGBImageFromBase64(b64data, w, h);
    if(tex_name.indexOf("sprite") >= 0) {
      this.cropRGBImage(tex_image);
    }
    this._textures[tex_idx] = {name: tex_name, image: tex_image};
  }
}

Textures.prototype.IMAGE_WIDTH = 64;
Textures.prototype.IMAGE_HEIGHT = 64;
Textures.prototype.BKGND_COLOR = "#ff00ff";

Textures.prototype.cropRGBImage = function(image) {
  let rect = this._getRGBImageCropRectangle(image);

  let new_data = [];
  new_data.length = 3*rect.w*rect.h;

  let img_w = image.width;
  for(let y = 0; y < rect.h; y++) {
    for(let x = 0; x < rect.w; x++) {
      new_data[3*(rect.w*y+x)+0] = image.data[3*(img_w*(rect.y+y)+rect.x+x)+0];
      new_data[3*(rect.w*y+x)+1] = image.data[3*(img_w*(rect.y+y)+rect.x+x)+1];
      new_data[3*(rect.w*y+x)+2] = image.data[3*(img_w*(rect.y+y)+rect.x+x)+2];
    }
  }

  console.log("width; "+image.width+", height: "+image.height+", rect: ");
  console.log(rect);

  image.width = rect.w;
  image.height = rect.h;
  image.data = new_data;
}

Textures.prototype._getRGBImageCropRectangle = function(image) {
  let img_w = image.width;
  let img_h = image.height;

  let padding_top = img_h;
  let padding_right = img_w;
  let padding_bottom = img_h;
  let padding_left = img_w;

  for(let y = 0; y < img_h; y++) {
    //let offset = y*4*img_w;
    for(let x = 0; x < img_w; x++) {
      let r = image.data[3*(img_w*y+x)+0];
      let g = image.data[3*(img_w*y+x)+1];
      let b = image.data[3*(img_w*y+x)+2];
      let color = this._rgbToHtmlColor(r, g, b);
      if(color != this.BKGND_COLOR) {
        padding_top = Math.min(padding_top, y);
        padding_right = Math.min(padding_right, img_w-1-x);
        padding_bottom = Math.min(padding_bottom, img_h-1-y);
        padding_left = Math.min(padding_left, x);
      }
    }
  }
  let rect = {
    x: padding_left,
    y: padding_top,
    w: img_w-(padding_left+padding_right),
    h: img_h-(padding_top+padding_bottom)
  };

  width_adj = ((rect.w+3)&0xfffffffc)-rect.w;
  rect.x -= (width_adj>>1);
  rect.w += width_adj;
  if(rect.x < 0) {
    rect.x = 0;
  }
  else if(rect.x+rect.w >= img_w) {
    rect.x = img_w-rect.w;
  }
  return rect;
}

Textures.prototype._RGBImageFromBase64 = function(b64data, w, h) {
  return {width: w, height: h, data: Array.from(atob(b64data), (x) => x.charCodeAt(0))};
}

Textures.prototype.numTextures = function() {
  return this._textures.length;
}

Textures.prototype.getTexture = function(tex_idx) {
  if(tex_idx < 0 || tex_idx >= this._textures.length) {
    return null;
  }
  return this._textures[tex_idx];
}

Textures.prototype.textureToDataURL = function(tex_idx) {
  if(tex_idx < 0 || tex_idx >= this._textures.length) {
    return;
  }

  // Color table:
  let color_map = this._createColorMap();
  let color_array = [];
  color_array.length = color_map.size;
  for(let [color, idx] of color_map) {
    color_array[idx] = color;
  }
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
  let tex_img = this._textures[tex_idx].image;
  let img_w = tex_img.width;
  let img_h = tex_img.height;
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
  let pxlarray = "";
  for(let y = img_h-1; y >= 0 ; y--) {
    let offset = y*3*img_w;
    let x = 0;
    while(x < img_w) {
      let r = tex_img.data[offset+3*x+0];
      let g = tex_img.data[offset+3*x+1];
      let b = tex_img.data[offset+3*x+2];
      let color = this._rgbToHtmlColor(r, g, b);
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
}

Textures.prototype._createColorMap = function() {
  let color_map = new Map();

  for(let idx = 0; idx < this._textures.length; idx++) {
    let tex_img = this._textures[idx].image;
    for(let idx = 0; idx < tex_img.width*tex_img.height; idx++) {
      let r = tex_img.data[3*idx+0];
      let g = tex_img.data[3*idx+1];
      let b = tex_img.data[3*idx+2];
      let color = this._rgbToHtmlColor(r, g, b);
      color_map.set(color, 0);
    }
  }

  let idx = 1;
  for(let key of color_map.keys()) {
    if(key == this.BKGND_COLOR) {
      color_map.set(key, 0);
    }
    else if(idx > 255) {
      color_map.delete(key);
    }
    else {
      color_map.set(key, idx);
      idx++;
    }
  }
  console.log(color_map);
  if(idx > 255) {
    alert("Texture image has too many colors.");
  }
  return color_map;
}

Textures.prototype._rgbToHtmlColor = function(r, g, b) {
  r_str = (r < 0x10) ? "0"+r.toString(16) : r.toString(16);
  g_str = (g < 0x10) ? "0"+g.toString(16) : g.toString(16);
  b_str = (b < 0x10) ? "0"+b.toString(16) : b.toString(16);
  return "#"+r_str+g_str+b_str;
}

Textures.prototype._int16ToString = function(val) {
  return [val, (val>>8)].map(item => String.fromCharCode(item&0xff)).join("");
}

Textures.prototype._int32ToString = function(val) {
  return [val, (val>>8), (val>>16), (val>>24)].map(item => String.fromCharCode(item&0xff)).join("");
}


/* Tilemap class
*/
function Tilemap() {
  console.log("Tilemap.constructor()");
  this._mapdata = [];
  this._width = 0;
  this._height = 0;
}

Tilemap.prototype.getWidth = function() {
  return this._width;
}

Tilemap.prototype.setWidth = function(width) {
  console.log("Tilemap.setWidth("+width+")");
  if(width < 0) {
    width = 0;
  }
  for(let row = 0; row < this._height; row++) {
    this._mapdata[row].length = width;
    for(let col = this._width; col < width; col++) {
      this._mapdata[row][col] = 0;
    }
  }
  this._width = width;
}

Tilemap.prototype.getHeight = function() {
  return this._height;
}

Tilemap.prototype.setHeight = function(height) {
  console.log("Tilemap.setHeight("+height+")");
  if(height < 0) {
    height = 0;
  }
  this._mapdata.length = height;
  for(let row = this._height; row < height; row++) {
    this._mapdata[row] = [];
    for(let col = 0; col < this._width; col++) {
      this._mapdata[row][col] = 0;
    }
  }
  this._height = height;
}

Tilemap.prototype.getTileId = function(column, row) {
  if(row < this.getHeight() && row >= 0 && column < this.getWidth() && column >= 0) {
    return this._mapdata[row][column];
  }
}

Tilemap.prototype.setTileId = function(column, row, tile_id) {
  if(row < this.getHeight() && row >= 0 && column < this.getWidth() && column >= 0) {
    this._mapdata[row][column] = tile_id;
  }
}


/* Tileset class
*/
function Tileset(settings) {
  console.log("Tileset.constructor()");
  this._active_id = 0;
  this._images = [];
  this._symbols = settings.symbols;
  this._tilesize = settings.tile_size;

  this._images.length = settings.num_tiles;
}

Tileset.prototype.getTileSize = function() {
  return this._tilesize
}

Tileset.prototype.getTileImageData = function(tile_id) {
  return this._images[tile_id];
}

Tileset.prototype.setTileImageData = function(tile_id, imagedata) {
  this._images[tile_id] = imagedata;
}

Tileset.prototype.numTiles = function() {
  return this._images.length;
}

Tileset.prototype.tileSymbolAt = function(tile_id) {
  if(tile_id >=0 && tile_id < this.numTiles()) {
    return this._symbols[tile_id];
  }
}

Tileset.prototype.tileSymbolToId = function(tile_symbol) {
  return this._symbols.indexOf(tile_symbol);
}

Tileset.prototype.getActiveTileId = function() {
  return this._active_id;
}

Tileset.prototype.setActiveTileId = function(tile_id) {
  if(tile_id < this.numTiles() && tile_id >= 0) {
    this._active_id = tile_id;
  }
}


/* Waypoint class
*/
function Waypoint(x = 0, y = 0, radius = 0, speed = 0, checkpoint = true) {
  this.checkpoint = checkpoint;
  this.radius = radius;
  this.speed = speed;
  this.x = x;
  this.y = y;
}


/* Waypoints class
*/
function Waypoints() {
  console.log("Waypoints.constructor()");
  this._active_waypoint = null;
  this._waypoints = [];
}

Waypoints.prototype.numWaypoints = function() {
  return this._waypoints.length;
}

Waypoints.prototype.getWaypoint = function(idx) {
  if(idx >= 0 && idx < this._waypoints.length) {
    return this._waypoints[idx];
  }
  return null;
}

Waypoints.prototype.clearWaypoints = function() {
  this._waypoints.length = 0;
}

Waypoints.prototype.addWaypoint = function() {
  let len = this._waypoints.push(new Waypoint());
  this._active_waypoint = this._waypoints[len-1];
  return this._waypoints[len-1];
}

Waypoints.prototype.delWaypoint = function(idx) {
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
  }
}

Waypoints.prototype.getActiveWaypoint = function() {
  return this._active_waypoint;
}

Waypoints.prototype.setActiveWaypoint = function(waypoint) {
  this._active_waypoint = waypoint;
}


/* PgpEdit_Data class
*/
function PgpEdit_Data(settings) {
  console.log("PgpEdit_Data.constructor()");
  this.author = "";
  this.billboards = new Billboards();
  this.textures = new Textures(settings);
  this.tilemap = new Tilemap();
  this.tileset = new Tileset(settings.tileset)
  this.trackname = "";
  this.waypoints = new Waypoints();

  let billboards = settings.billboards;
  for(let idx = 0; idx < billboards.length; idx++) {
    let bboard_model = this.billboards.addBillboardModel();
    bboard_model.name = billboards[idx].name;
    bboard_model.color = billboards[idx].color;
  }
  this.billboards.setActiveModelIndex(0);
  console.log("BilboardModels added: "+this.billboards.numBillboardModels());

  this.tilemap.setWidth(32);
  this.tilemap.setHeight(32);
}



/* ================
 * PgpEditUI class:
 * ================
*/
function PgpEditUI(pgpedit_data) {
  console.log("PgpEditUI.constructor()");

  this.tileset_canvas = document.getElementById("tileset-canvas");
  this.active_tile_ctx = document.getElementById("brushtile").getContext("2d");
  this.tilemap_canvas = document.getElementById("tilemap");
  this.tilemap_imgdata = null;
  this.mousedownFlag = false;
  this.edit_mode = this.EditModeEnum.TILES;
  this.billboard_grabbed = false;
  this.billboard_grabx = 0;
  this.billboard_graby = 0;
  this.waypoint_grabbed = false;
  this.waypoint_grabx = 0;
  this.waypoint_graby = 0;
  this._pgpedit_data = pgpedit_data;
  this.tileset_images = [];
  this.sidepanel_view = null;
  this.tile_templates = [];
  this._texture_rects = new Map();

  this._texture_rects.set("tex01",{x: 0, y: 0, w: 16, h: 24});
  this._texture_rects.set("tex02",{x: 16, y: 0, w: 8, h: 12});
  this._texture_rects.set("tex03",{x: 16, y: 12, w: 8, h: 12});
  this._texture_rects.set("tex04",{x: 0, y: 24, w: 16, h: 24});
  this._texture_rects.set("tex05",{x: 16, y: 24, w: 16, h: 24});
  this._texture_rects.set("bkground",{x: 0, y: 48, w: 22, h: 16});
  this._texture_rects.set("sprite01",{x: 32, y: 0, w: 32, h: 32});
  this._texture_rects.set("sprite02",{x: 32, y: 32, w: 32, h: 32});
}

PgpEditUI.prototype.TILE_SIZE = 32;
PgpEditUI.prototype.GRID_COLOR = "rgb(80, 80, 80)";
PgpEditUI.prototype.HIGHLIGHT_COLOR = "rgba(255, 128, 128, 0.5)";
PgpEditUI.prototype.BBRD_MAX_NUM = 30;
PgpEditUI.prototype.BBRD_SELECTED_COLOR = "hsl(180,100%,75%)";
PgpEditUI.prototype.BBRD_RECT_SIZE = 10;
PgpEditUI.prototype.WP_MAX_NUM = 30;
PgpEditUI.prototype.WP_LINE_COLOR = "rgb(255,255,255)";
PgpEditUI.prototype.WP_RIM_COLOR = "hsl(200,50%,50%)";
PgpEditUI.prototype.WP_RIM_SELECTED_COLOR = "hsl(200,75%,75%)";
PgpEditUI.prototype.WP_TARGET_COLOR = "hsl(180,75%,50%)";
PgpEditUI.prototype.WP_TARGET_SELECTED_COLOR = "hsl(180,100%,75%)";
PgpEditUI.prototype.WP_TARGET_RECT_SIZE = 10;
PgpEditUI.prototype.WP_RADIUS = 128;
PgpEditUI.prototype.WP_SPEED = 100;

PgpEditUI.prototype.EditModeEnum = {TILES: 1, BILLBOARDS: 2, WAYPOINTS: 3};

PgpEditUI.prototype.init = function(settings) {
  console.log("PgpEditUI.init()");

  document.getElementById("mode-select").value = "tiles-tab";

  this.populateBillboardDroplist(settings);

  this.tileset_canvas.addEventListener("mousedown", this);
  this.tilemap_canvas.addEventListener("mousemove", this);
  this.tilemap_canvas.addEventListener("mouseout", this);
  this.tilemap_canvas.addEventListener("mousedown", this);
  window.addEventListener("mouseup", this);

  document.getElementById("mode-select").addEventListener("change", this);
  document.getElementById("billboard-droplist").addEventListener("change", this);
  document.getElementById("trackname-text").addEventListener("change", this);
  document.getElementById("author-text").addEventListener("change", this);
  document.getElementById("radius").addEventListener("change", this);
  document.getElementById("speed").addEventListener("change", this);
  document.getElementById("checkpoint").addEventListener("change", this);

  document.getElementById("loadtex-file").addEventListener("change", this);
  document.getElementById("import").addEventListener("change", this);
  document.getElementById("export").addEventListener("click", this);

  let idx_arrays = settings.tileset.template.index_arrays;
  let num_tiles = idx_arrays.length;
  this.tile_templates.length = num_tiles;
  for(idx = 0; idx < num_tiles; idx++) {
    this.tile_templates[idx] = Array.from(atob(idx_arrays[idx]), (x) => x.charCodeAt(x));
  }
  this.createTilesetImages();
  this.updateTilesetImages(this._pgpedit_data.tileset);

  this.tileset_canvas.width = 4*this.TILE_SIZE;
  this.tileset_canvas.height = 5*this.TILE_SIZE;
  this.drawTileset();

  this.active_tile_ctx.canvas.width = this.TILE_SIZE;
  this.active_tile_ctx.canvas.height = this.TILE_SIZE;
  this.drawActiveTile();

  this.tilemap_canvas.width = this._pgpedit_data.tilemap.getWidth()*this.TILE_SIZE;
  this.tilemap_canvas.height = this._pgpedit_data.tilemap.getHeight()*this.TILE_SIZE;
  this.drawTilemap();

  this.drawGrid(this.tilemap_canvas.getContext("2d"));

  document.getElementById("trackname-text").value = this._pgpedit_data.trackname;
  document.getElementById("author-text").value = this._pgpedit_data.author;
}

PgpEditUI.prototype.populateBillboardDroplist = function(settings) {
  let droplist = document.getElementById("billboard-droplist");
  while(droplist.length > 0) {
    droplist.remove(0);
  }

  let billboards = settings.billboards;
  for(let idx = 0; idx < billboards.length; idx++) {
    let opt = document.createElement("option");
    //opt.value = "billboard."+idx;
    opt.innerHTML = billboards[idx].name;
    droplist.appendChild(opt);
  }
}

PgpEditUI.prototype.createTilesetImages = function() {
  let minitile_imgs = [];
  let idx_table = [{x: 0, y: 16}, {x: 4, y: 16}, {x: 0, y: 20}, {x: 4, y: 20}];

  let image = this._pgpedit_data.textures.getTexture(0).image;
  for(let idx = 0; idx < 4; idx++) {
    minitile_imgs.push(this.minitileFromRGBImage(image, idx_table[idx].x, idx_table[idx].y));
  }

  image = this._pgpedit_data.textures.getTexture(1).image;
  minitile_imgs.push(this.minitileFromRGBImage(image, 0, 8));

  image = this._pgpedit_data.textures.getTexture(2).image;
  minitile_imgs.push(this.minitileFromRGBImage(image, 0, 8));

  image = this._pgpedit_data.textures.getTexture(3).image;
  for(let idx = 0; idx < 4; idx++) {
    minitile_imgs.push(this.minitileFromRGBImage(image, idx_table[idx].x, idx_table[idx].y));
  }

  image = this._pgpedit_data.textures.getTexture(4).image;
  for(let idx = 0; idx < 4; idx++) {
    minitile_imgs.push(this.minitileFromRGBImage(image, idx_table[idx].x, idx_table[idx].y));
  }

  for(let tile_idx = 0; tile_idx < this.tile_templates.length; tile_idx++) {
    let tile_tmpl = this.tile_templates[tile_idx];
    let target_data = [];
    target_data.length = 3*this.TILE_SIZE*this.TILE_SIZE;
    let target_w = this.TILE_SIZE;
    let minitile_size = 4;
    for(let target_idx = 0; target_idx < this.TILE_SIZE*this.TILE_SIZE; target_idx++) {
      let tmpl_item_idx = target_idx/(this.TILE_SIZE*minitile_size)|0;
      tmpl_item_idx *= this.TILE_SIZE/minitile_size;
      tmpl_item_idx += ((target_idx%this.TILE_SIZE)/minitile_size)|0;
      let minitile_idx = tile_tmpl[tmpl_item_idx];

      let src_idx = target_idx%minitile_size;
      src_idx += minitile_size*(((target_idx/this.TILE_SIZE)|0)%minitile_size);
      
      target_data[3*target_idx+0] = minitile_imgs[minitile_idx].data[4*src_idx+0];
      target_data[3*target_idx+1] = minitile_imgs[minitile_idx].data[4*src_idx+1];
      target_data[3*target_idx+2] = minitile_imgs[minitile_idx].data[4*src_idx+2];
    }
    this._pgpedit_data.tileset.setTileImageData(tile_idx, target_data);
  }
}

PgpEditUI.prototype.updateTilesetImages = function(tileset) {
  console.log("updateTilesetImages()");
  let ctx = document.getElementById("tileset-canvas").getContext("2d");

  this.tileset_images.length = tileset.numTiles();
  let tilesize = tileset.getTileSize();
  for(let idx=0; idx < tileset.numTiles(); idx++) {
    this.tileset_images[idx] = ctx.createImageData(tilesize, tilesize);
    let target_data = this.tileset_images[idx].data;
    let src_data = tileset.getTileImageData(idx);
    for(let p_idx=0; p_idx<tilesize*tilesize; p_idx++) {
      target_data[p_idx*4] = src_data[p_idx*3];
      target_data[p_idx*4+1] = src_data[p_idx*3+1];
      target_data[p_idx*4+2] = src_data[p_idx*3+2];
      target_data[p_idx*4+3] = 255;
    }
  }
}

PgpEditUI.prototype.minitileFromRGBImage = function(image, sx, sy) {
  let ctx = document.getElementById("tileset-canvas").getContext("2d");
  let tile_img = ctx.createImageData(4, 4);

  let img_w = image.width;
  for(let y = 0; y < 4; y++) {
    let img_offset = img_w*(sy+y)+sx;
    let tile_offset = tile_img.width*y;
    for(let x = 0; x < 4; x++) {
      tile_img.data[4*(tile_img.width*y+x)+0] = image.data[3*(img_w*(sy+y)+sx+x)+0];
      tile_img.data[4*(tile_img.width*y+x)+1] = image.data[3*(img_w*(sy+y)+sx+x)+1];
      tile_img.data[4*(tile_img.width*y+x)+2] = image.data[3*(img_w*(sy+y)+sx+x)+2];
      tile_img.data[4*(tile_img.width*y+x)+3] = 255;
    }
  }
  return tile_img;
}

PgpEditUI.prototype.handleEvent = function(evt) {
  console.log("{event.target.id:\""+evt.target.id+"\", event.type:\""+evt.type+"\"}");
  if(evt.type == "mousemove") {
    if(evt.target.id == "tilemap") {
      let coord = this.tileCoordinatesFromMouse(this.tilemap_canvas, evt);
      this.revertTilemapCanvas();
      if(this.edit_mode == this.EditModeEnum.TILES) {
        if(this.mousedownFlag) {
          let tile_id = this._pgpedit_data.tileset.getActiveTileId();
          this.drawTile(tile_id, coord.col, coord.row);
        }
        this.drawTileHighlight(coord.col, coord.row);
        this.drawGrid(this.tilemap_canvas.getContext("2d"));
      }
      else if(this.edit_mode == this.EditModeEnum.BILLBOARDS) {
        if(this._pgpedit_data.billboards.numBillboardObjects() > 0) {
          if(this.billboard_grabbed) {
            let canvas_h = this.tilemap_canvas.height;
            let rect = this.tilemap_canvas.getBoundingClientRect();
            let mousex = (evt.clientX-rect.left)|0;
            let mousey = (evt.clientY-rect.top)|0;

            let billboard = this._pgpedit_data.billboards.getActiveBillboardObject();
            billboard.x = (mousex-this.billboard_grabx)*2;
            billboard.y = (canvas_h-(mousey-this.billboard_graby))*2;
          }
          this.drawBillboards();
        }
      }
      else if(this.edit_mode == this.EditModeEnum.WAYPOINTS) {
        if(this._pgpedit_data.waypoints.numWaypoints() > 0) {
          if(this.waypoint_grabbed) {
            let canvas_h = this.tilemap_canvas.height;
            let rect = this.tilemap_canvas.getBoundingClientRect();
            let mousex = (evt.clientX-rect.left)|0;
            let mousey = (evt.clientY-rect.top)|0;

            let waypoint = this._pgpedit_data.waypoints.getActiveWaypoint();
            waypoint.x = (mousex-this.waypoint_grabx)*2;
            waypoint.y = (canvas_h-(mousey-this.waypoint_graby))*2;
          }
          this.drawWaypoints();
        }
      }
    }
  }
  else if(evt.type == "mouseout") {
    this.onTilemapMouseout(evt);
  }
  else if(evt.type == "mousedown") {
    if(evt.target.id == "tilemap") {
      this.onTilemapMousedown(evt);
    }
    if(evt.target.id == "tileset-canvas") {
      this.onTilesetMouseDown(evt);
    }
  }
  else if(evt.type == "mouseup") {
    this.mousedownFlag = false;
    this.billboard_grabbed = false;
    this.waypoint_grabbed = false;
  }
  else if(evt.type == "click") {
    if(evt.target.id == "export") {
      this.onExportButtonClick(evt);
    }
  }
  else if(evt.type == "change") {
    this.onPropertyChange(evt);
  }
}

PgpEditUI.prototype.onTilemapMousedown = function(evt) {
  this.mousedownFlag = true;

  this.revertTilemapCanvas();

  if(this.edit_mode == this.EditModeEnum.TILES) {
    let coord = this.tileCoordinatesFromMouse(this.tilemap_canvas, evt);
    let tile_id = this._pgpedit_data.tileset.getActiveTileId();
    this.drawTile(tile_id, coord.col, coord.row);
    this.drawGrid(this.tilemap_canvas.getContext("2d"));
  }
  else if(this.edit_mode == this.EditModeEnum.BILLBOARDS) {
    let canvas_h = this.tilemap_canvas.height;
    let rect = this.tilemap_canvas.getBoundingClientRect();
    let mousex = (evt.clientX-rect.left)|0;
    let mousey = (evt.clientY-rect.top)|0;
    if(document.getElementById("add_billboard-tool").checked) {
      if(this._pgpedit_data.billboards.numBillboardObjects() < this.BBRD_MAX_NUM) {
        let billboard = this._pgpedit_data.billboards.addBillboardObject();
        billboard.x = mousex*2;
        billboard.y = (canvas_h-mousey)*2;

        this.billboard_grabbed = true;
        this.billboard_grabx = 0;
        this.billboard_graby = 0;
      }
      else {
        alert("Maximum number of billboards: "+this.BBRD_MAX_NUM);
      }
    }
    else {
      console.log("Select/delete billboard");
      if(this._pgpedit_data.billboards.numBillboardObjects() > 0) {
        for(let idx = this._pgpedit_data.billboards.numBillboardObjects()-1; idx >= 0; idx--) {
          let billboard = this._pgpedit_data.billboards.getBillboardObject(idx);
          let offs_x = mousex-(billboard.x/2);
          let offs_y = mousey-(canvas_h-billboard.y/2);
          let dist = Math.max(Math.abs(offs_x), Math.abs(offs_y));
          console.log("dist: "+dist);
          if(dist <= this.BBRD_RECT_SIZE/2) {
            if(document.getElementById("sel_billboard-tool").checked) {
              this._pgpedit_data.billboards.setActiveBillboardObject(billboard);
              this.billboard_grabbed = true;
              this.billboard_grabx = offs_x;
              this.billboard_graby = offs_y;
            }
            else if(document.getElementById("del_billboard-tool").checked) {
              this._pgpedit_data.billboards.delBillboardObject(idx);
            }
            break;
          }
        }
      }
    }
    this.drawBillboards();
  }
  else if(this.edit_mode == this.EditModeEnum.WAYPOINTS) {
    let canvas_h = this.tilemap_canvas.height;
    let rect = this.tilemap_canvas.getBoundingClientRect();
    let mousex = (evt.clientX-rect.left)|0;
    let mousey = (evt.clientY-rect.top)|0;
    if(document.getElementById("add-tool").checked) {
      if(this._pgpedit_data.waypoints.numWaypoints() < this.WP_MAX_NUM) {
        let waypoint = this._pgpedit_data.waypoints.addWaypoint();
        waypoint.x = mousex*2;
        waypoint.y = (canvas_h-mousey)*2;
        waypoint.radius = this.WP_RADIUS;
        waypoint.speed = this.WP_SPEED;
        waypoint.checkpont = true;

        this.waypoint_grabbed = true;
        this.waypoint_grabx = 0;
        this.waypoint_graby = 0;
      }
      else {
        alert("Maximum number of waypoints: "+this.WP_MAX_NUM);
      }
    }
    else {
      if(0 < this._pgpedit_data.waypoints.numWaypoints()) {
        for(let idx = this._pgpedit_data.waypoints.numWaypoints()-1; idx >= 0; idx--) {
          let waypoint = this._pgpedit_data.waypoints.getWaypoint(idx);
          let offs_x = mousex-(waypoint.x/2);
          let offs_y = mousey-(canvas_h-waypoint.y/2);
          let dist_sq = offs_x*offs_x+offs_y*offs_y;
          if(dist_sq <= waypoint.radius*waypoint.radius/4) {
            if(document.getElementById("select-tool").checked) {
              this._pgpedit_data.waypoints.setActiveWaypoint(waypoint);
              this.waypoint_grabbed = true;
              this.waypoint_grabx = offs_x;
              this.waypoint_graby = offs_y;
            }
            else if(document.getElementById("del-tool").checked) {
              this._pgpedit_data.waypoints.delWaypoint(idx);
            }
            break;
          }
        }
      }
    }
    this.drawWaypoints();

    if(this._pgpedit_data.waypoints.numWaypoints() > 0) {
      let waypoint = this._pgpedit_data.waypoints.getActiveWaypoint();
      document.getElementById("radius").value = waypoint.radius;
      document.getElementById("speed").value = waypoint.speed;
      document.getElementById("checkpoint").checked = waypoint.checkpoint;
    }
    else {
      document.getElementById("radius").value = "";
      document.getElementById("speed").value = "";
      document.getElementById("checkpoint").checked = false;
    }
  }
}

PgpEditUI.prototype.setEditMode = function(mode) {
  this.edit_mode = mode;

  console.log("setEditMode("+mode+")");

  this.revertTilemapCanvas();
  if(this.edit_mode == this.EditModeEnum.TILES) {
    this.drawGrid(this.tilemap_canvas.getContext("2d"));
  }
  else if(this.edit_mode == this.EditModeEnum.BILLBOARDS) {
    if(this._pgpedit_data.billboards.numBillboardObjects() > 0) {
      this.drawBillboards();
    }
    this.updateSidepanelBillboardArea();
  }
  else if(this.edit_mode == this.EditModeEnum.WAYPOINTS) {
    if(this._pgpedit_data.waypoints.numWaypoints() > 0) {
      this.drawWaypoints();

      let waypoint = this._pgpedit_data.waypoints.getActiveWaypoint();
      document.getElementById("radius").value = waypoint.radius;
      document.getElementById("speed").value = waypoint.speed;
      document.getElementById("checkpoint").checked = waypoint.checkpoint;
    }
    else {
      document.getElementById("radius").value = "";
      document.getElementById("speed").value = "";
      document.getElementById("checkpoint").checked = false;
    }
  }
}

PgpEditUI.prototype.updateSidepanelBillboardArea = function() {
  console.log("PgpEditUI.updateSidepanelBillboardArea()");

  let canvas = document.getElementById("billboard-canvas");
  let idx = this._pgpedit_data.billboards.getActiveModelIndex();
  let tex = this._pgpedit_data.textures.getTexture(6+idx);
  if(tex != null) {
    let tex_w = tex.image.width;
    let tex_h = tex.image.height;
    canvas.width = tex_w;
    canvas.height = tex_h;
    let ctx = canvas.getContext("2d");
    let billboard_img = ctx.createImageData(tex_w, tex_h);
    for(let idx = 0; idx < tex_w*tex_h; idx++) {
      billboard_img.data[4*idx+0] = tex.image.data[3*idx+0];
      billboard_img.data[4*idx+1] = tex.image.data[3*idx+1];
      billboard_img.data[4*idx+2] = tex.image.data[3*idx+2];
      billboard_img.data[4*idx+3] = 255;
    }
    ctx.putImageData(billboard_img, 0, 0);
  }
  else {
    canvas.width = 32;
    canvas.height = 32;
  }

  document.getElementById("billboard-droplist").selectedIndex = idx;
  let bboard_model = this._pgpedit_data.billboards.getBillboardModel(idx);
  document.getElementById("billboard-color").style.backgroundColor = bboard_model.color;
}

// Draws buffered tilemap on canvas to clear grid etc.
PgpEditUI.prototype.revertTilemapCanvas = function() {
  let ctx = this.tilemap_canvas.getContext("2d");
  ctx.putImageData(this.tilemap_imgdata, 0, 0);
}

PgpEditUI.prototype.drawTile = function(tile_id, map_col, map_row) {
  if(tile_id == this._pgpedit_data.tilemap.getTileId(map_col, map_row)) {
    return;
  }
  this._pgpedit_data.tilemap.setTileId(map_col, map_row, tile_id);

  let map_x = map_col*this.TILE_SIZE;
  let map_y = map_row*this.TILE_SIZE;

  let ctx = this.tilemap_canvas.getContext("2d");
  let image = this.tileset_images[tile_id];
  ctx.putImageData(image, map_x, map_y);

  // Save canvas imagedata before grid is drawn over tiles.
  this.tilemap_imgdata = 
    ctx.getImageData(0, 0, this.tilemap_canvas.width, this.tilemap_canvas.height);
}

PgpEditUI.prototype.drawTileHighlight = function(map_col, map_row) {
  let ctx = this.tilemap_canvas.getContext("2d");
  ctx.fillStyle = this.HIGHLIGHT_COLOR;
  ctx.fillRect(map_col*this.TILE_SIZE, map_row*this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);
}

PgpEditUI.prototype.onPropertyChange = function(evt) {
  console.log("onPropertyChange(): "+evt.target.id);

  if(evt.target.id == "mode-select") {
    let tabcontents = document.getElementsByClassName("tabcontent");
    for(let i = 0; i < tabcontents.length; i++) {
      tabcontents[i].style.display = "none";
    }

    let tabcontent_id = document.getElementById(evt.target.id).value;
    document.getElementById(tabcontent_id).style.display = "block";

    if(tabcontent_id == "tiles-tab") {
      this.setEditMode(this.EditModeEnum.TILES);
    }
    else if(tabcontent_id == "billboards-tab") {
      this.setEditMode(this.EditModeEnum.BILLBOARDS);
    }
    else if(tabcontent_id == "waypoints-tab") {
      this.setEditMode(this.EditModeEnum.WAYPOINTS);
    }
  }
  else if(evt.target.id == "billboard-droplist") {
    let idx = evt.target.selectedIndex;
    this._pgpedit_data.billboards.setActiveModelIndex(idx);
    this.updateSidepanelBillboardArea();
  }
  else if(evt.target.id == "trackname-text") {
    this._pgpedit_data.trackname = document.getElementById(evt.target.id).value;
    console.log("Trackname changed to "+this._pgpedit_data.trackname+".");
  }
  else if(evt.target.id == "author-text") {
    this._pgpedit_data.author = document.getElementById(evt.target.id).value;
    console.log("Author changed to "+this._pgpedit_data.author+".");
  }
  else if(evt.target.id == "loadtex-file") {
    this.onTextureFileChange(evt);
  }
  else if(evt.target.id == "import") {
    this.onImportFileChange(evt);
  }
  else if(evt.target.id == "radius") {
    if(this._pgpedit_data.waypoints.numWaypoints() > 0) {
      let radius = parseInt(document.getElementById(evt.target.id).value);
      if(radius > 1024) {
        radius = 1024;
      }
      else if(radius < 0) {
        radius = 0;
      }
      document.getElementById(evt.target.id).value = radius;
      this._pgpedit_data.waypoints.getActiveWaypoint().radius = radius;

      this.revertTilemapCanvas();
      this.drawWaypoints();
    }
    else {
      document.getElementById(evt.target.id).value = "";
    }
  }
  else if(evt.target.id == "speed") {
    if(this._pgpedit_data.waypoints.numWaypoints() > 0) {
      let speed = parseInt(document.getElementById(evt.target.id).value);
      if(speed > 100) {
        speed = 100;
      }
      else if(speed < 0) {
        speed = 0;
      }
      document.getElementById(evt.target.id).value = speed;
      this._pgpedit_data.waypoints.getActiveWaypoint().speed = speed;

      this.revertTilemapCanvas();
      this.drawWaypoints();
    }
    else {
      document.getElementById(evt.target.id).value = "";
    }
  }
  else if(evt.target.id == "checkpoint") {
    if(this._pgpedit_data.waypoints.numWaypoints() > 0) {
      this._pgpedit_data.waypoints.getActiveWaypoint().checkpoint = 
        document.getElementById(evt.target.id).checked;

      this.revertTilemapCanvas();
      this.drawWaypoints();
    }
    else {
      document.getElementById(evt.target.id).checked = false;
    }
  }
}

PgpEditUI.prototype.onTextureFileChange = function(evt) {
  let fileinput = document.getElementById(evt.target.id);
  let file = fileinput.files[0];
  if (file.type.match("image/*")) {
    let img = new Image();
    img.onload = function(evt) {
      let tex_w = this._pgpedit_data.textures.IMAGE_WIDTH;
      let tex_h = this._pgpedit_data.textures.IMAGE_HEIGHT;
      if(img.width != tex_w || img.height != tex_h) {
        alert("Image size must be "+tex_w+"x"+tex_h+" pixels.");
      }
      else {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        let imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for(let idx = 0; idx < this._pgpedit_data.textures.numTextures(); idx++) {
          let tex = this._pgpedit_data.textures.getTexture(idx);
          let rect = this._texture_rects.get(tex.name);
          this.changeTextureImage(imgdata, rect.x, rect.y, rect.w, rect.h, tex);
        }
        this.createTilesetImages();
        this.updateTilesetImages(this._pgpedit_data.tileset);
        this.drawTileset();
        this.drawActiveTile();
        this.drawTilemap();
        this.drawGrid(this.tilemap_canvas.getContext("2d"));
      }
    }.bind(this);
    img.src = window.URL.createObjectURL(file);
  }
  else {
    alert("Invalid file type. Please choose an image file.");
  }
  fileinput.value = "";
}

PgpEditUI.prototype.changeTextureImage = function(img, sx, sy, w, h, texture) {
  tex_data = [];
  tex_data.length = 3*w*h;

  console.log(img);

  let img_w = img.width;
  for(let y = 0; y < h; y++) {
    for(let x = 0; x < w; x++) {
      tex_data[3*(w*y+x)+0] = img.data[4*(img_w*(sy+y)+sx+x)+0];
      tex_data[3*(w*y+x)+1] = img.data[4*(img_w*(sy+y)+sx+x)+1];
      tex_data[3*(w*y+x)+2] = img.data[4*(img_w*(sy+y)+sx+x)+2];
    }
  }
  texture.image.width = w;
  texture.image.height = h;
  texture.image.data = tex_data;
  if(texture.name.indexOf("sprite") >= 0) {
    this._pgpedit_data.textures.cropRGBImage(texture.image);
  }
}

PgpEditUI.prototype.onImportFileChange = function(evt) {
  let fileinput = document.getElementById(evt.target.id);
  let file = fileinput.files[0];
  if(file.type.match("text/*")) {
    let reader = new FileReader();
    reader.onload = function(evt) {
      this.parseTrack(reader.result);

      document.getElementById("trackname-text").value = this._pgpedit_data.trackname;
      document.getElementById("author-text").value = this._pgpedit_data.author;

      this.drawTilemap();
      this.setEditMode(this.edit_mode);
    }.bind(this);
    reader.readAsText(file);
  }
  else {
    alert("Invalid file type. Please choose a text file.");
  }
  fileinput.value = "";
}

PgpEditUI.prototype.onExportButtonClick = function(evt) {
  let zip = new JSZip();

  let track_str = this.trackToString();
  zip.file("track.txt", this.trackToString());

  let waypoints_str = this.waypointsToString();
  let billboards_str = this.billboardsToString();
  if(waypoints_str.length > 0 || billboards_str.length > 0) {
    zip.file("objects.txt", [waypoints_str, billboards_str].join("\n"));
  }

  for(let idx = 0; idx < this._pgpedit_data.textures.numTextures(); idx++) {
    let dataurl = this._pgpedit_data.textures.textureToDataURL(idx);
    let texname = this._pgpedit_data.textures.getTexture(idx).name;
    zip.file(texname+".bmp", dataurl.split('base64,')[1], {base64: true});
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

/*  // Export single track.txt file
    let data_str = [this.trackToString(), this.waypointsToString(), this.billboardsToString()].join("\n");
    let data = new Blob([data_str], {type: 'text/plain'});

    let link = document.createElement('a');
    link.setAttribute("download", "track.txt");
    link.href = window.URL.createObjectURL(data);
    document.body.appendChild(link);

    let event = new MouseEvent('click');
    link.dispatchEvent(event);

    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
*/
}

PgpEditUI.prototype.onTilesetMouseDown = function(evt) {
  let tileset_cols = (this.tileset_canvas.width/this.TILE_SIZE)|0;
  let coord = this.tileCoordinatesFromMouse(this.tileset_canvas, evt);
  let tile_id = coord.col+coord.row*tileset_cols;
  this._pgpedit_data.tileset.setActiveTileId(tile_id);
  this.drawActiveTile();
}

PgpEditUI.prototype.onTilemapMouseout = function(evt) {
  this.revertTilemapCanvas();
  if(this.edit_mode == this.EditModeEnum.TILES) {
    this.drawGrid(this.tilemap_canvas.getContext("2d"));
  }
  else if(this.edit_mode == this.EditModeEnum.BILLBOARDS) {
    this.drawBillboards();
  }
  else if(this.edit_mode == this.EditModeEnum.WAYPOINTS) {
    this.drawWaypoints();
  }
}

PgpEditUI.prototype.tileCoordinatesFromMouse = function(canvas, evt) {
  let rect = canvas.getBoundingClientRect();
  let mousex = (evt.clientX-rect.left)|0;
  let mousey = (evt.clientY-rect.top)|0;
  return { 
    col: ((mousex/this.TILE_SIZE)|0),
    row: ((mousey/this.TILE_SIZE)|0)
  };
}

PgpEditUI.prototype.drawGrid = function(ctx) {
  let width = ctx.canvas.width;
  let height = ctx.canvas.height;

  ctx.strokeStyle = this.GRID_COLOR;
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);

  ctx.lineWidth = 1;
  for(let y = this.TILE_SIZE; y < height; y += this.TILE_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for(let x = this.TILE_SIZE; x < width; x += this.TILE_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
}

PgpEditUI.prototype.drawTileset = function() {
  let ctx = this.tileset_canvas.getContext("2d");

  let cells = ctx.canvas.width/this.TILE_SIZE;
  for(let idx = 0; idx < this.tileset_images.length; idx++) {
    let x = this.TILE_SIZE*(idx%cells);
    let y = this.TILE_SIZE*((idx/cells)|0);
    ctx.putImageData(this.tileset_images[idx], x, y);
  }

  this.drawGrid(ctx);
}

PgpEditUI.prototype.drawActiveTile = function() {
  let tile_id = this._pgpedit_data.tileset.getActiveTileId();
  let image = this.tileset_images[tile_id];
  this.active_tile_ctx.putImageData(image, 0, 0);
}

PgpEditUI.prototype.drawTilemap = function() {
  let ctx = this.tilemap_canvas.getContext("2d");

  for(let row = 0; row < this._pgpedit_data.tilemap.getHeight(); row++) {
    let map_y = row*this.TILE_SIZE;
    for(let col = 0; col < this._pgpedit_data.tilemap.getWidth(); col++) {
      let map_x = col*this.TILE_SIZE;
      let image = this.tileset_images[this._pgpedit_data.tilemap.getTileId(col, row)];
      ctx.putImageData(image, map_x, map_y);
    }
  }

  this.tilemap_imgdata = 
    ctx.getImageData(0, 0, this.tilemap_canvas.width, this.tilemap_canvas.height);
}

PgpEditUI.prototype.drawBillboards = function() {
  if(this._pgpedit_data.billboards.numBillboardObjects() > 0 ) {
    let canvas_h = this.tilemap_canvas.height;
    let ctx = this.tilemap_canvas.getContext("2d");

    for(let idx = 0; idx < this._pgpedit_data.billboards.numBillboardObjects(); idx++) {
      let billboard = this._pgpedit_data.billboards.getBillboardObject(idx);
      let x = billboard.x/2;
      let y = canvas_h-billboard.y/2;

      ctx.lineWidth = 2;
      ctx.strokeStyle = this._pgpedit_data.billboards.getBillboardModel(billboard.model_index).color;
      ctx.strokeRect(x-this.BBRD_RECT_SIZE/2, y-this.BBRD_RECT_SIZE/2, 
        this.BBRD_RECT_SIZE, this.BBRD_RECT_SIZE);

      if(billboard == this._pgpedit_data.billboards.getActiveBillboardObject()) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(x-this.BBRD_RECT_SIZE/2-3, y-this.BBRD_RECT_SIZE/2-3, 
          this.BBRD_RECT_SIZE+6, this.BBRD_RECT_SIZE+6);
        ctx.setLineDash([]);
      }
    }
  }
}

PgpEditUI.prototype.drawWaypoints = function() {
  if(this._pgpedit_data.waypoints.numWaypoints() > 0 ) {
    let canvas_h = this.tilemap_canvas.height;
    let ctx = this.tilemap_canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.WP_LINE_COLOR;

    let waypoint = this._pgpedit_data.waypoints.getWaypoint(0);
    let prevx = waypoint.x;
    let prevy = waypoint.y;
    for(let idx = 1; idx < this._pgpedit_data.waypoints.numWaypoints(); idx++) {
      waypoint = this._pgpedit_data.waypoints.getWaypoint(idx);
      ctx.setLineDash([(waypoint.speed/5)|0, ((100-waypoint.speed)/5)|0]);
      ctx.beginPath();
      ctx.moveTo(prevx/2, canvas_h-prevy/2);
      ctx.lineTo(waypoint.x/2, canvas_h-waypoint.y/2);
      ctx.stroke();
      ctx.setLineDash([]);
      prevx = waypoint.x;
      prevy = waypoint.y;
    }

    for(let idx = 0; idx < this._pgpedit_data.waypoints.numWaypoints(); idx++) {
      waypoint = this._pgpedit_data.waypoints.getWaypoint(idx);
      let x = waypoint.x/2;
      let y = canvas_h-waypoint.y/2;
      let radius = waypoint.radius/2;

      ctx.lineWidth = 2;
      ctx.strokeStyle = this.WP_RIM_COLOR;
      if(!waypoint.checkpoint) {
        ctx.setLineDash([20, 10]);
      }
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2*Math.PI, false);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.lineWidth = 2;
      ctx.strokeStyle = this.WP_TARGET_COLOR;
      ctx.strokeRect(x-this.WP_TARGET_RECT_SIZE/2, y-this.WP_TARGET_RECT_SIZE/2, 
        this.WP_TARGET_RECT_SIZE, this.WP_TARGET_RECT_SIZE);

      if(waypoint == this._pgpedit_data.waypoints.getActiveWaypoint()) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(x-radius-1, y-radius-1, radius*2+2, radius*2+2);
        ctx.setLineDash([]);
      }
    }
  }
}

PgpEditUI.prototype.parseTrack = function(text) {
  let lines = text.split('\n');
  if(lines.length < this.rows+2) {
    alert("Import failed: too few lines.");
    return;
  }

  let linenum = 0;
  let currline = lines[linenum].trim();
  if(currline[0] != '[') {
    this._pgpedit_data.trackname = lines[0];
    this._pgpedit_data.author = lines[1];
    linenum = this.parseTilemap(lines, 2);
    if(linenum < 2+32) {
      // Error in parsing tilemap
      return;
    }
  }

  this._pgpedit_data.waypoints.clearWaypoints();
  this._pgpedit_data.billboards.clearBillboardObjects();

  while(linenum < lines.length) {
    currline = lines[linenum].trim();
    if(currline.length > 0) {
      if(currline == "[waypoints]") {
        linenum = this.parseWaypoints(lines, linenum+1);
      }
      else if(currline == "[billboards]") {
        linenum = this.parseBillboards(lines, linenum+1);
      }
    }
    linenum++;
  }
}

PgpEditUI.prototype.parseTilemap = function(lines, linenum) {
  console.log("parseTilemap()");
  let map_w = this._pgpedit_data.tilemap.getWidth();
  let map_h = this._pgpedit_data.tilemap.getHeight();
  let data = [];
  data.length = map_w*map_h;

  for(let row = 0; row < map_h; row++) {
    let currline = lines[linenum].trim();
    if(currline.length != map_w) {
      alert("Error on line "+(linenum+1)+": Track definition must have exactly "
        +map_w+" tile symbols on every line.");
      return linenum;
    }

    for(let col=0; col < map_w; col++) {
      let tile_idx = this._pgpedit_data.tileset.tileSymbolToId(currline[col]);
      if(tile_idx < 0) {
        alert("Invalid tile symbol '"+currline[col]+"' on line "+(linenum+1)+".");
        tile_idx = 0;
      }
      data[map_w*row+col] = tile_idx;
    }
    linenum++;
  }

  for(let row = 0; row < map_h; row++) {
    for(let col=0; col < map_w; col++) {
      let tile_idx = data[map_w*row+col];
      this._pgpedit_data.tilemap.setTileId(col, row, tile_idx);
    }
  }
  return linenum;
}

PgpEditUI.prototype.parseWaypoints = function(lines, linenum) {
  console.log("parseWaypoints()");

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
        let waypoint = this._pgpedit_data.waypoints.addWaypoint();
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

  console.log("Imported "+this._pgpedit_data.waypoints.numWaypoints()+" waypoints.");

  return linenum;
}

PgpEditUI.prototype.parseBillboards = function(lines, linenum) {
  console.log("parseBillboards()");

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
        let billboard = this._pgpedit_data.billboards.addBillboardObject();
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

  console.log("Imported "+this._pgpedit_data.billboards.numBillboardObjects()+" billboards.");

  return linenum;
}

PgpEditUI.prototype.trackToString = function() {
  let lines = [this._pgpedit_data.trackname, this._pgpedit_data.author];

  for(let row = 0; row < this._pgpedit_data.tilemap.getHeight(); row++) {
    lines.push("");
    for(let col = 0; col < this._pgpedit_data.tilemap.getWidth(); col++) {
      let tile_id = this._pgpedit_data.tilemap.getTileId(col, row);
      lines[2+row] += this._pgpedit_data.tileset.tileSymbolAt(tile_id);
    }
  }
  return lines.join('\n');
}

PgpEditUI.prototype.waypointsToString = function() {
  let lines = [];
  let num_waypoints = this._pgpedit_data.waypoints.numWaypoints();
  if(num_waypoints > 0) {
    lines.push("[waypoints]");
    for(let idx = 0; idx < num_waypoints; idx++) {
      let waypoint = this._pgpedit_data.waypoints.getWaypoint(idx);
      lines.push(waypoint.x+","+waypoint.y+","+waypoint.radius+","+waypoint.speed+","+(waypoint.checkpoint ? 1 : 0));
    }
  }
  return lines.join('\n');
}

PgpEditUI.prototype.billboardsToString = function() {
  let lines = [];
  let num_bboards = this._pgpedit_data.billboards.numBillboardObjects();
  if(num_bboards > 0) {
    lines.push("[billboards]");
    for(let idx = 0; idx < num_bboards; idx++) {
      let billboard = this._pgpedit_data.billboards.getBillboardObject(idx);
      lines.push(billboard.model_index+","+billboard.x+","+billboard.y);
    }
  }
  return lines.join('\n');
}



let pgpedit_data = new PgpEdit_Data(pgpedit_settings);
let pgpedit_ui = new PgpEditUI(pgpedit_data);
pgpedit_ui.init(pgpedit_settings);


/*
function imageTest() {
  let img = document.getElementById("test-img");
  console.log(img);
  let canvas = document.getElementById("test-canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  let imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function jsonTest() {
  let url = "assets/tileset.json";
  let req = new XMLHttpRequest();
  req.onload = function(evt) {
    pgpedit_ui.init(JSON.parse(this.responseText));
  };
  req.overrideMimeType("text/plain");
  req.open("GET", url);
  //req.open("GET", chrome.extension.getURL(url), true);
  req.send();
}

function urlToPromise(url) {
  return new Promise(function(resolve, reject) {
    JSZipUtils.getBinaryContent(url, function (err, data) {
      if(err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  });
}

PgpEditUI.prototype.dataURLtoBlob = function(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
*/


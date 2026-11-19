/**
 * BUINI studio API
 *
 * 1. Go to https://script.google.com and create a project.
 * 2. Paste this file in as Code.gs, then Save.
 * 3. Deploy > New deployment > Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 4. Copy the web app URL that ends in /exec.
 * 5. In the React project, create .env with:
 *      REACT_APP_API_URL=https://script.google.com/macros/s/XXXX/exec
 * 6. Restart npm start.
 *
 * The first request creates a Google Sheet named "BUINI Flowers CRM"
 * in the Google Drive of the account that deployed the script.
 * Desk login: studio@buini.test / atelier
 * Change those in Script properties ADMIN_EMAIL and ADMIN_PASSWORD.
 *
 * Orders, customers, inventory, inquiries, and subscribers take
 * page and pageSize and return one page: { items, page, pageSize, pages, total }.
 * Redeploy the web app (Deploy > Manage deployments > edit > new version)
 * after changing this file, or the desk keeps the previous version.
 */

var HEADERS = {
  Products: ["id", "slug", "brand", "name", "price", "compareAt", "category", "badge", "description", "additional", "rating", "stock", "featured", "trending", "madeToOrder", "sizes", "colors", "images", "details"],
  Orders: ["id", "createdAt", "email", "firstName", "lastName", "phone", "address", "city", "region", "occasion", "note", "deliveryDate", "shipping", "coupon", "discount", "subtotal", "shippingCost", "total", "status", "itemsJson"],
  Customers: ["email", "firstName", "lastName", "phone", "orders", "spent", "createdAt"],
  Inquiries: ["id", "name", "email", "topic", "message", "createdAt", "status"],
  Subscribers: ["email", "createdAt"],
  Reviews: ["id", "productId", "author", "rating", "title", "body", "createdAt"],
  Coupons: ["code", "type", "amount", "label"]
};

var SOFT = "Blush:#e7b7b0|Ivory:#f3efe6|Sage:#9aab84|Kraft:#c4a574";
var BRIDAL = "Ivory:#f7f4ee|Blush:#e7b7b0|Black:#1c1c1c";
var DRIED = "Kraft:#c4a574|Clay:#c47a5a|Ivory:#f3efe6";
var SIZES = "Petite|Classic|Grand";
var CARE = "Stems are cut the morning they leave the studio. Recut the ends, change the water daily, and keep the bunch out of direct sun.";

function img(id) {
  return "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=1200&q=80";
}

function piece(id, slug, brand, name, price, compareAt, category, badge, stock, flags, description, details, images, colors) {
  return {
    id: id,
    slug: slug,
    brand: brand,
    name: name,
    price: price,
    compareAt: compareAt || "",
    category: category,
    badge: badge || "",
    description: description,
    additional: CARE,
    rating: 5,
    stock: stock,
    featured: flags.indexOf("f") >= 0,
    trending: flags.indexOf("t") >= 0,
    madeToOrder: flags.indexOf("m") >= 0,
    sizes: SIZES,
    colors: colors || SOFT,
    images: images,
    details: details
  };
}

function catalog() {
  return [
    piece("p01", "blush-peony-cloud", "ATELIER", "Blush Peony Cloud", 86, 110, "Bouquets", "SALE", 8, "ft", "A loose cloud of blush peonies, garden roses, and sweet pea, tied with a silk ribbon.", "Hand-tied in the studio|Seasonal peonies when the market allows|Care card in the wrap", img("photo-1525310072745-f49212b5ac6d") + "|" + img("photo-1496062031456-07b8f162a322")),
    piece("p02", "garden-rose-posy", "ATELIER", "Garden Rose Posy", 64, "", "Bouquets", "", 6, "t", "Short garden roses in a tight posy, finished with a soft ribbon and a handwritten tag.", "Compact posy|Ribbon wrap|Best on a bedside table", img("photo-1518895949257-7621c3c786d7") + "|" + img("photo-1567696153798-9111f9cd3d0d")),
    piece("p03", "ivory-ranunculus", "ATELIER", "Ivory Ranunculus Bundle", 72, "", "Bouquets", "", 5, "", "Paper-thin ranunculus in ivory and cream, gathered with a few stems of olive.", "Ivory and cream only|Olive foliage|Wrapped to travel", img("photo-1455659817273-f96807779a8a") + "|" + img("photo-1591886960571-74d43a9d4166")),
    piece("p04", "crimson-dahlia", "ATELIER", "Crimson Dahlia Hand-tie", 78, 96, "Bouquets", "SALE", 4, "ft", "Dinner-plate dahlias in crimson and wine, hand-tied with dark foliage.", "Seasonal dahlias|Rich, low palette|A statement on a long table", img("photo-1463936575829-25148e1db1b8") + "|" + img("photo-1561181286-d3fee7d55364")),
    piece("p05", "meadow-jar", "SEASON", "Meadow Wildflower Jar", 48, "", "Seasonal", "", 10, "f", "A jam jar of whatever the meadow is offering: cosmos, scabiosa, and fine grasses.", "Arranged in a reusable jar|Changes with the week|Includes the jar", img("photo-1490750967868-88aa4486c946") + "|" + img("photo-1444930694458-01bab9af4a51")),
    piece("p06", "sunset-tulips", "SEASON", "Sunset Tulip Bunch", 42, "", "Seasonal", "", 12, "t", "A generous armful of tulips in apricot, blush, and butter yellow.", "Loose bunch|Stems keep growing in the vase|Kraft or blush wrap", img("photo-1520763185298-1b434c919102") + "|" + img("photo-1468327768560-75b778cbb551")),
    piece("p07", "champagne-orchid", "STEM", "Champagne Orchid Spray", 96, "", "Stems", "", 3, "", "A single arching spray of champagne cymbidium, cut long for a tall vase.", "One premium spray|Lasts for weeks|Vase not included", img("photo-1471899236350-e3016bf1e69e") + "|" + img("photo-1455659817273-f96807779a8a")),
    piece("p08", "white-lily-stems", "STEM", "White Lily Stems", 54, "", "Stems", "", 7, "", "Three stems of white oriental lily, buds just opening.", "Three stems|Pinch the pollen to protect linen|Strong evening scent", img("photo-1487070183336-b863922373d4") + "|" + img("photo-1591886960571-74d43a9d4166")),
    piece("p09", "sage-eucalyptus", "STEM", "Sage Eucalyptus Wrap", 38, "", "Stems", "", 9, "", "Seeded eucalyptus and olive, tied for a mantel, a bath, or the neck of a gift.", "Foliage only|Dries beautifully|Long stems", img("photo-1501004318641-b39e6451bec6") + "|" + img("photo-1416879595882-3373a0480b5b")),
    piece("p10", "pampas-cloud", "DRIED", "Dried Pampas Cloud", 68, "", "Dried", "", 6, "ft", "Bleached and natural pampas with bunny tail and a clay ribbon.", "Preserved and dried|Keep away from humidity|No water needed", img("photo-1507290439931-a861b5a38200") + "|" + img("photo-1606041008023-472dfb5e530f"), DRIED),
    piece("p11", "palm-wreath", "DRIED", "Terracotta Palm Wreath", 84, "", "Dried", "", 4, "", "A flat wreath of sun palms, strawflower, and terracotta ribbon.", "Ready to hang|About 35 cm across in Classic|Indoor use", img("photo-1613539246066-78db6ec4ff0f") + "|" + img("photo-1507290439931-a861b5a38200"), DRIED),
    piece("p12", "rose-dome", "DRIED", "Preserved Rose Dome", 120, 145, "Dried", "SALE", 3, "", "Preserved roses under a glass dome, in a color that holds for years.", "Glass dome included|Preserved, not fresh|A kept gift", img("photo-1518895949257-7621c3c786d7") + "|" + img("photo-1561181286-d3fee7d55364"), DRIED),
    piece("p13", "bridal-cascade", "BRIDAL", "Bridal Cascade", 180, 220, "Wedding", "SALE", 5, "fm", "A cascading bridal bunch of garden rose, jasmine, and trailing vine.", "Tied to order|Trial bunch available|Ivory, blush, or black ribbon", img("photo-1519225421980-715cb0215aed") + "|" + img("photo-1526047932273-341f2a7631f9"), BRIDAL),
    piece("p14", "aisle-cluster", "BRIDAL", "Ceremony Aisle Cluster", 96, "", "Wedding", "", 4, "m", "A pew or aisle cluster designed to repeat down a ceremony.", "Priced per cluster|Mechanics included|Palette matched to the bridal bunch", img("photo-1519741497674-611481863552") + "|" + img("photo-1487530811176-3780de880c2d"), BRIDAL),
    piece("p15", "daisy-pail", "SEASON", "Buttercup Daisy Pail", 36, "", "Seasonal", "NEW", 11, "", "Market daisies and buttercup in a small zinc pail.", "Pail included|Cheerful and short|A good first order", img("photo-1490750967868-88aa4486c946") + "|" + img("photo-1462275646964-a0e3386b89fa")),
    piece("p16", "midnight-anemone", "ATELIER", "Midnight Anemone Bouquet", 92, "", "Bouquets", "NEW", 5, "", "Inky anemones with a white eye, black scabiosa, and a dark ribbon.", "Dark palette|Short, sculptural stems|Best in a low bowl", img("photo-1470509037663-253afd7f0f51") + "|" + img("photo-1496062031456-07b8f162a322")),
    piece("p17", "bud-vase-trio", "STEM", "Mini Bud Vase Trio", 44, "", "Stems", "SOLD OUT", 0, "", "Three mismatched glass bud vases, each holding a single stem.", "Three vases included|Stems chosen that morning|A set for a dinner", img("photo-1471899236350-e3016bf1e69e") + "|" + img("photo-1455659817273-f96807779a8a")),
    piece("p18", "kraft-sweetheart", "ATELIER", "Kraft-Wrapped Sweetheart", 52, 64, "Bouquets", "SALE", 8, "", "A sweetheart posy of spray rose and chamomile, wrapped in kraft and twine.", "Small enough to carry|Twine wrap|A note card is tucked in", img("photo-1563241527-3004b7be0ffd") + "|" + img("photo-1487530811176-3780de880c2d")),
    piece("p19", "olive-rose", "BRIDAL", "Olive & Rose Compact", 110, "", "Wedding", "", 4, "m", "A compact bridal posy of cream rose and silver olive.", "Round posy|Bound handle|Trial available in the studio", img("photo-1526047932273-341f2a7631f9") + "|" + img("photo-1519225421980-715cb0215aed"), BRIDAL),
    piece("p20", "winter-whites", "SEASON", "Winter White Dome", 74, "", "Seasonal", "NEW", 6, "f", "Hellebore, paperwhite, and silver brunia in a low white dome.", "Low and wide|Scented paperwhite|Winter palette", img("photo-1591886960571-74d43a9d4166") + "|" + img("photo-1572454591674-2739f30d8c40")),
    piece("p21", "studio-rose", "STEM", "Studio Rose, Single Stem", 18, "", "Stems", "", 15, "", "One garden rose, chosen for the head and the scent.", "A single stem|Wrapped in tissue|Ask for a trio in the note", img("photo-1518895949257-7621c3c786d7") + "|" + img("photo-1561181286-d3fee7d55364"))
  ];
}

function doGet(e) {
  return respond(e && e.parameter ? e.parameter : {});
}

function doPost(e) {
  var params = {};
  if (e && e.postData && e.postData.contents) {
    try {
      params = JSON.parse(e.postData.contents);
    } catch (err) {
      params = {};
    }
  }
  return respond(params);
}

function respond(params) {
  try {
    var extra = {};
    if (params.payload) extra = JSON.parse(params.payload);
    var action = String(params.action || extra.action || "products");
    var data = handle(action, Object.assign({}, params, extra));
    return json({ ok: true, data: data });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function book() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty("SHEET_ID");
  if (id) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (err) {
      props.deleteProperty("SHEET_ID");
    }
  }
  var created = SpreadsheetApp.create("BUINI Flowers CRM");
  props.setProperty("SHEET_ID", created.getId());
  return created;
}

function ensure() {
  var ss = book();
  Object.keys(HEADERS).forEach(function (name) {
    if (!ss.getSheetByName(name)) {
      var sheet = ss.insertSheet(name);
      sheet.appendRow(HEADERS[name]);
    }
  });
  var products = ss.getSheetByName("Products");
  if (products.getLastRow() < 2) seed(ss);
  var def = ss.getSheetByName("Sheet1");
  if (def && ss.getSheets().length > 1) ss.deleteSheet(def);
  return ss;
}

function writeSheet(ss, name, objects) {
  var sheet = ss.getSheetByName(name);
  var headers = HEADERS[name];
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  if (!objects.length) return;
  var values = objects.map(function (obj) {
    return headers.map(function (header) {
      var value = obj[header];
      return value === undefined || value === null ? "" : value;
    });
  });
  sheet.getRange(sheet.getLastRow() + 1, 1, values.length, headers.length).setValues(values);
}

function seed(ss) {
  writeSheet(ss, "Products", catalog());
  writeSheet(ss, "Coupons", [
    { code: "BLOOM10", type: "percent", amount: 10, label: "10% off the first studio order" },
    { code: "STUDIO20", type: "percent", amount: 20, label: "20% studio courtesy" },
    { code: "WELCOME15", type: "amount", amount: 15, label: "$15 off" }
  ]);
  writeSheet(ss, "Reviews", [
    { id: "r1", productId: "p01", author: "Mira C.", rating: 5, title: "Soft and full", body: "It looked exactly like the photograph and lasted six days on the dining table.", createdAt: "2026-11-02" },
    { id: "r2", productId: "p01", author: "Elena V.", rating: 5, title: "The blush was true", body: "The whole bunch sat in that blush. Beautifully tied.", createdAt: "2026-10-28" },
    { id: "r3", productId: "p04", author: "Jonah A.", rating: 5, title: "Dark and generous", body: "The dahlias were huge. It made a small room feel dressed for dinner.", createdAt: "2026-10-18" },
    { id: "r4", productId: "p06", author: "Priya S.", rating: 5, title: "Still opening on day four", body: "The tulips arrived closed and performed all week.", createdAt: "2026-11-08" },
    { id: "r5", productId: "p10", author: "Nima T.", rating: 4, title: "Stays put", body: "The pampas is full without shedding everywhere.", createdAt: "2026-09-30" },
    { id: "r6", productId: "p13", author: "Mira C.", rating: 5, title: "Held together all evening", body: "The cascade survived hugs, photos, and a warm room.", createdAt: "2026-11-16" },
    { id: "r7", productId: "p21", author: "Elena V.", rating: 5, title: "Just one perfect rose", body: "Exactly what I wanted for a birthday note.", createdAt: "2026-11-11" },
    { id: "r8", productId: "p20", author: "Anika S.", rating: 5, title: "Quiet winter whites", body: "Low enough for the table and scented without taking over.", createdAt: "2026-11-14" }
  ]);
  writeSheet(ss, "Customers", [
    { email: "mira@buini.test", firstName: "Mira", lastName: "Chen", phone: "+977 980-100-0001", orders: 1, spent: 174, createdAt: "2026-11-16T10:30:00.000Z" },
    { email: "elena@buini.test", firstName: "Elena", lastName: "Voss", phone: "+977 980-100-0002", orders: 1, spent: 140, createdAt: "2026-11-18T08:10:00.000Z" },
    { email: "jonah@buini.test", firstName: "Jonah", lastName: "Adeyemi", phone: "+977 980-100-0003", orders: 1, spent: 68, createdAt: "2026-11-19T04:40:00.000Z" }
  ]);
  writeSheet(ss, "Orders", [
    orderSeed("BF-1042", "2026-11-16T10:30:00.000Z", "mira@buini.test", "Mira", "Chen", "+977 980-100-0001", "12 Lazimpat Marg", "Anniversary", "Please leave it with the doorman.", "2026-11-17", "flat", "BLOOM10", 18, 180, 12, 174, "Delivered", [{ productId: "p13", slug: "bridal-cascade", name: "Bridal Cascade", brand: "BRIDAL", size: "Classic", color: "Ivory", unitPrice: 180, qty: 1, image: img("photo-1519225421980-715cb0215aed") }]),
    orderSeed("BF-1038", "2026-11-18T08:10:00.000Z", "elena@buini.test", "Elena", "Voss", "+977 980-100-0002", "4 Sanepa Lane", "Birthday", "No lilies, please.", "2026-11-19", "flat", "", 0, 128, 12, 140, "Processing", [{ productId: "p01", slug: "blush-peony-cloud", name: "Blush Peony Cloud", brand: "ATELIER", size: "Classic", color: "Blush", unitPrice: 86, qty: 1, image: img("photo-1525310072745-f49212b5ac6d") }, { productId: "p06", slug: "sunset-tulips", name: "Sunset Tulip Bunch", brand: "SEASON", size: "Classic", color: "Kraft", unitPrice: 42, qty: 1, image: img("photo-1520763185298-1b434c919102") }]),
    orderSeed("BF-1033", "2026-11-19T04:40:00.000Z", "jonah@buini.test", "Jonah", "Adeyemi", "+977 980-100-0003", "Thamel Marg", "Thank you", "I will collect this after 4pm.", "2026-11-20", "pickup", "", 0, 68, 0, 68, "New", [{ productId: "p10", slug: "pampas-cloud", name: "Dried Pampas Cloud", brand: "DRIED", size: "Classic", color: "Kraft", unitPrice: 68, qty: 1, image: img("photo-1507290439931-a861b5a38200") }])
  ]);
  writeSheet(ss, "Inquiries", [
    { id: "i1", name: "Anika Sherpa", email: "anika@example.com", topic: "Wedding", message: "We need a ceremony arch and eight aisle clusters for 14 June in Patan. Soft ivory and dried grasses.", createdAt: "2026-11-15T09:00:00.000Z", status: "New" },
    { id: "i2", name: "The Courtyard", email: "kitchen@example.com", topic: "Wholesale", message: "Can the studio deliver a Monday table arrangement for twenty covers?", createdAt: "2026-11-10T06:20:00.000Z", status: "Replied" }
  ]);
  writeSheet(ss, "Subscribers", [
    { email: "mira@buini.test", createdAt: "2026-10-02T00:00:00.000Z" },
    { email: "elena@buini.test", createdAt: "2026-10-18T00:00:00.000Z" },
    { email: "nima@example.com", createdAt: "2026-11-01T00:00:00.000Z" },
    { email: "priya@example.com", createdAt: "2026-11-12T00:00:00.000Z" }
  ]);
}

function orderSeed(id, createdAt, email, firstName, lastName, phone, address, occasion, note, deliveryDate, shipping, coupon, discount, subtotal, shippingCost, total, status, items) {
  return {
    id: id,
    createdAt: createdAt,
    email: email,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    address: address,
    city: "Kathmandu",
    region: "Bagmati",
    occasion: occasion,
    note: note,
    deliveryDate: deliveryDate,
    shipping: shipping,
    coupon: coupon,
    discount: discount,
    subtotal: subtotal,
    shippingCost: shippingCost,
    total: total,
    status: status,
    itemsJson: JSON.stringify(items)
  };
}

function table(name) {
  var sheet = ensure().getSheetByName(name);
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0];
  return values.slice(1).filter(function (row) {
    return row[0] !== "" && row[0] !== null;
  }).map(function (row) {
    var obj = {};
    headers.forEach(function (header, index) { obj[header] = row[index]; });
    return obj;
  });
}

function append(name, obj) {
  var sheet = ensure().getSheetByName(name);
  var headers = HEADERS[name];
  sheet.appendRow(headers.map(function (header) {
    var value = obj[header];
    return value === undefined || value === null ? "" : value;
  }));
}

function updateRow(name, key, id, updates) {
  var sheet = ensure().getSheetByName(name);
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var idCol = headers.indexOf(key);
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][idCol]) === String(id)) {
      Object.keys(updates).forEach(function (field) {
        var col = headers.indexOf(field);
        if (col >= 0) sheet.getRange(r + 1, col + 1).setValue(updates[field]);
      });
      return;
    }
  }
  throw new Error("Record not found.");
}

function truthy(value) {
  return value === true || value === "TRUE" || value === "true";
}

function pipes(value) {
  return String(value || "").split("|").filter(function (part) { return part; });
}

function mapProduct(row) {
  var stock = Number(row.stock) || 0;
  return {
    id: String(row.id),
    slug: String(row.slug),
    brand: row.brand,
    name: row.name,
    price: Number(row.price) || 0,
    compareAt: row.compareAt === "" || row.compareAt === null ? null : Number(row.compareAt),
    category: row.category,
    badge: stock === 0 ? "SOLD OUT" : (row.badge || ""),
    description: row.description,
    additional: row.additional,
    rating: Number(row.rating) || 0,
    stock: stock,
    featured: truthy(row.featured),
    trending: truthy(row.trending),
    madeToOrder: truthy(row.madeToOrder),
    sizes: pipes(row.sizes),
    colors: pipes(row.colors).map(function (pair) {
      var bits = String(pair).split(":");
      return { name: bits[0], hex: bits[1] || "#dddddd" };
    }),
    images: pipes(row.images),
    details: pipes(row.details)
  };
}

function mapOrder(row) {
  var items = [];
  try { items = JSON.parse(row.itemsJson || "[]"); } catch (err) { items = []; }
  return {
    id: String(row.id),
    createdAt: row.createdAt,
    email: String(row.email || "").toLowerCase(),
    firstName: row.firstName,
    lastName: row.lastName,
    phone: row.phone,
    address: row.address,
    city: row.city,
    region: row.region,
    occasion: row.occasion,
    note: row.note,
    deliveryDate: row.deliveryDate,
    shipping: row.shipping,
    coupon: row.coupon || "",
    discount: Number(row.discount) || 0,
    subtotal: Number(row.subtotal) || 0,
    shippingCost: Number(row.shippingCost) || 0,
    total: Number(row.total) || 0,
    status: row.status,
    items: items
  };
}

function reviewsFor(productId) {
  return table("Reviews").filter(function (row) {
    return String(row.productId) === String(productId);
  }).map(function (row) {
    return {
      id: String(row.id),
      productId: String(row.productId),
      author: row.author,
      rating: Number(row.rating) || 0,
      title: row.title,
      body: row.body,
      createdAt: row.createdAt
    };
  });
}

function round2(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function sizedPrice(price, size) {
  var factor = size === "Petite" ? 0.8 : size === "Grand" ? 1.35 : 1;
  return Math.round(Number(price) * factor);
}

function assertAdmin(token) {
  if (!token || CacheService.getScriptCache().get("tok_" + token) !== "1") {
    throw new Error("Please sign in to the studio desk again.");
  }
}

function newestOrders() {
  return table("Orders").map(mapOrder).reverse();
}

function clampPageSize(value) {
  var size = Math.floor(Number(value) || 8);
  if (size < 1) size = 8;
  if (size > 50) size = 50;
  return size;
}

function pageWindow(total, page, pageSize, newestFirst, lastRow) {
  var pages = Math.max(1, Math.ceil(total / pageSize));
  var safe = Math.min(Math.max(1, Math.floor(Number(page) || 1)), pages);
  if (!total) return { page: 1, pages: 1, startRow: 2, endRow: 1 };
  var startRow;
  var endRow;
  if (newestFirst) {
    endRow = lastRow - (safe - 1) * pageSize;
    startRow = Math.max(2, endRow - pageSize + 1);
  } else {
    startRow = 2 + (safe - 1) * pageSize;
    endRow = Math.min(lastRow, startRow + pageSize - 1);
  }
  return { page: safe, pages: pages, startRow: startRow, endRow: endRow };
}

function readObjects(sheet, startRow, endRow) {
  if (endRow < startRow) return [];
  var width = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0];
  var values = sheet.getRange(startRow, 1, endRow - startRow + 1, width).getValues();
  return values.filter(function (row) {
    return row[0] !== "" && row[0] !== null;
  }).map(function (row) {
    var obj = {};
    headers.forEach(function (header, index) { obj[header] = row[index]; });
    return obj;
  });
}

function pagedSheet(name, payload, mapRow, newestFirst) {
  var sheet = ensure().getSheetByName(name);
  var lastRow = sheet.getLastRow();
  var total = Math.max(0, lastRow - 1);
  var pageSize = clampPageSize(payload.pageSize);
  var span = pageWindow(total, payload.page, pageSize, newestFirst, lastRow);
  var rows = readObjects(sheet, span.startRow, span.endRow);
  if (newestFirst) rows.reverse();
  return {
    items: rows.map(mapRow),
    page: span.page,
    pageSize: pageSize,
    pages: span.pages,
    total: total
  };
}

function columnValues(sheet, header) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  var col = headers.indexOf(header);
  if (col < 0) return [];
  return sheet.getRange(2, col + 1, lastRow - 1, 1).getValues();
}

function handle(action, payload) {
  if (action === "products") {
    return table("Products").map(mapProduct);
  }
  if (action === "product") {
    var found = table("Products").map(mapProduct).filter(function (product) {
      return product.slug === payload.slug || product.id === payload.id;
    })[0];
    if (!found) throw new Error("That piece is no longer in the studio.");
    found.reviews = reviewsFor(found.id);
    return found;
  }
  if (action === "coupon") {
    var code = String(payload.code || "").trim().toUpperCase();
    var coupon = table("Coupons").filter(function (row) { return String(row.code).toUpperCase() === code; })[0];
    if (!coupon) throw new Error("That code is not recognized.");
    var subtotal = Number(payload.subtotal) || 0;
    var discount = String(coupon.type) === "percent" ? round2(subtotal * (Number(coupon.amount) / 100)) : Math.min(subtotal, Number(coupon.amount) || 0);
    return { code: String(coupon.code).toUpperCase(), type: coupon.type, amount: Number(coupon.amount), label: coupon.label, discount: discount };
  }
  if (action === "subscribe") {
    var email = String(payload.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email.");
    var exists = table("Subscribers").some(function (row) { return String(row.email).toLowerCase() === email; });
    if (!exists) append("Subscribers", { email: email, createdAt: new Date().toISOString() });
    return { ok: true };
  }
  if (action === "inquiry") {
    var name = String(payload.name || "").trim();
    var mail = String(payload.email || "").trim();
    var message = String(payload.message || "").trim();
    if (!name || !mail || !message) throw new Error("Name, email, and a note are required.");
    var inquiry = { id: "i" + new Date().getTime(), name: name, email: mail, topic: payload.topic || "General", message: message, createdAt: new Date().toISOString(), status: "New" };
    append("Inquiries", inquiry);
    return inquiry;
  }
  if (action === "order") return placeOrder(payload);
  if (action === "login") {
    var adminEmail = PropertiesService.getScriptProperties().getProperty("ADMIN_EMAIL") || "admin@buini.com";
    var adminPass = PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD") || "buiniFlowers@3000";
    if (String(payload.email || "").trim().toLowerCase() === adminEmail && String(payload.password || "") === adminPass) {
      var token = Utilities.getUuid();
      CacheService.getScriptCache().put("tok_" + token, "1", 21600);
      return { token: token, name: "Studio", email: adminEmail };
    }
    throw new Error("Those studio details do not match.");
  }
  if (action === "dashboard") {
    assertAdmin(payload.token);
    var ss = ensure();
    var orderSheet = ss.getSheetByName("Orders");
    var orderCount = Math.max(0, orderSheet.getLastRow() - 1);
    var revenue = 0;
    var openOrders = 0;
    if (orderCount) {
      var totals = columnValues(orderSheet, "total");
      var statuses = columnValues(orderSheet, "status");
      for (var i = 0; i < orderCount; i++) {
        var status = statuses[i] ? statuses[i][0] : "";
        if (status !== "Cancelled") revenue += Number(totals[i] ? totals[i][0] : 0) || 0;
        if (status !== "Delivered" && status !== "Cancelled") openOrders++;
      }
    }
    var inquiryStatuses = columnValues(ss.getSheetByName("Inquiries"), "status");
    var products = table("Products").map(mapProduct);
    return {
      revenue: round2(revenue),
      orders: orderCount,
      openOrders: openOrders,
      inquiries: inquiryStatuses.filter(function (row) { return row[0] === "New"; }).length,
      subscribers: Math.max(0, ss.getSheetByName("Subscribers").getLastRow() - 1),
      customers: Math.max(0, ss.getSheetByName("Customers").getLastRow() - 1),
      lowStock: products.filter(function (product) { return product.stock <= 3; }),
      recent: pagedSheet("Orders", { page: 1, pageSize: 5 }, mapOrder, true).items,
      mode: "sheet",
      sheetUrl: ss.getUrl()
    };
  }
  if (action === "orders") {
    assertAdmin(payload.token);
    return pagedSheet("Orders", payload, mapOrder, true);
  }
  if (action === "orderUpdate") {
    assertAdmin(payload.token);
    updateRow("Orders", "id", payload.id, { status: payload.status });
    return { id: payload.id, status: payload.status };
  }
  if (action === "customers") {
    assertAdmin(payload.token);
    return pagedSheet("Customers", payload, function (row) {
      return { email: String(row.email).toLowerCase(), firstName: row.firstName, lastName: row.lastName, phone: row.phone, orders: Number(row.orders) || 0, spent: Number(row.spent) || 0, createdAt: row.createdAt };
    }, false);
  }
  if (action === "inventory") {
    assertAdmin(payload.token);
    return pagedSheet("Products", payload, mapProduct, false);
  }
  if (action === "stock") {
    assertAdmin(payload.token);
    var next = Math.max(0, Number(payload.stock) || 0);
    var current = table("Products").filter(function (row) { return String(row.id) === String(payload.id); })[0];
    if (!current) throw new Error("Record not found.");
    var badge = current.badge || "";
    if (next === 0) badge = "SOLD OUT";
    else if (String(badge) === "SOLD OUT") badge = current.compareAt ? "SALE" : "";
    updateRow("Products", "id", payload.id, { stock: next, badge: badge });
    return { id: payload.id, stock: next };
  }
  if (action === "inquiries") {
    assertAdmin(payload.token);
    return pagedSheet("Inquiries", payload, function (row) {
      return { id: String(row.id), name: row.name, email: row.email, topic: row.topic, message: row.message, createdAt: row.createdAt, status: row.status };
    }, true);
  }
  if (action === "inquiryUpdate") {
    assertAdmin(payload.token);
    updateRow("Inquiries", "id", payload.id, { status: payload.status });
    return { id: payload.id, status: payload.status };
  }
  if (action === "subscribers") {
    assertAdmin(payload.token);
    return pagedSheet("Subscribers", payload, function (row) {
      return { email: String(row.email).toLowerCase(), createdAt: row.createdAt };
    }, false);
  }
  if (action === "account") {
    var who = String(payload.email || "").trim().toLowerCase();
    return newestOrders().filter(function (order) { return order.email === who; });
  }
  throw new Error("Unknown request.");
}

function placeOrder(payload) {
  var items = payload.items || [];
  if (!items.length) throw new Error("Your basket is empty.");
  var email = String(payload.email || "").trim().toLowerCase();
  if (!email || !payload.firstName || !payload.address) throw new Error("Name, email, and address are required.");
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var products = table("Products");
    var byId = {};
    products.forEach(function (row) { byId[String(row.id)] = row; });
    var need = {};
    var priced = items.map(function (item) {
      var row = byId[String(item.productId)];
      if (!row) throw new Error(item.name + " is no longer in the studio.");
      var qty = Math.max(1, Number(item.qty) || 1);
      need[String(item.productId)] = (need[String(item.productId)] || 0) + qty;
      return {
        productId: String(item.productId),
        slug: row.slug,
        name: row.name,
        brand: row.brand,
        size: item.size || "Classic",
        color: item.color || "",
        unitPrice: sizedPrice(row.price, item.size || "Classic"),
        qty: qty,
        image: pipes(row.images)[0] || ""
      };
    });
    Object.keys(need).forEach(function (id) {
      var row = byId[id];
      if ((Number(row.stock) || 0) < need[id]) throw new Error(row.name + " does not have enough stems left.");
    });
    Object.keys(need).forEach(function (id) {
      var row = byId[id];
      var left = (Number(row.stock) || 0) - need[id];
      updateRow("Products", "id", id, { stock: left, badge: left === 0 ? "SOLD OUT" : row.badge });
    });
    var subtotal = round2(priced.reduce(function (sum, item) { return sum + item.unitPrice * item.qty; }, 0));
    var couponCode = String(payload.coupon || "").trim().toUpperCase();
    var discount = 0;
    if (couponCode) {
      var coupon = table("Coupons").filter(function (row) { return String(row.code).toUpperCase() === couponCode; })[0];
      if (coupon) {
        discount = String(coupon.type) === "percent" ? round2(subtotal * (Number(coupon.amount) / 100)) : Math.min(subtotal, Number(coupon.amount) || 0);
      } else {
        couponCode = "";
      }
    }
    var shippingCost = payload.shipping === "pickup" ? 0 : 12;
    var total = round2(Math.max(0, subtotal - discount) + shippingCost);
    var orderSheet = ensure().getSheetByName("Orders");
    var orderIds = columnValues(orderSheet, "id");
    var maxId = orderIds.reduce(function (max, row) {
      var num = Number(String(row[0]).replace(/\D/g, ""));
      return Math.max(max, isNaN(num) ? 0 : num);
    }, 1042);
    var order = {
      id: "BF-" + (maxId + 1),
      createdAt: new Date().toISOString(),
      email: email,
      firstName: payload.firstName,
      lastName: payload.lastName || "",
      phone: payload.phone || "",
      address: payload.address,
      city: payload.city || "",
      region: payload.region || "",
      occasion: payload.occasion || "",
      note: payload.note || "",
      deliveryDate: payload.deliveryDate || "",
      shipping: payload.shipping === "pickup" ? "pickup" : "flat",
      coupon: couponCode,
      discount: discount,
      subtotal: subtotal,
      shippingCost: shippingCost,
      total: total,
      status: "New",
      items: priced
    };
    append("Orders", Object.assign({}, order, { itemsJson: JSON.stringify(priced) }));
    delete order.itemsJson;
    var customers = table("Customers");
    var customer = customers.filter(function (row) { return String(row.email).toLowerCase() === email; })[0];
    if (customer) {
      updateRow("Customers", "email", email, {
        firstName: order.firstName,
        lastName: order.lastName,
        phone: order.phone,
        orders: (Number(customer.orders) || 0) + 1,
        spent: round2((Number(customer.spent) || 0) + total)
      });
    } else {
      append("Customers", { email: email, firstName: order.firstName, lastName: order.lastName, phone: order.phone, orders: 1, spent: total, createdAt: order.createdAt });
    }
    return order;
  } finally {
    lock.releaseLock();
  }
}

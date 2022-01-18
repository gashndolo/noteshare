["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/dom/vendor.js"],"~:js","goog.provide(\"goog.dom.vendor\");\ngoog.require(\"goog.string\");\ngoog.require(\"goog.userAgent\");\ngoog.dom.vendor.getVendorJsPrefix = function() {\n  if (goog.userAgent.WEBKIT) {\n    return \"Webkit\";\n  } else {\n    if (goog.userAgent.GECKO) {\n      return \"Moz\";\n    } else {\n      if (goog.userAgent.IE) {\n        return \"ms\";\n      } else {\n        if (goog.userAgent.OPERA) {\n          return \"O\";\n        }\n      }\n    }\n  }\n  return null;\n};\ngoog.dom.vendor.getVendorPrefix = function() {\n  if (goog.userAgent.WEBKIT) {\n    return \"-webkit\";\n  } else {\n    if (goog.userAgent.GECKO) {\n      return \"-moz\";\n    } else {\n      if (goog.userAgent.IE) {\n        return \"-ms\";\n      } else {\n        if (goog.userAgent.OPERA) {\n          return \"-o\";\n        }\n      }\n    }\n  }\n  return null;\n};\ngoog.dom.vendor.getPrefixedPropertyName = function(propertyName, opt_object) {\n  if (opt_object && propertyName in opt_object) {\n    return propertyName;\n  }\n  var prefix = goog.dom.vendor.getVendorJsPrefix();\n  if (prefix) {\n    prefix = prefix.toLowerCase();\n    var prefixedPropertyName = prefix + goog.string.toTitleCase(propertyName);\n    return opt_object === undefined || prefixedPropertyName in opt_object ? prefixedPropertyName : null;\n  }\n  return null;\n};\ngoog.dom.vendor.getPrefixedEventType = function(eventType) {\n  var prefix = goog.dom.vendor.getVendorJsPrefix() || \"\";\n  return (prefix + eventType).toLowerCase();\n};\n","~:source","// Copyright 2012 The Closure Library Authors. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS-IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\n/**\n * @fileoverview Vendor prefix getters.\n */\n\ngoog.provide('goog.dom.vendor');\n\ngoog.require('goog.string');\ngoog.require('goog.userAgent');\n\n\n/**\n * Returns the JS vendor prefix used in CSS properties. Different vendors\n * use different methods of changing the case of the property names.\n *\n * @return {?string} The JS vendor prefix or null if there is none.\n */\ngoog.dom.vendor.getVendorJsPrefix = function() {\n  if (goog.userAgent.WEBKIT) {\n    return 'Webkit';\n  } else if (goog.userAgent.GECKO) {\n    return 'Moz';\n  } else if (goog.userAgent.IE) {\n    return 'ms';\n  } else if (goog.userAgent.OPERA) {\n    return 'O';\n  }\n\n  return null;\n};\n\n\n/**\n * Returns the vendor prefix used in CSS properties.\n *\n * @return {?string} The vendor prefix or null if there is none.\n */\ngoog.dom.vendor.getVendorPrefix = function() {\n  if (goog.userAgent.WEBKIT) {\n    return '-webkit';\n  } else if (goog.userAgent.GECKO) {\n    return '-moz';\n  } else if (goog.userAgent.IE) {\n    return '-ms';\n  } else if (goog.userAgent.OPERA) {\n    return '-o';\n  }\n\n  return null;\n};\n\n\n/**\n * @param {string} propertyName A property name.\n * @param {!Object=} opt_object If provided, we verify if the property exists in\n *     the object.\n * @return {?string} A vendor prefixed property name, or null if it does not\n *     exist.\n */\ngoog.dom.vendor.getPrefixedPropertyName = function(propertyName, opt_object) {\n  // We first check for a non-prefixed property, if available.\n  if (opt_object && propertyName in opt_object) {\n    return propertyName;\n  }\n  var prefix = goog.dom.vendor.getVendorJsPrefix();\n  if (prefix) {\n    prefix = prefix.toLowerCase();\n    var prefixedPropertyName = prefix + goog.string.toTitleCase(propertyName);\n    return (opt_object === undefined || prefixedPropertyName in opt_object) ?\n        prefixedPropertyName :\n        null;\n  }\n  return null;\n};\n\n\n/**\n * @param {string} eventType An event type.\n * @return {string} A lower-cased vendor prefixed event type.\n */\ngoog.dom.vendor.getPrefixedEventType = function(eventType) {\n  var prefix = goog.dom.vendor.getVendorJsPrefix() || '';\n  return (prefix + eventType).toLowerCase();\n};\n","~:compiled-at",1637169376522,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.dom.vendor.js\",\n\"lineCount\":56,\n\"mappings\":\"AAkBAA,IAAA,CAAKC,OAAL,CAAa,iBAAb,CAAA;AAEAD,IAAA,CAAKE,OAAL,CAAa,aAAb,CAAA;AACAF,IAAA,CAAKE,OAAL,CAAa,gBAAb,CAAA;AASAF,IAAA,CAAKG,GAAL,CAASC,MAAT,CAAgBC,iBAAhB,GAAoCC,QAAQ,EAAG;AAC7C,MAAIN,IAAJ,CAASO,SAAT,CAAmBC,MAAnB;AACE,WAAO,QAAP;AADF;AAEO,QAAIR,IAAJ,CAASO,SAAT,CAAmBE,KAAnB;AACL,aAAO,KAAP;AADK;AAEA,UAAIT,IAAJ,CAASO,SAAT,CAAmBG,EAAnB;AACL,eAAO,IAAP;AADK;AAEA,YAAIV,IAAJ,CAASO,SAAT,CAAmBI,KAAnB;AACL,iBAAO,GAAP;AADK;AAFA;AAFA;AAFP;AAUA,SAAO,IAAP;AAX6C,CAA/C;AAoBAX,IAAA,CAAKG,GAAL,CAASC,MAAT,CAAgBQ,eAAhB,GAAkCC,QAAQ,EAAG;AAC3C,MAAIb,IAAJ,CAASO,SAAT,CAAmBC,MAAnB;AACE,WAAO,SAAP;AADF;AAEO,QAAIR,IAAJ,CAASO,SAAT,CAAmBE,KAAnB;AACL,aAAO,MAAP;AADK;AAEA,UAAIT,IAAJ,CAASO,SAAT,CAAmBG,EAAnB;AACL,eAAO,KAAP;AADK;AAEA,YAAIV,IAAJ,CAASO,SAAT,CAAmBI,KAAnB;AACL,iBAAO,IAAP;AADK;AAFA;AAFA;AAFP;AAUA,SAAO,IAAP;AAX2C,CAA7C;AAsBAX,IAAA,CAAKG,GAAL,CAASC,MAAT,CAAgBU,uBAAhB,GAA0CC,QAAQ,CAACC,YAAD,EAAeC,UAAf,CAA2B;AAE3E,MAAIA,UAAJ,IAAkBD,YAAlB,IAAkCC,UAAlC;AACE,WAAOD,YAAP;AADF;AAGA,MAAIE,SAASlB,IAAA,CAAKG,GAAL,CAASC,MAAT,CAAgBC,iBAAhB,EAAb;AACA,MAAIa,MAAJ,CAAY;AACVA,UAAA,GAASA,MAAA,CAAOC,WAAP,EAAT;AACA,QAAIC,uBAAuBF,MAAvBE,GAAgCpB,IAAA,CAAKqB,MAAL,CAAYC,WAAZ,CAAwBN,YAAxB,CAApC;AACA,WAAQC,UAAD,KAAgBM,SAAhB,IAA6BH,oBAA7B,IAAqDH,UAArD,GACHG,oBADG,GAEH,IAFJ;AAHU;AAOZ,SAAO,IAAP;AAb2E,CAA7E;AAqBApB,IAAA,CAAKG,GAAL,CAASC,MAAT,CAAgBoB,oBAAhB,GAAuCC,QAAQ,CAACC,SAAD,CAAY;AACzD,MAAIR,SAASlB,IAAA,CAAKG,GAAL,CAASC,MAAT,CAAgBC,iBAAhB,EAATa,IAAgD,EAApD;AACA,SAAO,CAACA,MAAD,GAAUQ,SAAV,EAAqBP,WAArB,EAAP;AAFyD,CAA3D;;\",\n\"sources\":[\"goog/dom/vendor.js\"],\n\"sourcesContent\":[\"// Copyright 2012 The Closure Library Authors. All Rights Reserved.\\n//\\n// Licensed under the Apache License, Version 2.0 (the \\\"License\\\");\\n// you may not use this file except in compliance with the License.\\n// You may obtain a copy of the License at\\n//\\n//      http://www.apache.org/licenses/LICENSE-2.0\\n//\\n// Unless required by applicable law or agreed to in writing, software\\n// distributed under the License is distributed on an \\\"AS-IS\\\" BASIS,\\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\\n// See the License for the specific language governing permissions and\\n// limitations under the License.\\n\\n/**\\n * @fileoverview Vendor prefix getters.\\n */\\n\\ngoog.provide('goog.dom.vendor');\\n\\ngoog.require('goog.string');\\ngoog.require('goog.userAgent');\\n\\n\\n/**\\n * Returns the JS vendor prefix used in CSS properties. Different vendors\\n * use different methods of changing the case of the property names.\\n *\\n * @return {?string} The JS vendor prefix or null if there is none.\\n */\\ngoog.dom.vendor.getVendorJsPrefix = function() {\\n  if (goog.userAgent.WEBKIT) {\\n    return 'Webkit';\\n  } else if (goog.userAgent.GECKO) {\\n    return 'Moz';\\n  } else if (goog.userAgent.IE) {\\n    return 'ms';\\n  } else if (goog.userAgent.OPERA) {\\n    return 'O';\\n  }\\n\\n  return null;\\n};\\n\\n\\n/**\\n * Returns the vendor prefix used in CSS properties.\\n *\\n * @return {?string} The vendor prefix or null if there is none.\\n */\\ngoog.dom.vendor.getVendorPrefix = function() {\\n  if (goog.userAgent.WEBKIT) {\\n    return '-webkit';\\n  } else if (goog.userAgent.GECKO) {\\n    return '-moz';\\n  } else if (goog.userAgent.IE) {\\n    return '-ms';\\n  } else if (goog.userAgent.OPERA) {\\n    return '-o';\\n  }\\n\\n  return null;\\n};\\n\\n\\n/**\\n * @param {string} propertyName A property name.\\n * @param {!Object=} opt_object If provided, we verify if the property exists in\\n *     the object.\\n * @return {?string} A vendor prefixed property name, or null if it does not\\n *     exist.\\n */\\ngoog.dom.vendor.getPrefixedPropertyName = function(propertyName, opt_object) {\\n  // We first check for a non-prefixed property, if available.\\n  if (opt_object && propertyName in opt_object) {\\n    return propertyName;\\n  }\\n  var prefix = goog.dom.vendor.getVendorJsPrefix();\\n  if (prefix) {\\n    prefix = prefix.toLowerCase();\\n    var prefixedPropertyName = prefix + goog.string.toTitleCase(propertyName);\\n    return (opt_object === undefined || prefixedPropertyName in opt_object) ?\\n        prefixedPropertyName :\\n        null;\\n  }\\n  return null;\\n};\\n\\n\\n/**\\n * @param {string} eventType An event type.\\n * @return {string} A lower-cased vendor prefixed event type.\\n */\\ngoog.dom.vendor.getPrefixedEventType = function(eventType) {\\n  var prefix = goog.dom.vendor.getVendorJsPrefix() || '';\\n  return (prefix + eventType).toLowerCase();\\n};\\n\"],\n\"names\":[\"goog\",\"provide\",\"require\",\"dom\",\"vendor\",\"getVendorJsPrefix\",\"goog.dom.vendor.getVendorJsPrefix\",\"userAgent\",\"WEBKIT\",\"GECKO\",\"IE\",\"OPERA\",\"getVendorPrefix\",\"goog.dom.vendor.getVendorPrefix\",\"getPrefixedPropertyName\",\"goog.dom.vendor.getPrefixedPropertyName\",\"propertyName\",\"opt_object\",\"prefix\",\"toLowerCase\",\"prefixedPropertyName\",\"string\",\"toTitleCase\",\"undefined\",\"getPrefixedEventType\",\"goog.dom.vendor.getPrefixedEventType\",\"eventType\"]\n}\n"]
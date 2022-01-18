["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/async/animationdelay.js"],"~:js","goog.provide(\"goog.async.AnimationDelay\");\ngoog.require(\"goog.Disposable\");\ngoog.require(\"goog.events\");\ngoog.require(\"goog.functions\");\ngoog.async.AnimationDelay = function(listener, opt_window, opt_handler) {\n  goog.async.AnimationDelay.base(this, \"constructor\");\n  this.id_ = null;\n  this.usingListeners_ = false;\n  this.listener_ = listener;\n  this.handler_ = opt_handler;\n  this.win_ = opt_window || window;\n  this.callback_ = goog.bind(this.doAction_, this);\n};\ngoog.inherits(goog.async.AnimationDelay, goog.Disposable);\ngoog.async.AnimationDelay.TIMEOUT = 20;\ngoog.async.AnimationDelay.MOZ_BEFORE_PAINT_EVENT_ = \"MozBeforePaint\";\ngoog.async.AnimationDelay.prototype.start = function() {\n  this.stop();\n  this.usingListeners_ = false;\n  var raf = this.getRaf_();\n  var cancelRaf = this.getCancelRaf_();\n  if (raf && !cancelRaf && this.win_.mozRequestAnimationFrame) {\n    this.id_ = goog.events.listen(this.win_, goog.async.AnimationDelay.MOZ_BEFORE_PAINT_EVENT_, this.callback_);\n    this.win_.mozRequestAnimationFrame(null);\n    this.usingListeners_ = true;\n  } else {\n    if (raf && cancelRaf) {\n      this.id_ = raf.call(this.win_, this.callback_);\n    } else {\n      this.id_ = this.win_.setTimeout(goog.functions.lock(this.callback_), goog.async.AnimationDelay.TIMEOUT);\n    }\n  }\n};\ngoog.async.AnimationDelay.prototype.startIfNotActive = function() {\n  if (!this.isActive()) {\n    this.start();\n  }\n};\ngoog.async.AnimationDelay.prototype.stop = function() {\n  if (this.isActive()) {\n    var raf = this.getRaf_();\n    var cancelRaf = this.getCancelRaf_();\n    if (raf && !cancelRaf && this.win_.mozRequestAnimationFrame) {\n      goog.events.unlistenByKey(this.id_);\n    } else {\n      if (raf && cancelRaf) {\n        cancelRaf.call(this.win_, this.id_);\n      } else {\n        this.win_.clearTimeout(this.id_);\n      }\n    }\n  }\n  this.id_ = null;\n};\ngoog.async.AnimationDelay.prototype.fire = function() {\n  this.stop();\n  this.doAction_();\n};\ngoog.async.AnimationDelay.prototype.fireIfActive = function() {\n  if (this.isActive()) {\n    this.fire();\n  }\n};\ngoog.async.AnimationDelay.prototype.isActive = function() {\n  return this.id_ != null;\n};\ngoog.async.AnimationDelay.prototype.doAction_ = function() {\n  if (this.usingListeners_ && this.id_) {\n    goog.events.unlistenByKey(this.id_);\n  }\n  this.id_ = null;\n  this.listener_.call(this.handler_, goog.now());\n};\ngoog.async.AnimationDelay.prototype.disposeInternal = function() {\n  this.stop();\n  goog.async.AnimationDelay.base(this, \"disposeInternal\");\n};\ngoog.async.AnimationDelay.prototype.getRaf_ = function() {\n  var win = this.win_;\n  return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame || null;\n};\ngoog.async.AnimationDelay.prototype.getCancelRaf_ = function() {\n  var win = this.win_;\n  return win.cancelAnimationFrame || win.cancelRequestAnimationFrame || win.webkitCancelRequestAnimationFrame || win.mozCancelRequestAnimationFrame || win.oCancelRequestAnimationFrame || win.msCancelRequestAnimationFrame || null;\n};\n","~:source","// Copyright 2012 The Closure Library Authors. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS-IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\n/**\n * @fileoverview A delayed callback that pegs to the next animation frame\n * instead of a user-configurable timeout.\n *\n * @author nicksantos@google.com (Nick Santos)\n */\n\ngoog.provide('goog.async.AnimationDelay');\n\ngoog.require('goog.Disposable');\ngoog.require('goog.events');\ngoog.require('goog.functions');\n\n\n\n// TODO(nicksantos): Should we factor out the common code between this and\n// goog.async.Delay? I'm not sure if there's enough code for this to really\n// make sense. Subclassing seems like the wrong approach for a variety of\n// reasons. Maybe there should be a common interface?\n\n\n\n/**\n * A delayed callback that pegs to the next animation frame\n * instead of a user configurable timeout. By design, this should have\n * the same interface as goog.async.Delay.\n *\n * Uses requestAnimationFrame and friends when available, but falls\n * back to a timeout of goog.async.AnimationDelay.TIMEOUT.\n *\n * For more on requestAnimationFrame and how you can use it to create smoother\n * animations, see:\n * @see http://paulirish.com/2011/requestanimationframe-for-smart-animating/\n *\n * @param {function(this:THIS, number)} listener Function to call\n *     when the delay completes. Will be passed the timestamp when it's called,\n *     in unix ms.\n * @param {Window=} opt_window The window object to execute the delay in.\n *     Defaults to the global object.\n * @param {THIS=} opt_handler The object scope to invoke the function in.\n * @template THIS\n * @constructor\n * @struct\n * @extends {goog.Disposable}\n * @final\n */\ngoog.async.AnimationDelay = function(listener, opt_window, opt_handler) {\n  goog.async.AnimationDelay.base(this, 'constructor');\n\n  /**\n   * Identifier of the active delay timeout, or event listener,\n   * or null when inactive.\n   * @private {?goog.events.Key|number}\n   */\n  this.id_ = null;\n\n  /**\n   * If we're using dom listeners.\n   * @private {?boolean}\n   */\n  this.usingListeners_ = false;\n\n  /**\n   * The function that will be invoked after a delay.\n   * @const\n   * @private\n   */\n  this.listener_ = listener;\n\n  /**\n   * The object context to invoke the callback in.\n   * @const\n   * @private {(THIS|undefined)}\n   */\n  this.handler_ = opt_handler;\n\n  /**\n   * @private {Window}\n   */\n  this.win_ = opt_window || window;\n\n  /**\n   * Cached callback function invoked when the delay finishes.\n   * @private {function()}\n   */\n  this.callback_ = goog.bind(this.doAction_, this);\n};\ngoog.inherits(goog.async.AnimationDelay, goog.Disposable);\n\n\n/**\n * Default wait timeout for animations (in milliseconds).  Only used for timed\n * animation, which uses a timer (setTimeout) to schedule animation.\n *\n * @type {number}\n * @const\n */\ngoog.async.AnimationDelay.TIMEOUT = 20;\n\n\n/**\n * Name of event received from the requestAnimationFrame in Firefox.\n *\n * @type {string}\n * @const\n * @private\n */\ngoog.async.AnimationDelay.MOZ_BEFORE_PAINT_EVENT_ = 'MozBeforePaint';\n\n\n/**\n * Starts the delay timer. The provided listener function will be called\n * before the next animation frame.\n */\ngoog.async.AnimationDelay.prototype.start = function() {\n  this.stop();\n  this.usingListeners_ = false;\n\n  var raf = this.getRaf_();\n  var cancelRaf = this.getCancelRaf_();\n  if (raf && !cancelRaf && this.win_.mozRequestAnimationFrame) {\n    // Because Firefox (Gecko) runs animation in separate threads, it also saves\n    // time by running the requestAnimationFrame callbacks in that same thread.\n    // Sadly this breaks the assumption of implicit thread-safety in JS, and can\n    // thus create thread-based inconsistencies on counters etc.\n    //\n    // Calling cycleAnimations_ using the MozBeforePaint event instead of as\n    // callback fixes this.\n    //\n    // Trigger this condition only if the mozRequestAnimationFrame is available,\n    // but not the W3C requestAnimationFrame function (as in draft) or the\n    // equivalent cancel functions.\n    this.id_ = goog.events.listen(\n        this.win_, goog.async.AnimationDelay.MOZ_BEFORE_PAINT_EVENT_,\n        this.callback_);\n    this.win_.mozRequestAnimationFrame(null);\n    this.usingListeners_ = true;\n  } else if (raf && cancelRaf) {\n    this.id_ = raf.call(this.win_, this.callback_);\n  } else {\n    this.id_ = this.win_.setTimeout(\n        // Prior to Firefox 13, Gecko passed a non-standard parameter\n        // to the callback that we want to ignore.\n        goog.functions.lock(this.callback_), goog.async.AnimationDelay.TIMEOUT);\n  }\n};\n\n\n/**\n * Starts the delay timer if it's not already active.\n */\ngoog.async.AnimationDelay.prototype.startIfNotActive = function() {\n  if (!this.isActive()) {\n    this.start();\n  }\n};\n\n\n/**\n * Stops the delay timer if it is active. No action is taken if the timer is not\n * in use.\n */\ngoog.async.AnimationDelay.prototype.stop = function() {\n  if (this.isActive()) {\n    var raf = this.getRaf_();\n    var cancelRaf = this.getCancelRaf_();\n    if (raf && !cancelRaf && this.win_.mozRequestAnimationFrame) {\n      goog.events.unlistenByKey(this.id_);\n    } else if (raf && cancelRaf) {\n      cancelRaf.call(this.win_, /** @type {number} */ (this.id_));\n    } else {\n      this.win_.clearTimeout(/** @type {number} */ (this.id_));\n    }\n  }\n  this.id_ = null;\n};\n\n\n/**\n * Fires delay's action even if timer has already gone off or has not been\n * started yet; guarantees action firing. Stops the delay timer.\n */\ngoog.async.AnimationDelay.prototype.fire = function() {\n  this.stop();\n  this.doAction_();\n};\n\n\n/**\n * Fires delay's action only if timer is currently active. Stops the delay\n * timer.\n */\ngoog.async.AnimationDelay.prototype.fireIfActive = function() {\n  if (this.isActive()) {\n    this.fire();\n  }\n};\n\n\n/**\n * @return {boolean} True if the delay is currently active, false otherwise.\n */\ngoog.async.AnimationDelay.prototype.isActive = function() {\n  return this.id_ != null;\n};\n\n\n/**\n * Invokes the callback function after the delay successfully completes.\n * @private\n */\ngoog.async.AnimationDelay.prototype.doAction_ = function() {\n  if (this.usingListeners_ && this.id_) {\n    goog.events.unlistenByKey(this.id_);\n  }\n  this.id_ = null;\n\n  // We are not using the timestamp returned by requestAnimationFrame\n  // because it may be either a Date.now-style time or a\n  // high-resolution time (depending on browser implementation). Using\n  // goog.now() will ensure that the timestamp used is consistent and\n  // compatible with goog.fx.Animation.\n  this.listener_.call(this.handler_, goog.now());\n};\n\n\n/** @override */\ngoog.async.AnimationDelay.prototype.disposeInternal = function() {\n  this.stop();\n  goog.async.AnimationDelay.base(this, 'disposeInternal');\n};\n\n\n/**\n * @return {?function(function(number)): number} The requestAnimationFrame\n *     function, or null if not available on this browser.\n * @private\n */\ngoog.async.AnimationDelay.prototype.getRaf_ = function() {\n  var win = this.win_;\n  return win.requestAnimationFrame || win.webkitRequestAnimationFrame ||\n      win.mozRequestAnimationFrame || win.oRequestAnimationFrame ||\n      win.msRequestAnimationFrame || null;\n};\n\n\n/**\n * @return {?function(number): undefined} The cancelAnimationFrame function,\n *     or null if not available on this browser.\n * @private\n */\ngoog.async.AnimationDelay.prototype.getCancelRaf_ = function() {\n  var win = this.win_;\n  return win.cancelAnimationFrame || win.cancelRequestAnimationFrame ||\n      win.webkitCancelRequestAnimationFrame ||\n      win.mozCancelRequestAnimationFrame || win.oCancelRequestAnimationFrame ||\n      win.msCancelRequestAnimationFrame || null;\n};\n","~:compiled-at",1637169376501,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.async.animationdelay.js\",\n\"lineCount\":86,\n\"mappings\":\"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\",\n\"sources\":[\"goog/async/animationdelay.js\"],\n\"sourcesContent\":[\"// Copyright 2012 The Closure Library Authors. All Rights Reserved.\\n//\\n// Licensed under the Apache License, Version 2.0 (the \\\"License\\\");\\n// you may not use this file except in compliance with the License.\\n// You may obtain a copy of the License at\\n//\\n//      http://www.apache.org/licenses/LICENSE-2.0\\n//\\n// Unless required by applicable law or agreed to in writing, software\\n// distributed under the License is distributed on an \\\"AS-IS\\\" BASIS,\\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\\n// See the License for the specific language governing permissions and\\n// limitations under the License.\\n\\n/**\\n * @fileoverview A delayed callback that pegs to the next animation frame\\n * instead of a user-configurable timeout.\\n *\\n * @author nicksantos@google.com (Nick Santos)\\n */\\n\\ngoog.provide('goog.async.AnimationDelay');\\n\\ngoog.require('goog.Disposable');\\ngoog.require('goog.events');\\ngoog.require('goog.functions');\\n\\n\\n\\n// TODO(nicksantos): Should we factor out the common code between this and\\n// goog.async.Delay? I'm not sure if there's enough code for this to really\\n// make sense. Subclassing seems like the wrong approach for a variety of\\n// reasons. Maybe there should be a common interface?\\n\\n\\n\\n/**\\n * A delayed callback that pegs to the next animation frame\\n * instead of a user configurable timeout. By design, this should have\\n * the same interface as goog.async.Delay.\\n *\\n * Uses requestAnimationFrame and friends when available, but falls\\n * back to a timeout of goog.async.AnimationDelay.TIMEOUT.\\n *\\n * For more on requestAnimationFrame and how you can use it to create smoother\\n * animations, see:\\n * @see http://paulirish.com/2011/requestanimationframe-for-smart-animating/\\n *\\n * @param {function(this:THIS, number)} listener Function to call\\n *     when the delay completes. Will be passed the timestamp when it's called,\\n *     in unix ms.\\n * @param {Window=} opt_window The window object to execute the delay in.\\n *     Defaults to the global object.\\n * @param {THIS=} opt_handler The object scope to invoke the function in.\\n * @template THIS\\n * @constructor\\n * @struct\\n * @extends {goog.Disposable}\\n * @final\\n */\\ngoog.async.AnimationDelay = function(listener, opt_window, opt_handler) {\\n  goog.async.AnimationDelay.base(this, 'constructor');\\n\\n  /**\\n   * Identifier of the active delay timeout, or event listener,\\n   * or null when inactive.\\n   * @private {?goog.events.Key|number}\\n   */\\n  this.id_ = null;\\n\\n  /**\\n   * If we're using dom listeners.\\n   * @private {?boolean}\\n   */\\n  this.usingListeners_ = false;\\n\\n  /**\\n   * The function that will be invoked after a delay.\\n   * @const\\n   * @private\\n   */\\n  this.listener_ = listener;\\n\\n  /**\\n   * The object context to invoke the callback in.\\n   * @const\\n   * @private {(THIS|undefined)}\\n   */\\n  this.handler_ = opt_handler;\\n\\n  /**\\n   * @private {Window}\\n   */\\n  this.win_ = opt_window || window;\\n\\n  /**\\n   * Cached callback function invoked when the delay finishes.\\n   * @private {function()}\\n   */\\n  this.callback_ = goog.bind(this.doAction_, this);\\n};\\ngoog.inherits(goog.async.AnimationDelay, goog.Disposable);\\n\\n\\n/**\\n * Default wait timeout for animations (in milliseconds).  Only used for timed\\n * animation, which uses a timer (setTimeout) to schedule animation.\\n *\\n * @type {number}\\n * @const\\n */\\ngoog.async.AnimationDelay.TIMEOUT = 20;\\n\\n\\n/**\\n * Name of event received from the requestAnimationFrame in Firefox.\\n *\\n * @type {string}\\n * @const\\n * @private\\n */\\ngoog.async.AnimationDelay.MOZ_BEFORE_PAINT_EVENT_ = 'MozBeforePaint';\\n\\n\\n/**\\n * Starts the delay timer. The provided listener function will be called\\n * before the next animation frame.\\n */\\ngoog.async.AnimationDelay.prototype.start = function() {\\n  this.stop();\\n  this.usingListeners_ = false;\\n\\n  var raf = this.getRaf_();\\n  var cancelRaf = this.getCancelRaf_();\\n  if (raf && !cancelRaf && this.win_.mozRequestAnimationFrame) {\\n    // Because Firefox (Gecko) runs animation in separate threads, it also saves\\n    // time by running the requestAnimationFrame callbacks in that same thread.\\n    // Sadly this breaks the assumption of implicit thread-safety in JS, and can\\n    // thus create thread-based inconsistencies on counters etc.\\n    //\\n    // Calling cycleAnimations_ using the MozBeforePaint event instead of as\\n    // callback fixes this.\\n    //\\n    // Trigger this condition only if the mozRequestAnimationFrame is available,\\n    // but not the W3C requestAnimationFrame function (as in draft) or the\\n    // equivalent cancel functions.\\n    this.id_ = goog.events.listen(\\n        this.win_, goog.async.AnimationDelay.MOZ_BEFORE_PAINT_EVENT_,\\n        this.callback_);\\n    this.win_.mozRequestAnimationFrame(null);\\n    this.usingListeners_ = true;\\n  } else if (raf && cancelRaf) {\\n    this.id_ = raf.call(this.win_, this.callback_);\\n  } else {\\n    this.id_ = this.win_.setTimeout(\\n        // Prior to Firefox 13, Gecko passed a non-standard parameter\\n        // to the callback that we want to ignore.\\n        goog.functions.lock(this.callback_), goog.async.AnimationDelay.TIMEOUT);\\n  }\\n};\\n\\n\\n/**\\n * Starts the delay timer if it's not already active.\\n */\\ngoog.async.AnimationDelay.prototype.startIfNotActive = function() {\\n  if (!this.isActive()) {\\n    this.start();\\n  }\\n};\\n\\n\\n/**\\n * Stops the delay timer if it is active. No action is taken if the timer is not\\n * in use.\\n */\\ngoog.async.AnimationDelay.prototype.stop = function() {\\n  if (this.isActive()) {\\n    var raf = this.getRaf_();\\n    var cancelRaf = this.getCancelRaf_();\\n    if (raf && !cancelRaf && this.win_.mozRequestAnimationFrame) {\\n      goog.events.unlistenByKey(this.id_);\\n    } else if (raf && cancelRaf) {\\n      cancelRaf.call(this.win_, /** @type {number} */ (this.id_));\\n    } else {\\n      this.win_.clearTimeout(/** @type {number} */ (this.id_));\\n    }\\n  }\\n  this.id_ = null;\\n};\\n\\n\\n/**\\n * Fires delay's action even if timer has already gone off or has not been\\n * started yet; guarantees action firing. Stops the delay timer.\\n */\\ngoog.async.AnimationDelay.prototype.fire = function() {\\n  this.stop();\\n  this.doAction_();\\n};\\n\\n\\n/**\\n * Fires delay's action only if timer is currently active. Stops the delay\\n * timer.\\n */\\ngoog.async.AnimationDelay.prototype.fireIfActive = function() {\\n  if (this.isActive()) {\\n    this.fire();\\n  }\\n};\\n\\n\\n/**\\n * @return {boolean} True if the delay is currently active, false otherwise.\\n */\\ngoog.async.AnimationDelay.prototype.isActive = function() {\\n  return this.id_ != null;\\n};\\n\\n\\n/**\\n * Invokes the callback function after the delay successfully completes.\\n * @private\\n */\\ngoog.async.AnimationDelay.prototype.doAction_ = function() {\\n  if (this.usingListeners_ && this.id_) {\\n    goog.events.unlistenByKey(this.id_);\\n  }\\n  this.id_ = null;\\n\\n  // We are not using the timestamp returned by requestAnimationFrame\\n  // because it may be either a Date.now-style time or a\\n  // high-resolution time (depending on browser implementation). Using\\n  // goog.now() will ensure that the timestamp used is consistent and\\n  // compatible with goog.fx.Animation.\\n  this.listener_.call(this.handler_, goog.now());\\n};\\n\\n\\n/** @override */\\ngoog.async.AnimationDelay.prototype.disposeInternal = function() {\\n  this.stop();\\n  goog.async.AnimationDelay.base(this, 'disposeInternal');\\n};\\n\\n\\n/**\\n * @return {?function(function(number)): number} The requestAnimationFrame\\n *     function, or null if not available on this browser.\\n * @private\\n */\\ngoog.async.AnimationDelay.prototype.getRaf_ = function() {\\n  var win = this.win_;\\n  return win.requestAnimationFrame || win.webkitRequestAnimationFrame ||\\n      win.mozRequestAnimationFrame || win.oRequestAnimationFrame ||\\n      win.msRequestAnimationFrame || null;\\n};\\n\\n\\n/**\\n * @return {?function(number): undefined} The cancelAnimationFrame function,\\n *     or null if not available on this browser.\\n * @private\\n */\\ngoog.async.AnimationDelay.prototype.getCancelRaf_ = function() {\\n  var win = this.win_;\\n  return win.cancelAnimationFrame || win.cancelRequestAnimationFrame ||\\n      win.webkitCancelRequestAnimationFrame ||\\n      win.mozCancelRequestAnimationFrame || win.oCancelRequestAnimationFrame ||\\n      win.msCancelRequestAnimationFrame || null;\\n};\\n\"],\n\"names\":[\"goog\",\"provide\",\"require\",\"async\",\"AnimationDelay\",\"goog.async.AnimationDelay\",\"listener\",\"opt_window\",\"opt_handler\",\"base\",\"id_\",\"usingListeners_\",\"listener_\",\"handler_\",\"win_\",\"window\",\"callback_\",\"bind\",\"doAction_\",\"inherits\",\"Disposable\",\"TIMEOUT\",\"MOZ_BEFORE_PAINT_EVENT_\",\"prototype\",\"start\",\"goog.async.AnimationDelay.prototype.start\",\"stop\",\"raf\",\"getRaf_\",\"cancelRaf\",\"getCancelRaf_\",\"mozRequestAnimationFrame\",\"events\",\"listen\",\"call\",\"setTimeout\",\"functions\",\"lock\",\"startIfNotActive\",\"goog.async.AnimationDelay.prototype.startIfNotActive\",\"isActive\",\"goog.async.AnimationDelay.prototype.stop\",\"unlistenByKey\",\"clearTimeout\",\"fire\",\"goog.async.AnimationDelay.prototype.fire\",\"fireIfActive\",\"goog.async.AnimationDelay.prototype.fireIfActive\",\"goog.async.AnimationDelay.prototype.isActive\",\"goog.async.AnimationDelay.prototype.doAction_\",\"now\",\"disposeInternal\",\"goog.async.AnimationDelay.prototype.disposeInternal\",\"goog.async.AnimationDelay.prototype.getRaf_\",\"win\",\"requestAnimationFrame\",\"webkitRequestAnimationFrame\",\"oRequestAnimationFrame\",\"msRequestAnimationFrame\",\"goog.async.AnimationDelay.prototype.getCancelRaf_\",\"cancelAnimationFrame\",\"cancelRequestAnimationFrame\",\"webkitCancelRequestAnimationFrame\",\"mozCancelRequestAnimationFrame\",\"oCancelRequestAnimationFrame\",\"msCancelRequestAnimationFrame\"]\n}\n"]
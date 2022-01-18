(ns ^:dev/once notes.app
  (:require
   [devtools.core :as devtools]
   [notes.core :as core]))

(enable-console-print!)

(println "loading env/dev/cljs/guestbook/app.cljs...")

(devtools/install!)

(core/init!)
(ns notes.env
  (:require [clojure.tools.logging :as log]))

(def defaults
  {:init
   (fn []
     (log/info "\n-=[notes started successfully]=-"))
   :stop
   (fn []
     (log/info "\n-=[notes has shut down successfully]=-"))
   :middleware identity})

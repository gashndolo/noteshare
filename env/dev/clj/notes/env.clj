(ns notes.env
  (:require
    [selmer.parser :as parser]
    [clojure.tools.logging :as log]
    [notes.dev-middleware :refer [wrap-dev]]))

(def defaults
  {:init
   (fn []
     (parser/cache-off!)
     (log/info "\n-=[notes started successfully using the development profile]=-"))
   :stop
   (fn []
     (log/info "\n-=[notes has shut down successfully]=-"))
   :middleware wrap-dev})

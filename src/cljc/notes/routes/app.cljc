(ns notes.routes.app
  (:require
   #?@(:clj [[notes.layout :as layout]
             [notes.middleware :as middleware]]
       :cljs [[notes.views.home :as home]
              [notes.views.note :as note]
              [notes.views.myaccount :as myaccount]])))

#?(:clj
   (defn home-page [request]
     (layout/render
      request
      "home.html")))

(defn app-routes []
  [""
   #?(:clj {:middleware [middleware/wrap-csrf]
            :get home-page})
   ["/"
    (merge
     {:name ::home}
     #?(:cljs
        {:view #'home/home}))]
   ["/my-account"
    (merge
     {:name ::myaccount}
     #?(:cljs
        {:view #'myaccount/myaccount}))]
   ["/note/:note"
    (merge
     {:name ::note}
     #?(:cljs
        {:view #'note/note}))]])
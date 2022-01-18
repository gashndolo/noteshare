(ns notes.validation
  (:require
   [struct.core :as st]))

(def message-schema
  [[:title
    st/required
    st/string]
   [:description
    st/required
    st/string
    {:message "message must contain at least 10 characters"
     :validate (fn [msg] (>= (count msg) 10))}]])

(defn validate-message [params]
  (first (st/validate params message-schema)))

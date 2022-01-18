(ns notes.notes
  (:require [notes.db.core :as db]
            [notes.validation :refer [validate-message]]))

(defn notes-list []
  {:notes (vec (db/get-notes))})


 (defn save-note! [message]
  (db/save-note! message))

;(defn save-note! [{:keys [login]} message]
;  (if-let [errors (validate-message message)]
;    (throw (ex-info "Note is invalid"
;                    {:notes/error-id :validation
 ;                    :errors errors}))
 ;   (db/save-note! (assoc message :author login))))

(defn update-note! [message]
  (db/update-note message))

(defn delete-note [id]
  (db/delete-note {:id id}))
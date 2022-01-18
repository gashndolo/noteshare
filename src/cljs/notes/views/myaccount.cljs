(ns notes.views.myaccount
  (:require [re-frame.core :as rf]
            [notes.views.home]
            [ajax.core :refer [GET POST]]))

(rf/reg-event-fx
 :delete/note
 (fn [_ [_ id]]
   (POST (str "api/delete/" id)
     {:headers {"Accept" "application/transit+json"
                "x-csrf-token" (.-value (.getElementById js/document "token"))}
      :handler #(rf/dispatch [:notes/load])
      :error-handler (.log js/console "Argument not deleted")})))

(defn myaccount []
  (let [notes (rf/subscribe [:getnotes])]
    [:div
     [:p "My notes"]
     (if @(rf/subscribe [:notes/loading?])
       [:div "Loading..."]
       [:ul.notes
        (for [{:keys [id title description private author]} @notes]
          (when (= author (:login @(rf/subscribe [:auth/user])))
           [:li
            [:div.card.note
             [:header.card-header
              [:p.card-header-title [:a {:href (str "note/" id)
                                         :on-click (fn []
                                                     (rf/dispatch [:set/note id title description private author])
                                                     (rf/dispatch [:form/set-field-edit title description private]))} title]]
              [:button.button.is-danger.deleter {:on-click #(rf/dispatch [:delete/note id])}"Delete"]]
             [:div.card-content
              [:div.content
               [:p description]]]]]))])]))
(ns notes.views.note
  (:require [re-frame.core :as rf]
            [ajax.core :refer [POST]]))
(rf/reg-sub
 :get/note
 (fn [db _]
   (:note db)))

(rf/reg-event-fx
 :note/update!
 (fn [{:keys [db]} [_ fields]]
   (POST "/api/update"
     {:format :json
      :headers {"Accept" "application/transit+json"
                "x-csrf-token" (.-value (.getElementById js/document "token"))}
      :params fields
      :handler #(rf/dispatch [:note/add (:note %)])
      :error-handler #(.log js/console "Argument not posted")})))

(defn note []
  (let [note @(rf/subscribe [:get/note])]
    (rf/dispatch [:form/set-field-id (:id note)])
    (fn []
      [:div
       [:p "Da note"]
       (case (= (:author note) (:login @(rf/subscribe [:auth/user])))
         true
         [:div.update-form
          [:input.input
           {:name :edit-title
            :on-change #(rf/dispatch
                         [:form/set-field
                          :title
                          (.. % -target -value)])
            :value @(rf/subscribe [:form/field :title])}]
          [:textarea.textarea
           {:name :text
            :value @(rf/subscribe [:form/field :description])
            :on-change #(rf/dispatch
                         [:form/set-field
                          :description
                          (.. % -target -value)])}]
          [:div.form-group
           [:label "Private"]
           [:select.form-control {:field :list
                                  :id :many.options
                                  :on-change #(rf/dispatch
                                               [:form/set-field-private
                                                (.. % -target -value)])}
            [:option {:key :affirmative} "true"]
            [:option {:key :negative} "false"]]]
          [:input.button.is-primary
           {:type :submit
            :value "update"
            :on-click #(rf/dispatch [:note/update!
                                     @(rf/subscribe [:form/fields])])}]]
         false
         [:div
          [:p (:title note)]
          [:p (:description note)]])])))
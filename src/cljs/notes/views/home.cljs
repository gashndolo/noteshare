(ns notes.views.home
  (:require [re-frame.core :as rf]
            [ajax.core :refer [POST]]
            [clojure.string :as string]
            [notes.validation :refer [validate-message]]))

(rf/reg-event-db
 :form/set-field
 [(rf/path :form/fields)]
 (fn [fields [_ id value]]
   (assoc fields id value)))

(rf/reg-event-db
 :form/set-field-search
 (fn [db [_ value]]
   (assoc db :form/search value)))

(rf/reg-event-db
 :form/set-field-id
 [(rf/path :form/fields)]
 (fn [fields [_ id]]
   (assoc fields :id id)))

(rf/reg-event-db
 :form/set-field-private
 [(rf/path :form/fields)]
 (fn [fields [_ value]]
   (if (= value "true")
     (assoc fields :private true)
     (assoc fields :private false))))

(rf/reg-event-db
 :form/clear-fields
 [(rf/path :form/fields)]
 (fn [_ _]
   {:private true}))

(rf/reg-sub
 :form/fields
 (fn [db _]
   (:form/fields db)))

(rf/reg-sub
 :form/field
 :<- [:form/fields]
 (fn [fields [_ id]]
   (get fields id)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;,,,;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(rf/reg-event-db
:form/set-server-errors
[(rf/path :form/server-errors)]
(fn [_ [_ errors]]
errors))

(rf/reg-sub
 :form/server-errors
 (fn [db _]
   (:form/server-errors db)))

;;Validation errors are reactively computed
(rf/reg-sub
 :form/validation-errors
 :<- [:form/fields]
 (fn [fields _]
   (validate-message fields)))

(rf/reg-sub
 :form/validation-errors?
 :<- [:form/validation-errors]
 (fn [errors _]
   (not (empty? errors))))

(rf/reg-sub
 :form/errors
 :<- [:form/validation-errors]
 :<- [:form/server-errors]
 (fn [[validation server] _]
   (merge validation server)))

(rf/reg-sub
 :form/error
 :<- [:form/errors]
 (fn [errors [_ id]]
   (get errors id)))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;,,,;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;


(rf/reg-event-db
 :note/add
 (fn [db [_ note]]
   (update db :notes/list conj note)))

(rf/reg-event-fx
 :note/post!
 (fn [{:keys [db]} [_ fields]]
   (POST "/api/note"
     {:format :json
      :headers {"Accept" "application/transit+json"
                "x-csrf-token" (.-value (.getElementById js/document "token"))}
      :params fields
      :handler #(do
                  (rf/dispatch [:form/clear-fields])
                  (rf/dispatch [:note/add (:note %)]))
      :error-handler #(.log js/console "Argument not posted")})))

(rf/reg-event-db
 :set/note
 [(rf/path :note)]
 (fn [note [_ id title description private author]]
   (assoc note
          :id id :title title :description description :private private :author author)))

(rf/reg-event-db
 :form/set-field-edit
 [(rf/path :form/fields)]
 (fn [fields [_ title description private]]
   (assoc fields
          :title title :description description :private private)))

(rf/reg-event-fx
 :note/search!
 (fn [{:keys [db]} [_ fields]]
   (POST "/api/search"
     {:format :json
      :headers {"Accept" "application/transit+json"
                "x-csrf-token" (.-value (.getElementById js/document "token"))}
      :params fields
      :handler #(rf/dispatch [:notes/set (:notes %)])
      :error-handler #(.log js/console (str "Search didn't go through" %))})
   (assoc db :notes/loading? true)))

(defn search []
  [:div
   [:input.input.is-success
    {:placeholder "Search"
     :on-change #(do
                   (rf/dispatch
                    [:form/set-field-search
                     {:title (str "%" (.. % -target -value) "%")}])
                   (rf/dispatch
                    [:note/search!
                     {:title (str "%" (.. % -target -value) "%")}]))}]])
(defn unauthenticated []
  [:div
   [search]
   [:p "Create and share lists, musings or even poetry with the rest of the world"]
   [:p "Please log in or create an account to create a post"]])

(defn notes-list []
  (let [notes (rf/subscribe [:getnotes])]
    (if @(rf/subscribe [:notes/loading?])
      [:div "Loading..."]
      [:ul.notes
       (for [{:keys [id title description private author]} @notes]
         [:li
          [:div.card.note
           [:header.card-header
            [:p.card-header-title [:a {:href (str "note/" id)
                                       :on-click (fn []
                                                   (rf/dispatch [:set/note id title description private author])
                                                   (rf/dispatch [:form/set-field-edit title description private]))} title]]]
           [:div.card-content
            [:div.content
             [:p description]]]]])])))

(defn errors-component [id]
  (when-let [error @(rf/subscribe [:form/error id])]
    [:div.notification.is-danger (string/join error)]))

(defn home []
  (let [notes (rf/subscribe [:getnotes])]
    (rf/dispatch [:form/clear-fields])
    (rf/dispatch [:notes/load])
    
    (fn []
      [:div
       (case @(rf/subscribe [:auth/user-state])
         :anonymous
         [:div
          [unauthenticated]
          [notes-list]]
         :loading
         [:div {:style {:width "5em"}}
          [:progress.progress.is-dark.is-small {:max 100} "30%"]]
         :authenticated
         [:div
          [search]
          [:div.column.is-full.drop-down
           {:on-click (fn []
                        (let [cont (.getElementById js/document "form")]
                          (if (= (.. cont -style -display) "block")
                            (set! (.. cont -style -display) "none")
                            (set! (.. cont -style -display) "block"))))} "Post Note"]
          [:div#form.form
           [:div.field
            [:label.label {:for :title} "Title"]
            [errors-component :title]
            [:input.input
             {:name :title
              :on-change #(do
                            (rf/dispatch
                             [:form/set-field
                              :title
                              (.. % -target -value)])
                            (rf/dispatch [:form/set-field
                                          :author
                                          (:login @(rf/subscribe [:auth/user]))]))
              :value @(rf/subscribe [:form/field :title])}]]
           [:div.field
            [:label.label {:for :text} "Text"]
            [errors-component :description]
            [:textarea.textarea
             {:name :text
              :on-change #(rf/dispatch
                           [:form/set-field
                            :description
                            (.. % -target -value)])

              :value @(rf/subscribe [:form/field :description])}]]
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
             :value "submit"
             :disabled @(rf/subscribe [:form/validation-errors?])
             :on-click #(rf/dispatch [:note/post!
                                      @(rf/subscribe [:form/fields])])}]]
          [notes-list]])])))
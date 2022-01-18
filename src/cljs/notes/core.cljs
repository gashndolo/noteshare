(ns notes.core
  (:require [reagent.dom :as dom]
            [reagent.core :as r]
            [re-frame.core :as rf]
            [reitit.coercion.spec :as reitit-spec]
            [reitit.frontend :as rtf]
            [reitit.frontend.easy :as rtfe]
            [notes.views.home :as home]
            [notes.auth :as auth]
            [notes.routes.app :refer [app-routes]]
            [notes.modals :as m]
            [ajax.core :refer [GET POST]]))

(rf/reg-fx
 :ajax/get
 (fn [{:keys [url success-event error-event success-path]}]
   (GET url
     (cond-> {:headers {"Accept" "application/transit+json"}}
       success-event (assoc :handler
                            #(rf/dispatch
                              (conj success-event
                                    (if success-path
                                      (get-in % success-path)
                                      %))))
       error-event (assoc :error-handler
                          #(rf/dispatch
                            (conj error-event %)))))))

(rf/reg-event-db
 :router/navigated
 (fn [db [_ new-match]]
   (assoc db :router/current-route new-match)))

(rf/reg-sub
 :router/current-route
 (fn [db]
   (:router/current-route db)))

(rf/reg-event-fx
 :app/initialize
 (fn [_ _]
   {:db {:notes/loading? true}
    :dispatch-n [[:session/load] [:notes/load]]}))

(rf/reg-event-fx
 :notes/load
 (fn [{:keys [db]} _]
   (GET "/api/notes"
     {:headers {"Accept" "application/transit+json"}
      :handler (fn [r]
                 (rf/dispatch [:notes/set (:notes r)]))})
   (:db (assoc db :notes/loading? true))))

(rf/reg-event-db
 :notes/set
 (fn [db [_ notes]]
   (assoc db
          :notes/loading? false
          :notes/list notes
          :form/fields {:private true})))

(rf/reg-sub
 :getnotes
 (fn [db _]
   (:notes/list db [])))

(rf/reg-sub
 :notes/loading?
 (fn [db _]
   (:notes/loading? db)))

(def router
  (rtf/router
   (app-routes)
   {:data {:coercion reitit-spec/coercion}}))

(defn page [{{:keys [view name]} :data
             path :path}]
  [:section.section>div.container
   (if view
     [view]
     [:div "No view specified for route: " name " (" path ")"])])

(defn navbar []
  (let [burger-active (r/atom false)]
    (fn []
      [:nav.navbar.is-info
       [:div.container
        [:div.navbar-brand
         [:a.navbar-item
          {:href "/"
           :style {:font-weight "bold"}}
          "Notes"]
         [:span.navbar-burger.burger
          {:data-target "nav-menu"
           :on-click #(swap! burger-active not)
           :class (when @burger-active "is-active")}
          [:span]
          [:span]
          [:span]]]
        [:div#nav-menu.navbar-menu
         {:class (when @burger-active "is-active")}
         [:div.navbar-start
          [:a.navbar-item
           {:href "/"}
           "Home"]]
         [:div.navbar-end
          [:div.navbar-item
           (case @(rf/subscribe [:auth/user-state])
             :loading
             [:div {:style {:width "5em"}}
              [:progress.progress.is-dark.is-small {:max 100} "30%"]]
             :authenticated
             [:div.buttons
              [auth/nameplate @(rf/subscribe [:auth/user])]
              [auth/logout-button]]
             :anonymous
             [:div.buttons
                [auth/login-button]
                [auth/register-button]
              ])]]]]])))

(defn app []
  (let [current-route @(rf/subscribe [:router/current-route])]
    [:div.app
     [navbar]
     [:section.section>div.container
      [page current-route]]]))

(defn init-routes! []
  (rtfe/start!
   router
   (fn [new-match]
     (when new-match
       (rf/dispatch [:router/navigated new-match])))
   {:use-fragment false}))


(defn ^:dev/after-load mount-components []
  (rf/clear-subscription-cache!)
  (.log js/console "Mounting components")
  (init-routes!)
  (dom/render [#'app] (.getElementById js/document "content"))
  (.log js/console "Components mounted"))

(defn init! []
  (.log js/console "Initializing app")
  (rf/dispatch [:app/initialize])
  (mount-components))

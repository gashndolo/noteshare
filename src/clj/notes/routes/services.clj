(ns notes.routes.services
  (:require [notes.notes :as nts]
            [reitit.swagger :as swagger]
            [reitit.swagger-ui :as swagger-ui]
            [reitit.ring.coercion :as coercion]
            [reitit.coercion.spec :as spec-coercion]
            [reitit.ring.middleware.muuntaja :as muuntaja]
            [reitit.ring.middleware.exception :as exception]
            [reitit.ring.middleware.multipart :as multipart]
            [reitit.ring.middleware.parameters :as parameters]
            [notes.middleware :as middleware]
            [notes.middleware.formats :as formats]
            [notes.db.core :as db]
            [notes.auth :as auth]
            [clojure.spec.alpha :as s]
            [clojure.string :as string]
            [ring.util.http-response :as response]
            [spec-tools.data-spec :as ds]))

(defn service-routes []
  ["/api"
   {:middleware [parameters/parameters-middleware
                 muuntaja/format-negotiate-middleware
                 muuntaja/format-response-middleware
                 exception/exception-middleware
                 muuntaja/format-request-middleware
                 coercion/coerce-response-middleware
                 coercion/coerce-request-middleware
                 multipart/multipart-middleware]
    :swagger {:id ::api}
    :muuntaja formats/instance
    :coercion spec-coercion/coercion}
   ["" {:no-doc true}
    ["/swagger.json"
     {:get (swagger/create-swagger-handler)}]
    ["/swagger-ui*"
     {:get (swagger-ui/create-swagger-ui-handler
            {:url "/api/swagger.json"})}]]
   ["/search"
    {:post
     {:parameters
      {:body
       {:title string?}}
      :responses
      {200
       {:body map?}}
      :handler
      (fn [{{params :body} :parameters}]
        (->>
         (db/search-note params)
         (assoc {:status :ok} :notes)
         (response/ok)))}}]
   ["/notes"
    {:get
     {:responses
      {200
       {:body
        {:notes
         [{:id pos-int?
           :title string?
           :description string?
           :private boolean?}]}}}
      :handler
      (fn [_]
        (response/ok (nts/notes-list)))}}]
   ["/note"
    {:post
     {:parameters
      {:body
       {:author string?
        :title string?
        :description string?
        :private boolean?}}
      :responses
      {200
       {:body map?}
       400
       {:body map?}
       500
       {:errors map?}}
      :handler
      (fn [{{params :body} :parameters
            ;{:keys [identity]} :session
            }]
        (try
          (->> (nts/save-note! params)
               (assoc {:status :ok} :note)
               (response/ok))
          (catch Exception e
            (let [{id :notes/error-id
                   errors :errors} (ex-data e)]
              (case id
                :validation
                (response/bad-request {:errors errors})
                ;;else
                (response/internal-server-error
                 {:errors {:server-error ["Failed to save message"]}}))))))}}]
   ["/update"
    {:post
     {:parameters
      {:body
       {:id pos-int?
        :title string?
        :description string?
        :private boolean?}}
      :responses
      {200
       {:body map?}
       400
       {:body map?}
       500
       {:errors map?}}
      :handler
      (fn [{{params :body} :parameters}]
        (try
          (->> (nts/update-note! params)
               (assoc {:status :ok} :note)
               (response/ok))
          (catch Exception e
            (let [{id :notes/error-id
                   errors :errors} (ex-data e)]
              (case id
                :validation
                (response/bad-request {:errors errors})
                ;;else
                (response/internal-server-error
                 {:errors {:server-error ["Failed to save message"]}}))))))}}]
   ["/delete/:arg-id"
     {:post
      {:parameters
       {:path
        {:arg-id pos-int?}}
       :responses
       {200
        {:body map?}
        404
        {:message string?}}
       :handler
       (fn [{{{:keys [arg-id]} :path} :parameters}]
         (try (->> (nts/delete-note arg-id)
                   (response/ok))
              (catch Exception e
                (response/bad-request {:message "Post not deleted"}))))}}]
   ["/login"
    {:post {:parameters
            {:body
             {:login string?
              :password string?}}
            :responses
            {200
             {:body
              {:identity
               {:login string?
                :created_at inst?}}}
             401
             {:body
              {:message string?}}}
            :handler
            (fn [{{{:keys [login password]} :body} :parameters
                  session :session}]
              (if-some [user (auth/authenticate-user login password)]
                (->
                 (response/ok
                  {:identity user})
                 (assoc :session (assoc session
                                        :identity
                                        user)))
                (response/unauthorized
                 {:message "Incorrect login or password."})))}}]
   ["/register"
    {:post {:parameters
            {:body
             {:login string?
              :password string?
              :confirm string?}}
            :responses
            {200
             {:body
              {:message string?}}
             400
             {:body
              {:message string?}}
             409
             {:body
              {:message string?}}}
            :handler
            (fn [{{{:keys [login password confirm]} :body} :parameters}]
              (if-not (= password confirm)
                (response/bad-request
                 {:message
                  "Password and Confirm do not match."})
                (try
                  (auth/create-user! login password)
                  (response/ok
                   {:message
                    "User registration successful. Please log in."})
                  (catch clojure.lang.ExceptionInfo e
                    (if (= (:notes/error-id (ex-data e))
                           ::auth/duplicate-user)
                      (response/conflict
                       {:message
                        "Registration failed! User with login already exists!"})
                      (throw e))))))}}]
   ["/logout"
    {:post {:handler
            (fn [_]
              (->
               (response/ok)
               (assoc :session nil)))}}]
   ["/session"
    {:get
     {:responses
      {200
       {:body
        {:session
         {:identity
          (ds/maybe
           {:login string?
            :created_at inst?})}}}}
      :handler
      (fn [{{:keys [identity]} :session}]
        (response/ok {:session
                      {:identity
                       (not-empty
                        (select-keys identity [:login :created_at]))}}))}}]])
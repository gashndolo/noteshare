-- :name save-note! :! :1
-- :doc creates a new note using the title, description and private keys
INSERT INTO notes
(author, title, description, private)
VALUES (:author, :title, :description, :private)
RETURNING *;

-- :name get-notes :? :*
-- :doc selects all available notes
SELECT * FROM notes

-- :name update-note :! 1
-- :doc updates an existing note
UPDATE notes
SET 
    title = :title,
    description = :description,
    private = :private
WHERE :id = id
RETURNING *;

-- :name search-note :? :*
-- :doc search the notes table
SELECT * FROM notes
WHERE title ILIKE :title;

-- :name create-user!* :! :n
-- :doc creates a new user with the provided login and hashed password
INSERT INTO users
(login, password)
VALUES (:login, :password)

-- :name get-user-for-auth* :? :1
-- :doc selects a user for authentication
SELECT * FROM users
WHERE login = :login 

-- :name delete-note :! :1
-- :doc deletes selected note
DELETE FROM notes WHERE id = :id
RETURNING title;
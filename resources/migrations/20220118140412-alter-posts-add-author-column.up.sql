ALTER TABLE notes
    ADD COLUMN author text
    REFERENCES users(login)
    ON DELETE SET null
    ON UPDATE CASCADE;
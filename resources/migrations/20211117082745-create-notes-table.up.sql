CREATE TABLE notes
(id SERIAL PRIMARY KEY,
title text not null,
description text not null,
private boolean not null default false);
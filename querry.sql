-- TABLE USERS
CREATE TABLE worker
(
    wrk_id VARCHAR NOT NULL PRIMARY KEY,
    wrk_name VARCHAR(255),
    wrk_email VARCHAR(255),
    wrk_phone VARCHAR(255),
    wrk_password VARCHAR(255),
    wrk_confirmpassword VARCHAR(255),
    wrk_jobdesk VARCHAR(255),
    wrk_dom VARCHAR(255),
    wrk_place VARCHAR(255),
    wrk_desc VARCHAR(255),
    wrk_photo VARCHAR(255)
);




CREATE TABLE recruiter
(
    rec_id VARCHAR NOT NULL PRIMARY KEY,
    rec_compname VARCHAR(255),
    rec_jobfield VARCHAR(255),
    rec_province VARCHAR(255),
    rec_city VARCHAR(255),
    rec_desc VARCHAR(255),
    rec_emailcomp VARCHAR(255),
    rec_phone VARCHAR(255),
    rec_linkedin VARCHAR(255),
    rec_name VARCHAR(255),
    rec_email VARCHAR(255),
    rec_position VARCHAR(255),
    rec_password VARCHAR(255),
    rec_confirmpassword VARCHAR(255),
    rec_photo VARCHAR(255)
);

CREATE TABLE experience
(
    exp_id VARCHAR NOT NULL PRIMARY KEY,
    exp_position VARCHAR(255),
    exp_compname VARCHAR(255),
    exp_datefrom VARCHAR(255),
    exp_dateuntil VARCHAR(255),
    exp_desc VARCHAR(255),
    wrk_id VARCHAR(255)
);

CREATE TABLE portofolio
(
    por_id VARCHAR NOT NULL PRIMARY KEY,
    por_name VARCHAR(255),
    por_repository VARCHAR(255),
    por_photo VARCHAR(255),
    wrk_id VARCHAR(255)
);

CREATE TABLE skill
(
    skill_id VARCHAR NOT NULL PRIMARY KEY,
    skill_name VARCHAR(255),
    wrk_id VARCHAR(255)
);

CREATE TABLE recipes
(
    recipes_id VARCHAR PRIMARY KEY,
    recipes_title VARCHAR(255),
    recipes_ingredients VARCHAR(255) ,
    recipes_photo VARCHAR(255),
    recipes_video VARCHAR(255),
    recipes_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    categorys_id INT,
    users_id VARCHAR(255)
);

CREATE TABLE comments
(
    comment_id INT PRIMARY KEY,
    recipes_id VARCHAR(255),
    users_id VARCHAR(255),
    comment_text VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE likeds
(
    likeds_id VARCHAR PRIMARY KEY,
    recipes_id VARCHAR(255),
    users_id VARCHAR(255)
);

CREATE TABLE bookmarks
(
    bookmarks_id VARCHAR PRIMARY KEY,
    recipes_id VARCHAR(255),
    users_id VARCHAR(255)
);

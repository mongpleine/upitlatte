create schema sellingnote;

use sellingnote;

-- auto-generated definition
create table sellingnote.users
(
    user_id      int auto_increment
        primary key,
    username     varchar(20)                          not null,
    email        varchar(30)                          not null,
    password     varchar(50)                          not null,
    eid          varchar(15)                          not null comment '사업자등록번호',
    tel          varchar(15)                          null,
    join_date    datetime   default CURRENT_TIMESTAMP null,
    last_login   datetime                             null,
    is_superuser tinyint(1) default 0                 not null,
    constraint users_eid_uindex
        unique (eid),
    constraint users_email_uindex
        unique (email),
    constraint users_username_uindex
        unique (username)
);

-- auto-generated definition
create table product
(
    product_id       int auto_increment
        primary key,
    user_id          int                  not null,
    product_no       varchar(20)          not null comment '마켓의 상품번호',
    product_name     varchar(50)          not null,
    market           varchar(20)          not null,
    keyword          text                 null,
    notification     tinyint(1) default 0 not null,
    notification_set varchar(200)         null,
    etc              varchar(200)         null,
    active           tinyint(1) default 1 not null,
    constraint items_unique
        unique (user_id, product_no, market),
    constraint items_users_user_id_fk
        foreign key (user_id) references users (user_id)
);

-- auto-generated definition
create table sellingnote.shop_data
(
    keyword   varchar(50)              not null,
    data_date date default (curdate()) not null,
    shop_data longtext                 not null,
    constraint keyword
        unique (keyword, data_date)
);

create index shop_data_data_date_index
    on shop_data (data_date);

create index shop_data_keyword_index
    on shop_data (keyword);

-- auto-generated definition
create table sellingnote.product_rank
(
    log_id        int auto_increment
        primary key,
    pl_product_id int         not null,
    pl_product_no varchar(20) not null,
    keyword       varchar(50) not null,
    ranking          int         not null,
    rank_date     date        not null,
    constraint product_rank_uq
        unique (pl_product_id, pl_product_no, keyword, rank_date)
);
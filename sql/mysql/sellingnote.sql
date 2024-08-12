create schema sellingnote collate utf8mb4_0900_ai_ci;

create table sellingnote.coupang_cate
(
    cate_id   int auto_increment
        primary key,
    cate_name varchar(50) not null,
    cate_num  varchar(50) null,
    constraint coupangCate_cate_num_uindex
        unique (cate_num)
);

create table sellingnote.item_log
(
    log_id  int auto_increment
        primary key,
    item_id int not null,
    lank    int not null
);

create table sellingnote.market_api
(
    api_id     int auto_increment
        primary key,
    user_id    int          null,
    app_id     varchar(50)  null,
    app_secret varchar(50)  null,
    market     varchar(30)  null,
    token      varchar(100) null
);

create table sellingnote.shop_data
(
    keyword   varchar(50)              not null,
    data_date date default (curdate()) not null,
    shop_data longtext                 not null
);

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

create table sellingnote.product
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
    constraint items_unique
        unique (user_id, product_no, market),
    constraint items_users_user_id_fk
        foreign key (user_id) references sellingnote.users (user_id)
);



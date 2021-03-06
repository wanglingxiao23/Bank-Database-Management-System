create database bank_system;
use bank_system;
create table user(
id int primary key auto_increment,
username varchar(16) not null,
password varchar(16) not null,
limits int not null
)engine=InnoDB default charset=utf8;

create table user_info(
id int primary key not null,
user_name varchar(16) not null,
user_tel bigint not null,
ID_no bigint not null,
sex int not null,
addr varchar(16),
paypsd varchar(16) not null
)engine=InnoDB default charset=utf8;

create table property(
id int primary key,
sum int not null
)engine=InnoDB default charset=utf8;

create table history(
id int primary key,
amount double not null,
status int not null,
date timestamp null default now()
)engine=InnoDB default charset=utf8;

create table admin_info(
id int primary key,
admin_name varchar(16) not null,
admin_tel bigint not null
)engine=InnoDB default charset=utf8;

create table if not exists `users` (
    `userId` int(11) PRIMARY KEY AUTO_INCREMENT,
    `username` varchar(20) not null,
    `password` varchar(30) not null,
    `elo` int(11) default 0
);

create table if not exists `admin` (
    `adminId` int(11) PRIMARY KEY AUTO_INCREMENT,
    `userId` int(11) not null,
    `permLevel` int(11) not null,
    CONSTRAINT fk_userId FOREIGN KEY (userId) 
    REFERENCES users(userId)
);

create table if not exists `matches` (
    `matchId` int(11) PRIMARY KEY AUTO_INCREMENT,
    `user1Id` int(11) not null,
    `user2Id` int(11) not null,
    `winner`  int(11) not null,
    CONSTRAINT fk_ply_1 FOREIGN KEY (user1Id) 
    REFERENCES users(userId),
    CONSTRAINT fk_ply_2 FOREIGN KEY (user2Id) 
    REFERENCES users(userId),
    CONSTRAINT fk_winner FOREIGN KEY (winner)
    REFERENCES users(userId)
);

create table if not exists `leaderboards` (
    `rank` int(1) PRIMARY KEY AUTO_INCREMENT,
    `userId` int(11) not null
);

create table if not exists `queries` (
    `uri` varchar(100) not null,
    `type` varchar(100) not null,
    `stat` int(11) not null,
    PRIMARY Key (uri, type)
);
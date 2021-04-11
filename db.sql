create table if not exists `users` (
    `userId` int(10) PRIMARY KEY AUTO_INCREMENT,
    `email` varchar(40) not null,
    `username` varchar(20) not null,
    `password` varchar(30) not null,
    `win` int(11) default 0,
    `lose` int(11) default 0,
    `draw` int(11) default 0,
    `elo` int(11) default 100,
    `isAdmin` boolean default false
);

create table if not exists `matches` (
    `matchId` int(11) PRIMARY KEY AUTO_INCREMENT,
    `user1Id` int(10) not null,
    `user2Id` int(10) not null,
    `winner`  int(10) not null,
    CONSTRAINT fk_user1Id FOREIGN KEY (user1Id) REFERENCES users(userId),
    CONSTRAINT fk_user2Id FOREIGN KEY (user2Id) REFERENCES users(userId),
    CONSTRAINT fk_winner FOREIGN KEY (winner) REFERENCES users(userId)
);

create table if not exists `queries` (
    `uri` varchar(100) not null,
    `type` varchar(100) not null,
    `stat` int(11) not null,
    PRIMARY Key (uri, type)
);

-- 


-- get
    -- user
    -- user/{id}
    -- matches/{user_id}
    -- userLeaderboard
    -- queries
-- post
    -- user
    -- login
    -- challenge
-- put
    -- user
    -- userElo [ADMIN] -> Admin has rights to update elo if miscalculation or something
-- delete
    -- challenge/{id}
    -- user/{id} [ADMIN]
    -- match/{id} [ADMIN] -> Delete a match
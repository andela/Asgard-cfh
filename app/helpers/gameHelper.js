exports.getLeaderBoard = (users, games) => {
  const leaderBoard = [];
  users.forEach((user) => {
    const leaderBoardInfo = {
      user: user.name,
      gamesWon: games.filter(game => game.gameWinner === user.name).length
    };
    leaderBoard.push(leaderBoardInfo);
  });
  return leaderBoard.sort((a, b) => b.gamesWon - a.gamesWon);
};

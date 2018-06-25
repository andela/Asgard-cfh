exports.getDonations = (users) => {
  const donationsInfo = [];
  users.forEach((user) => {
    const donations = {
      user: user.name,
      amountDonated: user.donations.length === 0 ? 0 : user.donations.reduce((a, b) => a + b)
    };
    donationsInfo.push(donations);
  });
  return donationsInfo.sort((a, b) => b.amountDonated - a.amountDonated);
};

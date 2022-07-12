exports.getTodayDate = function () {
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };

  return new Date().toLocaleDateString('en-US', options);
};

exports.getToday = function () {
  const options = {
    weekday: 'long',
  };

  return new Date().toLocaleDateString('en-US', options);
};

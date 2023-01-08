exports.ok = (data) => {
  return { error: false, data };
};

exports.error = (error) => {
  return { error: true, data: error };
};

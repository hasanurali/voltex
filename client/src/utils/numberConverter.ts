const numberConverter = (num: number): string => {

  if (num === 0) {
    return "0";
  };

  const numberMarks = [
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "M" },
    { value: 1e3, symbol: "K" }
  ];

  const item = numberMarks.find(elm => num >= elm.value);

  if (item) {
    return parseFloat((num / item.value).toFixed(1)) + item.symbol;
  };

  return num.toString();
};

export default numberConverter;
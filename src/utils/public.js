export const txtStatus = (status) => {
  let text = "";
  switch (status) {
    case 1:
      text = "未受理";
      break;
    case 2:
      text = "已受理";
      break;
    case 3:
      text = "已接单";
      break;
    case 4:
      text = "转派";
      break;
    case 5:
      text = "完工";
      break;
    case 6:
      text = "已评价";
      break;
    default:
      text = "未受理";
  }
  return text;
};

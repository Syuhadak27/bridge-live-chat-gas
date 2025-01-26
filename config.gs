var TOKEN = ""; // Masukkan token bot Anda
var ADMIN_ID = ;     // Masukkan ID Telegram admin bot



function setWebhook() {
  var token = TOKEN;
  var url = "";        //masukkan url deploy
  var apiUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${url}`;
  var response = UrlFetchApp.fetch(apiUrl);
  Logger.log(response.getContentText());
}

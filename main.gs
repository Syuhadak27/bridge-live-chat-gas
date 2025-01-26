function doPost(e) {
  var update = JSON.parse(e.postData.contents);
  if (update.message) {
    handleMessage(update.message);
  }
}

// Fungsi untuk menangani pesan masuk
function handleMessage(message) {
  var chatId = message.chat.id;

  if (chatId === ADMIN_ID) {
    // Pesan dari admin
    if (message.reply_to_message) {
      var targetChatId = extractUserIdFromReply(message.reply_to_message.text);
      if (targetChatId) {
        var userMessageId = extractMessageIdFromReply(message.reply_to_message.text);
        if (userMessageId) {
          deleteMessage(targetChatId, userMessageId); // Hapus pesan user sebelumnya
        }
        forwardAdminReply(targetChatId, message); // Kirim balasan admin ke user
        deleteMessage(chatId, message.message_id); // Hapus pesan admin
      }
    } else {
      sendMessage(ADMIN_ID, "Reply pesan yg di-forward.");
    }
  } else {
    // Pesan dari user
    if (message.text === "/start") {
      sendMessage(chatId, "Bot aktif.");
    } else {
      var userMessage = "Pesan diterima dan diteruskan ke admin, tunggu admin membalas.";
      sendReplyAndForwardToAdmin(message, userMessage);
    }
  }
}

// Fungsi untuk mengirim balasan ke user dan meneruskan ke admin
function sendReplyAndForwardToAdmin(message, userMessage) {
  var chatId = message.chat.id;
  var user = message.from;

  // Balas user
  var replyResponse = sendMessage(chatId, userMessage);
  var userMessageId = JSON.parse(replyResponse.getContentText()).result.message_id;

  // Teruskan ke admin
  var content = `From: <b>${user.first_name}</b> (@${user.username || "N/A"})\nUser ID: <code>${message.chat.id}</code>\nMessage ID: <code>${userMessageId}</code>\n`;
  if (message.text) {
    content += `Pesan:\n<code>${message.text}</code>`;
    sendMessage(ADMIN_ID, content, "HTML");
  } else if (message.photo || message.document || message.video || message.audio) {
    forwardMediaToAdmin(message, content);
  }
}

// Fungsi untuk meneruskan media ke admin
function forwardMediaToAdmin(message, content) {
  var url;
  var payload;
  var options = {
    method: "post",
    contentType: "application/json"
  };

  if (message.photo) {
    url = `https://api.telegram.org/bot${TOKEN}/sendPhoto`;
    payload = {
      chat_id: ADMIN_ID,
      photo: message.photo.pop().file_id,
      caption: content,
      parse_mode: "HTML"
    };
  } else if (message.document) {
    url = `https://api.telegram.org/bot${TOKEN}/sendDocument`;
    payload = {
      chat_id: ADMIN_ID,
      document: message.document.file_id,
      caption: content,
      parse_mode: "HTML"
    };
  } else if (message.video) {
    url = `https://api.telegram.org/bot${TOKEN}/sendVideo`;
    payload = {
      chat_id: ADMIN_ID,
      video: message.video.file_id,
      caption: content,
      parse_mode: "HTML"
    };
  } else if (message.audio) {
    url = `https://api.telegram.org/bot${TOKEN}/sendAudio`;
    payload = {
      chat_id: ADMIN_ID,
      audio: message.audio.file_id,
      caption: content,
      parse_mode: "HTML"
    };
  }

  options.payload = JSON.stringify(payload);
  UrlFetchApp.fetch(url, options);
}

// Fungsi untuk meneruskan balasan admin ke user
// Fungsi untuk meneruskan balasan admin ke user
function forwardAdminReplyTES(targetChatId, message) {
  var url;
  var payload;
  var options = {
    method: "post",
    contentType: "application/json"
  };

  var adminMessage = `<b>Pesan dari admin:</b>\n`;

  if (message.text) {
    // Kirim teks
    url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    payload = {
      chat_id: targetChatId,
      text: adminMessage + `<code>${message.text}</code>`,
      parse_mode: "HTML"
    };
  } else if (message.photo) {
    // Kirim foto
    url = `https://api.telegram.org/bot${TOKEN}/sendPhoto`;
    payload = {
      chat_id: targetChatId,
      photo: message.photo.pop().file_id,
      caption: adminMessage + (message.caption || ""),
      parse_mode: "HTML"
    };
  } else if (message.document) {
    // Kirim dokumen
    url = `https://api.telegram.org/bot${TOKEN}/sendDocument`;
    payload = {
      chat_id: targetChatId,
      document: message.document.file_id,
      caption: adminMessage + (message.caption || ""),
      parse_mode: "HTML"
    };
  } else if (message.video) {
    // Kirim video
    url = `https://api.telegram.org/bot${TOKEN}/sendVideo`;
    payload = {
      chat_id: targetChatId,
      video: message.video.file_id,
      caption: adminMessage + (message.caption || ""),
      parse_mode: "HTML"
    };
  } else if (message.audio) {
    // Kirim audio
    url = `https://api.telegram.org/bot${TOKEN}/sendAudio`;
    payload = {
      chat_id: targetChatId,
      audio: message.audio.file_id,
      caption: adminMessage + (message.caption || ""),
      parse_mode: "HTML"
    };
  } else if (message.voice) {
    // Kirim pesan suara
    url = `https://api.telegram.org/bot${TOKEN}/sendVoice`;
    payload = {
      chat_id: targetChatId,
      voice: message.voice.file_id,
      caption: adminMessage + (message.caption || ""),
      parse_mode: "HTML"
    };
  }

  options.payload = JSON.stringify(payload);
  UrlFetchApp.fetch(url, options);
}

function forwardAdminReply(targetChatId, message) {
  try {
    var url;
    var payload;
    var options = {
      method: "post",
      contentType: "application/json"
    };

    var adminMessage = `<b>Pesan dari admin:</b>\n`;

    if (message.text) {
      // Kirim teks
      url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
      payload = {
        chat_id: targetChatId,
        text: adminMessage + `<code>${message.text}</code>`,
        parse_mode: "HTML"
      };
    } else if (message.photo) {
      // Kirim foto
      url = `https://api.telegram.org/bot${TOKEN}/sendPhoto`;
      payload = {
        chat_id: targetChatId,
        photo: message.photo.pop().file_id, // Menggunakan foto terakhir
        caption: adminMessage + (message.caption || ""),
        parse_mode: "HTML"
      };
    } else if (message.document) {
      // Kirim dokumen
      url = `https://api.telegram.org/bot${TOKEN}/sendDocument`;
      payload = {
        chat_id: targetChatId,
        document: message.document.file_id,
        caption: adminMessage + (message.caption || ""),
        parse_mode: "HTML"
      };
    } else if (message.video) {
      // Kirim video
      url = `https://api.telegram.org/bot${TOKEN}/sendVideo`;
      payload = {
        chat_id: targetChatId,
        video: message.video.file_id,
        caption: adminMessage + (message.caption || ""),
        parse_mode: "HTML"
      };
    } else if (message.audio) {
      // Kirim audio
      url = `https://api.telegram.org/bot${TOKEN}/sendAudio`;
      payload = {
        chat_id: targetChatId,
        audio: message.audio.file_id,
        caption: adminMessage + (message.caption || ""),
        parse_mode: "HTML"
      };
    } else if (message.voice) {
      // Kirim pesan suara
      url = `https://api.telegram.org/bot${TOKEN}/sendVoice`;
      payload = {
        chat_id: targetChatId,
        voice: message.voice.file_id,
        caption: adminMessage + (message.caption || ""),
        parse_mode: "HTML"
      };
    } else {
      // Jika tipe tidak dikenali
      throw new Error("Tipe pesan tidak didukung");
    }

    // Kirim permintaan ke API Telegram
    options.payload = JSON.stringify(payload);
    var response = UrlFetchApp.fetch(url, options);
    Logger.log("Response: " + response.getContentText());
  } catch (e) {
    Logger.log("Error: " + e.message);
  }
}


// Fungsi untuk menghapus pesan
function deleteMessage(chatId, messageId) {
  var url = `https://api.telegram.org/bot${TOKEN}/deleteMessage`;
  var payload = {
    chat_id: chatId,
    message_id: messageId
  };
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };
  UrlFetchApp.fetch(url, options);
}

// Fungsi untuk mengirim pesan
function sendMessage(chatId, text, parseMode) {
  var url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
  var payload = {
    chat_id: chatId,
    text: text
  };

  if (parseMode) {
    payload.parse_mode = parseMode;
  }

  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  return UrlFetchApp.fetch(url, options);
}

// Fungsi untuk mengekstrak ID user dari teks reply
function extractUserIdFromReply(replyText) {
  var match = replyText.match(/User ID: (\d+)/);
  return match ? match[1] : null;
}

// Fungsi untuk mengekstrak ID pesan user dari teks reply
function extractMessageIdFromReply(replyText) {
  var match = replyText.match(/Message ID: (\d+)/);
  return match ? match[1] : null;
}

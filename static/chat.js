
document.write('<script src="/static/reconnecting-websocket.js" type="text/javascript" charset="utf-8"></script>');

$(function() {
    // When we're using HTTPS, use WSS too.
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var chatsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat" + window.location.pathname);
    // chatsock.debug = true;
    // chatsock.timeoutInterval = 1000;
    // chatsock.maxReconnectAttempts = 4;
    var lost_con_time = 0;

    chatsock.onmessage = function(message) {
        var data = JSON.parse(message.data);
        var chat = $("#chat")
        var ele = $('<tr></tr>')

        ele.append(
            $("<td></td>").text(data.timestamp)
        )
        ele.append(
            $("<td></td>").text(data.handle)
        )
        ele.append(
            $("<td></td>").text(data.message)
        )

        chat.append(ele)
    };
    //连接发生错误的回调方法
    chatsock.onerror = function () {

        console.log("websocket.error ,tring to reconnect");
        // var totoal = 1;
        // while (totoal > 0){
        //     totoal = totoal - 1 ;
        //     chatsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat" + window.location.pathname);
        // }

    };
    chatsock.onclose = function (e) {
        console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
        console.log(e)
    };
window.onbeforeunload = function () {
        chatsock.close();
    };

    $("#chatform").on("submit", function(event) {
        var message = {
            handle: $('#handle').val(),
            message: $('#message').val(),
        }
        chatsock.send(JSON.stringify(message));
        $("#message").val('').focus();
        return false;
    });
});

